<!-- meta
legacy: knowledge/_legacy/機能設計書.md L258-L394
source: source/package/DATMaster/Import/
-->
## 3. DATMaster（ItemType: h4_DATMaster「帳票マスタ」＋ h4_RevisionHistory「改訂履歴」）

### 3.1 ファイル一覧
CommandBarSection/h4_DATMaster RevisionHistoryIVRCB.xml, cui_Control/ItemView.Form.xml, cui_WindowSection/h4_DATMaster.xml, Form/(h4_DATMaster, h4_DATMaster CLN), ItemType/(h4_DATMaster, h4_RevisionHistory), PresentationConfiguration/(h4_DATFormat RevisionHistoryCS, h4_DATMaster RevisionHistoryCS, h4_DATMasterCLNCS, h4_RevisionHistory_CS), RelationshipType/(h4_DATFormat RevisionHistory, h4_DATMaster CLN, h4_DATMaster DATFormat, h4_DATMaster RevisionHistory, h4_DATMaster SingOff, h4_DATMaster Table, h4_RevisionHistory Doc, h4_RevisionHistory RevHist)

### 3.2 ItemType h4_DATMaster 基本設定
| 項目 | 値 |
|---|---|
| ラベル | en: Form Master / ja: 帳票マスタ |
| ID | 95C9A38FE49C46B5A5656226665D2EBC |
| implementation_type / instance_data | table / H4_DATMASTER |
| is_versionable / manual_versioning | 1 / 0 |
| revisions | h4_RevManagementRev |
| history_template | Default |
| unlock_on_logout | 1 |
| allow_private_permission / enforce_discovery | 1 / 1 |
| default_page_size | 100 |
| structure_view | tabs on |
| show_parameters_tab | 0 |
| アイコン | ../images/FromTemplate.svg |
| ライフサイクル | h4_DATMasterLC |
| 許可ワークフロー | h4_DATFormatWF（sort128） |
| 許可アクセス権 | h4_Everyone_Full_Control（is_default=1） |
| Can Add | World |
| View | Form h4_DATMaster, role World, default |
| ITPresentationConfiguration | h4_DATMaster_TOC_Configuration（本パッケージ内にXMLなし） |

### 3.3 プロパティ表（h4_DATMaster）
| 名前 | ラベル(ja/en) | 型 | 長さ | 必須 | データソース | 既定値 | ソート | その他 |
|---|---|---|---|---|---|---|---|---|
| h4_delta_version | Δバージョン / Δversion | list | 256 | 必須 | list h4_DeltaVersion | 空 | 100 | keyed_name_order=1, width128 |
| name | 名称 / Name | string | 32 | 必須 | - | - | 110 | keyed_name_order=2, width160 |
| h4_state | ステータス / status | foreign | - | - | current_state → Life Cycle State.label | - | 3712 | - |
| h4_updatedate | 更新日 / Modified on | date | - | - | - | - | 3584 | readonly |

システムプロパティ(edit): created_by_id(作成者,必須,readonly,非表示,640), created_on(作成日,必須,readonly,非表示,512), managed_by_id(管理者,非表示,896), modified_by_id(更新者,readonly,1152), modified_on(更新日,readonly,1024), state(string 32,readonly,非表示,1408), superseded_date(非表示,3200)。

### 3.4 イベント（h4_DATMaster）
サーバー:
| タイミング | Method | sort |
|---|---|---|
| GetKeyedName | h4_ctrl_keyed_name | 256 |
| onBeforeGet | h4_sort_control | 128 |
| onAfterAdd | h4_SetWfForDATMasterAtAdd | 512 |
| onAfterAdd | h4_NewAssignInProgressForDat | 640 |
| onAfterCopy | h4_SetWfForDATMasterAtAdd | 700 |
| onAfterUpdate | h4_ReAssignInProgressForDat | 384 |
| onBeforeVersion | h4_SetWfForDATAtRevisio_Before | 956 |
| onAfterVersion | h4_SetWfForDATAtRevisio_After | 828 |

クライアント: OnAfterNew → h4_setDefaultChargeListForDAT（128）。
（開達書式と異なり、権限再設定系・h4_CheckLockRelationDoc等は設定されていない。）

### 3.5 ItemType h4_RevisionHistory（このパッケージ内で定義）
| 項目 | 値 |
|---|---|
| ラベル | en/ja: Revision History / 改訂履歴 |
| ID | 00DB7AFBCD5D4B8D89483816E141FE65 |
| implementation_type / instance_data | table / H4_REVISIONHISTORY |
| is_versionable / manual_versioning | 1 / 0 |
| revisions | Default |
| history_template | Default |
| unlock_on_logout | 0 |
| show_parameters_tab | 1 |
| structure_view | tabs on |
| ライフサイクル / ワークフロー | XMLに記載なし |
| 許可アクセス権 | h4_RevisionHistory（is_default=1） |
| Can Add | World |
| ITPresentationConfiguration | h4_RevisionHistory_CS |
| View | Form h4_RevisionHistory, World, default |

プロパティ表:
| 名前 | ラベル(ja / en) | 型 | 長さ | 必須 | データソース | 既定値 | ソート | その他 |
|---|---|---|---|---|---|---|---|---|
| h4_revision_number | 確認No. / Confirmation No. | string | 32 | - | - | - | 10 | readonly, keyed_name_order=1 |
| h4_revision_sub_number | 枝番 / Branch Number | integer | - | - | - | 1 | 20 | readonly, 非表示 |
| h4_revision_summary | 確認事項（改訂内容） / Confirmation Items (Revised Content) | text | - | 必須 | - | - | 30 | keyed_name_order=5 |
| h4_rel_dat_master | 対象：帳票マスタ / Target: Form Master | item | - | - | ItemType h4_DATMaster | - | 30 | readonly, keyed_name_order=3, is_hidden2=1 |
| h4_rel_dat_format | 対象：開達書式 / Target:TE Format | item | - | - | ItemType h4_DATFormat | - | 40 | readonly, keyed_name_order=4 |
| h4_revised_by | 担当者（改訂者） / Revised by | item | - | - | User | - | 50 | readonly, is_hidden2=1 |
| h4_revision_date | 改訂日（公開承認になった日） / Revision Date (Date Public Approval Granted) | date | - | - | - | - | 60 | readonly |
| h4_applover_1 | 承認者 / Approver | item | - | - | Identity | - | 70 | - |
| h4_applover_2 | 承認者2 / Approver2 | item | - | - | Identity | - | 71 | - |
| h4_confirmation_status | 確認済み / Confirmed | list | 256 | 必須 | list h4_confirmation_status | `not_confirmed`(ja) | 3712 | 非表示 |
| h4_due_date | 対応期日 / Due Date | date | - | - | - | - | 3840 | 非表示 |
| h4_newest_revision_history | 最新 / Latest Data | item | - | - | ItemType h4_RevisionHistory | - | 3968 | readonly, 非表示 |
| h4_response_note | 回答事項 / Response Content | text | - | - | - | - | 4352 | 非表示 |
| h4_revision_reason | 改訂理由 / Reason for Revision | text | - | 必須 | - | - | 4864 | 非表示 |

システムプロパティ(edit): created_on(記載日 / Date of Record, 必須, readonly, 非表示, 512), managed_by_id(管理者,非表示,896), superseded_date(非表示,3200)。
サーバーイベント: onAfterAdd → h4_SetNos（128）、onAfterAdd → h4_CreateNewRevisionHistory（130）。
クライアントイベント: OnAfterNew → h4_setPropToRevisionHistory（128）。

### 3.6 関係ItemType
| 名前 | ラベル(ja/en) | source | related | behavior | その他 | sort |
|---|---|---|---|---|---|---|
| h4_DATMaster DATFormat | 帳票マスタ-開達書式 / Form Master - TE Format | h4_DATMaster | h4_DATFormat | float | grid_view=intermix。Relationship Grid Event `oninsertrow` → Method `h4_addDatFormatCheck`(128)。relationship ItemTypeのrelated_idプロパティ(item→h4_DATFormat, is_indexed)に Grid Event `onsearchdialog` → `h4_propDeltaFilter`(128)。sort_orderプロパティ(integer, 非表示, ラベル「並び順」, 3200)。View/Form delete | 128 |
| h4_DATMaster SingOff | サインオフ / Sign-off | h4_DATMaster | - | float | Relationship View: Form h4_WFSignOffsForMQReqDoc, World | 256 |
| h4_DATMaster Table | Table / やるやら | h4_DATMaster | - | float | Relationship View: start_page=`../../Solutions/h4_Table/h4_DATMasterTable/html/index.html`, World | 256 |
| h4_DATMaster CLN | 担当者一覧 / List of Responsible Parties | h4_DATMaster | Identity | hard_float | grid_view=right | 384 |
| h4_DATMaster RevisionHistory | 改訂履歴 / Revision History | h4_DATMaster | h4_RevisionHistory | hard_float | View/Form delete | 512 |
| h4_DATFormat RevisionHistory | 改訂履歴 / Revision History | h4_DATFormat | h4_RevisionHistory | hard_float | View/Form delete | 768 |
| h4_RevisionHistory Doc | 補足資料（ja） | h4_RevisionHistory | Document | float | View/Form delete | 128 |
| h4_RevisionHistory RevHist | 関連改訂履歴（ja） | h4_RevisionHistory | h4_RevisionHistory | float | View/Form delete | 256 |

### 3.7 Form
- **h4_DATMaster**（Responsive, 1024x256, SH: 帳票マスタ）: Field `h4_delta_version`(dropdown, ラベル⊿バージョン, display_length128, x0 y0, sort100) と `name`(text, 名称, length192, x200 y0, sort110)。Form Eventなし。FormComposite→cui_WindowSection h4_DATMaster。
- **h4_DATMaster CLN**（699x234）: h4_workflow_role(dropdown 役割) / h4_check_required(checkbox 必須)。イベントなし。

### 3.8 画面（cui / CommandBar）
- cui_WindowSection `h4_DATMaster` → cui_Control ItemView.Form（id 8244FC6D…）。
- ItemView.Form: cui_ControlFormField 7件（重複あり）。ユニーク構成: Column Set 0 = h4_delta_version(filterList, max200) / name(text, max432)、Column Set 4 = managed_by_id(item)、Column Set 3 = h4_state(multiLingual) / h4_updatedate(date)。order: Column Set 0, 4, 3。全 readonly=1。
- CommandBarSection **h4_DATMaster RevisionHistoryIVRCB**（location=ItemView.RelationshipsCommandBar）。CommandBarSectionItem:
| action | 対象CommandBarItem | alternate（置換先） | sort |
|---|---|---|---|
| Remove | itemview.relationshipscommandbar.default.selectitems | - | 128 |
| Remove | itemview.relationshipcommandbar.addrow | - | 256 |
| Replace | itemview.relationshipscommandbar.create_item | h4_DATHistRelIVCBNewItem | 384 |
| Replace | itemview.relationshipscommandbar.default.deleterow | h4_DATHistRelIVCBRowDell | 512 |
| Add | h4_ivrcb_directCreateHistory | - | 520 |
| Add | h4_ivrcb_directDeleterow | - | 524 |
  （全て role=World）。ボタン→Methodの対応（CommandBarItemのon_click_handler等）は本パッケージ内に無く不明。

### 3.9 PresentationConfiguration
| 名前 | CommandBarSection |
|---|---|
| h4_DATMasterCLNCS | h4_DATMasterCLNIVRCB |
| h4_DATFormat RevisionHistoryCS | h4_DATFormat RevisionHistoryIVRCB |
| h4_DATMaster RevisionHistoryCS | h4_DATMaster RevisionHistoryIVRCB（上記） |
| h4_RevisionHistory_CS | h4_RevisionHistory_IVCB |
（いずれも role=World, sort128）

### 3.10 qry/rb
なし。

---

