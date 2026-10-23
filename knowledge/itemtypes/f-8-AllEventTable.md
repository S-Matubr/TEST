<!-- meta
legacy: knowledge/_legacy/機能設計書.md L645-L694
source: source/package/AllEventTable/Import/
-->
## 8. AllEventTable（ItemType: h4_AllEventTable「マルQ イベント横通し表示」）

ファイル: CommandBarMenuButton/com.aras.innovator.cui_default.toc_h4_AllEventTable_AF93993…xml, CommandBarSection/h4_AllEventTable_TOC_Content.xml, cui_Control/ItemView.Form.xml, cui_WindowSection/h4_AllEventTable.xml, Form/(h4_AllEventTable, h4_AllEventTable Table), ItemType/h4_AllEventTable.xml, PresentationConfiguration/h4_AllEventTable_TOC_Configuration.xml, RelationshipType/h4_AllEventTable Table.xml

### 8.1 基本設定
| 項目 | 値 |
|---|---|
| ラベル | en: MaruQ All Event Data List / ja: マルQ イベント横通し表示 |
| ID | 4E29B9EE8D40476A85B338A4781E37EC |
| implementation_type / instance_data | table / H4_ALLEVENTTABLE |
| is_versionable | **0**（バージョン管理なし） |
| revisions | Default（history_templateなし） |
| unlock_on_logout | 0 |
| show_parameters_tab | 1 |
| structure_view | tabs on |
| ライフサイクル / ワークフロー | なし |
| 許可アクセス権 | h4_Everyone_Full_Control（is_default=1） |
| Can Add | World |
| ITPresentationConfiguration | h4_AllEventTable_TOC_Configuration |
| View | Form h4_AllEventTable, World, default |
| サーバー/クライアントイベント | なし |

### 8.2 プロパティ表
| 名前 | ラベル(ja / en) | 型 | 長さ | 必須 | データソース | ソート | その他 |
|---|---|---|---|---|---|---|---|
| h4_model_name | 機種呼称 / Model Name | item | - | 必須 | ItemType HRDPMTypModelProject | 100 | float, keyed_name_order=2 |
| h4_delta_version | Δバージョン / Delta Version | list | 256 | 必須 | list h4_DeltaVersion | 300 | keyed_name_order=3 |
| h4_dept | 室課 / Dept. | string | 32 | 必須 | - | 3072 | - |
| h4_group | グループ | string | 32 | - | - | 3200 | - |
| h4_section | セクション | string | 32 | - | - | 3328 | - |
| h4_model_code | 機種コード | string | 32 | 必須 | - | 3456 | keyed_name_order=4 |
| h4_my | MY | list | 256 | 必須 | list h4_ModelYear | 3584 | keyed_name_order=1 |
（既定値の記載なし。システムプロパティのedit なし。）

### 8.3 関係ItemType
`h4_AllEventTable Table`（ラベル 一覧 / List, source=h4_AllEventTable, float, sort_order=1）: Relationship View start_page=`../../Solutions/h4_Table/h4_AllEventTable/html/index.html`, role=World。

### 8.4 Form
- **h4_AllEventTable**（Responsive, 699x150）: Bodyのみ。Form Event `onload` → Method `h4_MainFormMin`（コメント「マルQページ一覧ツリー、イベント横通しテーブルを表示した際にメインフォームを最小化する」）。コード: アイテムIDが空（新規作成時）なら何もせず終了（設定画面表示のため）。`aras.getIdentityList()` を順に `Identity` 取得し、keyed_name が `Administrators` のものがあれば adminCheck=false。`parent.document` の最初の `aras-accordion` に対し `toggle(adminCheck)` を呼ぶ（Administrators以外はtrue=閉じる、Administratorsは開く）。
- **h4_AllEventTable Table**（699x234）: Bodyのみ。

### 8.5 画面（cui / CommandBar）
- cui_WindowSection h4_AllEventTable → ItemView.Form（id B16CF129…）: 7フィールド(h4_model_name=item, h4_dept/h4_section/h4_group/h4_model_code=text, h4_delta_version/h4_my=filterList)。レイアウト: Column Set 0 = [h4_dept, h4_group]＋[h4_section]、Column Set 1 = [h4_delta_version, h4_model_code]、[h4_my, h4_model_name]。全readonly=1。
- CommandBarMenuButton `com.aras.innovator.cui_default.toc_h4_AllEventTable_AF93993530274CD187DA94A790908CC8`: ラベル en「MaruQ All Event Data List」/ ja「マルQ イベント横通し表示」, image=../images/calendar.svg, parent_menu=h4_toc_menu_HND_SH, additional_data=`{"itemTypeId":"4E29B9EE8D40476A85B338A4781E37EC"}`（ItemType h4_AllEventTableを開くTOCメニュー項目）。Method指定なし。
- CommandBarSection `h4_AllEventTable_TOC_Content`（location=TOC）に上記ボタンを Add（World, sort768）。
- PresentationConfiguration `h4_AllEventTable_TOC_Configuration` → CommandBarSection h4_AllEventTable_TOC_Content（World, 128）。
- 一覧UI本体は RelationshipType h4_AllEventTable Table の start_page（Solutions/h4_Table/h4_AllEventTable/html/index.html）。このHTMLは今回の対象XMLに含まれない。

---

