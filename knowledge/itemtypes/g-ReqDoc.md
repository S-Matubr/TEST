<!-- meta
legacy: knowledge/_legacy/機能設計書.md L1195-L1597
source: source/package/ReqDoc/Import/
-->
# G. マルQ・指摘・必要資料・検証結果・WF 系パッケージ 読込メモ (その2: ReqDoc / TestResult / Last)

ベース: `C:\Claude\TEST\HND-マルQ Step3パッケージ\Step3パッケージ`
読み方の注意は `G_mq_wf_packages_a.md` 冒頭の「共通の読み方・注意」に同じ(Method本体はImportに無く名前のみ。Form/Fieldのインラインjsだけ内容を要約。「Hidden1/2」は is_hidden/is_hidden2 の値)。

---

# 3. パッケージ ReqDoc (`ReqDoc\Import`)

含まれるファイル: cui_Control(8) / cui_WindowSection(2) / Form(6) / ItemType(1) / PresentationConfiguration(2) / RelationshipType(8)

## 3.1 ItemType: h4_ReqDoc (ラベル ja: 必要資料)

### 設定

| 項目 | 値 |
|---|---|
| name | h4_ReqDoc |
| label / label_plural | 必要資料 / 必要資料 |
| instance_data | H4_REQDOC |
| is_versionable | 1 (manual_versioning=0) |
| is_relationship / is_dependent | 0 / 0 |
| structure_view | tabs on |
| default_page_size | 100 |
| auto_search / enforce_discovery | 0 / 1 |
| show_parameters_tab | 1 |
| unlock_on_logout | 0 |
| icon | ../images/Copy.svg |
| ITPresentationConfiguration | h4_ReqDoc_TOC_Configuration (client=js) |

### プロパティ・サーバーイベント・付随設定

**ItemType "h4_ReqDoc" のプロパティ** (ItemType action=add)

| 名前 | ラベル(ja) | ラベル(en) | 型 | 長さ | 必須 | データソース | 既定値 | 読取専用 | Hidden1/2 | 備考 |
|---|---|---|---|---|---|---|---|---|---|---|
| h4_approval_date | 承認日時 |  | date |  | 0 |  |  | 1 | 1/0 |  |
| h4_approval_round | 次数 |  | integer |  | 0 |  | 1 | 1 | 0/0 |  |
| h4_approve_style | ワークフローの有無 |  | boolean |  | 0 |  |  | 1 | 1/1 |  |
| h4_approver | 承認者 |  | item |  | 0 | User |  | 1 | 1/0 | item_behavior=float |
| h4_category | 資料分類 | Document Classification | list | 256 | 0 | h4_category |  | 1 | 0/0 | 列幅=96 |
| h4_class | 区分 |  | list | 256 | 1 | h4_class | - | 0 | 0/1 | 列幅=50 |
| h4_custom01 | カスタム01 |  | string | 32 | 0 |  |  | 0 | 1/1 |  |
| h4_custom02 | カスタム02 |  | string | 32 | 0 |  |  | 0 | 1/1 |  |
| h4_custom03 | カスタム03 |  | string | 32 | 0 |  |  | 0 | 1/1 |  |
| h4_datformat_name | 資料名称（室課） |  | string | 32 | 0 |  |  | 0 | 1/0 | 列幅=200 |
| h4_deadline | 提出期限 |  | date |  | 0 |  |  | 0 | 0/0 |  |
| h4_delta_version | ⊿バージョン |  | list | 256 | 0 | h4_DeltaVersion |  | 1 | 1/1 | 列幅=128 |
| h4_dept | 室課 |  | string | 32 | 0 |  |  | 1 | 0/1 |  |
| h4_destination | 仕向け |  | text |  | 0 |  |  | 1 | 0/1 | keyed_name_order=6 |
| h4_developmentbase | 開発拠点 |  | text |  | 0 |  |  | 1 | 1/1 |  |
| h4_directaplist | ステート |  | list | 256 | 0 | h4_MQLDOCNULLLCS | InProgress | 1 | 1/0 |  |
| h4_doc_attached | 資料添付済 |  | boolean |  | 0 |  |  | 1 | 0/0 | 列幅=80 |
| h4_equipment | 装備 |  | string | 256 | 0 |  |  | 0 | 1/1 |  |
| h4_evaluation_unit | 評価単位 |  | string | 256 | 0 |  |  | 0 | 0/0 | keyed_name_order=7 |
| h4_event | イベント |  | filter list | 256 | 0 | h4_Events |  | 1 | 0/1 | keyed_name_order=4; pattern=h4_delta_version |
| h4_gr | Gr |  | string | 32 | 0 |  |  | 1 | 1/1 |  |
| h4_group | グループ |  | string | 32 | 0 |  |  | 1 | 0/0 |  |
| h4_model_code | 機種コード |  | string | 32 | 0 |  |  | 1 | 0/1 |  |
| h4_model_name | 機種呼称 |  | item |  | 0 | HRDPMTypModelProject |  | 1 | 0/1 | keyed_name_order=3; item_behavior=float |
| h4_my | MY |  | list | 256 | 0 | h4_ModelYear |  | 1 | 0/1 | keyed_name_order=2 |
| h4_pare_mq | 親マルQページ |  | item |  | 0 | h4_MQPage |  | 1 | 1/1 | item_behavior=float |
| h4_sec | sec |  | string | 32 | 0 |  |  | 1 | 1/1 |  |
| h4_section | セクション |  | string | 32 | 0 |  |  | 1 | 0/0 |  |
| h4_test_schedule | 検証会日程 |  | date |  | 0 |  |  | 0 | 0/0 |  |
| h4_unique_event | 個別イベント名 |  | string | 256 | 0 |  |  | 0 | 1/1 | keyed_name_order=5 |
| h4_variations | バリエーション |  | string | 256 | 0 |  |  | 0 | 1/1 |  |
| h4_yryr | やるやら |  | list | 256 | 1 | h4_yryr | 1 | 1 | 0/0 | 列幅=60 |
| h4_yryr_classification | 項目分類 |  | string | 100 | 0 |  |  | 0 | 1/1 |  |
| h4_yryr_reason | やるやら理由 |  | text |  | 0 |  |  | 0 | 0/0 |  |
| name | 資料名称（マスタ） |  | string | 32 | 0 |  |  | 1 | 0/0 | keyed_name_order=1; 列幅=200 |

**ItemType "h4_ReqDoc" のプロパティ** (ItemType action=edit)

| 名前 | ラベル(ja) | ラベル(en) | 型 | 長さ | 必須 | データソース | 既定値 | 読取専用 | Hidden1/2 | 備考 |
|---|---|---|---|---|---|---|---|---|---|---|
| created_on |  |  | date |  | 1 |  |  | 1 | 1/1 | pattern=short_date_time; 列幅=150; (標準プロパティのedit) |
| managed_by_id | 編集者 | 利用者(同室課) | item |  | 1 | Identity |  | 0 | 1/1 | item_behavior=float; (標準プロパティのedit) |
| modified_by_id |  |  | item |  | 0 | User |  | 1 | 0/1 | item_behavior=float; 列幅=160; (標準プロパティのedit) |
| modified_on |  |  | date |  | 0 |  |  | 1 | 0/1 | pattern=short_date_time; 列幅=150; (標準プロパティのedit) |
| owned_by_id | 閲覧者 | 利用者(別室課) | item |  | 0 | Identity |  | 0 | 1/1 | item_behavior=float; (標準プロパティのedit) |
| superseded_date |  | Superseded Date | date |  | 0 |  |  | 0 | 1/1 | pattern=short_date_time; (標準プロパティのedit) |



**ItemType "h4_ReqDoc" のイベント・付随設定**

サーバーイベント(発火タイミング順。同一イベント内はsort_order順)

| イベント(発火タイミング) | Method | sort_order | is_required |
|---|---|---|---|
| onBeforeAdd | h4_CheckLockRelationDoc | 1536 | 0 |
| onAfterAdd | h4_AddRelPointOutReqDoc | 384 | 0 |
| onAfterAdd | h4_InitSetPermissionAndNo | 1792 | 0 |
| onBeforeUpdate | h4_CheckLockRelationDoc | 1664 | 0 |
| onBeforeUpdate | h4_ReSetPermisson_Before | 2560 | 0 |
| onAfterUpdate | h4_Promote_By_List_MQPage ReqDoc | 128 | 0 |
| onAfterUpdate | h4_AddRelPointOutReqDoc | 256 | 0 |
| onAfterUpdate | h4_ReAssignInProgress | 300 | 0 |
| onAfterUpdate | h4_SetVoteInProgress | 310 | 0 |
| onAfterUpdate | h4_InitSetPermissionAndNo | 1920 | 0 |
| onAfterUpdate | h4_ReSetPermisson_After | 2304 | 0 |
| onBeforeDelete | h4_ReSetPermisson_Before | 2688 | 0 |
| onBeforeDelete | h4_CheckLockRelationDoc | 2816 | 0 |
| onAfterDelete | h4_ReSetPermisson_After | 2432 | 0 |
| onBeforeGet | h4_sort_control | 768 | 0 |
| onBeforeLock | h4_checkDeadline | 2944 | 0 |
| onBeforePromote | h4_CheckLockRelationDoc | 2048 | 0 |
| onAfterPromote | h4_List_By_Promote_MQPage ReqDoc | 100 | 0 |
| onAfterPromote | h4_UpdatePointOutPermission | 101 | 0 |
| onAfterPromote | h4_UpdatePermissionForPromote | 2176 | 0 |

クライアントイベント

| イベント | Method |
|---|---|
| OnAfterNew | h4_ControlItemCreation |
| OnAfterNew | h4_setPropToReqDoc |
| OnAfterNew | h4_setDefaultChargeList |

その他の付随設定

- ITPresentationConfiguration : client=js, related_id=h4_ReqDoc_TOC_Configuration
- View : client=js, related_id=h4_ReqDoc, role=World, show_ssvc=0, type=default
- ItemType Life Cycle : related_id=h4_MQPage ReqDocsNLC
- Allowed Workflow : is_default=1, related_id=h4_ApprovalWFMQAndReqDoc
- Can Add : can_add=1, related_id=World
- Allowed Permission : is_default=1, related_id=h4_Everyone_Full_Control



- ライフサイクル: h4_MQPage ReqDocsNLC。許可ワークフロー: h4_ApprovalWFMQAndReqDoc(既定)。WF詳細は `_c.md`。
- クライアントイベントは OnAfterNew に3件(上表の順: h4_ControlItemCreation, h4_setPropToReqDoc, h4_setDefaultChargeList)。
- フィールドイベントではなく、Form `h4_ReqDoc` の onload に `h4_ControlTabbar`(後述)。

### 関係ItemType (h4_ReqDoc を source とする RelationshipType: 8件) → 3.2

## 3.2 RelationshipType

**RelationshipType "h4_ReqDoc CLN"** (ラベル ja=担当者一覧)

- source(親)=h4_ReqDoc / related(子)=Identity
- behavior=float / related_option=2 / related_notnull=0 / new_show_related=0 / create_related=0 / copy_permissions=0 / auto_search=1 / hide_in_all=0 / is_list_type=0 / inc_rel_key_name=1 / inc_related_key_name=1 / grid_view=right
- リレーションシップ用ItemType: name=h4_ReqDoc CLN / instance_data=H4_REQDOC_CLN / label_ja=
- (同ファイル内) View action=delete where=source_id='BF7FB54D008543AB9B0F8845721EBA45' (既定のView/Formを削除する指示)
- (同ファイル内) Form action=delete where=name='h4_ReqDoc CLN' (既定のView/Formを削除する指示)



**ItemType "h4_ReqDoc CLN" のプロパティ** (ItemType action=add)

| 名前 | ラベル(ja) | ラベル(en) | 型 | 長さ | 必須 | データソース | 既定値 | 読取専用 | Hidden1/2 | 備考 |
|---|---|---|---|---|---|---|---|---|---|---|
| h4_check_required | 必須 |  | boolean |  | 0 |  |  | 0 | 1/0 |  |
| h4_workflow_role | 役割 |  | list | 256 | 1 | h4_Workflow_Role |  | 0 | 1/0 |  |



**ItemType "h4_ReqDoc CLN" のイベント・付随設定**

その他の付随設定

- ITPresentationConfiguration : client=js, related_id=h4_ReqDoc CLN_TOC_Configuration
- Item Action : related_id=h4_SubstituteApprover



**RelationshipType "h4_ReqDoc Doc"** (ラベル ja=成果物)

- source(親)=h4_ReqDoc / related(子)=Document
- behavior=float / related_option=2 / related_notnull=0 / new_show_related=0 / create_related=0 / copy_permissions=0 / auto_search=1 / hide_in_all=0 / is_list_type=0 / inc_rel_key_name=1 / inc_related_key_name=1 / grid_view=
- リレーションシップ用ItemType: name=h4_ReqDoc Doc / instance_data=H4_REQDOC_DOC / label_ja=
- Relationship Grid Event : grid_event=oninsertrow, related_id=h4_ReqDocsNDocGridEventAdd
- Relationship Grid Event : grid_event=ondeleterow, related_id=h4_ReqDocsNDocGridEventDel
- (同ファイル内) View action=delete where=source_id='5B76E13022254FCCB77157859B7BD694' (既定のView/Formを削除する指示)
- (同ファイル内) Form action=delete where=name='h4_ReqDoc Doc' (既定のView/Formを削除する指示)



**ItemType "h4_ReqDoc Doc" のプロパティ** (ItemType action=add)

| 名前 | ラベル(ja) | ラベル(en) | 型 | 長さ | 必須 | データソース | 既定値 | 読取専用 | Hidden1/2 | 備考 |
|---|---|---|---|---|---|---|---|---|---|---|
| h4_parent_order_no |  |  | integer |  | 0 |  |  | 0 | 1/1 |  |



**ItemType "h4_ReqDoc Doc" のイベント・付随設定**

その他の付随設定

- ITPresentationConfiguration : client=js, related_id=h4_ReqDoc Doc_TOC_Configuration



**RelationshipType "h4_ReqDoc DocsInfoGridN"** (ラベル ja=文書情報（グリッド）)

- source(親)=h4_ReqDoc / related(子)=(なし: related_idなし=関係先アイテムを持たない)
- behavior=float / related_option=2 / related_notnull=0 / new_show_related=0 / create_related=0 / copy_permissions=0 / auto_search=1 / hide_in_all=0 / is_list_type=0 / inc_rel_key_name=1 / inc_related_key_name=1 / grid_view=
- リレーションシップ用ItemType: name=h4_ReqDoc DocsInfoGridN / instance_data=H4_REQDOC_DOCSINFOGRIDN / label_ja=文書情報



**ItemType "h4_ReqDoc DocsInfoGridN" のプロパティ** (ItemType action=add)

| 名前 | ラベル(ja) | ラベル(en) | 型 | 長さ | 必須 | データソース | 既定値 | 読取専用 | Hidden1/2 | 備考 |
|---|---|---|---|---|---|---|---|---|---|---|
| h4_prop_data_type | データタイプ |  | list | 64 | 0 | Data Types |  | 0 | 0/0 |  |
| h4_prop_name | プロパティ名前 |  | string | 32 | 0 |  |  | 0 | 0/0 |  |
| h4_prop_value | プロパティ値 |  | string | 32 | 0 |  |  | 0 | 0/0 |  |



**ItemType "h4_ReqDoc DocsInfoGridN" のイベント・付随設定**

その他の付随設定

- View : client=js, related_id=h4_ReqDoc DocsInfoGridN, role=World, show_ssvc=0, type=default



**RelationshipType "h4_ReqDoc FormatN"** (ラベル ja=フォーマット)

- source(親)=h4_ReqDoc / related(子)=(なし: related_idなし=関係先アイテムを持たない)
- behavior=float / related_option=2 / related_notnull=0 / new_show_related=0 / create_related=0 / copy_permissions=0 / auto_search=1 / hide_in_all=0 / is_list_type=0 / inc_rel_key_name=1 / inc_related_key_name=1 / grid_view=
- リレーションシップ用ItemType: name=h4_ReqDoc FormatN / instance_data=H4_REQDOC_FORMATN / label_ja=フォーマット



**ItemType "h4_ReqDoc FormatN" のプロパティ** (ItemType action=add)

| 名前 | ラベル(ja) | ラベル(en) | 型 | 長さ | 必須 | データソース | 既定値 | 読取専用 | Hidden1/2 | 備考 |
|---|---|---|---|---|---|---|---|---|---|---|
| h4_format_file | フォーマットファイル |  | item |  | 0 | File |  | 0 | 0/0 | keyed_name_order=1; item_behavior=float; 列幅=480 |
| h4_revision_date | 改訂日（公開承認になった日） | Revision Date (Date Public Approval Granted) | date |  | 0 |  |  | 1 | 0/0 |  |
| h4_revision_summary | 確認事項（改訂内容） | Confirmation Items (Revised Content) | text |  | 0 |  |  | 1 | 0/0 |  |



**ItemType "h4_ReqDoc FormatN" のイベント・付随設定**

サーバーイベント(発火タイミング順。同一イベント内はsort_order順)

| イベント(発火タイミング) | Method | sort_order | is_required |
|---|---|---|---|
| onBeforeAdd | h4_setRevisionData | 128 | 0 |

その他の付随設定

- View : client=js, related_id=h4_ReqDocs FormatN, role=World, show_ssvc=0, type=default
- View : client=js, related_id=h4_ReqDoc FormatN, role=World, show_ssvc=0, type=default



**RelationshipType "h4_ReqDoc PointOut"** (ラベル ja=指摘)

- source(親)=h4_ReqDoc / related(子)=h4_PointOut
- behavior=float / related_option=1 / related_notnull=1 / new_show_related=1 / create_related=0 / copy_permissions=0 / auto_search=1 / hide_in_all=0 / is_list_type=0 / inc_rel_key_name=1 / inc_related_key_name=1 / grid_view=
- リレーションシップ用ItemType: name=h4_ReqDoc PointOut / instance_data=H4_REQDOC_POINTOUT / label_ja=
- (同ファイル内) View action=delete where=source_id='D15C79C60FD34F9BA52F00862C910AE5' (既定のView/Formを削除する指示)
- (同ファイル内) Form action=delete where=name='h4_ReqDoc PointOut' (既定のView/Formを削除する指示)



**ItemType "h4_ReqDoc PointOut" のイベント・付随設定**

その他の付随設定

- ITPresentationConfiguration : client=js, related_id=h4_ReqDoc PointOutt_TOC_Configuration



**RelationshipType "h4_ReqDoc SingOff1N"** (ラベル ja=サインオフ)

- source(親)=h4_ReqDoc / related(子)=(なし: related_idなし=関係先アイテムを持たない)
- behavior=float / related_option=2 / related_notnull=0 / new_show_related=0 / create_related=0 / copy_permissions=0 / auto_search=1 / hide_in_all=0 / is_list_type=0 / inc_rel_key_name=1 / inc_related_key_name=1 / grid_view=
- リレーションシップ用ItemType: name=h4_ReqDoc SingOff1N / instance_data=H4_REQDOC_SINGOFF1N / label_ja=
- Relationship View : form=h4_WFSignOffsForMQReqDoc, related_id=World



**ItemType "h4_ReqDoc SingOff1N" のイベント・付随設定**

その他の付随設定

- View : client=js, related_id=h4_ReqDoc SingOff1N, role=World, show_ssvc=0, type=default



**RelationshipType "h4_ReqDoc TestResult"** (ラベル ja=検証結果・根拠)

- source(親)=h4_ReqDoc / related(子)=h4_Test_Result
- behavior=float / related_option=2 / related_notnull=0 / new_show_related=1 / create_related=0 / copy_permissions=0 / auto_search=1 / hide_in_all=0 / is_list_type=0 / inc_rel_key_name=1 / inc_related_key_name=1 / grid_view=
- リレーションシップ用ItemType: name=h4_ReqDoc TestResult / instance_data=H4_REQDOC_TESTRESULT / label_ja=
- (同ファイル内) View action=delete where=source_id='67BBB057F126418E9D3809EFB3E9E566' (既定のView/Formを削除する指示)
- (同ファイル内) Form action=delete where=name='h4_ReqDoc TestResult' (既定のView/Formを削除する指示)



**ItemType "h4_ReqDoc TestResult" のイベント・付随設定**

その他の付随設定

- ITPresentationConfiguration : client=js, related_id=h4_ReqDoc TestResult_TOC_Configuration
- Allowed Permission : is_default=1, related_id=h4_Everyone_Full_Control



**RelationshipType "h4_ReqDoc TGVRevQuery"** (ラベル ja=サインオフ)

- source(親)=h4_ReqDoc / related(子)=(なし: related_idなし=関係先アイテムを持たない)
- behavior=float / related_option=2 / related_notnull=0 / new_show_related=0 / create_related=0 / copy_permissions=0 / auto_search=1 / hide_in_all=0 / is_list_type=0 / inc_rel_key_name=1 / inc_related_key_name=1 / grid_view=
- リレーションシップ用ItemType: name=h4_ReqDoc TGVRevQuery / instance_data=H4_REQDOC_TGVREVQUERY / label_ja=
- Relationship View : parameters='tgvdId=0BDB1D64F13C4E93A8016AA47EF388C8&startConditionProvider=ItemDefault({"id":"id"})', related_id=World, start_page=../Modules/aras.innovator.TreeGridView/Views/MainPage.html



**ItemType "h4_ReqDoc TGVRevQuery" のイベント・付随設定**

その他の付随設定

- View : client=js, related_id=h4_ReqDoc TGVRevQuery, role=World, show_ssvc=0, type=default



補足(RelationshipType間の対応): `h4_ReqDoc SingOff1N` は Relationship View に Form `h4_WFSignOffsForMQReqDoc`(承認履歴+承認引き戻しボタン、4.3参照)を使用。`h4_ReqDoc TGVRevQuery` は Relationship View で TreeGridView(`tgvdId=0BDB1D64F13C4E93A8016AA47EF388C8`、start_page=`../Modules/aras.innovator.TreeGridView/Views/MainPage.html`、`startConditionProvider=ItemDefault({"id":"id"})`)を表示する。tgvdIdのGUIDが指すTGV定義名はこのImportからは特定できない(WFMapの `h4_ReqDoc TGVRevQuery` が同名のTGVとして存在するが、GUIDとの対応は確認できていない)。

## 3.3 Form

### 3.3.1 h4_ReqDoc (classification=Responsive, 699x234)
Bodyにフィールドなし。フォームイベントのみ。

| イベント | Method | 内容 |
|---|---|---|
| onload | h4_ControlTabbar | MQPage の `h4_MQPage` フォームの onload と同一ロジック(1.3.1 参照)。サインオフ関連タブ(`h4_ReqDoc SingOff1N` / `h4_ReqDoc TGVRevQuery` / `h4_ReqDoc CLN`)の表示制御(WF使用有無 `h4_approve_style`、`h4_ApprovalWFGroup_ApTarget` の有無で単数/複数用を出し分け)。必要資料は3段アコーディオンのため DOM の `aras-tabs__tab` を `display:none`。 |

FormComposite: h4_ReqDoc。

### 3.3.2 h4_MultiDirectApproveStateSelect (一括ダイレクト承認遷移先選択フォーム, 699x234)

| フィールド | 型 | ラベル | x,y | イベント |
|---|---|---|---|---|
| h4_frm_state | html(select id=State) | ステート | 13,4 | なし |
| h4_frm_OK | button | OK | 182,45 | onclick → h4_frm_get_value_multi_direct_ap |

- h4_frm_get_value_multi_direct_ap(コメント「必要資料複数ダイレクト承認の遷移先選択フォーム終了」): select(name=State)の値を取得し、`parent.dialogArguments.dialog.close(strState)` で呼出元へ返す。
- フォームイベント onload → h4_frm_init_setState(「遷移先選択フォーム初期化」): `dialogArguments.state` / `.label` の配列から select に option を追加。

### 3.3.3 その他のForm(Bodyのみ、フィールド・イベントなし、699x234)
h4_ReqDoc DocsInfoGridN / h4_ReqDoc SingOff1N / h4_ReqDoc TGVRevQuery / h4_ReqDocs FormatN

(これらは RelationshipType の View として参照されている(3.2): DocsInfoGridN→`h4_ReqDoc DocsInfoGridN`、FormatN→`h4_ReqDocs FormatN` と `h4_ReqDoc FormatN`、SingOff1N/TGVRevQuery は同名Formを View で参照)。

## 3.4 画面定義(cui_Control / cui_WindowSection / PresentationConfiguration)

cui_WindowSection

| 名前 | location | WindowSectionControl(順) |
|---|---|---|
| h4_ReqDoc | ItemView | ItemView.Form |
| h4_ReqDoc itemview window (description「必要資料：Item View Window定義」) | ItemView | h4_ReqDoc AccCon, h4_ReqDoc TabCon, h4_ReqDoc FormatN, h4_ReqDoc Doc, h4_ReqDoc CLN, h4_ReqDoc PointOut, h4_ReqDoc SingOff1N, h4_ReqDoc TGVRevQuery, h4_ReqDoc TestResult |

(h4_ReqDoc AccCon / h4_ReqDoc TabCon の cui_Control 定義は、このImportには含まれない。参照のみ。)

cui_Control

| 名前 | control_type | parent_control | additional_data(relTypeId→RelationshipType) | ラベル(ja) |
|---|---|---|---|---|
| h4_ReqDoc CLN | TabElementControl | h4_ReqDoc TabCon | 38D46A5E…(= h4_ReqDoc CLN) | 担当者一覧 |
| h4_ReqDoc Doc | TabElementControl | h4_ReqDoc TabCon | 5B6FE242…(= h4_ReqDoc Doc) | 成果物 |
| h4_ReqDoc FormatN | TabElementControl | h4_ReqDoc TabCon | 2E7D31A0…(= h4_ReqDoc FormatN) | フォーマット |
| h4_ReqDoc PointOut | TabElementControl | h4_ReqDoc TabCon | 9FB4F403…(= h4_ReqDoc PointOut) | 指摘 |
| h4_ReqDoc SingOff1N | TabElementControl | h4_ReqDoc TabCon | 9C5A61B7…(= h4_ReqDoc SingOff1N) | サインオフ |
| h4_ReqDoc TestResult | TabElementControl | h4_ReqDoc TabCon | 2490FCE1…(= h4_ReqDoc TestResult) | 検証結果・根拠 |
| h4_ReqDoc TGVRevQuery | TabElementControl | h4_ReqDoc TabCon | 5D5E0409…(= h4_ReqDoc TGVRevQuery) | サインオフ |
| ItemView.Form | FormControl | ItemView.FormTab | (layout JSON) | - |

(relTypeIdの右の名前は、同名のcui_Controlとの対応であり、GUID照合までは行っていない。)

ItemView.Form のレイアウト:

```
行1: {h4_dept | h4_group | h4_section | h4_class | h4_approval_round | h4_category}
行2: {{h4_directaplist | h4_approve_style | h4_pare_mq} | {h4_approval_group_item}}
行3: {h4_delta_version | h4_model_code | h4_my | h4_destination | h4_model_name | h4_event}
行4: {name | h4_datformat_name | h4_yryr | h4_yryr_reason}
行5: {h4_developmentbase | h4_equipment | h4_variations | h4_unique_event | h4_yryr_classification | h4_evaluation_unit}
行6: {managed_by_id, owned_by_id | h4_test_schedule, h4_deadline | h4_approver, h4_approval_date}
```

cui_ControlFormField(role=World)の対象プロパティ(35件): h4_dept, h4_gr, h4_sec, h4_approval_round, h4_approve_style, h4_yryr, h4_delta_version, h4_my, h4_destination(2件), h4_approver, h4_approval_date, h4_model_name, h4_test_schedule, h4_deadline, h4_yryr_reason, h4_datformat_name, name, h4_pare_mq, h4_directaplist, h4_model_code, h4_event, h4_unique_event, h4_equipment, h4_variations, h4_yryr_classification, h4_class, h4_group, h4_section, owned_by_id, managed_by_id, h4_developmentbase, h4_evaluation_unit, h4_approval_group_item, h4_category。(h4_approval_group_item は ReqDoc の ItemType定義には無く、MQPage側の Property として `Last` で定義されている。コード上、ReqDoc に h4_approval_group_item を add する定義は見当たらない。)

PresentationConfiguration

| 名前 | 構成 |
|---|---|
| h4_ReqDoc_TOC_Configuration | cui_PresentConfigWinSection → h4_ReqDoc itemview window / PresentationCommandBarSection → h4_ReqDoc_TOC_Content, h4_ReqDoc_SVCB, h4_ReqDoc_IVICB (いずれも role=World) |
| h4_ReqDoc FormatN_TOC_Configuration | PresentationCommandBarSection → h4_ReqDoc FormatN_IVRCB (role=World) |

コマンドバーの中身(ボタン・Method)は上記CommandBarSection名の参照のみで、このImportには定義されていない。ボタン→Methodの対応が記述されているのは 3.3.2 のForm内 `h4_frm_OK` のみ。

---

