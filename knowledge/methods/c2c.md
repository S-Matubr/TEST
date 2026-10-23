<!-- meta
legacy: knowledge/_legacy/機能設計書.md L5648-L5697
source: source/package/Independent/Import/Method/
-->
# Method AML 調査 C_method2c (126〜128番目: h4_getSettingCheckBox, h4_GetWFComment, h4_getWFComment_DAT)

---
## [126] h4_getSettingCheckBox
- 言語: JavaScript / comments: h4_Input_Check_Value 画面で設定した値の取得
- 概要: フォーム `h4_Input_Check_Value` のOKボタンで動作(コード内コメント)。フォーム上のチェック済みcheckboxの `id` を配列で収集して `parent.dialogArguments.dialog.close(配列)`。`h4_frm_getSettingEvents` と同一処理で、仕様変更に備え別Methodにしてある(コード内コメント)。
- 呼出す他Method: なし。

## [127] h4_GetWFComment
- 言語: C# / comments: ワークフロー遷移時コメントを指摘とメールに使用。
- 概要: WF(ワークフロー)遷移時に走る共通処理(コード冒頭コメント): Vote時コメント取得 / 否認・仮承認時のコメント空欄警告 / 全WFごとの担当者取得 / 担当者役割が揃っているかチェック / メール送信対象者のメールアドレス有無チェック / 否認時の指摘(h4_PointOut)追加 / メール構築用の値作成(ここでは送らず、`RequestState` に載せて次アサインメントの OnAssign で別Methodがメール送信 — コメント記載)。
- 呼び出し契機(推測): MQPage / ReqDoc / Test_Result / ApprovalWFGroup 各ライフサイクルの Activity(ワークフロー)の OnClose/OnVote 系イベントのMethod(`this`=Activity、`this.getProperty("id")`=ActivityID)。次アクティビティで `h4_sendMail`(コメント記載)がRequestStateを使用。
- 入力: this = Activity(`id`)。出力: this(失敗時 `inn.newError`)。`RequestState` へ以下を設定: `fromAddress, Subject, Body, ccList, createrList, reviewerList, approverList, nextActivity(遷移先Activity名), targetItemId, h4_isYryrReviewType`。
- 定数: Path名 `YryrReview`/`YryrApprove`/`YryrReject`(必要資料やるやら承認依頼系)、`Request Review`(確認中へのパス)、引き戻しパス `pullBack`/`pullBack_RA_IP`、メールコメント書式 `"<br>{0} :<br>{1}<br>"`。全体を `Administrators` 権限で実行。
- 処理フロー:
  1. `Activity Assignment`(source_id=ActivityID, select=comments,closed_on,path,related_id,closed_by)を取得。コメントのあるものを `SourceAssignmentList` に、`closed_on` が最新のものを「確定したパス」とみなして `pathName` を決定。
  2. pathName が Yryr系3種なら `isYryrReviewType`、`Request Review` なら `isRequestReviewPath`。
  3. 同じ path のAssignmentについて Alias(related_id=Identity)→User を取得し `voteList` と `ccList`(email)に追加(VOTE実行者)。
  4. pathName が `Reject`/`ProvisionalApprove`/`YryrReject` でコメント空白なら `h4_S_E_0811` エラー。
  5. 引き戻し(pullBack, pullBack_RA_IP)以外の場合のみ以降を実行: コメント整形(`コメントN（path）：…`)とメール用コメント(User keyed_name + comments)。`Reject`/`YryrReject` のコメントがあればそれを `comment` とし break。遷移先を特定: `Workflow Process Path`(source_id=Activity, name=pathName, select related_id,label)のうち遷移先Activityの `created_on` が最新のものを `relatedActivity`、そのpath `label` を `pathLabel` に。`Workflow Process Activity`→`Workflow Process`→`Workflow`(behavior が `hard_float` のもの)から承認対象 `source_id` / `source_type` を取得。
  6. source_type(ItemTypeのID)で分岐し担当者一覧(`CLN`)を取得:
     - `EC17A836496248498BC080344F060619` = h4_MQPage: select(`h4_event,h4_model_code,h4_my,h4_destination,h4_model_name,h4_pare_mq,keyed_name,managed_by_id,h4_evaluation_unit,h4_unique_event`)。`h4_MQPage CLN` から related_id/h4_workflow_role を取得。指摘は `h4_MQPage PointOut` の最大指摘番号+1(`h4_point_number` の先頭3文字「MQ_」を除去して数値化)。
     - `DD0E19C0D9DE43E986F27A243FBD2298` = h4_ApprovalWFGroup: `h4_ApprovalWFGroup CLN` / `h4_ApprovalWFGroup PointOut`(先頭3文字「AP_」除去)。
     - `984B394A7FF14AD8B3E11EE939283344` = h4_Test_Result: `h4_Test_Result CLN` / `h4_Test_Result_PointOut`(先頭3文字「RZ_」除去)。
     - それ以外 = h4_ReqDoc: `h4_ReqDoc CLN` / `h4_ReqDoc PointOut`(先頭4文字「DOC_」除去)。
     各 CLN 行: related_id が空の場合 — Yryr系(ReqDocのみ)はスキップ; `Request Review`パスなら `h4_S_E_0005` エラー; それ以外は workflow_role=="Reviewer" ならスキップ、他は `h4_S_E_0017` エラー。related_id がある行は Identity を get、`is_alias=="1"`(エイリアスIdentity)のみ対象として Alias→User を取得し、役割 `Creater`/`Reviewer`/`Approver` ごとに `createrList`/`reviewerList`/`approverList` に email を追加、`isExist_*` を true、email 空なら `noMailUser`(ReqDocのCreater/Approverは Yryr用 `noMailUserForYryrReview` にも追加)に keyed_name を追加。
  7. 役割充足チェック: (ReqDocかつ`isYryrReviewType`)→Creater&Approverが必要で、無ければ `h4_S_E_0014`; `Request Review`パス→Creater&Reviewer&Approver必要で、無ければ `h4_S_E_0004`; それ以外→Creater&Approver必要で、無ければ `h4_S_E_0014`。
  8. メール未設定ユーザー: Yryr系は `noMailUserForYryrReview`(重複排除)で `h4_S_E_0015`、それ以外は `noMailUser` で `h4_S_E_0013`(メッセージに `<br>`区切りのユーザー名)。
  9. `ItemType`(id=source_type)の label を取得。
  10. pathName=="Reject" の場合: 承認対象の `h4_event,h4_model_code,h4_my,h4_destination,h4_model_name,managed_by_id,h4_evaluation_unit,h4_unique_event` をコピーした `h4_PointOut` を add(`h4_indication_date`=現在日時, `h4_pointer`=実行ユーザID, `h4_newest_pointout`=自ID, `h4_points_to_note`=コメント)。対象別の紐づきプロパティと番号: MQPage→`h4_rel_mq`,`MQ_nnn`(D3); ReqDoc→`h4_rel_reqdoc`,`DOC_nnn`; Test_Result→`h4_rel_testrsult`,`RZ_nnn`; ApprovalWFGroup→`h4_rel_approvalwfgroup`,`AP_nnn`。対応するリレーション(`h4_MQPage PointOut`/`h4_ReqDoc PointOut`/`h4_Test_Result_PointOut`/`h4_ApprovalWFGroup PointOut`)を add。ReqDocの場合は親マルQ(`h4_pare_mq`)の `h4_MQPage PointOut` にも追加(こちらはエラー判定なし)。ItemType ID: MQPage=EC17A836…, ReqDoc=D014A8C89FAF461FB45AC076BEE4B2E4, Test_Result=984B394A…, ApprovalWFGroup=DD0E19C0….
  11. メール本文作成: `EMail Message`(name): 既定 `h4_WFMail`、Reject→`h4_WFMailReject`、Approve→`h4_WFMailApprove`、`YryrReview`→`h4_WFYryrReview`、`YryrApprove`/`YryrReject`→`h4_WFYryrApproveResult`(仮承認は承認依頼と共通で `h4_WFMail`)。置換: `{ItemName}`(Reject時=ItemTypeラベル、ただしApprovalWFGroupの否認は「承認対象アイテム」、他=「VOTE実行者：<ユーザー名(cmn_name)><br>」+ラベル)、`{Request}`(pathLabelから「仮」「依頼」を除去; Yryr系はpathLabelそのまま)、`{KeyName}`(VOTE実行者+keyed_name)、`{ItemURL}`(`<scheme>://<host><PathBase からServer文字を除去>?StartItem=<ItemType>%3A<ID>`)、`{UserComment}`。件名の `{Path}`=pathLabel、`{KeyName}`=keyed_name+「【マルQ】」。送信元は `from_user` の email。上記を `RequestState` に格納。
- 呼出す他Method: なし(メール送信は別Method `h4_sendMail` に委譲 — コメント記載)。
- 注意点: 遷移先は pathName と最新Activityから推定。`closed_on` が全て空なら `tempSourceAssignment` が null になるリスクあり(コード上)。ReqDocPointOuts は `getRelatedItem()!=null` の場合のみ対象だが MQPage の場合は条件なし。

## [128] h4_getWFComment_DAT
- 言語: C# / comments: 帳票マスタ、開達書式のWF遷移時のコメント取得メソッド
- 概要: [127]の帳票マスタ系版(コード冒頭コメント「実装内容等もほぼ同じ」)。対象は h4_DATMaster / h4_DATFormat / h4_AppWFGroupForDATFormat。メール送信は `h4_sendMail_DAT`(コード内コメント)が `RequestState` を使用。
- 処理フロー(差分中心):
  1. Activity Assignment(select comments,closed_on,path,closed_by)取得→最新closeのpath決定。`pathName != "pullBack"` の場合のみ以降を実行([127]と同様にコメント整理、遷移先 `relatedActivity`/`pathLabel` を特定、`hard_float` のWorkflowから `source_id`/`source_type`)。担当者一覧のrelated_idが空なら無条件で `h4_S_E_0005`。
  2. source_type別:
     - `95C9A38FE49C46B5A5656226665D2EBC` = h4_DATMaster: select keyed_name。`h4_DATMaster CLN` の役割 `Creater`→createrList, `ReleaseApprover`→releaseApproverList, `Approver`→approverList。
     - `A13E2920E0A2442286CFA172EE076880` = h4_DATFormat: select keyed_name,h4_category。`h4_category=="EXPTest"` なら `expFlag=true` で `h4_DATFormat EXPCLN` を使用し、役割 `InspEXPStaff`→EXPTestCreaterList, `InspEXPApprover`→EXPTestApproverList, `Q1Staff`→Q1CreaterList, `Q1Approver`→Q1ApproverList, `ReleaseApprover`→releaseApproverList_EXP。それ以外は `h4_DATFormat CLN`(Creater/ReleaseApprover/Approver)。
     - `018E955AA0DC4FAFBDE9BDC651E3188A` = h4_AppWFGroupForDATFormat: select(`keyed_name,h4_isexp,h4_delta_version,h4_destination,h4_event,h4_my,h4_evaluation_unit,h4_unique_event,h4_model_name,managed_by_id`)。`h4_isexp=="1"` なら `h4_AppWFGrForDATFormat EXPCLN`(役割は上記EXP系)、それ以外は `h4_AppWFGrForDATFormat CLN`。さらに `h4_AppWFGr4DATFormat PointOut` の最大 `h4_point_number`(先頭4文字「APD_」除去)+1 を算出。
  3. 担当者のうち is_alias=="1" のみ対象、メール未設定は `noMailUser` に集め、1件でもあれば `h4_S_E_0013`。
  4. 否認時指摘: sourceTypeがAppWFGroupForDATFormat かつ pathName が "Reject"/"reject" の場合のみ `h4_PointOut` を add(`h4_event,h4_my,h4_destination,h4_delta_version,h4_model_name,managed_by_id,h4_evaluation_unit,h4_unique_event`, `h4_indication_date`, `h4_pointer`=実行ユーザ, `h4_newest_pointout`=自ID, `h4_rel_appwfgroupfordatformat`, `h4_point_number`="APD_"+D3, `h4_points_to_note`=コメント)。`h4_AppWFGr4DATFormat PointOut` リレーションを add。
  5. メール: `EMail Message` 名 既定 `h4_WFMail`、Reject/reject→`h4_WFMailReject`、Approve→`h4_WFMailApprove`。置換 `{ItemName}`(AppWFGroupの否認は「承認対象アイテム」、他はItemTypeラベル)、`{Request}`、`{KeyName}`、`{ItemURL}`、`{UserComment}`、件名 `{Path}`/`{KeyName}`。
  6. `RequestState` に `expFlag, Subject, Body, fromAddress, createrList, releaseApproverList, approverList, EXPTestCreaterList, EXPTestApproverList, Q1CreaterList, Q1ApproverList, releaseApproverList_EXP, nextActivity, targetItemId` を格納。
- 注意点: 役割充足チェック(`isExist_*`)は計算するが [128] では使用していない(エラー判定コードなし)。ccList・VOTE実行者の処理は無い([127]との差)。`pathName=="pullBack_RA_IP"` は除外対象になっていない。


