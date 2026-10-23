<!-- meta
legacy: knowledge/_legacy/機能設計書.md L2117-L2567
source: source/package/ (Life Cycle Map / Workflow Map)
-->
# G. マルQ・指摘・必要資料・検証結果・WF 系パッケージ 読込メモ (その3: WFMap)

ベース: `C:\Claude\TEST\HND-マルQ Step3パッケージ\Step3パッケージ`
読み方の注意は `G_mq_wf_packages_a.md` 冒頭に同じ(Method本体はImportに無く名前のみ)。

---

# 6. パッケージ WFMap (`WFMap\Import`)

含まれるファイル: qry_QueryDefinition(5) / rb_TreeGridViewDefinition(7) / Workflow Map(5)
(ItemType/Form/RelationshipType/cui_* は含まれない。)

## 6.1 qry_QueryDefinition

共通の読み方: `qry_QueryItem`=対象ItemType(aliasで識別)、`qry_QueryReference`=親子結合(filter_xmlが結合条件。`parent::Item` はクエリ上の親QueryItemを指す)。`qry_QueryItemSelectProperty`=取得するプロパティ。

### 6.1.1 h4_MQPage_Query
description: 「マルQページの『必要資料指摘一覧(TGV)』タブのクエリー定義。マルQページ、子の必要資料、その子のテスト結果 の『指摘』タブのアイテムを表示する」

QueryItem一覧

| alias | item_type | 条件(filter_xml) | 選択プロパティ |
|---|---|---|---|
| h4_MQPage (ルート) | h4_MQPage | なし | keyed_name |
| h4_MQPage PointOut | h4_MQPage PointOut(RelationshipType) | なし | - |
| h4_PointOut_1 | h4_PointOut | なし | h4_checked, h4_point_number, h4_point_sub_number, h4_pointer, h4_respondent, h4_newest_pointout, h4_rel_mq, h4_rel_reqdoc, h4_rel_testrsult, keyed_name, id, h4_points_to_note, h4_answer_items |
| h4_MQPage ReqDoc | h4_MQPage ReqDoc(RelationshipType) | なし | - |
| h4_ReqDoc | h4_ReqDoc | `or( exists(参照パス 9FCA…=ReqDoc→ReqDoc PointOut), exists(参照パス 109F…=ReqDoc→ReqDoc TestResult) )` | keyed_name, id |
| h4_ReqDoc PointOut | h4_ReqDoc PointOut(RelationshipType) | なし | - |
| h4_PointOut | h4_PointOut | なし | h4_checked, h4_point_number, h4_point_sub_number, h4_respondent, h4_newest_pointout, h4_rel_mq, h4_rel_reqdoc, h4_rel_testrsult, keyed_name, h4_pointer, id, h4_points_to_note, h4_answer_items |
| h4_ReqDoc TestResult | h4_ReqDoc TestResult(RelationshipType) | なし | - |
| h4_Test_Result | h4_Test_Result | `exists(参照パス F750…=Test_Result→Test_Result_PointOut)` | keyed_name, id |
| h4_Test_Result_PointOut | h4_Test_Result_PointOut(RelationshipType) | なし | - |
| h4_PointOut_2 | h4_PointOut | なし | h4_PointOut_1と同じ13プロパティ |

結合(QueryReference。親→子:結合条件)

| 親 | 子 | 条件 |
|---|---|---|
| (ルート) | h4_MQPage | - |
| h4_MQPage | h4_MQPage PointOut | 親.id = 子.source_id |
| h4_MQPage PointOut | h4_PointOut_1 | 親.related_id = 子.id |
| h4_MQPage | h4_MQPage ReqDoc | 親.id = 子.source_id |
| h4_MQPage ReqDoc | h4_ReqDoc | 親.related_id = 子.id |
| h4_ReqDoc | h4_ReqDoc PointOut | 親.id = 子.source_id (参照パスID 9FCA…) |
| h4_ReqDoc PointOut | h4_PointOut | 親.related_id = 子.id |
| h4_ReqDoc | h4_ReqDoc TestResult | 親.id = 子.source_id (参照パスID 109F…) |
| h4_ReqDoc TestResult | h4_Test_Result | 親.related_id = 子.id |
| h4_Test_Result | h4_Test_Result_PointOut | 親.id = 子.source_id (参照パスID F750…) |
| h4_Test_Result_PointOut | h4_PointOut_2 | 親.related_id = 子.id |

### 6.1.2 h4_RevQueryDATFormat
description: 「承認対象(開達書式)から開達書式の一括WFを逆展開Query」

| alias | item_type | 条件 | 選択プロパティ |
|---|---|---|---|
| h4_DATFormat (ルート) | h4_DATFormat | なし | - |
| h4_ApWGr4DATFor DATForrelated_id | h4_AppWFGr4DATFormat DATFormat(RelationshipType) | なし | - |
| h4_AppWFGroupForDATFormat | h4_AppWFGroupForDATFormat | `is_current = 1` | keyed_name, h4_state, id |

結合: h4_DATFormat → h4_AppWFGr4DATFormat DATFormat(`親.id = 子.related_id`) → h4_AppWFGroupForDATFormat(`親.source_id = 子.id`)

### 6.1.3 h4_RevQueryMQAndMQReqDoc
description: 「承認対象(マルQページと必要資料)からWFの親を逆展開Query」

| alias | item_type | 条件 | 選択プロパティ |
|---|---|---|---|
| h4_ApprovalTarget (ルート) | h4_ApprovalTarget | なし | - |
| ApTarget related_id | h4_ApprovalWFGroup_ApTarget(RelationshipType) | なし | - |
| h4_ApprovalWFGroup | h4_ApprovalWFGroup | `is_current = 1` | keyed_name, current_state, h4_approver, h4_approval_date, id |

結合: h4_ApprovalTarget → h4_ApprovalWFGroup_ApTarget(`親.id = 子.related_id`) → h4_ApprovalWFGroup(`親.source_id = 子.id`)

### 6.1.4 h4_TestResultReqDoc
description: 「テスト結果のタブに設定。テスト結果の親の必要資料を表示する。」

| alias | item_type | 条件 | 選択プロパティ |
|---|---|---|---|
| h4_Test_Result (ルート) | h4_Test_Result | なし | - |
| h4_ReqDoc TestResult related_id | h4_ReqDoc TestResult(RelationshipType) | なし | - |
| h4_ReqDoc | h4_ReqDoc | `is_current = 1` | id, keyed_name, h4_dept, is_current |

結合: h4_Test_Result → h4_ReqDoc TestResult(`親.id = 子.related_id`) → h4_ReqDoc(`親.source_id = 子.id`)

### 6.1.5 h4_WFGDATFormatRevHistory
description: 「開達実施要領一括承認の確認項目一覧用」

| alias | item_type | 条件 | 選択プロパティ |
|---|---|---|---|
| h4_AppWFGroupForDATFormat (ルート) | h4_AppWFGroupForDATFormat | なし | - |
| h4_AppWFGr4DATFormat DATFormat | h4_AppWFGr4DATFormat DATFormat(RelationshipType) | なし | - |
| h4_DATFormat | h4_DATFormat | なし | h4_delta_version, name, h4_class, h4_category, h4_doc_class, h4_event, h4_doc_link1/2/3, h4_guideline_link1/2/3, h4_doc_description, h4_supplementary_materials1/2, h4_state, h4_updatedate, keyed_name |
| h4_DATFormat RevisionHistory | h4_DATFormat RevisionHistory(RelationshipType) | なし | - |
| h4_RevisionHistory | h4_RevisionHistory | なし | h4_revision_number, h4_revision_sub_number, h4_rel_dat_master, h4_rel_dat_format, h4_revised_by, h4_revision_date, h4_applover_1, h4_applover_2, keyed_name |

結合: h4_AppWFGroupForDATFormat → h4_AppWFGr4DATFormat DATFormat(`親.id = 子.source_id`) → h4_DATFormat(`親.related_id = 子.id`) → h4_DATFormat RevisionHistory(`親.id = 子.source_id`) → h4_RevisionHistory(`親.related_id = 子.id`)

## 6.2 rb_TreeGridViewDefinition

共通: `max_child_items=100` / `max_query_depth=2` / (`max_query_depth_is_onload=1`、h4_destination History以外 = このパッケージのTGVは全て)。全列 `builder_method` は同一ID(AD1F071A…)。列は rb_ColumnDefinition(ヘッダ・幅・表示順)と、行(rb_TreeRowDefinition)ごとの rb_ColumnMapping(セル表示テンプレート)で構成。

### 6.2.1 h4_DATFormat TGVRevQuery
description: 「開達書式を持つWFの親を逆展開」/ query_definition: h4_RevQueryDATFormat

行定義: h4_AppWFGroupForDATFormat(ルート行・child)

| 順 | ヘッダ(ja) | 幅 | セル種別 | テンプレート |
|---|---|---|---|---|
| 0 | 識別子 | 412 | Item | `{h4_AppWFGroupForDATFormat.id/@keyed_name}` (リンク先 type=h4_AppWFGroupForDATFormat, id=`{…id}`) |
| 1 | WFステート | 113 | Text | `{h4_AppWFGroupForDATFormat.h4_state}` |

### 6.2.2 h4_ReqDoc TGVRevQuery
description: 「必要資料を持つWFの親を逆展開(必要資DataModel変更後)」/ query_definition: h4_RevQueryMQAndMQReqDoc

行定義: h4_ApprovalWFGroup(ルート行・child)

| 順 | ヘッダ(ja) | 幅 | セル種別 | テンプレート |
|---|---|---|---|---|
| 0 | 識別子 | 600 | Item | `{h4_ApprovalWFGroup.id/@keyed_name}`(リンク type=h4_ApprovalWFGroup) |
| 1 | WFステート | 100 | Text | `{h4_ApprovalWFGroup.current_state/@keyed_name}` |
| 2 | 承認者 | 100 | Item | `{h4_ApprovalWFGroup.h4_approver/@keyed_name}` |
| 3 | 承認日 | 100 | Date | `{h4_ApprovalWFGroup.h4_approval_date}` (date_format=short_date) |

### 6.2.3 h4_TGVRevQueryMQ
description: 「マルQページを持つWFの親を逆展開」/ query_definition: h4_RevQueryMQAndMQReqDoc

行定義・列は 6.2.2 と同構成(行=h4_ApprovalWFGroup)。幅: 識別子 599 / WFステート 266 / 承認者 147 / 承認日 100(承認日のセルはText、date_formatなし)。

### 6.2.4 h4_TGVRevQueryMQReqDoc (name=h4_TGVRevQueryMQReqDoc)
description: 「必要資料を持つWFの親を逆展開」/ query_definition: h4_RevQueryMQAndMQReqDoc

6.2.3と同構成。幅: 識別子 436 / WFステート 112 / 承認者 154 / 承認日 170(Text)。

### 6.2.5 h4_TGVTestResultReqDoc
description: 「テスト結果のタブに設定。テスト結果の親の必要資料を表示する。」/ query_definition: h4_TestResultReqDoc

行定義: h4_ReqDoc(QueryItem 990B…、ルート行・child)

| 順 | ヘッダ(ja) | 幅 | 内容 |
|---|---|---|---|
| 1 | 必要資料 | 600 | マッピング2件: (a) Text `{h4_ReqDoc.h4_dept}`(対応する行定義が同TGV内に存在しない行ID 563E… に紐づく)、(b) Item `{h4_ReqDoc.keyed_name}`(data_template type=h4_ReqDoc, id=`{h4_ReqDoc.id}`、template の item_type_name=`h4_ApprovalWFGroup`, item_id=`{h4_ApprovalWFGroup.id}` と記述されている) |
| 2 | 室課 | 100 | Text `{h4_ReqDoc.h4_dept}` |

### 6.2.6 h4_TGVMQRDocPointOut
description: 「マルQページの『必要資料指摘一覧(TGV)』タブのTGV。マルQページ、子の必要資料、その子のテスト結果 の『指摘』タブのアイテムを表示する」/ query_definition: h4_MQPage_Query

行定義と階層(rb_TreeRowReference)

| 行(ref) | 対応QueryItem(alias) | 親行 | 順 |
|---|---|---|---|
| 行A (2A55…) | h4_MQPage | (ルート) | 128 |
| 行B (DB1E…) | h4_PointOut_1 | 行A | 128 |
| 行C (5C7D…) | h4_ReqDoc | 行A | 256 |
| 行D (2AD4…) | h4_PointOut | 行C | 128 |
| 行E (8A4F…) | h4_Test_Result | 行C | 256 |
| 行F (2F6D…) | h4_PointOut_2 | 行E | 128 |

つまり表示階層は 「マルQページ ├ 指摘(直下) └ 必要資料 ├ 指摘 └ 検証結果・根拠 └ 指摘」。

列定義(rb_ColumnDefinition。「順」= position_order)

| 順 | ヘッダ(ja) | 幅 | 行A | 行B/D/F(指摘行: PointOut_1 / PointOut / PointOut_2) | 行C/E |
|---|---|---|---|---|---|
| 0 | キーネーム | 300 | Text `{h4_MQPage.keyed_name}` | Item `{h4_PointOut_1.id/@keyed_name}` 等(リンク type=h4_PointOut) | 行C: Item `{h4_ReqDoc.id/@keyed_name}`、行E: Item `{h4_Test_Result.id/@keyed_name}` |
| 1 | 確認済 | 53 | | `{…h4_checked}` Text | |
| 2 | 指摘No. | 74 | | `{…h4_point_number}` Text | |
| 3 | 枝番 | 50 | | `{…h4_point_sub_number}` Text | |
| 4 | 指摘者 | 100 | | Item `{…h4_pointer/@keyed_name}`(item_type_name=User) | |
| 5 | 指摘事項 | 100 | | Text `{…h4_points_to_note}` | |
| 6 | 回答者 | 100 | | Item `{…h4_respondent/@keyed_name}`(User) | |
| 7 | 回答事項 | 100 | | Text `{…h4_answer_items}` | |
| 8 | 最新 | 100 | | Item `{…h4_newest_pointout/@keyed_name}`(type=h4_PointOut) | |
| 9 | 対象：マルQ | 100 | | Item `{…h4_rel_mq/@keyed_name}`(type=h4_MQPage) | |
| 10 | 対象：必要資料 | 100 | | Item `{…h4_rel_reqdoc/@keyed_name}`(type=h4_ReqDoc) | |
| 11 | 対象：検証結果・根拠 | 153 | | Item `{…h4_rel_testrsult/@keyed_name}`(type=h4_Test_Result) | |

(「…」は行ごとに PointOut_1 / PointOut / PointOut_2 のエイリアスが入る。)

### 6.2.7 h4_TGVWFGDATFormatRevHistory
description: 「開達実施要領一括承認の確認項目一覧用」/ query_definition: h4_WFGDATFormatRevHistory

行定義: 行A=h4_DATFormat(ルート)、行B=h4_RevisionHistory(行Aの子)

| 順 | ヘッダ(ja) | 幅 | セル種別 | テンプレート |
|---|---|---|---|---|
| 0 | 開達書式/改訂履歴 | 600 | Item(行B) / Item(行A) | 行B: `{h4_RevisionHistory.keyed_name}`(type=h4_RevisionHistory)、行A: `{h4_DATFormat.keyed_name}`(type=h4_DATFormat) |
| 1 | 改訂No. | 100 | Text | `{h4_RevisionHistory.h4_revision_number}` |
| 2 | 枝番 | 100 | Text | `{h4_RevisionHistory.h4_revision_sub_number}` |
| 3 | 対象：帳票マスタ | 100 | Text | `{h4_RevisionHistory.h4_rel_dat_master/@keyed_name}` |
| 4 | 対象：開達書式 | 100 | Text | `{h4_RevisionHistory.h4_rel_dat_format/@keyed_name}` |
| 5 | 担当者(改訂者) | 100 | Text | `{h4_RevisionHistory.h4_revised_by/@keyed_name}` |
| 6 | 改訂日 | 100 | Date(short_date) | `{h4_RevisionHistory.h4_revision_date}` |
| 7 | 承認者１ | 100 | Text | `{h4_RevisionHistory.h4_applover_1/@keyed_name}` |
| 8 | 承認者２ | 100 | Text | `{h4_RevisionHistory.h4_applover_2/@keyed_name}` |

## 6.3 Workflow Map

共通事項(5マップ全てに当てはまる)
- Workflow Map の process_owner は `Creator`。
- 各アクティビティ(Activity Template)の割当て(Assignment)定義は、これらのファイルには存在しない(`Activity Template Assignment` 相当のItemは0件)。担当者割当てはアクティビティの `on_activate` に仕込まれた Method(`h4_setWfAssignWhenOnActive` / `h4_setWfAssignWhenOnActiveForDAT`)で行う構成であり、Methodの実装はImportに無いため具体的な割当てルールはコードから読み取れない。
- `on_assign` に `h4_sendMail`(DAT系は `h4_sendMail_DAT`)、`on_close` に `h4_GetWFComment`(DAT系は `h4_getWFComment_DAT`)が設定されている。
- ライフサイクル遷移(Activity Template Transition): 各アクティビティが on_activate 時に、対象ItemTypeのLife Cycle Transition(from→to)を実行する設定。
- 「パス前処理」= `Workflow Map Path Pre`(遷移前に実行されるMethod、sequence順)。`condition`(パス条件)はどのPathにも設定されていない(空)。`override=1` のパスは is_override=1 のPath(拒否・仮承認など)。`is_default=1` はそのアクティビティの既定パス。
- Path に `authentication=none`。
- 全アクティビティで can_delegate=0 / can_refuse=0 / wait_for_all_inputs=0 / wait_for_all_votes=0。期限(expected_duration/timeout/reminder)は設定なし(0 または未設定)。

### Workflow Map: h4_ApprovalWFGroupWF

- label(ja)=WFの親アイテムのWF / description(ja)= / process_owner=Creator

**アクティビティ**

| アクティビティ名 | ラベル(ja) | 種別 | 自動 | 実行Method(イベント: Method) | ライフサイクル遷移(on_activate時, ItemType: from → to) | タスク(必須) | x,y |
|---|---|---|---|---|---|---|---|
| Approved | 承認 | 終了 | 1 | on_activate: h4_sendMail | h4_ApprovalWFGroup: ProvisionalApproved → Approved<br>h4_ApprovalWFGroup: RequestApproval → Approved |  | 557,92 |
| Start |  | 開始 | 1 |  |  |  | 25,95 |
| InProgress | 作業中 | 通常 | 0 | on_close: h4_GetWFComment<br>on_activate: h4_setWfAssignWhenOnActive<br>on_assign: h4_sendMail | h4_ApprovalWFGroup: InReview → InProgress<br>h4_ApprovalWFGroup: ProvisionalApproved → InProgress<br>h4_ApprovalWFGroup: RequestApproval → InProgress |  | 112,94 |
| ProvisionalApproved | 仮承認 | 通常 | 0 | on_activate: h4_setWfAssignWhenOnActive<br>on_close: h4_GetWFComment<br>on_assign: h4_sendMail | h4_ApprovalWFGroup: RequestApproval → ProvisionalApproved |  | 452,122 |
| InReview | 確認中 | 通常 | 0 | on_activate: h4_hidePullBack<br>on_close: h4_GetWFComment<br>on_activate: h4_setWfAssignWhenOnActive<br>on_assign: h4_sendMail | h4_ApprovalWFGroup: InProgress → InReview<br>h4_ApprovalWFGroup: RequestApproval → InReview |  | 229,93 |
| RequestApproval | 承認依頼 | 通常 | 0 | on_activate: h4_hidePullBack<br>on_activate: h4_hidepullBack_RA_IP<br>on_close: h4_GetWFComment<br>on_activate: h4_setWfAssignWhenOnActive<br>on_assign: h4_sendMail | h4_ApprovalWFGroup: InReview → RequestApproval<br>h4_ApprovalWFGroup: InProgress → RequestApproval |  | 353,94 |

**遷移(Path)**

| 遷移元 | Path名 | 遷移先 | 既定 | override | パス前処理(Workflow Map Path Pre: sequence順のMethod) | 認証 | 条件(condition) |
|---|---|---|---|---|---|---|---|
| Start | GO | InProgress | 1 | 0 |  | none |  |
| InProgress | Request Review | InReview | 0 | 0 | 1. h4_CheckReqDocYryrState | none |  |
| InProgress | DirectReview | RequestApproval | 0 | 0 |  | none |  |
| ProvisionalApproved | Approve | Approved | 0 | 0 | 1. h4_CheckReqDocYryrState | none |  |
| InReview | Review | RequestApproval | 0 | 0 |  | none |  |
| InReview | Reject | InProgress | 0 | 1 | 1. h4_CallSetReqDocRejecter_AppWFGr | none |  |
| InReview | pullBack | InProgress | 0 | 0 |  | none |  |
| RequestApproval | Approve | Approved | 1 | 0 | 1. h4_CheckReqDocYryrState | none |  |
| RequestApproval | ProvisionalApprove | ProvisionalApproved | 0 | 1 | 1. h4_CheckReqDocYryrState | none |  |
| RequestApproval | Reject | InProgress | 0 | 1 | 1. h4_IncrementRound<br>2. h4_CallSetReqDocRejecter_AppWFGr | none |  |
| RequestApproval | pullBack | InReview | 0 | 0 |  | none |  |
| RequestApproval | pullBack_RA_IP | InProgress | 0 | 0 |  | none |  |

### Workflow Map: h4_ApprovalWFMQAndReqDoc

- label(ja)=マルQページと必要資料のWFの / description(ja)= / process_owner=Creator

**アクティビティ**

| アクティビティ名 | ラベル(ja) | 種別 | 自動 | 実行Method(イベント: Method) | ライフサイクル遷移(on_activate時, ItemType: from → to) | タスク(必須) | x,y |
|---|---|---|---|---|---|---|---|
| Approved | 承認 | 終了 | 1 | on_activate: h4_sendMail<br>: h4_GetWFComment | h4_MQPage: RequestApproval → Approved<br>h4_MQPage: ProvisionalApproved → Approved<br>h4_ReqDoc: ProvisionalApproved → Approved<br>h4_ReqDoc: RequestApproval → Approved |  | 607,124 |
| Start |  | 開始 | 1 |  |  |  | 28,121 |
| InProgress | 作業中 | 通常 | 0 | on_close: h4_GetWFComment<br>on_activate: h4_setWfAssignWhenOnActive<br>on_assign: h4_sendMail<br>on_activate: h4_hideYryrRequestApproval | h4_MQPage: InReview → InProgress<br>h4_MQPage: RequestApproval → InProgress<br>h4_ReqDoc: InReview → InProgress<br>h4_ReqDoc: RequestApproval → InProgress<br>h4_ReqDoc: YryrRequestApproval → InProgress |  | 93,120 |
| ProvisionalApproved | 仮承認 | 通常 | 0 | on_activate: h4_setWfAssignWhenOnActive<br>on_close: h4_GetWFComment<br>on_assign: h4_sendMail | h4_MQPage: RequestApproval → ProvisionalApproved<br>h4_ReqDoc: RequestApproval → ProvisionalApproved |  | 474,173 |
| InReview | 確認中 | 通常 | 0 | on_activate: h4_hidePullBack<br>on_close: h4_GetWFComment<br>on_activate: h4_setWfAssignWhenOnActive<br>on_assign: h4_sendMail | h4_MQPage: InProgress → InReview<br>h4_MQPage: RequestApproval → InReview<br>h4_ReqDoc: InProgress → InReview<br>h4_ReqDoc: RequestApproval → InReview |  | 226,120 |
| RequestApproval | 承認依頼 | 通常 | 0 | on_activate: h4_hidePullBack<br>on_activate: h4_hidepullBack_RA_IP<br>on_close: h4_GetWFComment<br>on_activate: h4_setWfAssignWhenOnActive<br>on_assign: h4_sendMail | h4_MQPage: InReview → RequestApproval<br>h4_ReqDoc: InReview → RequestApproval<br>h4_ReqDoc: InProgress → RequestApproval<br>h4_MQPage: InProgress → RequestApproval |  | 337,119 |
| YryrRequestApproval | やるやら変更承認 | 通常 | 0 | on_activate: h4_setWfAssignWhenOnActive<br>on_assign: h4_sendMail<br>on_close: h4_GetWFComment | h4_ReqDoc: InProgress → YryrRequestApproval |  | 249,259 |

**遷移(Path)**

| 遷移元 | Path名 | 遷移先 | 既定 | override | パス前処理(Workflow Map Path Pre: sequence順のMethod) | 認証 | 条件(condition) |
|---|---|---|---|---|---|---|---|
| Start | GO | InProgress | 1 | 0 |  | none |  |
| InProgress | Request Review | InReview | 0 | 0 |  | none |  |
| InProgress | YryrReview | YryrRequestApproval | 0 | 0 |  | none |  |
| InProgress | DirectReview | RequestApproval | 0 | 0 |  | none |  |
| ProvisionalApproved | Approve | Approved | 0 | 0 | 1. h4_CheckReqDocYryrState | none |  |
| InReview | Review | RequestApproval | 0 | 0 |  | none |  |
| InReview | Reject | InProgress | 0 | 1 | 1. h4_CallSetReqDocRejecter_MQPage | none |  |
| InReview | pullBack | InProgress | 0 | 0 |  | none |  |
| RequestApproval | Approve | Approved | 1 | 0 | 1. h4_CheckReqDocYryrState | none |  |
| RequestApproval | ProvisionalApprove | ProvisionalApproved | 0 | 1 | 1. h4_CheckReqDocYryrState | none |  |
| RequestApproval | Reject | InProgress | 0 | 1 | 1. h4_IncrementRoundForMQPage<br>2. h4_CallSetReqDocRejecter_MQPage | none |  |
| RequestApproval | pullBack | InReview | 0 | 0 |  | none |  |
| RequestApproval | pullBack_RA_IP | InProgress | 0 | 0 |  | none |  |
| YryrRequestApproval | YryrApprove | InProgress | 0 | 0 | 1. h4_CallChangeYryrForWF | none |  |
| YryrRequestApproval | YryrReject | InProgress | 0 | 1 | 1. h4_CancelChangeYryrForWF | none |  |

### Workflow Map: h4_DATFormatEXPWF

- label(ja)=開達書式（EXP検定）WF / description(ja)=開達書式のEXP検定用WF / process_owner=Creator

**アクティビティ**

| アクティビティ名 | ラベル(ja) | 種別 | 自動 | 実行Method(イベント: Method) | ライフサイクル遷移(on_activate時, ItemType: from → to) | タスク(必須) | x,y |
|---|---|---|---|---|---|---|---|
| Release | 公開 | 終了 | 1 | on_activate: h4_sendMail_DAT | h4_DATFormat: ReleaseApproved → Release<br>h4_AppWFGroupForDATFormat: ReleaseApproved → Release |  | 852,161 |
| Start |  | 開始 | 1 |  |  |  | 19,103 |
| InProgress | 作業中 | 通常 | 0 | on_close: h4_CheckDATWFStart<br>on_activate: h4_setWfAssignWhenOnActiveForDAT<br>on_close: h4_getWFComment_DAT<br>on_assign: h4_sendMail_DAT | h4_DATFormat: ReqApproval_InspEXP → InProgress<br>h4_DATFormat: ReqApproval_Q1Stf → InProgress<br>h4_AppWFGroupForDATFormat: ReqApproval_InspEXP → InProgress<br>h4_AppWFGroupForDATFormat: ReqApproval_Q1Stf → InProgress |  | 114,104 |
| ReqApproval_InspEXP | 承認依頼（EXP検定） | 通常 | 0 | on_activate: h4_setWfAssignWhenOnActiveForDAT<br>on_activate: h4_hidePullBack<br>on_close: h4_getWFComment_DAT<br>on_assign: h4_sendMail_DAT | h4_DATFormat: InProgress → ReqApproval_InspEXP<br>h4_AppWFGroupForDATFormat: InProgress → ReqApproval_InspEXP | (required=1) | 254,128 |
| ReqApproval_Q1Stf | 承認依頼（品質一課担当者） | 通常 | 0 | on_activate: h4_setWfAssignWhenOnActiveForDAT<br>on_close: h4_getWFComment_DAT<br>on_assign: h4_sendMail_DAT | h4_DATFormat: ReqApproval_InspEXP → ReqApproval_Q1Stf<br>h4_AppWFGroupForDATFormat: ReqApproval_InspEXP → ReqApproval_Q1Stf | (required=1) | 428,144 |
| ReqApproval_Q1Appr | 承認依頼（品質一課承認者） | 通常 | 0 | on_activate: h4_setWfAssignWhenOnActiveForDAT<br>on_close: h4_getWFComment_DAT<br>on_assign: h4_sendMail_DAT | h4_DATFormat: ReqApproval_Q1Stf → ReqApproval_Q1Appr<br>h4_AppWFGroupForDATFormat: ReqApproval_Q1Stf → ReqApproval_Q1Appr | (required=1) | 583,162 |
| ReleaseApproved | 公開承認 | 通常 | 0 | on_activate: h4_setWfAssignWhenOnActiveForDAT<br>on_close: h4_getWFComment_DAT<br>on_assign: h4_sendMail_DAT | h4_DATFormat: ReqApproval_Q1Appr → ReleaseApproved<br>h4_AppWFGroupForDATFormat: ReqApproval_Q1Appr → ReleaseApproved | (required=1) | 744,161 |

**遷移(Path)**

| 遷移元 | Path名 | 遷移先 | 既定 | override | パス前処理(Workflow Map Path Pre: sequence順のMethod) | 認証 | 条件(condition) |
|---|---|---|---|---|---|---|---|
| Start | GO | InProgress | 1 | 0 |  | none |  |
| InProgress | Review_InspEXP | ReqApproval_InspEXP | 0 | 0 |  | none |  |
| ReqApproval_InspEXP | pullBack | InProgress | 0 | 0 |  | none |  |
| ReqApproval_InspEXP | Review_Q1Stf | ReqApproval_Q1Stf | 0 | 0 |  | none |  |
| ReqApproval_InspEXP | reject | InProgress | 0 | 1 |  | none |  |
| ReqApproval_Q1Stf | Review_Q1Appr | ReqApproval_Q1Appr | 0 | 0 |  | none |  |
| ReqApproval_Q1Stf | Reject | InProgress | 0 | 1 |  | none |  |
| ReqApproval_Q1Appr | ReleaseApprove | ReleaseApproved | 0 | 0 |  | none |  |
| ReleaseApproved | Approve | Release | 0 | 0 | 1. h4_CheckLockHist | none |  |

### Workflow Map: h4_DATFormatWF

- label(ja)=帳票マスタ・開達書式（EXP検定以外）WF / description(ja)=帳票マスタ・開達書式のWF / process_owner=Creator

**アクティビティ**

| アクティビティ名 | ラベル(ja) | 種別 | 自動 | 実行Method(イベント: Method) | ライフサイクル遷移(on_activate時, ItemType: from → to) | タスク(必須) | x,y |
|---|---|---|---|---|---|---|---|
| Release | 公開 | 終了 | 1 | on_activate: h4_sendMail_DAT | h4_DATFormat: ReleaseApproved → Release<br>h4_DATMaster: ReleaseApproved → Release<br>h4_AppWFGroupForDATFormat: ReleaseApproved → Release |  | 453,143 |
| Start |  | 開始 | 1 |  |  |  | 9,145 |
| RequestApproval | 承認依頼 | 通常 | 0 | on_activate: h4_setWfAssignWhenOnActiveForDAT<br>on_activate: h4_hidePullBack<br>on_close: h4_getWFComment_DAT<br>on_assign: h4_sendMail_DAT | h4_DATFormat: InProgress → RequestApproval<br>h4_DATMaster: InProgress → RequestApproval<br>h4_AppWFGroupForDATFormat: InProgress → RequestApproval | (required=1) | 220,144 |
| ReleaseApproved | 公開承認 | 通常 | 0 | on_activate: h4_setWfAssignWhenOnActiveForDAT<br>on_close: h4_getWFComment_DAT<br>on_assign: h4_sendMail_DAT | h4_DATFormat: RequestApproval → ReleaseApproved<br>h4_DATMaster: RequestApproval → ReleaseApproved<br>h4_AppWFGroupForDATFormat: RequestApproval → ReleaseApproved | (required=1) | 352,144 |
| InProgress | 作業中 | 通常 | 0 | on_close: h4_CheckDATWFStart<br>on_activate: h4_setWfAssignWhenOnActiveForDAT<br>on_close: h4_getWFComment_DAT<br>on_assign: h4_sendMail_DAT | h4_DATFormat: RequestApproval → InProgress<br>h4_DATMaster: RequestApproval → InProgress<br>h4_AppWFGroupForDATFormat: RequestApproval → InProgress |  | 89,145 |

**遷移(Path)**

| 遷移元 | Path名 | 遷移先 | 既定 | override | パス前処理(Workflow Map Path Pre: sequence順のMethod) | 認証 | 条件(condition) |
|---|---|---|---|---|---|---|---|
| Start | Go | InProgress | 1 | 0 |  | none |  |
| RequestApproval | ReleaseApprove | ReleaseApproved | 0 | 0 |  | none |  |
| RequestApproval | Reject | InProgress | 0 | 1 |  | none |  |
| RequestApproval | pullBack | InProgress | 0 | 0 |  | none |  |
| ReleaseApproved | Approve | Release | 0 | 0 | 1. h4_CheckIsLockRelatedDAT<br>2. h4_CheckLockHist | none |  |
| InProgress | Review | RequestApproval | 0 | 0 |  | none |  |

### Workflow Map: h4_Test_ResultWF

- label(ja)=承認依頼 / description(ja)= / process_owner=Creator

**アクティビティ**

| アクティビティ名 | ラベル(ja) | 種別 | 自動 | 実行Method(イベント: Method) | ライフサイクル遷移(on_activate時, ItemType: from → to) | タスク(必須) | x,y |
|---|---|---|---|---|---|---|---|
| Approved | 承認 | 終了 | 1 | on_activate: h4_sendMail | h4_Test_Result: RequestApproval → Approved |  | 437,123 |
| Start |  | 開始 | 1 |  |  |  | 34,127 |
| InProgress | 作業中 | 通常 | 0 | on_assign: h4_setWfAssignWhenOnActive<br>on_close: h4_GetWFComment<br>on_assign: h4_sendMail | h4_Test_Result: InReview → InProgress<br>h4_Test_Result: RequestApproval → InProgress |  | 120,126 |
| InReview | 確認中 | 通常 | 0 | on_activate: h4_setWfAssignWhenOnActive<br>on_close: h4_GetWFComment<br>on_activate: h4_hidePullBack<br>on_assign: h4_sendMail | h4_Test_Result: InProgress → InReview<br>h4_Test_Result: RequestApproval → InReview |  | 231,125 |
| RequestApproval | 承認依頼 | 通常 | 0 | on_activate: h4_setWfAssignWhenOnActive<br>on_close: h4_GetWFComment<br>on_activate: h4_hidePullBack<br>on_activate: h4_hidepullBack_RA_IP<br>on_assign: h4_sendMail | h4_Test_Result: InReview → RequestApproval<br>h4_Test_Result: InProgress → RequestApproval |  | 333,124 |

**遷移(Path)**

| 遷移元 | Path名 | 遷移先 | 既定 | override | パス前処理(Workflow Map Path Pre: sequence順のMethod) | 認証 | 条件(condition) |
|---|---|---|---|---|---|---|---|
| Start | GO | InProgress | 1 | 0 |  | none |  |
| InProgress | Request Review | InReview | 0 | 0 |  | none |  |
| InProgress | DirectReview | RequestApproval | 0 | 0 |  | none |  |
| InReview | Review | RequestApproval | 0 | 0 |  | none |  |
| InReview | Reject | InProgress | 0 | 1 |  | none |  |
| InReview | pullBack | InProgress | 0 | 0 |  | none |  |
| RequestApproval | Approve | Approved | 0 | 0 |  | none |  |
| RequestApproval | pullBack | InReview | 0 | 0 |  | none |  |
| RequestApproval | Reject | InProgress | 0 | 1 |  | none |  |
| RequestApproval | pullBack_RA_IP | InProgress | 0 | 0 |  | none |  |



### 6.3.x 遷移の流れ(Path表の要約)

#### (1) h4_ApprovalWFGroupWF(ラベル ja「WFの親アイテムのWF」、対象ItemType=h4_ApprovalWFGroup)
```
Start --GO--> InProgress(作業中)
InProgress --Request Review[前処理: h4_CheckReqDocYryrState]--> InReview(確認中)
InProgress --DirectReview--> RequestApproval(承認依頼)
InReview --Review--> RequestApproval
InReview --Reject(override)[前処理: h4_CallSetReqDocRejecter_AppWFGr]--> InProgress
InReview --pullBack--> InProgress
RequestApproval --Approve(既定)[前処理: h4_CheckReqDocYryrState]--> Approved(承認:終了)
RequestApproval --ProvisionalApprove(override)[前処理: h4_CheckReqDocYryrState]--> ProvisionalApproved(仮承認)
RequestApproval --Reject(override)[前処理: 1.h4_IncrementRound 2.h4_CallSetReqDocRejecter_AppWFGr]--> InProgress
RequestApproval --pullBack--> InReview
RequestApproval --pullBack_RA_IP--> InProgress
ProvisionalApproved --Approve[前処理: h4_CheckReqDocYryrState]--> Approved
```

#### (2) h4_ApprovalWFMQAndReqDoc(ラベル ja「マルQページと必要資料のWFの」、対象ItemType=h4_MQPage と h4_ReqDoc)
```
Start --GO--> InProgress
InProgress --Request Review--> InReview
InProgress --YryrReview--> YryrRequestApproval(やるやら変更承認)
InProgress --DirectReview--> RequestApproval
InReview --Review--> RequestApproval
InReview --Reject(override)[前処理: h4_CallSetReqDocRejecter_MQPage]--> InProgress
InReview --pullBack--> InProgress
RequestApproval --Approve(既定)[前処理: h4_CheckReqDocYryrState]--> Approved
RequestApproval --ProvisionalApprove(override)[前処理: h4_CheckReqDocYryrState]--> ProvisionalApproved
RequestApproval --Reject(override)[前処理: 1.h4_IncrementRoundForMQPage 2.h4_CallSetReqDocRejecter_MQPage]--> InProgress
RequestApproval --pullBack--> InReview
RequestApproval --pullBack_RA_IP--> InProgress
ProvisionalApproved --Approve[前処理: h4_CheckReqDocYryrState]--> Approved
YryrRequestApproval --YryrApprove[前処理: h4_CallChangeYryrForWF]--> InProgress
YryrRequestApproval --YryrReject(override)[前処理: h4_CancelChangeYryrForWF]--> InProgress
```
(YryrRequestApproval アクティビティの LC 遷移は h4_ReqDoc のみ(InProgress → YryrRequestApproval)。InProgress の `on_activate` に `h4_hideYryrRequestApproval` が設定されている。Approved には `event` 未設定の `h4_GetWFComment` と `on_activate` の `h4_sendMail` がある。)

#### (3) h4_DATFormatEXPWF(ラベル ja「開達書式(EXP検定)WF」、description「開達書式のEXP検定用WF」、対象ItemType=h4_DATFormat, h4_AppWFGroupForDATFormat)
```
Start --GO--> InProgress(作業中)
InProgress --Review_InspEXP--> ReqApproval_InspEXP(承認依頼(EXP検定))
ReqApproval_InspEXP --Review_Q1Stf--> ReqApproval_Q1Stf(承認依頼(品質一課担当者))
ReqApproval_InspEXP --pullBack--> InProgress
ReqApproval_InspEXP --reject(override)--> InProgress
ReqApproval_Q1Stf --Review_Q1Appr--> ReqApproval_Q1Appr(承認依頼(品質一課承認者))
ReqApproval_Q1Stf --Reject(override)--> InProgress
ReqApproval_Q1Appr --ReleaseApprove--> ReleaseApproved(公開承認)
ReleaseApproved --Approve[前処理: h4_CheckLockHist]--> Release(公開:終了)
```
(InProgress の `on_close` に `h4_CheckDATWFStart`。ReqApproval_InspEXP / Q1Stf / Q1Appr / ReleaseApproved に必須タスク「改訂履歴がすべて確認済みになっている」。)

#### (4) h4_DATFormatWF(ラベル ja「帳票マスタ・開達書式(EXP検定以外)WF」、description「帳票マスタ・開達書式のWF」、対象ItemType=h4_DATFormat, h4_DATMaster, h4_AppWFGroupForDATFormat)
```
Start --Go--> InProgress
InProgress --Review--> RequestApproval(承認依頼)
RequestApproval --ReleaseApprove--> ReleaseApproved(公開承認)
RequestApproval --Reject(override)--> InProgress
RequestApproval --pullBack--> InProgress
ReleaseApproved --Approve[前処理: 1.h4_CheckIsLockRelatedDAT 2.h4_CheckLockHist]--> Release(公開:終了)
```
(InProgress の `on_close` に `h4_CheckDATWFStart`。RequestApproval / ReleaseApproved に必須タスク「改訂履歴がすべて確認済みになっている」。)

#### (5) h4_Test_ResultWF(ラベル ja「承認依頼」、対象ItemType=h4_Test_Result)
```
Start --GO--> InProgress(作業中)
InProgress --Request Review--> InReview(確認中)
InProgress --DirectReview--> RequestApproval(承認依頼)
InReview --Review--> RequestApproval
InReview --Reject(override)--> InProgress
InReview --pullBack--> InProgress
RequestApproval --Approve--> Approved(承認:終了)
RequestApproval --pullBack--> InReview
RequestApproval --Reject(override)--> InProgress
RequestApproval --pullBack_RA_IP--> InProgress
```
(パス前処理Methodなし。)

### 6.3.y WF間の対応関係(コードから読み取れる範囲)
- h4_MQPage / h4_ReqDoc の ItemType は許可ワークフロー(既定)として h4_ApprovalWFMQAndReqDoc、h4_Test_Result は h4_Test_ResultWF(いずれも各ItemTypeのImport内 `Allowed Workflow`)。
- h4_ApprovalWFGroupWF は ItemType h4_ApprovalWFGroup のWFとして LC遷移が定義されているが、h4_ApprovalWFGroup 自体の ItemType 定義(Allowed Workflow 設定)はこの調査対象パッケージの Import には含まれない。
- h4_DATFormatWF / h4_DATFormatEXPWF の対象 h4_DATFormat / h4_DATMaster / h4_AppWFGroupForDATFormat も、ItemType定義は本調査対象外(MQPage…WFMap の6パッケージ外)。
- 「パス前処理」Method(h4_CheckReqDocYryrState, h4_IncrementRound, h4_IncrementRoundForMQPage, h4_CallSetReqDocRejecter_AppWFGr, h4_CallSetReqDocRejecter_MQPage, h4_CallChangeYryrForWF, h4_CancelChangeYryrForWF, h4_CheckLockHist, h4_CheckIsLockRelatedDAT)および `h4_PullBack` / `h4_PullBack_DAT`(TestResult パッケージの引き戻しボタン)の実装は、調査対象のImportには含まれない。




---

<!-- ===== 第3章 ===== -->

