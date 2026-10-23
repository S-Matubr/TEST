const { CellMaker } = wijmo.grid.cellmaker;
const aras = parent.aras;


export function getData() {
    var appData = {};
    var ItemData = [];
    var eventData = [];
    var eventApprovalStatus = {};
    var propertyString;
    var propertyLabelString;

    //　開達書式アイテムタイプを検索対象に指定
    propertyString = "h4_DATFormat";
    propertyLabelString = "開達書式";
    //表示プロパティはいったん固定
    const choiceProperty = "modified_by_id,modified_on";
    // 選択されたマルQアイテムタイプに紐づいた必要資料アイテムタイプを検索
    const body = "<itemId>" + parent.thisItem.getID() + "</itemId>"
        + "<propertys_disp>" + choiceProperty + "</propertys_disp>"
        + "<mod_disp_itemtypes>" + propertyString + "</mod_disp_itemtypes>";
    let itemTypes = aras.IomInnovator.applyMethod('h4_table_DATMaster_get', body);
    const getResult = itemTypes.getResult();
    var jsonStr = getResult
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/'/g, '"')
        .replace(/\//g, '\\/')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
    var json = JSON.parse(jsonStr);


    var choicePropertyArray = [];
    if (!(typeof choiceProperty === 'undefined')) {
        choicePropertyArray = choiceProperty.split(',');
    }

    //イベントの値を格納するリスト
    var eventvalue = [];
    //イベントのラベルを格納するリスト
    var eventHeader = [];
    //資料分類を格納するリスト
    var DocLists = [];
    // イベントリストを取得
    eventvalue = json[0].eventValueList;
    // イベントラベルリストを取得
    eventHeader = json[0].eventHeader;
    // 文書リストを取得
    DocLists = json[0].DocList;
    //全体の行数を格納する
    var rowSum = 0;
    // 表示するアイテムタイプ（行）ごとにサマリー表に設定
    var itemTypeArray = propertyString.split(',');
    var itemTypeLabelArray = propertyLabelString.split(',');

    // 取得したアイテムタイプが空ではない時に実行
    if (json.length > 1) {
        for (var t = 0; t < DocLists.length; t++) {
            // データ取得できたアイテムタイプかどうか
            var DocExistFlg = false;

            // イベントリストの値毎（列ごと）に表示データをサマリー表に設定
            for (var k = 0; k < eventvalue.length; k++) {
                // 現在列のイベント
                var eventName = eventvalue[k];
                var rowNum = rowNum;
                if (k == 0) {
                    rowNum = 0;
                }
                eventData[eventName] = [];
                //選択したイベントのみ表示
                // サーバーで取得したアイテムタイプを1個ずつサマリー表に設定
                for (var i = 1; i < json.length; i++) {
                    // 資料名を取得
                    var docName = json[i].docname;
                    var eventtemp = json[i].yaruyara;
                    var events = eventtemp.split(',');
                    // アイテムのイベントが列のイベントと同じの場合のみ値を設定
                    if (docName == DocLists[t] && events.includes(eventName)) {
                        DocExistFlg = true;
                        // アイテム名を取得
                        var itemNameLabel = json[i].itemnamelabel;
                        // アイテムのIDを取得
                        var itemId = json[i].itemid;
                        // ファイルのIDを取得
                        var fileId = json[i].fileid;
                        // ファイルの名前を取得
                        var fileName = json[i].fileName;
                        // 更新日を取得
                        var modifiedOn = json[i].modifyon;
                        // 更新者を取得
                        var modifiedByMan = json[i].modifyby;
                        // 作成日を取得
                        var createdOn = json[i].createon;
                        // 作成者を取得
                        var createdByMan = json[i].createby;
                        // やるやらを取得
                        var yaruyara = "○";
                        // 資料名を取得
                        var itemLabel = json[i].docname;


                        // イベント毎に列の情報を設定
                        eventData[eventName].push({
                            itemNameLabel: itemNameLabel,
                            itemtypeName: propertyString,
                            itemID: itemId,
                            fileID: fileId,
                            itemLink: 'リンク',
                            fileName: fileName,
                            modifyOn: modifiedOn,
                            modifyBy: modifiedByMan,
                            createOn: createdOn,
                            createBy: createdByMan,
                            docname: docName,
                            yaruyara: yaruyara,
                        });
                    }
                    //アイテムの最大数を格納
                    if (eventData[eventvalue[k]].length > rowNum) {
                        rowNum = eventData[eventvalue[k]].length;
                    }
                }
            }

            // 足りない行のタイトルを空白に
            for (var m = 0; m < eventvalue.length; m++) {
                var eventName = eventvalue[m];
                var Linktxt = "";
                // 行ごとにDataを設定
                for (var n = 0; n < rowNum; n++) {
                    // リンクタイトルを設定
                    if (typeof eventData[eventName][n] === 'undefined') {
                        Linktxt = ' ';
                    }
                    else {
                        Linktxt = eventData[eventName][n].itemNameLabel;
                    }

                    if (typeof eventData[eventName][n] != 'undefined') {
                        if (typeof ItemData[rowSum + n] === 'undefined') {

                            ItemData.push({
                                itemTypeLabel: itemLabel,
                                itemNameLabel: 'アイテム名',
                                itemLink: 'リンク',
                                fileLink: '資料リンク',
                                fileName: '資料名',
                                modifyOnLabel: '更新日時',
                                modifyByLabel: '更新者',
                                createOnLabel: '作成日時',
                                createByLabel: '作成者',
                                yaruyaraLabel: 'やるやら',
                            });

                        }
                        ItemData[rowSum + n][eventName] = eventData[eventName][n];
                        ItemData[rowSum + n]['Linktext' + eventName] = Linktxt;
                    }
                }
            }
            rowSum = rowSum + rowNum;

            //全イベントでアイテムが存在しない場合、空の行を表示させる
            if (!DocExistFlg) {
                var emptyRow = [];
                for (var m = 0; m < eventvalue.length; m++) {
                    var eventName = eventvalue[m];
                    //選択したイベントのみ表示
                    emptyRow[eventName] = [];
                    emptyRow[eventName].push({});
                    if (typeof emptyRow[eventName][0] != 'undefined') {
                        if (typeof ItemData[rowSum] === 'undefined') {
                            ItemData.push({
                                itemTypeLabel: DocLists[t],
                                itemNameLabel: 'アイテム名',
                                itemLink: 'リンク',
                                fileLink: '資料リンク',
                                fileName: '資料名',
                                modifyOnLabel: '更新日時',
                                modifyByLabel: '更新者',
                                createOnLabel: '作成日時',
                                createByLabel: '作成者',
                                yaruyaraLabel: 'やるやら',
                            });
                        }
                        ItemData[rowSum][eventName] = emptyRow[eventName][0];
                    }
                }
                rowSum = rowSum + 1;
            }
        }
        // eventData をループして、各アイテムの itemStatus を確認
        for (var eventName in eventData) {
            //選択したイベントのみ
            var allApproved = true;
            if (eventData[eventName].length > 0) {
                for (var i = 0; i < eventData[eventName].length; i++) {
                    if (eventData[eventName][i].itemStatus !== '承認') {
                        allApproved = false;
                        break;
                    }
                }
            } else {
                allApproved = false;
            }
            eventApprovalStatus[eventName] = allApproved;
        }

    } else {
        //全てのアイテムが存在しない場合
        //空の行だけ表示させる
        for (var t = 0; t < DocLists.length; t++) {
            var emptyRow = [];
            for (var l = 0; l < eventvalue.length; l++) {
                var eventName = eventvalue[l];
                //選択したイベントのみ表示

                emptyRow[eventName] = [];
                emptyRow[eventName].push({});
                if (typeof emptyRow[eventName][0] != 'undefined') {
                    if (typeof ItemData[rowSum] === 'undefined') {
                        ItemData.push({
                            itemTypeLabel: DocLists[t],
                            itemNameLabel: 'アイテム名',
                            itemLink: 'リンク',
                            fileLink: '資料リンク',
                            fileName: '資料名',
                            modifyOnLabel: '更新日時',
                            modifyByLabel: '更新者',
                            createOnLabel: '作成日時',
                            createByLabel: '作成者',
                            yaruyaraLabel: 'やるやら',
                        });
                    }
                    ItemData[rowSum][eventName] = emptyRow[eventName][0];
                }
            }
            rowSum = rowSum + 1;
        }
    }
    appData.ItemData = new wijmo.collections.CollectionView(ItemData);

    // 複数行表示のレイアウト詳細
    // 共通列（アイテムタイプ名列とプロパティ列）
    const commonColumns = [
        {
            header: '必要資料/イベント', cells: [
                { binding: 'itemTypeLabel', width: 190, wordWrap: true },
            ]
        },
    ];

    var selectedColumnDefinition = [...commonColumns];
    var headerLayoutDefinition = [
        {
            cells: [{ header: '必要資料/イベント', binding: 'itemTypeLabel', wordWrap: true }],
        }
    ]

    // レイアウトで表示するイベント列の詳細設定
    for (var i = 0; i < eventvalue.length; i++) {
        const eventName = eventvalue[i];
        var header = eventHeader[i];
        var statusHeader = "作業中";
        var statusCSS = "";
        // ステータスが全て承認済ならヘッダに承認済表示
/*
        if (Object.keys(eventApprovalStatus).length > 0) {
            if (eventApprovalStatus[eventName] === true) {
                statusHeader = "承認済";
                statusCSS = "approved-header";
            }
        }
*/
        //選択したイベントのみ表示
        selectedColumnDefinition.push(
            {
                header: header,
                align: 'center',
                colspan: 2,
                cells: [
                    { dataMap: ['○', '×'], binding: eventName + '.yaruyara', width: 100, colspan: 1, rowspan: 2, cssClass: 'large-text', align: 'center' },
                    {
                        binding: eventName + '.itemLink',
                        cellTemplate: CellMaker.makeLink({
                            click: (e, ctx) => {
                                if (typeof ctx["item"][eventName].itemtypeName != 'undefined' && typeof ctx["item"][eventName].itemID != 'undefined') {
                                    aras.uiShowItem(ctx["item"][eventName]["itemtypeName"], ctx["item"][eventName]["itemID"], 'tab view')
                                }
                            },
                        }),
                        align: 'center',
                        width: 100,
                        colspan: 1,
                        cssClass: 'middle-text',
                    },
                    {
                        binding: eventName + '.fileName',
                        cellTemplate: CellMaker.makeLink({
                            click: (e, ctx) => {
                                if (typeof ctx["item"][eventName].itemtypeName != 'undefined' && typeof ctx["item"][eventName].fileID != 'undefined') {
                                    aras.uiShowItem('File', ctx["item"][eventName]["fileID"], 'tab view')
                                }
                            },
                        }),
                        width: 150,
                        colspan: 1,
                        cssClass: 'small-text',
                    },
                ]
            },
        );
        headerLayoutDefinition.push(
            {
                colspan: 2,
                cells: [
                    { header: header, align: 'center', colspan: 2, cssClassAll: statusCSS, align: 'center' },
/*                    { header: statusHeader, align: 'center', colspan: 2, cssClassAll: statusCSS, align: 'center' },
                    { header: '実施日', align: 'center', colspan: 2, cssClassAll: statusCSS, align: 'center' },*/
                    { binding: eventName + '.yaruyara', rowspan: 2, colspan: 1, header: 'やるやら', cssClass: 'large-text', align: 'center' },
                    { binding: eventName + '.itemLink', colspan: 1, header: 'リンク', cssClass: 'middle-text', align: 'center' },
                    { binding: eventName + '.fileName', colspan: 1, header: '帳票', cssClass: 'small-text', align: 'center' },
                ],
            },
        );
/*
        var pushEventBinding = null;
        var pushHeaderEventBinding = null;
        // 表示するプロパティを設定する
        for (var propertyNum = 0; propertyNum < choicePropertyArray.length; propertyNum++) {
            pushEventBinding = null;
            pushHeaderEventBinding = null;
            switch (choicePropertyArray[propertyNum]) {

                case 'modified_by_id':
                    pushEventBinding = { binding: eventName + '.modifyBy', cssClass: 'small-text' };
                    pushHeaderEventBinding = { binding: eventName + '.modifyBy', cssClass: 'small-text', header: '更新者', align: 'center' };
                    break;
                case 'modified_on':
                    pushEventBinding = { binding: eventName + '.modifyOn', cssClass: 'small-text' };
                    pushHeaderEventBinding = { binding: eventName + '.modifyOn', cssClass: 'small-text', header: '更新日時', align: 'center' };
                    break;
                case 'created_on':
                    pushEventBinding = { binding: eventName + '.createOn'};
                    pushHeaderEventBinding = { binding: eventName + '.createOn', header: '作成日時', align: 'center'};
                    break;
                case 'created_by_id':
                    pushEventBinding = { binding: eventName + '.createBy'};
                    pushHeaderEventBinding = { binding: eventName + '.createBy', header: '作成者', align: 'center'};
                    break;
                default:
            }

            // selectedColumnDefinitionの最後のcellsにpush
            if (pushEventBinding != null) {
                selectedColumnDefinition[selectedColumnDefinition.length - 1].cells.push(pushEventBinding);
            }

            if (pushHeaderEventBinding != null) {
                headerLayoutDefinition[headerLayoutDefinition.length - 1].cells.push(pushHeaderEventBinding);
            }
        }
*/
    }


    appData.ldThreeLines = selectedColumnDefinition;
    appData.headerLayoutDefinition = headerLayoutDefinition;
    return appData;
}