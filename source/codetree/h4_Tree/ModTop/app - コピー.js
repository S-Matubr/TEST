
var aras = parent.aras || window.aras || top.aras;
const wjGrid = wijmo.grid;
const { CellMaker } = wijmo.grid.cellmaker;
import { HierarchicalFlexGridSearch } from './heirarchicalGridSearch.js';
wijmo = window;
//
document.readyState === 'complete' ? init() : window.onload = init;
//

function init() {

    // 表示するアイテムタイプ・プロパティを取得
//    let itemTypes = parent.thisItem.getProperty('mod_disp_itemtypes');
//    let propertysString = parent.thisItem.getProperty('propertys_disp');
    let propertyString = "name,current_state,modified_on,modified_by_id";


    // サーバーで全てのデータを取得
    const body = "<itemId>" + parent.thisItem.getID() + "</itemId>";
//        + "<propertys_disp>" + propertysString + "</propertys_disp>"
//        + "<mod_disp_itemtypes>" + itemTypes + "</mod_disp_itemtypes>";
    let treeModGet = aras.IomInnovator.applyMethod('h4_treeModGet', body);
    const getResult = treeModGet.getResult();
    var jsonStr = getResult.replace(/','/g, '","');
    jsonStr = jsonStr.replace(/':'/g, '":"');
    jsonStr = jsonStr.replace(/\[{'/g, '[{"');
    jsonStr = jsonStr.replace(/'}]/g, '"}]');
    jsonStr = jsonStr.replace(/'},{'/g, '"},{"');
    jsonStr = jsonStr.replace(/'/g, "'");
    jsonStr = jsonStr.replace(/\n/g, '\\n');
    var json = JSON.parse(jsonStr);

    // アイテムタイプが空じゃない場合のみ実施
//    if (!(typeof itemTypes === 'undefined')) {
        // 表示用配列の初期化
        var dispModArray = []; // 機種名-モデルイヤー-アイテムタイプ名-アイテムで表示

        // 表示するプロパティの配列を取得
        var propertyStringArray = [];
        if (!(typeof propertysString === 'undefined')) {
            propertyStringArray = propertysString.split(',');
        }

//        var itemTypeArray = itemTypes.split(',');

        // 各アイテムタイプごとに処理する
//        for (var itemTypeCount = 0; itemTypeCount < itemTypeArray.length; itemTypeCount++) {
//            // 処理するアイテムタイプ名を取得する
            var itemType = "h4_MQPage";


            // 1アイテムごとに処理する
            for (var itemCount = 0; itemCount < json.length; itemCount++) {
                var currentItemType = json[itemCount].itemType;

                if (currentItemType == itemType) {
                    // 機種が未設定の場合は表示しない
                    // 機種名とモデルイヤーを取得
                    var currentPjName = json[itemCount].currentPjName;
                    var currentModelYear = json[itemCount].currentModelYear;


                    var currentItemTypeName = json[itemCount].currentItemTypeName;
                    // プロパティを取得しておく
                    var title = json[itemCount].item_name; // タイトル
                    var status = json[itemCount].status; // ステータス
                    var modified_on = json[itemCount].modified_on; // 更新日
                    var modified_by_man = json[itemCount].modified_by_man; // 更新者
                    var created_on = json[itemCount].created_on; // 作成日
                    var created_by_man = json[itemCount].created_by_man; // 作成者
                    var itemId = json[itemCount].itemId; // アイテムID
                    var dept = json[itemCount].dept; // 室課
                    var dest = json[itemCount].dest; // 仕向け
                    var event_name = json[itemCount].event_name; // イベント

                    // 現在処理中のアイテムの機種が、表示用配列に存在するかを確認
                    // データ保存フラグ
                    var itemSaveFlag = 0;
                    for (var i = 0; i < dispModArray.length; i++) {
                        // モデルイヤーが存在する場合
                        if (currentModelYear == dispModArray[i].name) {
                            let dispPjName = dispModArray[i].pjName;
                            for (var j = 0; j < dispPjName.length; j++) {
                                // 機種が存在する場合
                                if (currentPjName == dispPjName[j].name) {
                                    let dispItemType = dispPjName[j].itemType;
                                    for (var k = 0; k < dispItemType.length; k++) {
                                        // アイテムタイプ名が存在する場合
                                        if (currentItemTypeName == dispItemType[k].name) {
                                            let pushElem = { name: title, title: title, status: status, modified_on: modified_on, modified_by_man: modified_by_man, created_on: created_on, created_by_man: created_by_man, itemId: itemId, itemType: itemType, dept: dept, dest: dest, event_name: event_name }
                                            // 既に配列があるため、itemにpushする
                                            dispModArray[i].pjName[j].itemType[k].item.push(pushElem);
                                            itemSaveFlag = 1;
                                            break;
                                        }
                                    }

                                    // アイテムタイプ名が存在しない場合
                                    if (itemSaveFlag == 0) {
                                        let pushElem = { name: currentItemTypeName, item: [{ name: title, title: title, status: status, modified_on: modified_on, modified_by_man: modified_by_man, created_on: created_on, created_by_man: created_by_man, itemId: itemId, itemType: itemType, dept: dept, dest: dest, event_name: event_name }] };
                                        // モデルイヤーは存在しているため、itemTypeにpushする
                                        dispModArray[i].pjName[j].itemType.push(pushElem);
                                        itemSaveFlag = 1;
                                        break;
                                    }
                                }
                            }
                            // 機種が存在しない場合
                            if (itemSaveFlag == 0) {
                                let pushElem = {
                                    name: currentPjName, itemType: [{ name: currentItemTypeName, item: [{ name: title, title: title, status: status, modified_on: modified_on, modified_by_man: modified_by_man, created_on: created_on, created_by_man: created_by_man, itemId: itemId, itemType: itemType, dept: dept, dest: dest, event_name: event_name }] }]
                                };
                                // 機種は存在しているため、pjNameにpushする
                                dispModArray[i].pjName.push(pushElem);
                                itemSaveFlag = 1;
                                break;
                            }

                        }
                    }
                    // モデルイヤーから存在しない場合
                    if (itemSaveFlag == 0) {
                        /*                        let pushElem = { name: currentPjName, itemType: [{ name: currentItemTypeName, item: [{ name: title, title: title, status: status, modified_on: modified_on, modified_by_man: modified_by_man, comment: comment, keyword: keyword, created_on: created_on, created_by_man: created_by_man, itemId: itemId, itemType: itemType }] }] };*/
                        let pushElem = {
                            name: currentModelYear, pjName: [{ name: currentPjName, itemType: [{ name: currentItemTypeName, item: [{ name: title, title: title, status: status, modified_on: modified_on, modified_by_man: modified_by_man, created_on: created_on, created_by_man: created_by_man, itemId: itemId, itemType: itemType, dept: dept, dest: dest, event_name: event_name }] }] }]
                        };

                        // 表示用配列にpushする
                        dispModArray.push(pushElem);
                        itemSaveFlag = 1;
                    }
                }

                //}
            }
            /*        });*/
//        }

        // Columnsを作成する
        var creColumns = [{ binding: 'name', header: '機種', width: 400, allowDragging: false, allowSorting: true },
        {
            header: 'リンク',
            binding: 'title',
            cellTemplate: CellMaker.makeLink({
                click: (e, ctx) => aras.uiShowItem(ctx.item.itemType, ctx.item.itemId, 'tab view')
            }),
            width: 150
        }];

        // 表示するプロパティを設定する
        for (var i = 0; i < propertyStringArray.length; i++) {
            var pushString = null;
            switch (propertyStringArray[i]) {
                case 'name':
                    break;
                case 'current_state':
                    pushString = { binding: 'status', header: 'ステータス', dataType: 'String', width: 150, allowSorting: true };
                    break;
                case 'modified_on':
                    pushString = { binding: 'modified_on', header: '更新日', dataType: 'String', width: 150, allowSorting: true };
                    break;
                case 'modified_by_id':
                    pushString = { binding: 'modified_by_man', header: '更新者', dataType: 'String', width: 150, allowSorting: true };
                    break;
                case 'created_on':
                    pushString = { binding: 'created_on', header: '作成日', dataType: 'String', width: 150, allowSorting: true };
                    break;
                case 'created_by_id':
                    pushString = { binding: 'created_by_man', header: '作成者', dataType: 'String', width: 150, allowSorting: true };
                    break;
                case 'cmn_pj':
                    break;
                default:
                    break;
            }

            if (pushString != null) {
                creColumns.push(pushString);
            }
        }

        var modTopGrid = new wjGrid.FlexGrid('#ModTopGrid', {
            headersVisibility: 'Column',
            childItemsPath: ['pjName', 'itemType', 'item'],
            autoGenerateColumns: false,
            columns: creColumns,
            itemsSource: dispModArray
        });

        modTopGrid.collapseGroupsToLevel(0);

        // ソート機能変更start
        modTopGrid.sortedColumn.addHandler(function (s, e) {
            var view = s.collectionView;
            // sort child items
            if (view && s.childItemsPath) {
                for (var i = 0; i < view.items.length; i++) {
                    sortItem(view.items[i], view, s.childItemsPath);
                }
            }

            view.refresh();
        });

        function sortItem(item, view, childItemsPath) {

            var children = Array.isArray(childItemsPath) ? item[childItemsPath[0]] : item[childItemsPath];
            if (children && Array.isArray(children)) {
                // sort array
                children.sort(view._compareItems());

                // sort child arrays
                for (var i = 0; i < children.length; i++) {
                    sortItem(children[i], view, Array.isArray(childItemsPath) ? childItemsPath.slice(1) : childItemsPath);
                }
            }
        }
        // ソート機能end

        // フィルタ機能追加start
        let searchBar = new HierarchicalFlexGridSearch('#searchBar', {
            placeholder: '検索欄',
            grid: modTopGrid,
        });
        // フィルタ機能end

        let clientWidth = document.documentElement.clientWidth;
        let clientHeight = document.documentElement.clientHeight;
        var divElement = document.getElementById('ModTopGrid');

        // 10px余裕を持たせる
        if (clientWidth > 10) {
            clientWidth = clientWidth - 10;
        }
        if (clientHeight > 10) {
            clientHeight = clientHeight - 10;
        }
        // フィルター表示のため30px高さ減らす
        clientHeight = clientHeight - 80;

        clientWidth = clientWidth - 30;

        divElement.style.width = clientWidth + 'px';
        divElement.style.height = clientHeight + 'px';
//    }
    
}

// 引数にクリックしたヘッダーと現在の階層アイテムを入れる
// 返り値はクリックしたヘッダーのプロパティ値
function propertyValue(clickHeader, classItem) {
    var returnValue = null;
    switch (clickHeader) {
        case 'リンク':
            returnValue = classItem.title;
            break;
        case 'ステータス':
            returnValue = classItem.status;
            break;
        case '更新日':
            returnValue = classItem.modified_on;
            break;
        case '更新者':
            returnValue = classItem.modified_by_man;
            break;
        case '作成日':
            returnValue = classItem.created_on;
            break;
        case '作成者':
            returnValue = classItem.created_by_man;
            break;
        default:
            // 機種の欄をクリックした場合は、nullを返す
            returnValue = null;
            break;
    }
    return returnValue;
}

$(window).resize(function () {
    // divの表示幅指定
    var clientWidth = document.documentElement.clientWidth;
    var clientHeight = document.documentElement.clientHeight;
    // 10px余裕を持たせる
    if (clientWidth > 10) {
        clientWidth = clientWidth - 10;
    }
    if (clientHeight > 10) {
        clientHeight = clientHeight - 10;
    }
    // フィルター表示のため30px高さ減らす
    clientHeight = clientHeight - 80;

    clientWidth = clientWidth - 30;

    var divElement = document.getElementById('ModTopGrid');
    divElement.style.width = clientWidth + 'px';
    divElement.style.height = clientHeight + 'px';
})