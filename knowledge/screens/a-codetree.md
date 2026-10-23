<!-- meta
legacy: knowledge/_legacy/機能設計書.md L6786-L7055
source: source/codetree/
-->
# A. コードツリー(クライアント側 HTML/JS)機能設計

対象: `C:\Claude\TEST\HND-マルQ Step3コードツリー\コードツリー`
調査方法: 配下24ファイルを全文読了(バックアップ系は現行版との差分を比較)。サーバ側Method(h4_table_*, h4_treeModGet)の実装はこのツリーに含まれないため、本章では呼び出し側(クライアント)から読み取れる入出力のみ記載する。コードから確認できない事項は「推測」と明記する。

## A.1 構成と共通事項

### A.1.1 ファイル構成

| 画面 | パス(コードツリー直下から) | 構成 |
|---|---|---|
| h4_AllEventTable | h4_Table\h4_AllEventTable | html\index.html / js\app.js / js\data.js |
| h4_DATMasterTable | h4_Table\h4_DATMasterTable | html\index.html / js\app.js / js\data.js |
| h4_DeptMQMasterTable | h4_Table\h4_DeptMQMasterTable | html\index.html / js\app.js / js\data.js(+ data.js.250826bak, data.js.250827bak) |
| h4_EventSumTable | h4_Table\h4_EventSumTable | html\index.html / js\app.js / js\data.js(+ data_250819/250919/250922/260824.js.bak) |
| h4_Tree/ModTop | h4_Tree\ModTop | index.html / app.js / heirarchicalGridSearch.js / styles.css(+ app - コピー.js, app_251017bak.js) |

### A.1.2 共通アーキテクチャ(コードから確認できる事実)
- 各画面はAras Innovatorのフォームに埋め込まれるiframe内のHTMLページ。親ウィンドウの `parent.aras`(Aras API)と `parent.thisItem`(表示中アイテム)に依存する。
- `<script type="module" src="../js/app.js">` で app.js を読み込み、app.js が `import { getData } from './data.js'` する。data.js が「サーバMethod呼び出し+表示用データ整形+Wijmoの列レイアウト定義」を担い、app.js が「グリッド生成+イベント処理」を担う分担(ModTop以外)。
- グリッドは Wijmo の `wijmo.grid.multirow.MultiRow`(1レコード複数行表示)。ModTopのみ `wijmo.grid.FlexGrid`(階層ツリー表示)。
- サーバ呼び出しは `aras.IomInnovator.applyMethod(<Method名>, <XML文字列body>)`。戻りは `getResult()` のJSON文字列。
- アイテム遷移は `aras.uiShowItem(<ItemType名>, <ID>, 'tab view')`(タブ表示)。リンク列は `CellMaker.makeLink`(wijmo.grid.cellmaker)で実現。
- Wijmoライセンスは `wijmo.setLicenseKey(h0_getWijmolicense())`(`h0\h0_LisenceTool\h0_getWijmolicense.js` を読み込む)。
- 共通UI: ツールチップ(`wijmo.Tooltip`)でセル内容を表示。コード中に「KB:6375300455183」の回避方法コメントあり(`document.elementFromPoint` で `wj-cell` クラスのときのみ表示)。
- 列ヘッダ・フィルタ: `wijmo.grid.filter.FlexGridFilter` を付与(ModTop除く)。左端1列固定(`frozenColumns = 1`)。グリッドは編集不可(`isReadOnly: true`)。

### A.1.3 共通ライブラリ(相対パスは各HTMLからの参照)
| ライブラリ | 用途 | 使用画面 |
|---|---|---|
| Lib/Wijmo/Dist/controls/wijmo.min.js, wijmo.input.min.js | Wijmo本体・入力 | 全画面 |
| wijmo.grid.min.js, wijmo.grid.filter.min.js | グリッド・列フィルタ | 全画面 |
| wijmo.grid.multirow.min.js | MultiRow | Table系4画面+ModTop(読込のみ) |
| wijmo.grid.cellmaker.min.js | リンクセル | 全画面 |
| wijmo.grid.search.min.js | FlexGridSearch | ModTopのみ |
| cultures/wijmo.culture.ja.min.js | 日本語カルチャ | ModTopのみ |
| Lib/jquery/jquery-1.11.1.min.js | jQuery(ModTopのresizeで `$(window).resize` を使用。他画面では読込のみで使用箇所なし) | 全画面 |
| styles/wijmo.css(Table系)/ wijmo.min.css(ModTop) | Wijmoスタイル(Table系は `media="print" onload="this.media='all'"` の非同期読込) | 全画面 |

---

## A.2 h4_AllEventTable(全イベント一覧)

### A.2.1 目的
マルQページ(h4_MQPage)に紐づく「必要資料(h4_ReqDoc)」ごとに、イベント(列)別の成果物ドキュメント(ItemType `Document`)を一覧表示する。HTMLタイトルは "Overview"、更新ボタンの表記は「必要資料成果物ドキュメント一覧表示・更新」。

### A.2.2 画面構成(index.html)
- 上部: `#refresh_grid` ボタン「必要資料成果物ドキュメント一覧表示・更新」(他のTable系画面と異なり、列表示切替ボタンは無い)。
- 本体: `#theGrid`(MultiRow)。背面に `#no_mq_page_message`(「対象マルQページなし」のメッセージ領域、z-index:1。グリッドは z-index:2)。データなし時はグリッドを `is-hidden` にしメッセージ表示。
- `#theColumnPicker`(列ピッカー用div)は存在するが app.js から参照なし。
- 注意: 他のTable系HTMLと異なり `h0_getWijmolicense.js` の `<script>` 読込タグが**無い**のに、本文で `wijmo.setLicenseKey(h0_getWijmolicense())` を呼んでいる(読込漏れの可能性。推測: 親フレームでグローバルに定義済みなら動作する)。

### A.2.3 表示データとデータ取得方法(data.js)
- サーバMethod: **`h4_table_AllEvent_get`**、body = `<itemId>{parent.thisItem.getID()}</itemId>` のみ。
- 戻りJSON(`JSON.parse(getResult())`、エスケープ置換なし)の構造:
  - `json[0]` = ヘッダ: `eventValueList`(イベント値配列=列キー), `eventHeader`(列見出し配列), `DocList`(必要資料名配列=行グループ), `noMqPage`(真なら対象なし)。
  - `json[1..]` = レコード: `reqdocname`, `event`, `documentname`, `documentid`, `documentconfigid`, `documentsortorder`。
- 使用ItemType(クライアントから直接発行するAML/Item API):
  - **`UserMessage`**(get, select=text, name=メッセージ名): メッセージ取得。メッセージ名 `h4_S_E_0002`(汎用エラー。フォールバック「メソッドでエラーが発生しました。システム管理者に連絡してください。」)、`h4_C_E_1101` は定数定義のみで未使用(フォールバック「表示条件に一致するマルQページが存在しません。」)。
  - **`Document`**(get, select=id, config_id=…, is_current=1): リンククリック時に最新世代のドキュメントIDを解決(`resolveLatestDocumentId`)。取得失敗/0件なら元のdocumentIDにフォールバック。
- 整形ロジック: DocList の各必要資料×イベントごとに `record.reqdocname`・`record.event` で絞り込み、`documentsortorder`(数値)昇順→`documentname` の日本語localeCompare で並べ替え。必要資料ごとの最大行数=その資料の最大ドキュメント数を `reqDocMaxCounts` に保持。最大0件の資料は1行のプレースホルダ行(`__isPlaceholder: true`)を作る。
- 「対象なし」判定: ①Method結果がエラーで、エラーメッセージが "not a single item"/"does not exist"/"not found"/"no items of type"/"見つか"/"存在し" のいずれかを含む場合、②`json[0].noMqPage` が真の場合、→ `createEmptyAppData()`(`noMqPage:true`, `emptyMessage:'対象マルQページなし'`)。それ以外のエラーは `aras.AlertError` で表示し null を返す。例外時もAlertError(メッセージ h4_S_E_0002)。

### A.2.4 data.jsの定義内容
- 行データ: `{groupKey: 必要資料名, itemTypeLabel:'', __isPlaceholder, [eventName]: {displayName, documentID, documentConfigID}}`。`CollectionView(ItemData, {groupDescriptions:['groupKey']})` で必要資料名でグルーピング。
- 列定義(`ldThreeLines`): 先頭列「必要資料/イベント」(binding `itemTypeLabel`, 幅250)+イベントごとに1列(binding `{eventName}.displayName`, 幅240, 折返し, cssClass `small-text`, リンクセル)。ヘッダ定義(`headerLayoutDefinition`)も同様に生成。
- リンククリック: `resolveLatestDocumentId` で最新IDを解決し `aras.uiShowItem('Document', latestId, 'tab view')`。

### A.2.5 app.jsの主要処理
| 関数/処理 | 内容 |
|---|---|
| `init()` | 更新ボタン設定→初期は「対象マルQページなし」表示→`parent.thisItem.getID()` が有効ならgetData()→グリッド生成。`window.onload` または readyState=complete で起動 |
| `hasCurrentItemId()` | `parent.thisItem.getID()` が空でないか |
| `createGrid(appData)` | MultiRow生成(ヘッダは列のみ表示、読取専用、groupHeaderFormat `<b>{value}</b>`)、frozenColumns=1、FlexGridFilter付与、各setup呼出 |
| `setupGroupHeaderLabel()` | グループ行の0列目を `[+]/[-] 必要資料名（最大件数 N件）` に描画、クリックで開閉できる旨のtitle |
| `setupInitialRowVisibility()` | `INITIAL_GROUP_COLLAPSED=false`(初期全展開)。プレースホルダ行は非表示(`row.visible=false`)。`loadedRows` でも再適用 |
| `setupReqDocToggle()` | グループ行の0列クリックで折り畳み/展開をトグル |
| `setupCellStyle()` | セル背景・太字をリセットするだけ |
| `setupTooltip()` | セル内容のツールチップ |
| `setupRefreshButton()` / `refreshGrid()` | ボタンclickで再取得。`setInterval(…,1000)` で1秒毎にボタンの活性/非活性を更新(`isIvEditing()`=ロック状態(`getLockStatus()===1`/`isLocked()`)または対象アイテムID無しなら disabled)。再取得時、グリッド既存なら `layoutDefinition`・`headerLayoutDefinition`・`itemsSource` を差し替えて `invalidate()` |
| `clearGridHost()`/`renderNoMqPage()` | グリッド破棄・非表示とメッセージ表示 |

- ソート: 明示的なソート制御なし(Wijmo標準)。フィルタ: FlexGridFilter(列フィルタ)。画面遷移: ドキュメントリンクのみ。

### A.2.6 依存ライブラリ
A.1.3のうち wijmo本体/input/grid/cellmaker/multirow/filter、jQuery(読込のみ)。

### A.2.7 注意点
- 他Table系と異なり「自画面で他ItemTypeを大量に直接検索」せず、サーバMethodに集約し、`UserMessage`/`Document` のみ追加でクライアントから検索する。
- 更新ボタンは1秒ポーリングで活性制御(推測: 親アイテムがロック(編集中)の間は更新させない意図)。
- 初回表示は `init()` で自動取得も行うため、ボタン押下は再取得用。

---

## A.3 h4_DATMasterTable(開達書式マスタ表)

### A.3.1 目的
マルQページに紐づく「開達書式(ItemType `h4_DATFormat`)」を、必要資料(行)×イベント(列)のマトリクスで表示する。各セルに「やるやら(○/×)」「リンク」「帳票(ファイル)」を持つ。

### A.3.2 画面構成
- 上部: fieldset「グリッド制御」内に `#switch_header` ボタン「ヘッダー列の表示/非表示」。
- 本体: `#theGrid`(MultiRow)。`#theColumnPicker` は display:none の領域内に存在(未使用)。
- h0_getWijmolicense.js を読み込み済み。

### A.3.3 表示データとデータ取得方法(data.js)
- 検索対象ItemType: **`h4_DATFormat`**(`propertyString`)、ラベル「開達書式」。表示プロパティ(`choiceProperty`)は固定 `"modified_by_id,modified_on"`。
- サーバMethod: **`h4_table_DATMaster_get`**、body = `<itemId>`(thisItem ID) + `<propertys_disp>modified_by_id,modified_on</propertys_disp>` + `<mod_disp_itemtypes>h4_DATFormat</mod_disp_itemtypes>`。
- 戻りの文字列は `\` `"` `'`→`"` `/` 改行等をエスケープ置換してから `JSON.parse`(サーバ側の出力がシングルクォートJSON形式であることを示唆: 推測)。
- 戻りJSON: `json[0]`={eventValueList, eventHeader, DocList}、`json[1..]`のレコード = `docname`, `yaruyara`(カンマ区切りのイベント一覧), `itemnamelabel`, `itemid`, `fileid`, `fileName`, `modifyon`, `modifyby`, `createon`, `createby`。
- 整形: DocListの資料名×イベントについて、`docname`一致かつ `yaruyara.split(',')` にイベント名を含むレコードを該当セルに配置。セル値は `{itemNameLabel, itemtypeName:'h4_DATFormat', itemID, fileID, itemLink:'リンク', fileName, modifyOn, modifyBy, createOn, createBy, docname, yaruyara:'○'}`。該当レコードが無い資料は空行(`{}`)を1行表示。レコードが全く無い(`json.length<=1`)場合は全資料を空行表示。
- 承認状況集計(`eventApprovalStatus`)は計算するが `itemStatus` が未設定のため常にfalse、かつ表示側(ステータスヘッダの「承認済」切替)は**コメントアウト**されている。

### A.3.4 data.jsの定義内容(列レイアウト)
- 先頭列「必要資料/イベント」(binding `itemTypeLabel`, 幅190)。
- イベントごとに colspan:2 の見出し(イベントヘッダ)+ 3セル: ①`{ev}.yaruyara`(dataMap ○/×, 幅100, rowspan2, large-text), ②`{ev}.itemLink`(リンク→`aras.uiShowItem(itemtypeName,itemID)`), ③`{ev}.fileName`(リンク→`aras.uiShowItem('File', fileID)`, 幅150)。
- ヘッダ定義: イベント名/やるやら/リンク/帳票。更新者・更新日時などの追加プロパティ列生成コードはコメントアウトされている(`choicePropertyArray` を使う `switch` 部)。
- `ItemData` は `CollectionView`(グルーピングなし)。

### A.3.5 app.jsの主要処理
- `init()`: getData→MultiRow生成(ヘッダ列のみ表示・読取専用・groupHeaderFormat `<b>{value} </b>({count:n0}個の項目)`)。`grid.frozenColumns = grid.frozenColumns ? 0 : 1`(初期値0のため結果は1)。FlexGridFilter付与。
- `formatItem`: セル値が「作業中」なら背景 `#ffb2b2`(DATでは該当セルは通常無い)。
- ツールチップ: マウス移動でセル内容表示、mouseoutで消去。
- **レイアウト復元処理**(h2_SumLayoutSave): `userID = aras.getUserID()`、`jsonKey = itemID + modelID(thisItemの h4_project プロパティ)`。ItemType `HRDPMTypModelProject`(get, id=modelID)から `iq_dev_flow` を取得(`devflow`、取得後の利用箇所なし)。ItemType **`h2_SumLayoutSave`**(get, `h2_userid`=ユーザID)から `h2_layoutjson` をJSON解析し、`jsonKey` の保存状態があれば列数比較のうえ visible を反映。**保存機能(add/edit)は無い**(EventSumTableのみ保存あり)。
- `#switch_header` クリック: `headersVisibility` を Column ⇔ None で切替。

### A.3.6 依存ライブラリ
A.1.3の通り(cellmaker, multirow, filter, jQuery(読込のみ))。

### A.3.7 注意点(コード上の不具合・リスク)
- **`vallist` が未定義**: レイアウト復元部で `vallist.getItemCount()` を参照するが、`vallist` を作る処理(ItemType `FILTER VALUE`/`list` 検索、"SH-762修正" 関連)はコメントアウトされている。保存済みレイアウト(配列形式)が存在するユーザでは ReferenceError となる可能性が高い(推測: 保存データが無ければ到達しない)。
- 保存したレイアウトは `appData.ldThreeLines[].visible` を変更するが、グリッド生成後の変更であり、反映は `grid.columns` の visible 再設定に依存(`column.binding` 一致のみ)。
- `HRDPMTypModelProject` の取得結果(devflow)は未使用。
- 上記の他、`rowNum = rowNum` 等の自己代入が残る。

---

## A.4 h4_DeptMQMasterTable(部門マルQマスタ表)

### A.4.1 目的・画面構成
画面構成(index.html)・app.js は **h4_DATMasterTable と完全一致**(バイト比較で差分なし)。data.js も下記の差分を除き同一。表示対象のItemTypeやラベルも data.js の `propertyString = "h4_DATFormat"`, `propertyLabelString = "開達書式"` のままで、DATMasterと同じ(部門マルQ固有のItemType名はクライアント側コードには現れない)。

### A.4.2 DATMasterTableとの差分(現行data.js)
- サーバMethod名のみ異なる: **`h4_table_DeptMQMaster_get`**(DATMasterは `h4_table_DATMaster_get`)。body構成も同一。
- 戻りJSONのレコード項目名は DATMaster と同じ前提でパースしている(`docname`, `yaruyara`, `itemnamelabel` …)。
- 目的の違いは、サーバMethod側(本ツリー外)で決まる。**推測**: 部門(室課)マルQの開達書式を返すMethodで、クライアントは `h4_DATFormat` 前提のまま流用している。

### A.4.3 以降の項目
A.3.3〜A.3.7と同一(vallist未定義のリスク含む)。

### A.4.4 バックアップとの差分(要点)
- `data.js.250826bak` → 現行: 列幅変更(必要資料列 120→190、やるやら/リンク/帳票セル 300→100/100/150)。リンクセルのbinding が `{ev}.itemStatus`→`{ev}.itemLink`、ヘッダ「ステータス/リンク」→「リンク」、`itemLink:'リンク'` を追加。ステータスヘッダ(承認済/作業中)出力・追加プロパティ列生成部をコメントアウト。
- `data.js.250827bak` → 現行: 必要資料列幅 120→190、リンク列ヘッダ「ステータス/リンク」→「リンク」、追加プロパティ生成部をコメントアウト(250826bakより新しい中間版)。

---

## A.5 h4_EventSumTable(イベントサマリ表)

### A.5.1 目的
マルQページに紐づく「必要資料(ItemType `h4_ReqDoc`)」を、必要資料(行)×イベント/承認次数(列)で一覧し、やるやら・ステータス・帳票・承認者/担当者/承認日時などを確認する。列表示状態・フィルタ条件をユーザ別に保存できる。

### A.5.2 画面構成
- 上部: fieldset「グリッド制御」内に `#switch_header`(ヘッダー列の表示/非表示)、`#btnSave`(レイアウトを保存)、`#btnReset`(レイアウトをリセット。実体はフィルタ解除)。
- 本体: `#theGrid`(MultiRow)。`btnSave` が無ければ app.js が動的生成する分岐あり。

### A.5.3 表示データとデータ取得方法(data.js)
- 検索対象ItemType: **`h4_ReqDoc`**(ラベル「必要資料」)。
- マルQページ(`parent.thisItem`)のプロパティ使用: `h4_model_name`(機種ID), `h4_event`(取得するが未使用), `h4_test_schedule`(検証会日程、先頭10文字を `testSchdlYMD` としてヘッダに表示)。
- サーバMethod: **`h4_table_1event_get`**、body = `<itemId>` + `<h4_model_name>` + `<propertys_disp>h4_approval_date,modified_by_id,modified_on</propertys_disp>` + `<mod_disp_itemtypes>h4_ReqDoc</mod_disp_itemtypes>`。戻りはDATMaster同様のエスケープ置換後にJSON解析。
- 戻りJSON: `json[0]`={eventValueList, eventHeader, DocList}。`json[1..]` = `docname`, `approvalround`(=列のイベント値と突合), `itemnamelabel`, `itemid`, `fileid`, `fileName`, `modifyon`, `modifyby`, `itemstatus`, `createon`, `createby`, `yaruyara`, `memo`, `approverName`, `creatorName`, `approvedDate`, `yryr_class`(項目分類)。
- 追加ItemType検索: `getLatestItemId(itemType, itemId)` が、指定ItemTypeを `get`(select=config_id, id指定)→同 config_id かつ `is_current=1` のアイテムIDを取得(リンク先を最新世代に解決。失敗時は元ID)。対象は `h4_ReqDoc` と `File`。
- 承認済み判定: イベント列ごとに、全行で「やるやら=○ かつ itemStatus が '承認' 以外」が1つでもあれば未承認、無ければ承認済(`ItemData.length>1` のとき)。承認済ならイベント見出し下段が「承認済」(cssClass `approved-header`=背景 #c0e2f0)、そうでなければ「作業中」。
- 行データ: 資料ごと、イベントごとに該当レコードを配置。無い資料は空行1行。`CollectionView(ItemData, {groupDescriptions:[eventName+'.yryrClass', 'itemTypeLabel']})`。

### A.5.4 data.jsの定義内容(列レイアウト)
- 先頭列「必要資料/イベント」(`itemTypeLabel`, 幅190)。
- イベントごとに: ①「項目分類」列(`{ev}.yryrClass`, 幅100)、②colspan:2見出し(イベント名)+ やるやら(dataMap ○/×, 幅300, rowspan2)・ステータス/リンク(`{ev}.itemStatus` リンク→`aras.uiShowItem('h4_ReqDoc', 最新ID)`)・帳票(`{ev}.fileName` リンク→`aras.uiShowItem('File', 最新ID)`)。
- ヘッダ3段: イベント名/「承認済」or「作業中」/「検証会日程：yyyy-mm-dd」。
- 追加プロパティ列: `choiceProperty` を `switch` で展開。実際に列が付くのは `modified_by_id`(更新者)・`modified_on`(更新日時)のみ。`h4_approval_date` は該当caseが無く表示されない。`h4_memo`・`approvedDate`・`creatorName`・`approverName` のcaseは存在するが、固定の `choiceProperty` に含まれないため現状は未使用。

### A.5.5 app.jsの主要処理
| 処理 | 内容 |
|---|---|
| `init()` | getData→MultiRow生成(groupHeaderFormat `<b>{value} </b>({count:n0}個の項目)`)、frozenColumns=1、FlexGridFilter |
| `adjustArasSwitcherHeight()` / `scheduleAdjustArasSwitcherHeight()` | ヘッダ高+グリッド高+16pxを計算し、親ウィンドウの `.aras-scroller .aras-switcher-pane_active` と `.aras-switcher` の高さを設定(try/catch、失敗時console.warn)。`window.resize`、`loadedRows`、`filterChanged`、ヘッダ切替時に呼出 |
| `formatItem` | セル値「作業中」→背景 #ffb2b2 |
| ツールチップ | DATMasterと同様 |
| レイアウト復元 | `getLayoutItems()` で `h2_SumLayoutSave`(`h2_userid`=ユーザID)を取得。`json[itemID+modelID]` を読み、旧形式(配列)・新形式(`{visibleStates, filterDefinition}`)の両対応。列数一致なら visible 復元、`filter.filterDefinition` も復元。モデルは `HRDPMTypModelProject` から `iq_dev_flow` を取得するが未使用 |
| `saveLayout()`(#btnSave) | 最新の `h2_SumLayoutSave` を再取得。既存あり: AML `action='edit' id=…` で `h2_userid` と `h2_layoutjson`(CDATA, JSON文字列)を更新。無し: `action='add'` で新規作成。失敗時 alert「レイアウト保存失敗: …」、成功時 alert「レイアウトを保存しました」。`escapeXml`/`toCData` で値をエスケープ |
| `#btnReset` | `filter.filterDefinition = null`(フィルタ解除のみ。列表示のリセットはしない) |
| `#switch_header` | ヘッダ表示 Column⇔None |

### A.5.6 依存ライブラリ
A.1.3の通り。

### A.5.7 注意点
- `checkboxStates` は初期化時の `ldThreeLines[].visible` 配列であり、列の表示/非表示を変更するUI(チェックボックス)がコード上に無いため、保存されるvisibleStatesは実質的に復元時の値の再保存(推測: 列ピッカー機能が削除/未実装)。フィルタ定義の保存が実質的な保存対象。
- `groupDescriptions` が `eventName + '.yryrClass'` を使用するが、`eventName` は直前までのforループ変数(最後のイベント)に依存(コード上 `var` のため最後の値が入る)。複数イベント時は最終イベントの項目分類でグルーピングされる。
- 空行が1行も無くレコードが全く無い場合(`json.length<=1`)は空行のみ表示し、承認判定は未実施。
- ユーザレイアウトはユーザ×(アイテムID+機種ID)単位で `h2_SumLayoutSave` 1アイテムに全体を保持する(`getItemCount()==1` 判定の箇所と `>=1` 判定の箇所が混在)。

### A.5.8 バックアップとの差分(要点、いずれも data.js 系)
- `data_250819.js.bak`: 現行より前の版。`getLatestItemId`・検証会日程(`h4_test_schedule`)・承認済判定(ItemData基準の `for x` ループ)・項目分類の一部定義が未実装。
- `data_250919.js.bak`: `getLatestItemId`・検証会日程が未実装。項目分類列・groupDescriptions(eventName.yryrClass/itemTypeLabel)の追加前後の途中版。
- `data_250922.js.bak`: `getLatestItemId`未実装で、リンクは `aras.uiShowItem` に元IDを直接渡す。承認済判定は現行版同等。
- `data_260824.js.bak`: 現行との差は `getLatestItemId` を使った最新世代解決(`h4_ReqDoc`/`File` のリンク先)の有無のみ(バックアップ側は元IDで遷移)。=最新世代解決が直近の変更点。
- 備考: 日付「260824」は他のbak日付(2509xx)より後の並びで、命名が年月日(2026/08/24)か否かは不明(推測)。

---

## A.6 h4_Tree/ModTop(機種別マルQページツリー)

### A.6.1 目的
マルQページ(ItemType `h4_MQPage`)を「モデルイヤー → 機種(プロジェクト) → 仕向け → イベント → マルQページ(アイテム)」の階層ツリーで一覧表示し、リンクから該当アイテムを開く。キーワード検索ができる。

### A.6.2 画面構成(index.html)
- 上部: `#searchBar`(検索欄。`HierarchicalFlexGridSearch`、placeholder「検索欄」)。
- 本体: `#ModTopGrid`(FlexGrid階層表示)。`#thePager` は空のdivで未使用。
- スタイル(styles.css): FlexGridの上下6pxマージン、グループ行背景白、body下マージン10px。

### A.6.3 表示データとデータ取得方法(app.js)
- サーバMethod: **`h4_treeModGet`**、body = `<itemId>{parent.thisItem.getID()}</itemId>` のみ(propertys_disp / mod_disp_itemtypes はコメントアウトで未送信)。
- `aras` は `parent.aras || window.aras || top.aras`。
- 戻りは**シングルクォート形式のJSON風文字列**で、正規表現置換(`','`→`","`、`':'`→`":"`、`[{'`→`[{"`、`'}]`→`"}]`、`'},{'`→`"},{"`、改行→`\n`)で整形して `JSON.parse`。値内に `'`/`"` が含まれる場合の解析失敗リスクあり(推測)。
- 戻り各要素: `itemType`, `currentPjName`(機種名), `currentModelYear`, `dest`(仕向け), `event_name`, `currentItemTypeName`, `item_name`, `status`, `modified_on`, `modified_by_man`, `created_on`, `created_by_man`, `itemId`, `dept`。
- 使用ItemType: **`h4_MQPage`**(`itemType` が一致する要素のみ表示。コード上の定数)。他のItemTypeはクライアントからは検索しない。

### A.6.4 階層データ構築(現行版)
`dispModArray` に 4階層の入れ子配列を構築: `{name:モデルイヤー, pjName:[{name:機種, dest:[{name:仕向け, event:[{name:イベント, item:[{name,title,status,modified_on,modified_by_man,created_on,created_by_man,itemId,itemType,dept,dest,event_name}]}]}]}]}`。既存ノードがあれば追加、無ければ新規ノードを作る逐次探索(5重ループ)。

### A.6.5 FlexGridの定義
- `childItemsPath: ['pjName','dest','event','item']`、`autoGenerateColumns:false`、`headersVisibility:'Column'`。
- 列: 「機種」(binding `name`, 幅400, ドラッグ不可, ソート可)、「リンク」(binding `title`, `CellMaker.makeLink` → `aras.uiShowItem(ctx.item.itemType, ctx.item.itemId, 'tab view')`, 幅150)。
- 追加列は `propertyStringArray`(`propertysString` を split)で ステータス/更新日/更新者/作成日/作成者 を追加する設計だが、**`propertysString`(s付き)はコメントアウトされ未定義**(定義されているのは `propertyString`(s無し)="name,current_state,modified_on,modified_by_id")。`typeof propertysString === 'undefined'` により配列が空のままとなり、**現行コードでは追加列は表示されない**(「機種」「リンク」の2列のみ)。
- 初期表示: `collapseGroupsToLevel(0)`(最上位のみ表示)。

### A.6.6 イベント・ソート・フィルタ・サイズ
- ソート: `sortedColumn` ハンドラで全階層の子配列を `view._compareItems()` で再帰ソート(`sortItem`)後 `refresh()`(Wijmo内部API使用)。
- 検索: `HierarchicalFlexGridSearch`(heirarchicalGridSearch.js)が `FlexGridSearch` を継承し `_filter` を上書き。`searchHeirarchy` が各ノードの全プロパティを `toString().toLowerCase()` で部分一致判定し、ヒットしなければ `childItemsPath` に沿って子を再帰探索、いずれかの子が一致すれば親を表示。`hideExtraRow=false` のため階層内の全行が表示される(`hideExtraRows/updateVisibleRows` は未使用)。
- サイズ: 初期表示と `$(window).resize` で `#ModTopGrid` の幅=clientWidth-10-30、高さ=clientHeight-10-80 に設定(jQuery使用)。
- `propertyValue()`(ヘッダ名→プロパティ値の変換関数)は定義されているが呼出箇所なし(未使用)。
- 先頭の `wijmo = window;` で wijmo グローバルを上書きしている(モジュール内でのグローバル参照合わせの回避策: 推測)。

### A.6.7 依存ライブラリ
wijmo本体/input/grid/filter/multirow/search/cellmaker/culture.ja、jQuery 1.11.1(resizeで使用)。

### A.6.8 注意点
- `heirarchicalGridSearch.js` は**UTF-8ではない(Shift-JIS等のレガシー文字コード)**。コメントのみ該当し動作に影響しないが、編集時の文字化けに注意。
- index.html の `<script type="module" script src="app.js">` は属性に余分な `script` が入っている(動作はするが誤記)。`<html>`/`<body>` 構造は `<!DOCTYPE>` なし。
- 階層構築の「イベント探索ループ」は `itemSaveFlag==0` の判定がループ内にあり、イベント一覧の先頭要素が不一致の時点で新規イベントを追加して抜ける(同一仕向けに複数イベントが既にある場合、先頭以外のイベントへの追加が不正になる可能性。推測: ロジック上の懸念で、実害はデータ依存)。

### A.6.9 バックアップとの差分(要点)
- `app.js`(現行, 14,337B): 階層=モデルイヤー→機種→仕向け→イベント→アイテム(`childItemsPath: ['pjName','dest','event','item']`)。
- `app_251017bak.js`(16,857B): 階層=モデルイヤー→機種→仕向け→アイテム(`['pjName','dest','item']`)。現行より旧版で、イベント階層が未実装(推測: 現行はイベント階層を追加した改修)。
- `app - コピー.js`(14,432B): 階層=モデルイヤー→機種→**アイテムタイプ**→アイテム(`['pjName','itemType','item']`)。仕向け/イベントのキーを使わない旧々版相当(推測)。
- 3版とも `h4_treeModGet`、`itemType="h4_MQPage"`、`propertysString` コメントアウト(追加列非表示)の状態は共通。
- 備考: ファイル名の日付「251017」は他bakより未来日付(2025/10/17)で、他のbakとの時系列関係は不明(推測)。

---

## A.7 横断的な設計上の要点(全体設計書へ引き継ぐ事項)

1. サーバMethod一覧(クライアントから `applyMethod` で呼出): `h4_table_AllEvent_get`, `h4_table_DATMaster_get`, `h4_table_DeptMQMaster_get`, `h4_table_1event_get`, `h4_treeModGet`。サーバ実装はコードツリー外(別章/Import側で確認が必要)。
2. クライアントから直接AML/Item APIで検索するItemType: `UserMessage`(AllEvent), `Document`(AllEvent, config_id+is_current), `h4_ReqDoc`・`File`(EventSum, 最新世代解決), `HRDPMTypModelProject`(DATMaster/DeptMQMaster/EventSum, `iq_dev_flow` 取得だが結果未使用), `h2_SumLayoutSave`(DATMaster/DeptMQMaster/EventSum, 取得。保存(add/edit)はEventSumのみ)。
3. 表示対象として文字列で指定されているItemType: `h4_ReqDoc`(EventSum), `h4_DATFormat`(DATMaster/DeptMQMaster), `h4_MQPage`(ModTop)。
4. マルQページ(`parent.thisItem`)から読み取るプロパティ: `h4_project`(DATMaster/DeptMQMaster, 機種ID), `h4_model_name`・`h4_event`・`h4_test_schedule`(EventSum)。**注意: EventSumは `h4_model_name`、DAT/DeptMQは `h4_project` と、機種IDの取得プロパティ名が画面で異なる**。
5. ユーザ別レイアウト保存先: ItemType `h2_SumLayoutSave`(プロパティ `h2_userid`, `h2_layoutjson`)。キーは `thisItemID + 機種ID`。h2_ プレフィックスのItemTypeであり、h4専用ではなく他モジュール共有の可能性(推測)。
6. 既知の不具合候補: DAT/DeptMQの `vallist` 未定義参照、ModTopの `propertysString` 未定義(追加列が出ない)、AllEvent HTMLのライセンス用script読込漏れ、EventSumの保存対象visibleStatesが実質固定。
7. DeptMQMasterTableはDATMasterTableのコピーでMethod名のみ違う(クライアントのItemType/ラベルは `h4_DATFormat` のまま)。


