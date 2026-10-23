<!-- meta
legacy: knowledge/_legacy/機能設計書.md L1598-L1850
source: source/package/TestResult/Import/
-->
# 4. パッケージ TestResult (`TestResult\Import`)

含まれるファイル: cui_Control(1) / cui_WindowSection(1) / Form(4) / ItemType(1) / PresentationConfiguration(1) / RelationshipType(5)

## 4.1 ItemType: h4_Test_Result (ラベル ja: 検証結果・根拠)

### 設定

| 項目 | 値 |
|---|---|
| name | h4_Test_Result |
| label / label_plural | 検証結果・根拠 |
| instance_data | H4_TEST_RESULT |
| is_versionable | 1 (manual_versioning=0) |
| is_relationship / is_dependent | 0 / 0 |
| structure_view | tabs on |
| default_page_size | 100 |
| auto_search / enforce_discovery | 0 / 1 |
| show_parameters_tab | 1 |
| unlock_on_logout | 0 |
| icon | ../images/ProductModel.svg |
| ITPresentationConfiguration | h4_Test_Result_TOC_Configuration (client=js) |

### プロパティ・サーバーイベント・付随設定

**ItemType "h4_Test_Result" のプロパティ** (ItemType action=add)

| 名前 | ラベル(ja) | ラベル(en) | 型 | 長さ | 必須 | データソース | 既定値 | 読取専用 | Hidden1/2 | 備考 |
|---|---|---|---|---|---|---|---|---|---|---|
| h4_approval_date | 承認日時 |  | date |  | 0 |  |  | 1 | 1/0 |  |
| h4_approve_style | ワークフローの有無 |  | boolean |  | 0 |  |  | 1 | 1/1 |  |
| h4_approver | 承認者 |  | item |  | 0 | User |  | 1 | 1/0 | item_behavior=float |
| h4_delta_version | ⊿バージョン |  | list | 256 | 0 | h4_DeltaVersion |  | 0 | 1/1 | 列幅=128 |
| h4_dept | 室課 |  | string | 32 | 0 |  |  | 1 | 0/0 |  |
| h4_destination | 仕向け |  | text |  | 0 |  |  | 1 | 0/1 | keyed_name_order=5 |
| h4_directaplist | ステート |  | list | 256 | 1 | h4_TestResultLCS | InProgress | 1 | 0/0 |  |
| h4_evaluation_unit | 評価単位 |  | string | 256 | 0 |  |  | 1 | 0/0 | keyed_name_order=6 |
| h4_event | イベント |  | filter list | 256 | 0 | h4_Events |  | 1 | 0/1 | keyed_name_order=3; pattern=h4_delta_version |
| h4_model_code | 機種コード |  | string | 32 | 0 |  |  | 1 | 0/1 |  |
| h4_model_name | 機種呼称 |  | item |  | 0 | HRDPMTypModelProject |  | 1 | 0/1 | keyed_name_order=2; item_behavior=float |
| h4_my | MY |  | list | 256 | 0 | h4_ModelYear |  | 1 | 0/1 | keyed_name_order=1 |
| h4_name | 担当者 |  | item |  | 0 | Identity |  | 1 | 1/0 | item_behavior=float |
| h4_test_date | テスト実施日 |  | date |  | 0 |  |  | 0 | 0/0 |  |
| h4_unique_event | 個別イベント |  | string | 256 | 0 |  |  | 1 | 0/0 | keyed_name_order=4 |

**ItemType "h4_Test_Result" のプロパティ** (ItemType action=edit)

| 名前 | ラベル(ja) | ラベル(en) | 型 | 長さ | 必須 | データソース | 既定値 | 読取専用 | Hidden1/2 | 備考 |
|---|---|---|---|---|---|---|---|---|---|---|
| managed_by_id | 編集者 | 利用者(同室課) | item |  | 1 | Identity |  | 0 | 1/1 | item_behavior=float; (標準プロパティのedit) |
| minor_rev |  |  | string | 8 | 0 |  |  | 0 | 0/1 | (標準プロパティのedit) |
| modified_by_id |  |  | item |  | 0 | User |  | 1 | 0/1 | item_behavior=float; 列幅=160; (標準プロパティのedit) |
| modified_on |  |  | date |  | 0 |  |  | 1 | 0/1 | pattern=short_date_time; 列幅=150; (標準プロパティのedit) |
| owned_by_id | 閲覧者 | 利用者(別室課) | item |  | 0 | Identity |  | 0 | 1/1 | item_behavior=float; (標準プロパティのedit) |
| superseded_date |  | Superseded Date | date |  | 0 |  |  | 0 | 1/1 | pattern=short_date_time; (標準プロパティのedit) |



**ItemType "h4_Test_Result" のイベント・付随設定**

サーバーイベント(発火タイミング順。同一イベント内はsort_order順)

| イベント(発火タイミング) | Method | sort_order | is_required |
|---|---|---|---|
| onBeforeAdd | h4_SaveTestResult | 428 | 0 |
| onBeforeAdd | h4_CheckLockRelationDoc | 1068 | 0 |
| onAfterAdd | h4_InitSetPermissionAndNo | 1196 | 0 |
| onBeforeUpdate | h4_SaveTestResult | 556 | 0 |
| onBeforeUpdate | h4_CheckLockRelationDoc | 1324 | 0 |
| onBeforeUpdate | h4_ReSetPermisson_Before | 1452 | 0 |
| onAfterUpdate | h4_Promote_By_List_MQPage ReqDoc | 200 | 0 |
| onAfterUpdate | h4_ReAssignInProgress | 300 | 0 |
| onAfterUpdate | h4_SetVoteInProgress | 310 | 0 |
| onAfterUpdate | h4_ReSetPermisson_After | 1708 | 0 |
| onAfterUpdate | h4_InitSetPermissionAndNo | 1836 | 0 |
| onBeforeDelete | h4_CheckLockRelationDoc | 1960 | 0 |
| onBeforeDelete | h4_ReSetPermisson_Before | 1964 | 0 |
| onAfterDelete | h4_ReSetPermisson_After | 2092 | 0 |
| onBeforeGet | h4_sort_control | 684 | 0 |
| onBeforePromote | h4_CheckLockRelationDoc | 2348 | 0 |
| onAfterPromote | h4_List_By_Promote_MQPage ReqDoc | 100 | 0 |
| onAfterPromote | h4_UpdatePointOutPermission | 101 | 0 |
| onAfterPromote | h4_UpdatePermissionForPromote | 2220 | 0 |

クライアントイベント

| イベント | Method |
|---|---|
| OnAfterNew | h4_CreateTestResult |
| OnAfterNew | h4_setDefaultChargeList |

その他の付随設定

- ITPresentationConfiguration : client=js, related_id=h4_Test_Result_TOC_Configuration
- View : client=js, related_id=h4_Test_Result, role=World, show_ssvc=0, type=default
- ItemType Life Cycle : related_id=h4_Test_ResultLC
- Allowed Workflow : is_default=1, related_id=h4_Test_ResultWF
- Can Add : can_add=1, related_id=World
- Allowed Permission : is_default=1, related_id=h4_Everyone_Full_Control



- ライフサイクル: h4_Test_ResultLC。許可ワークフロー: h4_Test_ResultWF(既定)。
- 注: `h4_parent`(親必要資料 → h4_ReqDoc)は `Last\Import\Property\h4_parent.xml` で別途定義。h4_Test_Result の二つ目のItemType(edit)には、managed_by_id / minor_rev(string 8) / modified_by_id / modified_on / owned_by_id / superseded_date が含まれる(上表の「標準プロパティのedit」行)。

## 4.2 RelationshipType

**RelationshipType "h4_Test_Result CLN"** (ラベル ja=担当者一覧)

- source(親)=h4_Test_Result / related(子)=Identity
- behavior=float / related_option=2 / related_notnull=0 / new_show_related=0 / create_related=0 / copy_permissions=0 / auto_search=1 / hide_in_all=0 / is_list_type=0 / inc_rel_key_name=1 / inc_related_key_name=1 / grid_view=right
- リレーションシップ用ItemType: name=h4_Test_Result CLN / instance_data=H4_TEST_RESULT_CLN / label_ja=
- Relationship Grid Event : grid_event=oninsertrow, related_id=h4_IncrementSequenceNumber
- (同ファイル内) View action=delete where=source_id='B98E4ACDE5FB4FC2AF9C39ED9414B9C4' (既定のView/Formを削除する指示)
- (同ファイル内) Form action=delete where=name='h4_Test_Result CLN' (既定のView/Formを削除する指示)



**ItemType "h4_Test_Result CLN" のプロパティ** (ItemType action=add)

| 名前 | ラベル(ja) | ラベル(en) | 型 | 長さ | 必須 | データソース | 既定値 | 読取専用 | Hidden1/2 | 備考 |
|---|---|---|---|---|---|---|---|---|---|---|
| h4_check_required | 必須 |  | boolean |  | 0 |  |  | 0 | 1/0 |  |
| h4_workflow_role | 役割 |  | list | 256 | 1 | h4_Workflow_Role |  | 0 | 1/0 |  |



**ItemType "h4_Test_Result CLN" のイベント・付随設定**

その他の付随設定

- ITPresentationConfiguration : client=js, related_id=h4_Test_Result CLN_TOC_Configuration
- Item Action : related_id=h4_SubstituteApprover



**RelationshipType "h4_Test_Result Doc"** (ラベル ja=関連資料)

- source(親)=h4_Test_Result / related(子)=Document
- behavior=float / related_option=2 / related_notnull=0 / new_show_related=0 / create_related=0 / copy_permissions=0 / auto_search=1 / hide_in_all=0 / is_list_type=0 / inc_rel_key_name=1 / inc_related_key_name=1 / grid_view=
- リレーションシップ用ItemType: name=h4_Test_Result Doc / instance_data=H4_TEST_RESULT_DOC / label_ja=
- (同ファイル内) View action=delete where=source_id='EBDCBC7BA2104B57ACEAE823F454C526' (既定のView/Formを削除する指示)
- (同ファイル内) Form action=delete where=name='h4_Test_Result Doc' (既定のView/Formを削除する指示)



**ItemType "h4_Test_Result Doc" のプロパティ** (ItemType action=add)

| 名前 | ラベル(ja) | ラベル(en) | 型 | 長さ | 必須 | データソース | 既定値 | 読取専用 | Hidden1/2 | 備考 |
|---|---|---|---|---|---|---|---|---|---|---|
| h4_parent_order_no |  |  | integer |  | 0 |  |  | 0 | 1/1 |  |



**ItemType "h4_Test_Result Doc" のイベント・付随設定**

その他の付随設定

- ITPresentationConfiguration : client=js, related_id=h4_Test_Result Doc_TOC_Configuration



**RelationshipType "h4_Test_Result SignOff"** (ラベル ja=サインオフ)

- source(親)=h4_Test_Result / related(子)=(なし: related_idなし=関係先アイテムを持たない)
- behavior=float / related_option=2 / related_notnull=0 / new_show_related=0 / create_related=0 / copy_permissions=0 / auto_search=1 / hide_in_all=0 / is_list_type=0 / inc_rel_key_name=1 / inc_related_key_name=1 / grid_view=
- リレーションシップ用ItemType: name=h4_Test_Result SignOff / instance_data=H4_TEST_RESULT_SIGNOFF / label_ja=
- Relationship View : form=h4_WFSignOffsForMQReqDoc, related_id=World



**ItemType "h4_Test_Result SignOff" のイベント・付随設定**

その他の付随設定

- View : client=js, related_id=h4_Test_Result SignOff, role=World, show_ssvc=0, type=default



**RelationshipType "h4_Test_Result_PointOut"** (ラベル ja=指摘)

- source(親)=h4_Test_Result / related(子)=h4_PointOut
- behavior=float / related_option=2 / related_notnull=0 / new_show_related=0 / create_related=0 / copy_permissions=0 / auto_search=1 / hide_in_all=0 / is_list_type=0 / inc_rel_key_name=1 / inc_related_key_name=1 / grid_view=
- リレーションシップ用ItemType: name=h4_Test_Result_PointOut / instance_data=H4_TEST_RESULT_POINTOUT / label_ja=
- (同ファイル内) View action=delete where=source_id='B8A71C16403E48BD835100172BE92349' (既定のView/Formを削除する指示)
- (同ファイル内) Form action=delete where=name='h4_Test_Result_PointOut' (既定のView/Formを削除する指示)



**ItemType "h4_Test_Result_PointOut" のイベント・付随設定**

その他の付随設定

- ITPresentationConfiguration : client=js, related_id=h4_Test_Result_PointOut_CS



**RelationshipType "h4_TGVTestResultReqDoc"** (ラベル ja=親必要資料一覧)

- source(親)=h4_Test_Result / related(子)=(なし: related_idなし=関係先アイテムを持たない)
- behavior=float / related_option=2 / related_notnull=0 / new_show_related=0 / create_related=0 / copy_permissions=0 / auto_search=1 / hide_in_all=0 / is_list_type=0 / inc_rel_key_name=1 / inc_related_key_name=1 / grid_view=
- リレーションシップ用ItemType: name=h4_TGVTestResultReqDoc / instance_data=H4_TGVTESTRESULTREQDOC / label_ja=
- Relationship View : parameters='tgvdId=ED6C8318436249F7866A2F270092C408&startConditionProvider=ItemDefault({"id":"id"})', related_id=World, start_page=../Modules/aras.innovator.TreeGridView/Views/MainPage.html



**ItemType "h4_TGVTestResultReqDoc" のイベント・付随設定**

その他の付随設定

- View : client=js, related_id=h4_TGVTestResultReqDoc, role=World, show_ssvc=0, type=default



PresentationConfiguration `h4_Test_Result_PointOut_CS`: PresentationCommandBarSection → h4_Test_Result_PointOut_IVCB (role=World)。(`h4_Test_Result_PointOut` の ITPresentationConfiguration から参照。コマンドバーの中身はImportに無い。)

## 4.3 Form

### 4.3.1 h4_Test_Result (classification=Responsive, 699x234)
Bodyにフィールドなし。onload → `h4_ControlTabbar`(1.3.1/3.3.1と同一ロジック。h4_Test_Result の場合は、WF不使用なら `h4_Test_Result SignOff` / `h4_Test_Result CLN` タブを非表示。WF使用時は何もしない(テスト結果は一括承認の対象外のため))。FormComposite: h4_Test_Result。

### 4.3.2 h4_WFSignOffsForMQReqDoc (800x250)
RelationshipType `h4_Test_Result SignOff` / `h4_ReqDoc SingOff1N` / `h4_MQSingOff1`(Last)の Relationship View で使われる承認履歴フォーム。

| フィールド | 型 | ラベル | x,y | イベント |
|---|---|---|---|---|
| button0 | button | 承認引き戻し | 750,0 (z_index=1) | onclick → h4_callPullBack |
| calculate_html | html(script) | - | 0,0 (absolute) | (スクリプト内でloadハンドラ設定) |
| result_iframe | html(`<iframe id="result_iframe_frame">`) | - | 0,30 (absolute) | なし |

- h4_callPullBack(コメント「ワークフローの引き戻しメソッドを呼ぶ」): 親フォームのアイテム(id, typeId, type)を取得し、type が `h4_DATMaster` / `h4_DATFormat` / `h4_AppWFGroupForDATFormat` 以外なら Method `h4_PullBack`、それらなら `h4_PullBack_DAT` をサーバー呼出(引数 id, type, typeName)。typeId で対象ItemTypeを判別(EC17A836…=h4_MQPage, DD0E19C0…=h4_ApprovalWFGroup, 984B394A…=h4_Test_Result, その他=h4_ReqDoc)。結果がエラー/件数-1の場合は UserMessage を取得して表示(全108行。先頭約45行確認)。
- calculate_html のスクリプト(全66行): onload でWFプロセス履歴を表示。`Workflow` アイテムを source_id=自アイテムID(related_id not null, sort_order desc)で取得し、Report「Workflow Process History」を `aras.runClientReport` で実行して iframe に書き込む。新規(action=add)の場合はリソース `imports_core.no_workflow_signoffs_exist` を表示。resize時にiframeサイズ調整。

### 4.3.3 その他のForm(Bodyのみ、699x234)
h4_Test_Result SignOff / h4_TGVTestResultReqDoc

## 4.4 画面定義

cui_WindowSection `h4_Test_Result` (location=ItemView) → ItemView.Form。

cui_Control ItemView.Form (FormControl, parent=ItemView.FormTab) のレイアウト:

```
行1: {h4_dept | h4_my | h4_destination | h4_event | h4_model_code | h4_model_name}
行2: {{h4_evaluation_unit | h4_unique_event}}
行3: {h4_directaplist | h4_test_date | h4_name | h4_approve_style | h4_parent}
行4: {managed_by_id | owned_by_id | h4_approver | h4_approval_date}
```

cui_ControlFormField(role=World)の対象プロパティ(17件): h4_test_date, h4_model_code, h4_dept, h4_model_name, h4_approver, h4_approval_date, h4_approve_style, h4_name, h4_parent, h4_my, h4_event, h4_directaplist, owned_by_id, managed_by_id, h4_evaluation_unit, h4_unique_event, h4_destination。ボタン/Method対応の定義はなし。

---

