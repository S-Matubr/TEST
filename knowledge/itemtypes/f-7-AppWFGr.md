<!-- meta
legacy: knowledge/_legacy/機能設計書.md L533-L644
source: source/package/AppWFGr/Import/
-->
## 7. AppWFGr（ItemType: h4_ApprovalWFGroup「一括承認」, h4_ApprovalTarget「承認対象」, h4_ApprovalWFGroupSignOff）

ファイル: cui_Control/ItemView.Form.xml, cui_WindowSection/h4_ApprovalWFGroup.xml, Form/(h4_ApprovalTarget, h4_ApprovalWFGroup, h4_ApprovalWFGroup PointOut, h4_ApprovalWFGroupSignOff), ItemType/(h4_ApprovalTarget, h4_ApprovalWFGroup, h4_ApprovalWFGroupSignOff), PresentationConfiguration/h4_ApprovalWFGroup CLN_TOC_Configuration.xml, Property/(h4_approval_group_item, h4_rel_approvalwfgroup), RelationshipType/(h4_ApprovalWFGroup CLN, h4_ApprovalWFGroup PointOut, h4_ApprovalWFGroup_ApSignOff, h4_ApprovalWFGroup_ApTarget)

### 7.1 ItemType h4_ApprovalWFGroup 基本設定
| 項目 | 値 |
|---|---|
| ラベル | en: h4_ApprovalWFGroup / ja: 一括承認（複数形ja同） |
| ID | DD0E19C0D9DE43E986F27A243FBD2298 |
| implementation_type / instance_data | table / H4_APPROVALWFGROUP |
| is_versionable / manual_versioning | 1 / 0 |
| revisions / history_template | Default / Default |
| unlock_on_logout | 0 |
| default_page_size | 100 |
| show_parameters_tab | 1 |
| structure_view | tabs on |
| アイコン | ../images/PackageDependsOn.svg |
| ライフサイクル | h4_ApprovalWFGroupLC |
| 許可ワークフロー | h4_ApprovalWFGroupWF（is_default=1） |
| 許可アクセス権 | h4_Everyone_Full_Control（is_default=1） |
| Can Add | World |
| ITPresentationConfiguration | h4_ApprovalWFGroup_TOC_Configuration（XMLなし） |
| View | Form h4_ApprovalWFGroup, World, default |

### 7.2 プロパティ表（h4_ApprovalWFGroup）
| 名前 | ラベル(ja / en) | 型 | 長さ | 必須 | データソース | 既定値 | ソート | その他 |
|---|---|---|---|---|---|---|---|---|
| h4_my | MY | list | 256 | - | list h4_ModelYear | - | 3072 | readonly, keyed_name_order=1 |
| h4_model_name | 機種呼称 | item | - | - | ItemType HRDPMTypModelProject | - | 4096 | readonly, float, keyed_name_order=2 |
| h4_event | イベント | filter list | 256 | - | list h4_Events（filter元 pattern=h4_delta_version） | - | 5522 | readonly, 非表示, keyed_name_order=3 |
| h4_unique_event | 個別イベント | string | 256 | - | - | - | 5266 | readonly, keyed_name_order=4 |
| h4_destination | 仕向け | text | - | - | - | - | 3300 | readonly, keyed_name_order=5 |
| h4_evaluation_unit | 評価単位 | string | 256 | - | - | - | 5394 | readonly, keyed_name_order=6 |
| h4_delta_version | ⊿バージョン / Copy of Delta Ver. | list | 256 | 必須 | list h4_DeltaVersion | 空 | 130 | readonly, 非表示, width128 |
| h4_dept | 室課 | string | 32 | - | - | - | 1300 | readonly |
| h4_model_code | 機種コード | string | 32 | 必須 | - | `-` | 3600 | readonly |
| h4_approval_round | 次数 | integer | - | - | - | 1 | 3712 | readonly |
| h4_approver | 承認者 | item | - | - | User | - | 3840 | readonly, 非表示, float |
| h4_approval_date | 承認日時 | date | - | - | - | - | 3968 | readonly, 非表示 |
| h4_remarks | 備考 | text | - | - | - | - | 3584 | 非表示 |
| h4_directaplist | ステート | list | 256 | 必須 | list h4_ApprovalWFGroupLCS | InProgress(en) | 5138 | readonly, 非表示 |
システムプロパティ(edit): created_on(必須,readonly,非表示,3800), current_state(ステート, item→Life Cycle State, readonly, 1280), managed_by_id(編集者 / 利用者(同室課), 非表示, 896), modified_by_id(readonly, 5010), modified_on(readonly, 5000), owned_by_id(閲覧者 / 利用者(別室課), 非表示, 768), superseded_date(非表示, 5906)。

### 7.3 イベント（h4_ApprovalWFGroup）
| タイミング | Method | sort |
|---|---|---|
| onBeforeGet | h4_sort_control | 428 |
| onAfterAdd | h4_set_owner_for_ApprovalWFGroup | 128 |
| onAfterAdd | h4_SaveCheckhApprovalWFGroup | 200 |
| onAfterUpdate | h4_SaveCheckhApprovalWFGroup | 32 |
| onAfterUpdate | h4_set_owner_for_ApprovalWFGroup | 256 |
| onAfterUpdate | h4_ReAssignInProgress | 300 |
| onAfterUpdate | h4_SetVoteInProgress | 310 |
| onBeforeUpdate | h4_CheckManagedByIdRequired | 1069 |
| onAfterPromote | h4_ListByPromoteApWFGroup | 940 |
| onAfterPromote | h4_UpdatePointOutPermission | 941 |
クライアント: OnAfterNew → h4_ControlItemCreation（128）。

### 7.4 ItemType h4_ApprovalTarget（承認対象、ポリモーフィック）
| 項目 | 値 |
|---|---|
| ラベル | en: ApprovalTarget / ja: 承認対象 |
| ID | 379A81DD9B26418CA278E7E4F9FB4C4E |
| implementation_type | **polymorphic**（instance_data H4_APPROVALTARGET） |
| is_versionable | 1（manual_versioning 0） |
| revisions / history_template | Default / Default |
| show_parameters_tab | 1, structure_view=tabs off, unlock_on_logout=0 |
| Can Add | Administratorsのみ |
| Morphae（実体ItemType） | h4_MQPage（sort256）, h4_ReqDoc（sort384） |
| ライフサイクル・ワークフロー | XMLに記載なし |
プロパティ: h4_approval_date(承認日時, item→h4_ApprovalTarget, 非表示, float, 3584), h4_approver(承認者, item→h4_ApprovalTarget, 非表示, float, 3712)。edit: classification(string 512, is_hidden2, 256), current_state(item→Life Cycle State, 非表示, readonly, 1408), itemtype(list, データソース List h4_ApprovalTarget, stored_length 64, readonly, 128), keyed_name(string 128, 384), superseded_date(非表示, 3328)。
サーバーイベント（全てポリモーフィック標準Method）: onBeforeDelete→polymorphic_item_onBeforeDelete(128), onBeforeLock→…onBeforeLock(256), onBeforeUnlock→…onBeforeUnlock(384), onBeforeVersion→…onBeforeVersion(512), onBeforeUpdate→…onBeforeUpdate(640), onBeforeAdd→…onBeforeAdd(768), onBeforeCopy→…onBeforeCopy(896)。
Form `h4_ApprovalTarget`: Field `itemtype`(dropdown, ラベル itemtype, x10 y10, propertytype=Property itemtype)。イベントなし。

### 7.5 ItemType h4_ApprovalWFGroupSignOff（WFの親アイテムサインオフ）
| 項目 | 値 |
|---|---|
| ID | 99CDDC94A3594E9C82EE78E1989A68A9 |
| ラベル | ja: WFの親アイテムサインオフ |
| implementation_type / instance_data | table / H4_APPROVALWFGROUPSIGNOFF |
| is_relationship | **1**, is_versionable=0 |
| structure_view | tabs off, show_parameters_tab=1, unlock_on_logout=0 |
プロパティ: h4_signoff_role(string 32, "Signoff Role", 3072), assigned_use(item→User, float, "Assigned Use", 3200), h4_comment(text, 3456), approved_on(date, "Approved On", 3584), source_type(item→ItemType, 非表示, float, 3712)。edit: related_id(item, indexed, float, 3968), source_id(item, indexed, 非表示, readonly, float, 3840)。
Form `h4_ApprovalWFGroupSignOff` / `h4_ApprovalWFGroup PointOut`: Bodyのみ（Field・イベントなし）。

### 7.6 Property単体XML
| 名前 | ラベル | 型 | データソース | 属性 | sort |
|---|---|---|---|---|---|
| h4_approval_group_item | 一括承認リンク | item | ItemType h4_ApprovalWFGroup | readonly, is_hidden2, float | 9162 |
| h4_rel_approvalwfgroup | 対象：一括承認 | item | ItemType h4_ApprovalWFGroup | float, column_width=240 | 6650 |
（source_idは出力されていない＝どのItemType上のプロパティかは別パッケージ側の定義に依存。XML上は特定不能。）

### 7.7 関係ItemType（source = h4_ApprovalWFGroup）
| 名前 | ラベル(ja) | related | behavior | その他 | sort |
|---|---|---|---|---|---|
| h4_ApprovalWFGroup_ApTarget | 承認対象 | h4_ApprovalTarget | float | View/Form delete | 128 |
| h4_ApprovalWFGroup_ApSignOff | サインオフ | h4_ApprovalWFGroupSignOff | float | Relationship View: Form h4_WFSignOffsForMQReqDoc, World。View/Form delete | 256 |
| h4_ApprovalWFGroup CLN | 担当者一覧 | Identity | float | grid_view=right。View/Form delete | 384 |
| h4_ApprovalWFGroup PointOut | 指摘 | h4_PointOut | float | related_option=1, related_notnull=1, new_show_related=1 | 512 |

### 7.8 Form（h4_ApprovalWFGroup）
Responsive 699x234。Field（全てx/y絶対配置）: h4_my(dropdown MY,x10 y10), h4_model_name(text 機種呼称, x10 y50), h4_destination(dropdown 仕向け, x10 y90), h4_event(dropdown イベント, x10 y130), h4_remarks(textarea 備考, 350x50, x10 y170), current_state(item, x153 y10), h4_approval_round(text, 次数, is_disabled=1, x155 y61)。Form Eventなし。FormComposite→cui_WindowSection h4_ApprovalWFGroup。

### 7.9 画面
- cui_WindowSection h4_ApprovalWFGroup → ItemView.Form（id 97301AE0…）。18フィールド（h4_destination, h4_approval_round等）。ユニーク構成: Column Set 30 = h4_dept, h4_approval_round, h4_directaplist(filterList), h4_delta_version(filterList), h4_model_code, h4_my(filterList)。Column Set 32 = h4_destination, h4_model_name(item), Column Set 33（h4_evaluation_unit, h4_unique_event）, h4_event(filterList)。Column Set 31 = managed_by_id, owned_by_id, h4_approver, h4_approval_date。単独: h4_remarks(textarea)。order: Column Set 30, 32, 31, h4_remarks。
- フィールド型: h4_destination は filterList と text の2エントリ、current_state は item、h4_model_name は item。全て readonly=1。

### 7.10 PresentationConfiguration
h4_ApprovalWFGroup CLN_TOC_Configuration → CommandBarSection `h4_ApprovalWFGroup CLN_IVRCB`（World, 128）。CommandBarSection本体は本パッケージに無い。

---

