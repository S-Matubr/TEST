<!-- meta
legacy: knowledge/_legacy/機能設計書.md L73-L236
source: source/package/DATFormat/Import/
-->
## 1. DATFormat（ItemType: h4_DATFormat 「開達書式」）

### 1.1 ファイル一覧
cui_Control/ItemView.Form.xml, cui_Control/h4_DATFormat_Input_Init_EventVal.xml, cui_WindowSection/h4_DATFormat.xml, cui_WindowSection/h4_DATFormat_Input_Init_EventVal.xml, Form/(h4_DATFormat, h4_DATFormat CLN, h4_DATFormat EXPCLN, h4_DATFormat_Input_Init_DestVal, h4_DATFormat_Input_Init_EventVal), ItemType/h4_DATFormat.xml, PresentationConfiguration/(h4_DATFormatCLNCS, h4_DATFormatEXPCLNCS, h4_DATFormatLink_CS), RelationshipType/(h4_AppWFGr4DATFormat DATFormat, h4_DATFormat CLN, h4_DATFormat Doc, h4_DATFormat EXPCLN, h4_DATFormat SingOff, h4_DATFormat TGVRevQuery, h4_DATFormatLink)

### 1.2 ItemType 基本設定
| 項目 | 値 |
|---|---|
| 名前 | h4_DATFormat |
| ラベル | en: TE Format / ja: 開達書式（複数形も同じ） |
| ID | A13E2920E0A2442286CFA172EE076880 |
| implementation_type / instance_data | table / H4_DATFORMAT |
| is_versionable / manual_versioning | 1 / 0（バージョン管理あり・自動） |
| revisions（リビジョン体系） | h4_RevManagementRev |
| history_template | Default |
| unlock_on_logout | 1（ログアウト時アンロック） |
| allow_private_permission | 1 |
| enforce_discovery | 1 |
| default_page_size | 100 |
| auto_search / hide_where_used / is_dependent / is_relationship | 0 / 0 / 0 / 0 |
| show_parameters_tab | 0 |
| structure_view | tabs on |
| use_src_access | 0 |
| アイコン | ../images/RequirementDocument.svg（large/open） |
| 継承 | XMLに継承（extends/ポリモーフィック）の記載なし（table実装） |
| ライフサイクル | h4_DATFormatLC（Life Cycle Map） |
| 許可ワークフロー（Allowed Workflow） | h4_DATFormatWF（sort 128, is_default=0）、h4_DATFormatEXPWF（sort 256, is_default=0） |
| 許可アクセス権（Allowed Permission） | h4_Everyone_Full_Control（is_default=1） |
| Can Add | World（can_add=1） |
| View | Form「h4_DATFormat」, role=World, type=default, display_priority=1, client=js |
| ITPresentationConfiguration | h4_DATFormat_TOC_Configuration（client=js, sort 128）※このXML自体はこのパッケージ内に無い |

### 1.3 プロパティ表（h4_DATFormat固有）
| 名前 | ラベル(ja / en) | 型 | 長さ | 必須 | データソース | 既定値 | ソート順 | その他 |
|---|---|---|---|---|---|---|---|---|
| name | 資料名称（マスタ） / Document Master Name | string | 32 | 必須(1) | - | - | 110 | keyed_name_order=3, column_width=160 |
| h4_delta_version | Δバージョン / Δversion | list | 256 | - | list: h4_DeltaVersion | 空 | 100 | readonly=1, keyed_name_order=1, column_width=128 |
| h4_category | 資料分類 / Document Classification | list | 256 | - | list: h4_category | - | 130 | default_search=format, column_width=96 |
| h4_class | 技No. / Technique No. | string | 32 | - | - | - | 120 | column_width=96 |
| h4_doc_class | No. / No. | string | 32 | - | - | - | 140 | keyed_name_order=2, column_width=96 |
| h4_event | イベント / Event | text | - | - | - | - | 195 | readonly=1, column_width=640 |
| h4_doc_link1 | 帳票リンク① / Form Link (1) | item | - | - | ItemType h4_DATFormat | - | 3584 | item_behavior=float |
| h4_doc_link2 | 帳票リンク② / Form Link (2) | item | - | - | h4_DATFormat | - | 3712 | float |
| h4_doc_link3 | 帳票リンク③ / Form Link (3) | item | - | - | h4_DATFormat | - | 3840 | float |
| h4_guideline_link1 | 実施要領リンク① / Guidelines Link(1) | item | - | - | h4_DATFormat | - | 3968 | float |
| h4_guideline_link2 | 実施要領リンク② / Guidelines Link(2) | item | - | - | h4_DATFormat | - | 4096 | float |
| h4_guideline_link3 | 実施要領リンク③ / Guidelines Link(3) | item | - | - | h4_DATFormat | - | 4224 | float |
| h4_doc_description | 帳票説明内容 / Form Description | text | - | - | - | - | 4352 | - |
| h4_supplementary_materials1 | 帳票補足資料① / Form Supplementary Materials(1) | image | - | - | - | - | 4480 | - |
| h4_supplementary_materials2 | 帳票補足資料② / Form Supplementary Materials(2) | image | - | - | - | - | 4608 | - |
| h4_state | ステータス / status | foreign | - | - | 参照元プロパティ current_state（自ItemType）、表示元は Life Cycle State の label | - | 4736 | - |
| h4_updatedate | 更新日 / Modified on | date(pattern short_date_time) | - | - | - | - | 4864 | readonly=1 |
| h4_document_content | 資料内容 | text | - | - | - | - | 4992 | is_hidden=1, is_hidden2=1 |
| h4_approval_group_item | 一括承認リンク | item | - | - | ItemType h4_AppWFGroupForDATFormat | - | 5120 | readonly=1, is_hidden2=1, item_behavior=float |

システムプロパティ（edit）:
| 名前 | ラベル(ja/en) | 型 | その他 | ソート |
|---|---|---|---|---|
| created_by_id | 作成者 / Created by | item→User | 必須, readonly, 非表示 | 640 |
| created_on | 作成日 / Created on | date | 必須, readonly, 非表示, width150 | 512 |
| managed_by_id | 管理者 / Administrator | item→Identity | 非表示 | 896 |
| modified_by_id | 更新者 / Modified by | item→User | readonly, width160 | 1152 |
| modified_on | 更新日 / Modified on | date | readonly, width150 | 1024 |
| owned_by_id | 閲覧者（ja） | item→Identity | is_hidden2=1 | 768 |
| state | ステータス / status | string 32 | readonly, 非表示 | 1408 |
| superseded_date | Superseded Date | date | 非表示 | 3200 |

### 1.4 サーバーイベント（Method名と発火タイミング）
sort_orderは同一イベント内の実行順。

| 発火タイミング | Method | sort_order |
|---|---|---|
| GetKeyedName | h4_ctrl_keyed_name | 256 |
| onBeforeGet | h4_sort_control | 128 |
| onBeforeAdd | h4_CheckLockRelationDoc | 1280 |
| onAfterAdd | h4_ChangeWfForDATFormatAtAdd | 512 |
| onAfterAdd | h4_NewAssignInProgressForDat | 515 |
| onAfterAdd | h4_InitSetPermissionAndNo | 1152 |
| onBeforeUpdate | h4_ChangeWfForDATFormat | 384 |
| onBeforeUpdate | h4_CheckLockRelationDoc | 896 |
| onBeforeUpdate | h4_ReSetPermisson_Before | 2176 |
| onAfterUpdate | h4_ReAssignInProgressForDat | 640 |
| onAfterUpdate | h4_InitSetPermissionAndNo | 1024 |
| onAfterUpdate | h4_ReSetPermisson_After | 1920 |
| onBeforeVersion | h4_SetWfForDATAtRevisio_Before | 630 |
| onAfterVersion | h4_SetWfForDATAtRevisio_After | 768 |
| onBeforePromote | h4_CheckLockRelationDoc | 1408 |
| onAfterPromote | h4_UpdatePermissionForPromote | 1536 |
| onBeforeDelete | h4_CheckLockRelationDoc | 1664 |
| onBeforeDelete | h4_ReSetPermisson_Before | 2048 |
| onAfterDelete | h4_ReSetPermisson_After | 1792 |

### 1.5 クライアントイベント
| イベント | Method | sort |
|---|---|---|
| OnAfterNew | h4_ControlItemCreation | 128 |
| OnAfterNew | h4_setDefaultChargeListForDAT | 256 |

### 1.6 関係ItemType（RelationshipType）
| 名前 | ラベル(ja / en) | source | related | behavior | その他 | sort |
|---|---|---|---|---|---|---|
| h4_DATFormat Doc | 書式ドキュメント / Format Document | h4_DATFormat | Document | float | grid_view=intermix, description「SH: 開達書式 - ドキュメントリレーションシップ」。View/Formはdelete指定 | 128 |
| h4_DATFormatLink | リンク / Link | h4_DATFormat | （related_id指定なし。relationship ItemTypeは h4_DATFormatLink） | float | ItemType h4_DATFormatLink の `is_released`(boolean, 非表示, readonly, ラベル「Released Matsumoto」)をedit | 256 |
| h4_DATFormat SingOff | サインオフ / Sign-off | h4_DATFormat | （related指定なし） | float | Relationship View: Form h4_WFSignOffsForMQReqDoc, role=World | 384 |
| h4_DATFormat TGVRevQuery | サインオフ / Sign-off | h4_DATFormat | （related指定なし） | float | Relationship View: start_page=`../Modules/aras.innovator.TreeGridView/Views/MainPage.html`, parameters=`tgvdId=51B00F3519EA4525BAF4CDD560AB6EAB&startConditionProvider=ItemDefault({"id":"id"})` | 385 |
| h4_DATFormat CLN | 担当者一覧 / List of Responsible Parties | h4_DATFormat | Identity | hard_float | grid_view=right | 512 |
| h4_DATFormat EXPCLN | 担当者一覧(EXP) / List of Responsible Parties(EXP) | h4_DATFormat | Identity | hard_float | grid_view=right | 640 |
| h4_AppWFGr4DATFormat DATFormat | 承認対象 | source=h4_AppWFGroupForDATFormat | related=h4_DATFormat | float | related_idプロパティ（relationship ItemType側）に Grid Event `onsearchdialog` → Method `h4_propIsExpFilter`(sort128)。View/Form delete | 128 |

共通: auto_search=1, copy_permissions=0, create_related=0, related_option=2, related_notnull=0, inc_rel_key_name=1, inc_related_key_name=1, new_show_related=0。

### 1.7 Form
**h4_DATFormat**（Responsive, 1024x172, SH: 開達書式）
- Body（bg #ffffff）にFieldなし。レイアウトはcui_Control側で定義。
- Form Event: `onload` → Method `h4_ControlTabbarForDAT`（コメント「開達書式の担当者一覧タブの表示制御」）。コード内容:
  - 定数: DATCLN=`h4_DATFormat CLN`, DATEXPCLN=`h4_DATFormat EXPCLN`, SINGOFF=`h4_DATFormat SingOff`, TGVSINGOFF=`h4_DATFormat TGVRevQuery`, InProgress=`InProgress`, EXPTest=`EXPTest`。
  - `parent.relationships` が未生成の間は50msでリトライ。thisItemから `state` と `h4_category` を取得。各RelationshipType名からIDを引いてタブIDとする。
  - `h4_AppWFGr4DATFormat DATFormat` を related_id=自身のIDで検索し、紐づく各 `h4_AppWFGroupForDATFormat` の `is_current` を取得（取得エラー時は UserMessage `h4_C_E_0002` をAlert）。`is_current=="1"` が1件でもあれば「一括承認対象」と判定。
  - 表示制御: 一括承認対象 → CLN/EXPCLN/SingOff非表示、TGVRevQuery表示。 そうでなく state が `InProgress` または空 → CLN, EXPCLN, SingOff表示、TGV非表示。 そうでなく category==`EXPTest` → EXPCLN, SingOff表示（CLN, TGV非表示）。 それ以外 → CLN, SingOff表示（EXPCLN, TGV非表示）。
- FormComposite → cui_WindowSection `h4_DATFormat`。

**h4_DATFormat CLN**（699x234）: Field `h4_workflow_role`(dropdown, 役割, 上ラベル, x10 y10, sort128) と `h4_check_required`(checkbox, 必須, 右ラベル, x10 y50, sort256)。イベントなし。
**h4_DATFormat EXPCLN**: CLNと同構成（propertytype_idのみ別）。
**h4_DATFormat_Input_Init_DestVal**（イベント/仕向け地選択ダイアログ用）:
- Field `button0`（button, ラベル「OK」）— Field Event `onclick` → Method `h4_frm_get_destination`: ダイアログ内のチェック済みcheckboxのidを配列化し `parent.dialogArguments.dialog.close(strDestinations)` で返却（コメント「マルQページ仕向け地の取得」）。
- Field `h4_destination`(html, `<div id="destinationField">`)。
- Form Event `onload` → Method `h4_setDestinaionInit`: `dialogArguments.destinations`（カンマ区切り）を取得、List `h4_destination` の Value(label,sort_order,value) を取得して8個ずつ行分けでチェックボックス生成。既存選択値はchecked。
**h4_DATFormat_Input_Init_EventVal**（開達書式イベント設定用, css font-size 20px）:
- Field `button0`（OK）— Field Event `onclick` → Method `h4_frm_getSettingEvents`: チェック済みcheckboxのidを `dialog.close(strEvents)` で返却。
- Field `h4_events`(html, `<div id="eventField">`)。
- Form Event `onload` → Method `h4_setEventInit`: `dialogArguments.deltaVer`, `dialogArguments.events` を取得。List `h4_events` の `Filter Value`（filter=deltaVer, inactive=0, select=filter,label,sort_order,value,inactive）を取得。0件なら UserMessage `h4_C_E_0410` をAlert。labelが「個別」のものは除外。8個ずつ行分けでチェックボックス生成。
- FormComposite → cui_WindowSection `h4_DATFormat_Input_Init_EventVal`。

### 1.8 画面（cui）
- cui_WindowSection `h4_DATFormat`（location=ItemView, classification=Data Model）→ cui_WindowSectionControl(Add, World, sort128) → cui_Control `ItemView.Form`(id 58C4C519…)。
- cui_WindowSection `h4_DATFormat_Input_Init_EventVal` → cui_Control `h4_DATFormat_Input_Init_EventVal`（control_type=FormControl, parent=ItemView.FormTab, additional_data `{"layout":{},"order":[]}`）。
- cui_Control `ItemView.Form`（FormControl, parent=ItemView.FormTab）: cui_ControlFormField 33件（重複登録あり）。ユニークなフィールド構成:
  - 1行目 Column Set 0: h4_delta_version(filterList, maxWidth144), name(text, 144), h4_category(72–144), h4_class, h4_doc_class
  - h4_event（単独行）
  - Column Set 2: h4_doc_link1 / 2 / 3（item）
  - Column Set 3: h4_guideline_link1 / 2 / 3（item）
  - Column Set 4: h4_supplementary_materials1 / 2（image）
  - Column Set 5: created_on(date), created_by_id(item), h4_state(multiLingual), h4_updatedate(date)
  - Column Set 6: managed_by_id, owned_by_id（Column Set 7）／ h4_approval_group_item（Column Set 9）
  - Column Set 8: h4_document_content(textarea), h4_doc_description(textarea)
  - order: Column Set 0, h4_event, Column Set 2, 3, 4, 5, 6, 8
  - 全フィールド readonly=1/required=1（XML値）。field_type: h4_delta_version=filterList, name=text, h4_category=filterList(別エントリでtextもあり), h4_class/h4_doc_class=text, link系=item, supplementary=image, h4_event=text。
  - 同一data_source（name, h4_category, h4_class, h4_doc_class, h4_delta_version, h4_event）が複数回登録されている（sort_order 128〜1408, 3712〜4608 等）。
- ボタン→Method対応: cui_Control/cui_WindowSectionにボタン定義なし。

### 1.9 PresentationConfiguration
| 名前 | 参照CommandBarSection | role | sort |
|---|---|---|---|
| h4_DATFormatCLNCS | h4_DATFormatCLNIVRCB | World | 128 |
| h4_DATFormatEXPCLNCS | h4_DATFormatEXPCLNIVRCB | World | 128 |
| h4_DATFormatLink_CS | h4_DATFormatLink_IVRGCM | World | 128 |

（CommandBarSection本体は `Independent\Import\CommandBarSection` にある。このパッケージ範囲外。）

### 1.10 qry_* / rb_* / CommandBar*
このパッケージには存在しない。

---

