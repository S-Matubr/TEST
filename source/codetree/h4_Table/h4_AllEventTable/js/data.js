const { CellMaker } = wijmo.grid.cellmaker;
const aras = parent.aras;
const iomInv = aras.IomInnovator;
const GENERIC_ERROR_MESSAGE_NAME = 'h4_S_E_0002';
const NO_MQ_PAGE_WARNING_NAME = 'h4_C_E_1101';

//Message取得Error時用
const GENERIC_ERROR_MESSAGE_FALLBACK = 'メソッドでエラーが発生しました。システム管理者に連絡してください。';
const NO_MQ_PAGE_WARNING_FALLBACK = '表示条件に一致するマルQページが存在しません。';

// ユーザメッセージ取得メソッド
function getUserMessageText(name, fallbackText) {
    let userMsgItem = iomInv.newItem('UserMessage', 'get');
    userMsgItem.setAttribute('select', 'text');
    userMsgItem.setProperty('name', name);
    userMsgItem = userMsgItem.apply();

    if (!userMsgItem || userMsgItem.isError()) {
        return fallbackText || '';
    }

    const msg = userMsgItem.getProperty('text', '');
    return msg || fallbackText || '';
}

function createDocumentRow(reqDocName, eventValues, isPlaceholder) {
    const row = {
        groupKey: reqDocName,
        itemTypeLabel: '',
        __isPlaceholder: !!isPlaceholder,
    };

    eventValues.forEach((eventName) => {
        row[eventName] = {};
    });

    return row;
}

function resolveLatestDocumentId(documentConfigId, fallbackDocumentId) {
    if (!documentConfigId) {
        return fallbackDocumentId;
    }

    let latestDoc = iomInv.newItem('Document', 'get');
    latestDoc.setAttribute('select', 'id');
    latestDoc.setProperty('config_id', documentConfigId);
    latestDoc.setProperty('is_current', '1');
    latestDoc = latestDoc.apply();

    if (!latestDoc || latestDoc.isError() || latestDoc.getItemCount() < 1) {
        return fallbackDocumentId;
    }

    const latest = latestDoc.getItemByIndex(0);
    return latest.getID() || latest.getProperty('id') || fallbackDocumentId;
}

function sortByDocumentOrder(left, right) {
    const leftOrder = Number(left.documentsortorder || 0);
    const rightOrder = Number(right.documentsortorder || 0);

    if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
    }

    return (left.documentname || '').localeCompare(right.documentname || '', 'ja');
}

function getItemErrorMessage(item) {
    if (!item) {
        return getUserMessageText(GENERIC_ERROR_MESSAGE_NAME, GENERIC_ERROR_MESSAGE_FALLBACK);
    }

    if (typeof item.getErrorString === 'function') {
        const errorString = item.getErrorString();
        if (errorString) {
            return errorString;
        }
    }

    if (typeof item.getResult === 'function') {
        const result = item.getResult();
        if (result) {
            return result;
        }
    }

    return getUserMessageText(GENERIC_ERROR_MESSAGE_NAME, GENERIC_ERROR_MESSAGE_FALLBACK);
}

function isItemNotFoundError(item) {
    const message = (getItemErrorMessage(item) || '').toLowerCase();
    const keywords = [
        'not a single item',
        'does not exist',
        'not found',
        'no items of type',
        '見つか',
        '存在し',
    ];

    return keywords.some((keyword) => message.indexOf(keyword) > -1);
}

function createEmptyAppData() {
    return {
        ItemData: new wijmo.collections.CollectionView([]),
        ldThreeLines: [
            {
                header: '',
                cells: [{ binding: 'empty', width: 160, wordWrap: true }],
            },
        ],
        headerLayoutDefinition: [
            {
                cells: [{ header: '', binding: 'empty', wordWrap: true, align: 'center' }],
            },
        ],
        noMqPage: true,
        emptyMessage: '対象マルQページなし',
    };
}

export function getData() {
    try {
        const appData = {};
        const ItemData = [];
        const reqDocMaxCounts = {};
        const body = '<itemId>' + parent.thisItem.getID() + '</itemId>';

        const itemTypes = aras.IomInnovator.applyMethod('h4_table_AllEvent_get', body);
        if (itemTypes.isError()) {
            if (isItemNotFoundError(itemTypes)) {
                return createEmptyAppData();
            }
            aras.AlertError(getItemErrorMessage(itemTypes));
            return null;
        }

        const json = JSON.parse(itemTypes.getResult());
        const headerData = json[0] || {};
        if (headerData.noMqPage) {
            return createEmptyAppData();
        }

        const eventvalue = headerData.eventValueList || [];
        const eventHeader = headerData.eventHeader || [];
        const docLists = headerData.DocList || [];
        const records = json.slice(1);

        docLists.forEach((reqDocName) => {
            const documentsByEvent = {};
            let maxRows = 0;

            eventvalue.forEach((eventName) => {
                const documents = records
                    .filter((record) => record.reqdocname === reqDocName && record.event === eventName)
                    .sort(sortByDocumentOrder);

                documentsByEvent[eventName] = documents;
                if (documents.length > maxRows) {
                    maxRows = documents.length;
                }
            });

            reqDocMaxCounts[reqDocName] = maxRows;

            const isPlaceholderGroup = maxRows === 0;
            if (isPlaceholderGroup) {
                maxRows = 1;
            }

            for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
                const row = createDocumentRow(reqDocName, eventvalue, isPlaceholderGroup);

                eventvalue.forEach((eventName) => {
                    const documentData = documentsByEvent[eventName][rowIndex];
                    if (documentData) {
                        row[eventName] = {
                            displayName: documentData.documentname,
                            documentID: documentData.documentid,
                            documentConfigID: documentData.documentconfigid,
                        };
                    }
                });

                ItemData.push(row);
            }
        });

        appData.ItemData = new wijmo.collections.CollectionView(ItemData, {
            groupDescriptions: ['groupKey']
        });

        const selectedColumnDefinition = [
            {
                header: '必要資料/イベント', cells: [
                    { binding: 'itemTypeLabel', width: 250, wordWrap: true },
                ]
            },
        ];

        const headerLayoutDefinition = [
            {
                cells: [{ header: '必要資料/イベント', binding: 'itemTypeLabel', wordWrap: true, align: 'center' }],
            }
        ];

        for (let i = 0; i < eventvalue.length; i++) {
            const eventName = eventvalue[i];
            const header = eventHeader[i] || eventName;

            selectedColumnDefinition.push({
                header,
                cells: [
                    {
                        binding: eventName + '.displayName',
                        width: 240,
                        wordWrap: true,
                        cssClass: 'small-text',
                        cellTemplate: CellMaker.makeLink({
                            click: (e, ctx) => {
                                const eventItem = ctx.item[eventName];
                                if (eventItem && eventItem.documentID) {
                                    const latestDocumentId = resolveLatestDocumentId(eventItem.documentConfigID, eventItem.documentID);
                                    aras.uiShowItem('Document', latestDocumentId, 'tab view');
                                }
                            },
                        }),
                    },
                ]
            });

            headerLayoutDefinition.push({
                cells: [
                    { header, binding: eventName + '.displayName', wordWrap: true, align: 'center' },
                ]
            });
        }

        appData.ldThreeLines = selectedColumnDefinition;
        appData.headerLayoutDefinition = headerLayoutDefinition;
        appData.reqDocMaxCounts = reqDocMaxCounts;
        return appData;
    } catch (error) {
        aras.AlertError(getUserMessageText(GENERIC_ERROR_MESSAGE_NAME, GENERIC_ERROR_MESSAGE_FALLBACK));
        return null;
    }
}