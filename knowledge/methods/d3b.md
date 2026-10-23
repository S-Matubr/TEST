<!-- meta
legacy: knowledge/_legacy/機能設計書.md L6303-L6458
source: source/package/Independent/Import/Method/
-->
# D_method3b: Method AML 解析 (No.209〜229)

凡例: 呼び出し契機は全て「推測」。execution_allowed_to は特記なき限り World(A73B655731924CD0B027E4F4D5FCC0A9)。

---
## 209. h4_sendMail
- ID: 69D2516F2B8A4B038A4AD6678CB617FD / C#
- 概要: WFメール送信メソッド。宛先・件名・本文は別Method(コメントより h4_GetWFComment)が RequestState に格納した値を使って送信する。
- 契機(推測): WFアクティビティの遷移時に呼ぶサーバーメソッド(手動遷移のみ送信)。
- 入力(RequestState): targetItemId, oldTargetItemId, h4_isYryrReviewType(bool), fromAddress, createrList, reviewerList, approverList, ccList(各 List<string> メールアドレス), nextActivity, Subject, Body。出力: this。失敗時 h4_S_E_0012。
- 処理フロー:
  1. RequestState["targetItemId"] が取れなければ(アイテム作成直後のWF開始)スキップ。
  2. oldTargetItemId と同じなら「h4_getWFCommentを通っていない」とみなしスキップ。取得できなければ手動遷移として続行。実行後 oldTargetItemId=targetItemId を保存。
  3. nextActivity別の宛先:
     - InProgress: 通常=TO担当者、CC=担当者+ccList。やるやらモード(h4_isYryrReviewType)=TO担当者、CC承認者。
     - InReview: TO確認者、CC担当者+ccList。
     - Approved: TO担当者+確認者+承認者(全員)。
     - YryrRequestApproval: TO承認者、CC担当者。
     - その他(承認依頼等): TO承認者、CC担当者+ccList。
  4. `CCO.Email.SetupSmtpMailServerAndSend(email)`(IsBodyHtml=true)。
- 呼出Method: なし(h4_getWFComment が事前に RequestState を設定する前提)。
- 注意: `(bool)RequestState["h4_isYryrReviewType"]` がnullだとキャスト例外→h4_S_E_0012。

## 210. h4_sendMail_DAT
- ID: E750715FF11047838D30102E69D5FD01 / C#
- 概要: 帳票マスタ・開達書式用のWFメール送信。コメントより h4_GetWFComment_DAT が RequestState を設定。
- 入力(RequestState): targetItemId, oldTargetItemId, expFlag, fromAddress, Subject, Body, createrList, releaseApproverList, approverList, EXPTestCreaterList, EXPTestApproverList, Q1CreaterList, Q1ApproverList, releaseApproverList_EXP, nextActivity。スキップ判定は209と同じ。失敗時 h4_S_E_0012。
- 宛先表(nextActivity × expFlag):

| nextActivity | EXP | TO | CC |
|---|---|---|---|
| InProgress | 非EXP | 担当者 | 公開承認者+承認者 |
| RequestApproval | 非EXP | 承認者 | 公開承認者+担当者 |
| ReleaseApproved | 非EXP | 公開承認者 | 承認者+担当者 |
| Release | 非EXP | 担当者+公開承認者+承認者 | なし |
| InProgress | EXP | EXP検定担当者 | EXP検定承認者+品質一課担当者+品質一課承認者+公開承認者(EXP) |
| ReqApproval_InspEXP | EXP | EXP検定承認者 | EXP検定担当者 |
| ReqApproval_Q1Stf | EXP | 品質一課担当者 | EXP検定承認者+EXP検定担当者 |
| ReqApproval_Q1Appr | EXP | 品質一課承認者 | 品質一課担当者+EXP検定承認者+EXP検定担当者 |
| ReleaseApproved | EXP | 公開承認者(EXP) | 品質一課承認者 |
| Release | EXP | EXP検定担当者+EXP検定承認者+品質一課担当者+品質一課承認者+公開承認者(EXP) | なし |
- 上記以外の組合せは宛先なしで SetupSmtpMailServerAndSend を呼ぶ(コード上、宛先なし分岐の除外処理なし)。

## 211. h4_Set_ApprovalInfo_For_ApWFG
- ID: 62D3765BE7BA4B08B80DFC78D9DD45DF / C#
- 概要: 一括承認(h4_ApprovalWFGroup)の承認時に承認者(h4_approver)と承認日(h4_approval_date)を入力。WFの "Approved" アクティビティの最終更新者と更新日時を採用。
- 入力: `id`(一括承認ID)。出力: this/h4_S_E_0002。
- 処理: Administrators権限。"Workflow"(source_id=id)→related_id(WF Process)→"Workflow Process Activity"→各Activity(select name,modified_by_id,modified_on)。name=="Approved" を見つけたら h4_ApprovalWFGroup を edit(version=0, serverEvents=0)で `h4_approver`=modified_by_id, `h4_approval_date`=modified_on をセット。見つからなければ h4_S_E_0002。
- 注意: `activity.getItemByIndex(i)` とループ添字iを使っている(Activity取得は単一件のため i>0 だと不整合の可能性。コード上の事実のみ記載)。edit結果のエラー判定なし。`DATEFOMAT` 未使用。

## 212. h4_Set_ApprovalInfo_On_Approve
- ID: 2BA6B715AD7E4D10BB3DDA3215F9AEA4 / C#
- 概要: 承認時の承認者・承認日時書込み(マルQページ、必要資料、テスト結果対応)。Call用(承認時に実施)。
- 入力: `type`(h4_MQPage/h4_ReqDoc/h4_Test_Result), `id`, `h4_approve_style`(isUseWF), `sourceID`(必要資料/テスト結果の親ID)。出力: this/h4_S_E_0002。
- 処理フロー(Administrators権限):
  1. type が h4_ReqDoc または h4_Test_Result の場合、親(ReqDoc→h4_MQPage、Test_Result→h4_ReqDoc)を sourceID で取得し h4_approver があれば、親の h4_approver/h4_approval_date を自アイテムに edit(version=0,serverEvents=0)でコピーして終了(親承認に伴う承認)。
  2. h4_approve_style=="0"(ダイレクト承認): h4_approver=ログインユーザーID、h4_approval_date=現在時刻(`yyyy-MM-ddTHH:mm:ss`)。
  3. それ以外(WF): "h4_ApprovalWFGroup_ApTarget"(related_id=id)があれば source_id(一括承認ID)をWF取得対象に、なければ自身のID。"Workflow"→"Workflow Process Activity"→Activity(name,modified_by_id,modified_on)を調べ name=="Approved" のアクティビティの modified_by_id/modified_on を h4_approver/h4_approval_date に edit。見つからなければ h4_S_E_0002。
- 注意: コメントに「一括承認の場合、一括承認側で承認者・承認日を入れる」とあるがコードは一括承認アイテム側のWFを参照して取得。Activity取得で `getItemByIndex(i)` とループ添字を使用。

## 213. h4_set_my
- ID: 13E172554CEB467F9A5826D3986461E5 / JavaScript
- 概要: マルQページの機種呼称(h4_model_name)に設定した Project アイテム(HRDPMTypModelProject)が持つMY(iq_model_year)を h4_my にセット。
- 処理: `aras.getItemById("h4_MQPage", itemId)`→h4_model_name→HRDPMTypModelProject を id で get(select=iq_model_year)→`aras.setItemProperty(maruQPage,"h4_my",値)`。
- 契機(推測): マルQページフォームの機種呼称フィールド onChange 等。`itemId` はフォーム/クライアント側コンテキスト変数。

## 214. h4_set_owner_for_ApprovalWFGroup
- ID: 2E2E7C801D654B539BD3FB3D735B0BC4 / C#
- 概要: 一括承認アイテム保存前(beforeAdd/beforeUpdate)に、承認対象の managed_by_id/owned_by_id を自身にも割り当てる。
- 処理: `h4_ApprovalWFGroup_ApTarget` リレーションの先頭(index 0)の related_id を取得(ループは回るが毎回 index 0 を参照)。リレーション0件・related_id なしなら何もせず this。`h4_ApprovalTarget` を get し、`owned_by_id` に **対象の managed_by_id**、`managed_by_id` に **対象の owned_by_id** をセット。
- 注意: 変数名 targetOwner=managed_by_id、targetManeger=owned_by_id となっており、owned/managed が入れ替わって設定されるコード(意図かバグかはコードからは不明)。

## 215. h4_SetApprovalGroupProperty
- ID: E997B02F60BC4266B43D67F3905EEC4B / C#
- 概要: 承認対象のリレーション追加時に、配下アイテムの `h4_approval_group_item` に一括承認アイテムID(source_id)を記録。親: 一括承認/開達実施要領一括承認、子: マルQページ/必要資料/開達書式。
- 契機(推測): リレーションItemTypeの onAfterAdd(this=リレーション)。
- 処理: this.getType() が "h4_AppWFGr4DATFormat DATFormat" → 子型 h4_DATFormat。"h4_ApprovalWFGroup_ApTarget" → `h4_ApprovalTarget`(ポリアイテム)を related_id で取得し実際の型を getType() で判別。子型を edit(doGetItem=0, version=0, serverEvents=0)し `h4_approval_group_item`=source_id。エラー時 h4_S_E_0002。
- 注意: 削除時のクリアはこのMethodには無い(UnSet は別Method h4_UnSetApprovalGroupProperty と推測。名称からの推測)。

## 216. h4_setCheckBoxInit
- ID: 6DB8AB8C6F9747B987C81DDBD49D40FD / JavaScript
- 概要: 開発拠点・仕向設定ダイアログ(フォーム h4_Input_CheckBoxes_Value)の初期化。参考 h4_setEventInit。
- 処理: List `h4_DevelopmentBase` と `h4_destination` の Value(label,value)を取得し、ラベルのチェックボックスを8個/行で `checkBoxes1`(見出し「開発拠点」)・`checkBoxes2`(見出し「仕向設定」)内に生成。リスト取得エラー時 UserMessage h4_C_E_0002 を AlertError。
- 注意: 仕向けリスト取得エラー時の Alert は ret1.val1 を表示している(ret2.val1 ではない)。選択済み値の初期チェックは行わない。

## 217. h4_setCheckInit
- ID: 3996286075CE47D5BFC63C93C0D10B64 / JavaScript
- 概要: Listの複数選択ダイアログ(フォーム h4_Input_Check_Value)初期化。
- 処理: `parent.frameElement.dialogArguments.targetListName` の List の Value ラベルを `checkBoxField` 要素へ8個/行でチェックボックス化。エラー時 h4_C_E_0002。選択済み反映なし。

## 218. h4_SetCompletedByForAdd
- ID: 627DF0C196F24039A62F2666ADE6301D / C#
- 概要: 追加時(onBeforeAdd想定)、`h4_checked`=="1"(完了)なら `h4_completed_by` にログインユーザーIDをセット。

## 219. h4_SetCompletedByForUpdate
- ID: 2A9658D8C798457FBB99BA14DB8DAAD1 / C#
- 概要: 更新時(onBeforeUpdate想定)。DBの更新前 h4_checked/h4_completed_by を取得し、更新前が「完了」で今回未完了なら h4_completed_by が入っていれば null に。更新前が未完了で今回「完了」かつ h4_completed_by が空ならログインユーザーIDを設定。取得失敗 h4_S_E_0002。

## 220. h4_setDefaultChargeList
- ID: C75080769FFD49279E8546A719AEDB13 / JavaScript
- 概要: アイテム新規作成時に担当一覧のデフォルト行を設定(h2_setDefaultChargeList 参考、[ShareHouse])。対象 h4_Test_Result("h4_Test_Result CLN")、h4_ReqDoc("h4_ReqDoc CLN")。
- 契機(推測): クライアント側 onAfterNew。
- 処理: `parent.thisItem.h4_approve_style !== "1"`(ワークフロー無し)なら終了。担当一覧3行を追加:
  1行目 Creater(h4_check_required=1, sort_order=32, 関連Identity=ログインユーザーのkeyedNameと同名の Identity)、2行目 Reviewer(sort_order=64, related_id is_null)、3行目 Approver(sort_order=96, related_id is_null)。エラー時 h4_C_E_0002。

## 221. h4_setDefaultChargeListForDAT
- ID: 425C5DFC2CB04D22AC4DC4DAB1910C88 / JavaScript
- 概要: 帳票マスタ(h4_DATMaster CLN)・開達書式(h4_DATFormat CLN)のデフォルト担当一覧。
- 処理: Creater(32,ログインユーザーIdentity), Approver(64), ReleaseApprover(96)(h4_check_required=1、related_id is_null)。h4_DATFormat の場合 "h4_DATFormat EXPCLN" に InspEXPStaff(32,ログインユーザー), InspEXPApprover(64), Q1Staff(96), Q1Approver(128), ReleaseApprover(160)も追加。
- 注意: `debugger;` 残存。h4_approve_style の判定なし。

## 222. h4_setDefaultCLNItem
- ID: 0DB4FB420E904B1C94CACC000416B371 / C#
- 概要: 引数で渡されたアイテムID群の担当者一覧にデフォルト値を設定(サーバー側)。
- 入力: `type`(h4_ApprovalWFGroup→"h4_ApprovalWFGroup CLN"/h4_MQPage→"h4_MQPage CLN"/h4_ReqDoc→"h4_ReqDoc CLN"), `idlist`(カンマ区切り)。出力: temp(OK=OK)/h4_S_E_0002。
- 処理: ログインユーザーの Alias(is_alias=1のIdentity)の related_id を取得。各IDについて edit(doGetItem=0,version=0,serverEvents=0)に3行 add(Creater sort32=ログインユーザー/Reviewer 64/Approver)を付けて AML を連結し一括 `applyAML`。
- 注意: Approver行の sort_order 設定が `relReviewer.setProperty("sort_order","96")` になっており、Reviewer行が96で上書き、Approver行はsort_order未設定(コード上のとおり)。applyAMLの結果エラー判定なし。契機(推測): 一括作成/コピー後などのクライアントJSからの呼出。

## 223. h4_setDefaultCLNItemForDAT
- ID: 83D7084127A943F48CAD8708919C5C84 / C#
- 概要: 帳票マスタ(h4_DATMaster CLN)・開達書式(h4_DATFormat CLN)・開達書式一括(h4_AppWFGroupForDATFormat→h4_AppWFGrForDATFormat CLN)の担当者一覧空行作成。
- 処理: 222と同様。行: Creater(32, ログインユーザー), Approver(64), ReleaseApprover(96指定が relReviewer へ → Approver側が96になる、ReleaseApprover行はsort_order未設定)。type が h4_DATFormat または h4_AppWFGroupForDATFormat の場合、EXP用リレーション("h4_DATFormat EXPCLN"/"h4_AppWFGrForDATFormat EXPCLN")に InspEXPStaff(32,ログインユーザー), InspEXPApprover(64), Q1Staff(96), Q1Approver(128), ReleaseApprover(160)を追加。h4_DATMaster はEXPなし。

## 224. h4_setDestinaionInit
- ID: 4A2ABC8B9FF542F3B519CD6185E77CCB / JavaScript / Administrators
- 概要: 仕向け設定ダイアログ(フォーム h4_DATFormat_Input_Init_DestVal)初期化。
- 処理: `dialogArguments.destinations` を split、List `h4_destination` の Value.value を8個/行のチェックボックスで `destinationField` に生成、選択済みはチェック。
- 注意: コメントは「イベント設定画面の初期化」(流用)。

## 225. h4_setDestination
- ID: 7591B8A162D3492B97A8117BCDEE3313 / JavaScript
- 概要: 帳票マスタ・開達書式の仕向設定ダイアログ表示。
- 処理: フォーム `h4_Input_Check_Value`(init=h4_setCheckInit相当)を `MaximazableDialog` で表示(title "仕向設定", targetListName="h4_destination", 850x300)。戻り値を `aras.setItemProperty(this.getItem(),"h4_destination",dlgRes)`。`debugger;` 残存。

## 226. h4_setDestinations
- ID: 5313717AF36C40308EC79B5DDA8F7AA4 / JavaScript / Administrators
- 概要: 仕向け設定ダイアログ表示(コード上のコメントは「マルQページのイベント設定ダイアログ」)。
- 処理: フォーム上の text input `h4_frm_Destination` の値を取得し、フォーム `h4_DATFormat_Input_Init_DestVal`(460x200, title "仕向け設定")を表示、戻り値で `h4_frm_Destination` の value を更新。初期化は h4_setDestinaionInit と推測。

## 227. h4_setDevBaseAndDestination
- ID: 515FAC0485B64976852B525519C5EB05 / JavaScript / Administrators
- 概要: 開発拠点・仕向け選択ダイアログ表示。
- 処理: フォーム `h4_Input_CheckBoxes_Value`(title "開発拠点・仕向設定", 850x300)を表示。戻り値 JSON(`strChecks1`,`strChecks2`)を `h4_developmentbase`, `h4_destination` にセット。初期化は h4_setCheckBoxInit(推測)。

## 228. h4_setEventInit
- ID: 7B99F30DC69A44479C2ABEC3A677C735 / JavaScript
- 概要: イベント設定ダイアログ(フォーム h4_DATFormat_Input_Init_EventVal)初期化。
- 処理: dialogArguments の deltaVer, events を取得。List `h4_events` の "Filter Value"(filter=deltaVer, inactive=0, select filter,label,sort_order,value,inactive)を取得。0件なら UserMessage h4_C_E_0410 を表示。label が「個別」のものは除外し、ラベルを8個/行チェックボックスで `eventField` に生成、選択済みをチェック。
- 注意: FilterValue非活性化対応(★■コメント)。

## 229. h4_setEvents
- ID: 321F4AE8D4714549B2E94B98BA4C2FAB / JavaScript
- 概要: 開達書式のイベント設定ボタン押下時処理(ダイアログ表示)。
- 処理: `thisItem.getParentItem().h4_delta_version` と自アイテムの `h4_event` を取得。フォーム `h4_DATFormat_Input_Init_EventVal`(title "イベント設定", 850x300, deltaVer, events)をダイアログ表示。戻り値を `h4_event` にセット。


