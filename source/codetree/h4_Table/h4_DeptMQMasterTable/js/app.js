import { getData } from './data.js';

document.readyState === 'complete' ? init() : window.onload = init;
const aras = parent.aras;



function init() {
    let appData = getData();
    var grid = new wijmo.grid.multirow.MultiRow('#theGrid', {
        itemsSource: appData.ItemData,
        layoutDefinition: appData.ldThreeLines,
        headerLayoutDefinition:appData.headerLayoutDefinition,
        // ヘッダーを折りたたむ（true）
        /*collapsedHeaders: true,*/

        // 0614追加、一番左のグレー列を非表示
        headersVisibility: wijmo.grid.HeadersVisibility.Column,
        //編集不可にする
		isReadOnly: true,
        groupHeaderFormat: '<b>{value} </b>({count:n0}個の項目)'

    });

    // 列固定機能を追加
    grid.frozenColumns = grid.frozenColumns ? 0 : 1;

    // フィルタ機能追加
    let filter = new wijmo.grid.filter.FlexGridFilter(grid);
    // セルのカスタムレンダリングを追加
    grid.formatItem.addHandler((s, e) => {
        if (e.panel.cellType === wijmo.grid.CellType.Cell) {
            let cell = e.cell;
            // セルのスタイルを初期化
            cell.style.backgroundColor = '';
            let cellData = s.getCellData(e.row, e.col, false);
            if (cellData === '作業中') {
                cell.style.backgroundColor = '#ffb2b2';
            }
        }
    });

    // マウスオーバーすると帳票名表示
    var tip = new wijmo.Tooltip();
    var rng = null; 
    grid.hostElement.addEventListener('mousemove', function (e) {
        var ht = grid.hitTest(e.pageX, e.pageY);
        if (!ht.range.equals(rng)) {
          if (ht.cellType == wijmo.grid.CellType.Cell) {
            rng = ht.range;
            var cellElement = document.elementFromPoint(e.clientX, e.clientY),
              cellBounds = grid.getCellBoundingRect(ht.row, ht.col),
              data = wijmo.escapeHtml(grid.getCellData(rng.row, rng.col, true));

            // --- 回避方法 (KB:6375300455183) ---
            if (cellElement.className.indexOf('wj-cell') > -1) {
              tip.show(grid.hostElement, data, cellBounds);
            }
            // ---------------------------------
          }
        }
    });

    grid.hostElement.addEventListener('mouseout', function (e) {
        tip.hide();
        rng = null;
    });

    // ポップアップ機能追加
    // var saveColumnsVisible = {};
    appData.ldThreeLines.forEach((item) => {
        item.visible = true;
    });

    // 保存したレイアウトを表示する
    const itemID = parent.thisItem.getID();
    const modelID = parent.thisItem.getProperty('h4_project');
    const jsonKey = itemID + modelID;
    const userID = aras.getUserID();
    var layoutJson = "";

    // SH-762修正start1
    var checkboxStates = "";

    // 現在開くアイテムの表示イベント数を取得
    // 機種情報(ID)よりプロジェクトアイテムタイプの開発フローと機種を取得
    var qproj = new aras.getMostTopWindowWithAras(window).Item("tmp", "tmp");
    qproj.loadAML("<Item type='HRDPMTypModelProject' action='get'>" + "<id>" + modelID + "</id>" + "</Item>");
    qproj = qproj.apply();
    var devflow = '開発フロー不明';
    if (qproj.getItemCount() == 1) {
        // 開発フローを取得
        devflow = qproj.getProperty('iq_dev_flow');
    }

    /*
    // リスト（イベント情報）取得
    var qlist = new aras.getMostTopWindowWithAras(window).Item("tmp", "tmp");
    qlist.loadAML("<Item type='list' action='get'> " +
        "<name>HRDPCListEvent</name> " +
        "</Item>");
    qlist = qlist.apply();
    var srcid = "";
    for (var k = 0; k < qlist.getItemCount(); k++) {
        if (qlist.getItemByIndex(k).getProperty('keyed_name') === "HRDPCListEvent") {
            srcid = qlist.getItemByIndex(k).getProperty('id');
            break;
        }
    }

    // イベント取得
    var vallist = new aras.getMostTopWindowWithAras(window).Item("tmp", "tmp");
    vallist.loadAML("<Item type='FILTER VALUE' action='get'>"
        + "<filter>" + devflow + "</filter>"
        + "<source_id>" + srcid + "</source_id>"
        + "</Item>");
    vallist = vallist.apply();
    // SH-762修正end1
    */

    // レイアウト情報保存用アイテムタイプから、userIDが同じなアイテムを取得
    var qLayout = new aras.getMostTopWindowWithAras(window).Item("tmp", "tmp");
    qLayout.loadAML("<Item type='h2_SumLayoutSave' action='get'>" + "<h2_userid>" + userID + "</h2_userid>" + "</Item>");
    qLayout = qLayout.apply();

    // 現在ログイン中のユーザのレイアウト情報保存用アイテムが存在する場合
    if (qLayout.getItemCount() == 1) {
        layoutJson = qLayout.getProperty('h2_layoutjson');
        var json = JSON.parse(layoutJson);
        // 現在のテーブル表示アイテムをレイアウト保存したことがある場合
        if (json.hasOwnProperty(jsonKey)) {
            // ローカルストレージから状態を復元
            const layoutCheck = json[jsonKey];
            /* SH-762修正のためコメントアウト
            layoutCheck.forEach((state, index) => {
                appData.ldThreeLines[index].visible = state;
            });
            */

            // SH-762修正start2

            // 保存したレイアウトがnullでない時
            if (Array.isArray(layoutCheck)) {
                // 保存したレイアウト配列の数と現在のイベント数を設定
                const columnsNum = vallist.getItemCount() + 1;
                const saveColumnsNum = layoutCheck.length;
                // 列数が同じであれば、保存したレイアウトを表示、異なれば、デフォルトの画面を表示
                if (saveColumnsNum == columnsNum) {
                    layoutCheck.forEach((state, index) => {
                        appData.ldThreeLines[index].visible = state;
                    });
                    // checkboxStatesに保存した値を入力
                    checkboxStates = layoutCheck;
                } else {
                    appData.ldThreeLines.forEach((item) => {
                        const visibleArray = [];
                        const hiddenArray = [];
                        const targetArray = item.visible ? visibleArray : hiddenArray;
                        item.cells.forEach((cell) => targetArray.push(cell.binding));
                    });
                    // checkboxStatesに初期化の値を入力
                    checkboxStates = appData.ldThreeLines.map(item => item.visible);
                }
            }
            // SH-762修正end2

            grid.columns.forEach((column) => {
                const isVisible = appData.ldThreeLines.some((item) => item.cells.some((cell) => cell.binding === column.binding && item.visible));
                column.visible = isVisible;
            });
        }　else {
            // 保存したレイアウトが存在しない場合、チェックボックスのデフォルトの状態を設定
            appData.ldThreeLines.forEach((item) => {
                const visibleArray = [];
                const hiddenArray = [];
                const targetArray = item.visible ? visibleArray : hiddenArray;
                item.cells.forEach((cell) => targetArray.push(cell.binding));
            });
            // checkboxStatesに初期化の値を入力
            checkboxStates = appData.ldThreeLines.map(item => item.visible);
            }
    } else {
        // 保存したレイアウトが存在しない場合、チェックボックスのデフォルトの状態を設定
        appData.ldThreeLines.forEach((item) => {
            const visibleArray = [];
            const hiddenArray = [];
            const targetArray = item.visible ? visibleArray : hiddenArray;
            item.cells.forEach((cell) => targetArray.push(cell.binding));
        });
        // SH-762修正start3
        // checkboxStatesに値を入力
        checkboxStates = appData.ldThreeLines.map(item => item.visible);
        // SH-762修正end3

    }

    // ボタンのクリックでヘッダーの表示/非表示を切り替え
    document.querySelector('#switch_header').addEventListener('click', () => {
        grid.headersVisibility = (grid.headersVisibility === wijmo.grid.HeadersVisibility.Column)
        ? wijmo.grid.HeadersVisibility.None
        : wijmo.grid.HeadersVisibility.Column;
    });
}
 