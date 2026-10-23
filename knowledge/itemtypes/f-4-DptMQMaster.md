<!-- meta
legacy: knowledge/_legacy/機能設計書.md L395-L448
source: source/package/DptMQMaster/Import/
-->
## 4. DptMQMaster（ItemType: h4_DeptMQMaster「マルQマスタ」）

ファイル: cui_Control/ItemView.Form.xml, cui_WindowSection/h4_DeptMQMaster.xml, Form/h4_DeptMQMaster.xml, ItemType/h4_DeptMQMaster.xml, RelationshipType/(h4_DMPMaster Table, h4_DMQMaster DATFormat)

### 4.1 基本設定
| 項目 | 値 |
|---|---|
| ラベル | en: Dept. Maru Q Master / ja: マルQマスタ |
| ID | B8AEEFB599DB4EC2A4067C036DC3C0C3 |
| implementation_type / instance_data | table / H4_DEPTMQMASTER |
| is_versionable / manual_versioning | 1 / **1**（手動バージョン管理） |
| revisions | Default |
| history_template | Default |
| unlock_on_logout | 1 |
| default_page_size | 100 |
| show_parameters_tab | 0 |
| structure_view | tabs on |
| アイコン | ../images/GenericIcon.svg |
| ライフサイクル / ワークフロー | XMLに記載なし |
| 許可アクセス権 | h4_Everyone_Full_Control（sort128, default指定なし）, h4_DeptMQMaster（sort256, is_default=1） |
| Can Add | World |
| ITPresentationConfiguration | h4_DeptMQMaster_TOC_Configuration（XML本パッケージ内なし） |

### 4.2 プロパティ表
| 名前 | ラベル(ja / en) | 型 | 長さ | 必須 | データソース | 既定値 | ソート | その他 |
|---|---|---|---|---|---|---|---|---|
| h4_dept | 室課 | string | 32 | 必須 | - | 空(ja) | 100 | - |
| name | 名称 / Name | string | 32 | 必須 | - | - | 120 | keyed_name_order=1, width250 |
| h4_delta_version | ⊿バージョン / Delta Ver. | list | 256 | - | list h4_DeltaVersion | 空 | 110 | readonly, width128 |
| h4_base_format_master | ベース帳票マスタ / Base Format Master | item | - | - | ItemType h4_DATMaster | - | 125 | readonly, 非表示, float, width250。Grid Event `onsearchdialog` → Method `h4_DeptMQMasterReleaseFilte`(128) |
| h4_class | 区分 | mv_list(複数値リスト) | 256 | - | list h4_class | - | 3628 | - |
| h4_group | グループ | string | 32 | - | - | - | 3756 | - |
| h4_section | セクション | string | 32 | - | - | - | 3884 | - |
| h4_approve_style | ワークフローの有無 | boolean | - | - | - | 1(ja) | 3456 | 非表示 |

システムプロパティ(edit): created_on(必須,readonly,非表示,3500), managed_by_id(管理者,非表示,896), modified_by_id(readonly,1152), modified_on(readonly,1024), owned_by_id(一般ユーザ / general user, 非表示, 768), superseded_date(非表示, 3200)。

### 4.3 イベント
- サーバー: onBeforeGet → h4_sort_control（128）。
- クライアント: OnAfterNew → h4_ControlItemCreation（256）。

### 4.4 関係ItemType
| 名前 | ラベル | source | related | behavior | その他 | sort |
|---|---|---|---|---|---|---|
| h4_DMQMaster DATFormat | マルQマスタ - 開達書式 / DAT Format | h4_DeptMQMaster | h4_DATFormat | **fixed** | grid_view=intermix。Relationship Grid Event `oninsertrow` → h4_addDatFormatCheck(128)。relationship側related_idに Grid Event `onsearchdialog` → h4_propDeltaFilter(128)。sort_orderプロパティ(integer,非表示,並び順,3200) | 128 |
| h4_DMPMaster Table | やるやら表 / Master Table | h4_DeptMQMaster | - | float | Relationship View: start_page=`../../Solutions/h4_Table/h4_DeptMQMasterTable/html/index.html`, World | 256 |

### 4.5 Form / 画面
- Form `h4_DeptMQMaster`（Responsive, 1024x172, SH: 室課マルQマスタ）: Field `h4_delta_version`(dropdown, x0 y0, length128), `name`(text, x150 y0, length160), `h4_base_format_master`(item, x4 y52, length160)。イベントなし。FormComposite→cui_WindowSection h4_DeptMQMaster。
- cui_Control ItemView.Form（id 48925850…）: 10フィールド。レイアウト: Column Set 6 = h4_class(checkboxList), h4_dept(text,72), h4_group(72), h4_section(72), h4_approve_style(checkbox), managed_by_id(item), owned_by_id(item)。Column Set 5 = h4_delta_version(filterList), name(text, max432), h4_base_format_master(item)。order: Column Set 6, 5。全 readonly=1。
- PresentationConfiguration / CommandBar / qry / rb: なし。

---

