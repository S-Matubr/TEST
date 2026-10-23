<!-- meta
legacy: knowledge/_legacy/機能設計書.md L4899-L5009
source: source/package/Independent/Import/Method/
-->
# B_method1b: Method AML 調査 (No.11〜34)

## 11. h4_Call_EventUp_MQPage
- 言語: C# / id BD632EB8EB8246A6AB22784E61BDC9B9 / comments: 「マルQページのイベントアップ」。Administrators権限で実行(GrantIdentity)。
- 概要: 選択したマルQページを新イベントへイベントアップ(複製して新イベント化)。h4_Call_Copy_MQPage とほぼ同構造(複製+必要資料再作成)。
- 呼び出し契機(推測/コメント記載): コメントに「h4_MQPage_ivicb_event_upから呼び出される」。
- 入力(this): ItemId, NewEvent, Group, Section。(OldEventVal/OldDelta はコメントアウト)。出力: 新 h4_MQPage Item / エラー時 newError(e.Message)。
- フロー:
  1. `CopyMQPage`: 元h4_MQPageのプロパティ(h4_approve_style, h4_class, h4_delta_version, h4_dept, h4_destination, h4_developmentbase, h4_equipment, h4_event, h4_group, h4_model_code, h4_model_name, h4_my, h4_pre_event, h4_section, h4_src_mq_master, h4_unique_event, h4_variations, managed_by_id, h4_evaluation_unit)を引継ぎ、h4_directaplist=InProgress で新規add。`h4_MQPage ReqDoc`/`h4_MQPage PointOut` の related(h4_ReqDoc/h4_PointOut)を `clone(true)`(必要資料は `h4_ReqDoc FormatN` を fetch して)しリレーション作成。reqDocIDMap(クローンID→元ID)記録。
  2. ソースマルQマスタ(h4_src_mq_master)の `h4_DMQMaster DATFormat`→h4_DATFormat→`h4_DATFormat Doc`→Document.file_item から datNames/formatFileIds を収集(最新書式ファイル)。
  3. 新ページの `h4_MQPage PointOut`: related の h4_checked=="1" のリレーション削除。`h4_MQPage ReqDoc`: 各必要資料を再作成(複製元の各プロパティ+h4_event=NewEvent, h4_group/h4_section=入力値, h4_approve_style, h4_directaplist=InProgress, h4_pare_mq 等。h4_evaluation_unit も引継ぎ)、リレーション作成後、`h4_ReqDoc PointOut`/`h4_ReqDoc TestResult` を全削除、名称がdatNamesに一致する場合 `h4_ReqDoc FormatN` を全削除→最新書式ファイルでmerge、元必要資料の `h4_ReqDoc Doc` を新必要資料へコピー、旧クローンのリレーション(`h4_MQPage ReqDoc`)をdelete。
  4. 新ページを edit: h4_event=NewEvent, h4_group, h4_section, h4_directaplist=InProgress, **h4_pre_event=元ページID(strItemId)**。再取得し `h4_MQPage PointOut`/`h4_MQPage ReqDoc` の related が h4_checked=="1" のものを削除。
- 他Method: なし。
- 注意: Copy_MQPage と異なり yryr(やるやら)の再判定やダイアログ入力値の全上書きは無く、Eventは NewEvent のみ。エラー判定は Copy より少ない(delete等の結果未確認)。reqDocIDMapに無いと h4_S_E_0002 メッセージで例外。

## 12〜17. h4_Call_Promote_* (WF親LC遷移時に子アイテムのLCを遷移させるCall群)
共通: C#。`this`=WF対象アイテムID。`Method h4_Promote_WFGroup_ApTarget` を `destination`(遷移先ステート名ハードコード) と `sourceId`(this.getID())で呼ぶ。コメントはいずれも「〜にWFの親LC遷移時に子アイテムのLCを遷移するメソッドを呼び出す」。呼び出し契機(推測): 承認WFグループ(h4_ApprovalWFGroup)のライフサイクルの各ステート遷移後/遷移時メソッド。戻り値 this。

| No. | Method名 | id | destination | 備考 |
|---|---|---|---|---|
| 12 | h4_Call_Promote_Approved | 628FBD8496B54278ADF343B87A852E5D | Approved | 呼出結果エラーなら newError(callMethod.getErrorString())。続けて `h4_Set_ApprovalInfo_For_ApWFG`(property id=this)を呼出し(承認者と承認日時の記載)、エラーなら newError |
| 13 | h4_Call_Promote_InProgress | 55AD6EA9C2D5419BB06CAC696360A5B0 | InProgress | 結果エラー未判定 |
| 14 | h4_Call_Promote_InReview | F36284DDF91D48AFA305A6A41FFE5105 | InReview | 同上 |
| 15 | h4_Call_Promote_ProvApproved | 0E284409307E4CD7B50709A6B05C9CA4 | ProvisionalApproved | 同上 |
| 16 | h4_Call_Promote_ReqProvApproval | E48C7DE7D6B244E19E47BD232A5A2499 | RequestProvisionalApproval | 同上 |
| 17 | h4_Call_Promote_RequestApproval | 17CF62BC9C714D9AB361292EFDF2F34B | RequestApproval | 同上 |
- 他Method呼出: h4_Promote_WFGroup_ApTarget(全て)、h4_Set_ApprovalInfo_For_ApWFG(12のみ)。
- 注意: 12のみエラー伝播あり。13〜17は apply結果を捨てる。

## 18. h4_CallCanReqSubstitute_cmn
- 言語: JavaScript / id 5AAD8CE0D1244C08A1F06D5C81BAFBEF / comments なし
- 概要: 「担当者一覧(CLN)の選択行について、ログインユーザーが代理承認依頼を実行可能か」を共通Method h0_canReqSubstituteApprover で判定し true/false を返す(マルQページ/テスト結果/必要資料/一括承認(h4_ApprovalWFGroup)用)。
- 呼び出し契機(推測): 担当者一覧タブのコンテキストメニュー/ボタンの可否(canExecute)判定。
- 入力: thisItem(クライアント)、選択行(`window.relationshipsControl.currTabID` のグリッド `getSelectedId()`。h4_ReqDoc は3段アコーディオンのため担当者一覧タブのrelationshipsId `38D46A5E9E14422CA9CC947389EAE30C` を固定指定)。出力: true/false。
- フロー: リレーション名辞書 h4_MQPage→`h4_MQPage CLN`、h4_Test_Result→`h4_Test_Result CLN`、h4_ReqDoc→`h4_ReqDoc CLN`、h4_ApprovalWFGroup→`h4_ApprovalWFGroup CLN`。roleActivityMap={Creater:InProgress, Reviewer:InReview, Approver: state=="ProvisionalApproved"なら"ProvisionalApproved"、他は"RequestApproval"}。param(itemTypeName,itemId,itemState,approverListName,approverListSelectedId,approverListRolePropertyName='h4_workflow_role',isEditMode=parent.isEditMode,userId,roleActivityMap(JSON))をXML文字列化して `inn.applyMethod("h0_canReqSubstituteApprover", body)`。エラーなら false。
- 他Method: h0_canReqSubstituteApprover。
- 注意: 取得で例外時 false。alertはコメントアウト(編集時にアイデンティティ置換できなくなるため)。

## 19. h4_CallCanReqSubstitute_DAT
- 言語: JavaScript / id A0F6DAEFD3894787ABD91C8F45F882F9 / comments: 「帳票マスタ、開達書式、開達書式一括承認の代理承認」
- 概要: 18のDAT(開達書式系)版。workflowtype を決めて担当者一覧名とロール→アクティビティMapを切替え、h0_canReqSubstituteApprover で判定。
- フロー: workflowtype: h4_DATMaster→"h4_DATMaster"; h4_DATFormat は h4_category=="EXPTest" なら "h4_DATFormatEXP"、他 "h4_DATFormat"; それ以外(一括承認)は h4_isexp=="1" なら "h4_AppWFGrForDATFormatEXP"、他 "h4_AppWFGrForDATFormat"。辞書: h4_DATMaster→`h4_DATMaster CLN`、h4_DATFormat→`h4_DATFormat CLN`、h4_DATFormatEXP→`h4_DATFormat EXPCLN`、h4_AppWFGrForDATFormat→`h4_AppWFGrForDATFormat CLN`、h4_AppWFGrForDATFormatEXP→`h4_AppWFGrForDATFormat EXPCLN`。roleActivityMap(通常)={Creater:InProgress, Approver:RequestApproval, ReleaseApprover:ReleaseApproved}、EXP={InspEXPStaff:InProgress, InspEXPApprover:ReqApproval_InspEXP, Q1Staff:ReqApproval_Q1Stf, Q1Approver:ReqApproval_Q1Appr, ReleaseApprover:ReleaseApproved}。パラメータ構成・呼出は18と同じ。
- 注意: 辞書キーは workflowtype だが param.itemTypeName は元の itemtype。

## 20. h4_CallChangeYryrForWF
- 言語: C# / id 72BD07E3AC064A9BB3E60F057140DCAA / comments: 「やるやらを〇から×に変更する」
- 概要: 必要資料のやるやら承認依頼→作業中へのパス(承認遷移)時に、h4_yryr を "1"(〇)から "0"(×)へ変更する。
- 呼び出し契機: コード内コメント「必要資料がやるやら承認依頼から作業中へパスが承認遷移した際、呼ばれる」(WFのパス後メソッド、this=WF Process)。
- フロー: Administrators権限。`h4_GetControlledItem`(ID=this)でWF対象アイテムを取得(エラーはnewError)。対象型が h4_ReqDoc 以外ならreturn this。`h4_ChangeYryr` を `<item_id>..</item_id><afterYryr>0</afterYryr>` で呼出、エラーなら newError。
- 他Method: h4_GetControlledItem, h4_ChangeYryr。

## 21. h4_CallOpenReqSubstitute_cmn
- 言語: JavaScript / id C4FE2177C8C640C8AB48A8096A21AB9F / comments なし
- 概要: 代理承認者(担当者一覧の選択行)を選択するダイアログを共通Method h0_openReqSubstituteApprover 経由で開く(マルQページ/テスト結果/必要資料/一括承認)。
- 呼び出し契機(推測): 担当者一覧タブの「代理承認依頼」メニュー/ボタン(18と対)。
- フロー: 選択行ID取得は18と同じ(必要資料は固定relationshipsId `38D46A5E...`)。取得失敗時 alert("Failed to get selected rows.")して終了。roleActivityMap・リレーション辞書・param も18と同一。param.callback(substituteApproverId) は現状 空文字を返すだけ(独自処理の追加余地コメントのみ)。`aras.evalMethod("h0_openReqSubstituteApprover", body, param)`。
- 他Method: h0_openReqSubstituteApprover。

## 22. h4_CallOpenReqSubstitute_DAT
- 言語: JavaScript / id 208D7D28F89B4F56BF5647062664C02E / comments なし
- 概要: 21のDAT版。19と同じ workflowtype 判定・辞書・roleActivityMap(通常/EXP)を使い、h0_openReqSubstituteApprover をダイアログ起動。選択行取得失敗時 alert。callbackは21と同じ(空)。
- 他Method: h0_openReqSubstituteApprover。

## 23〜29. h4_CallProm*4ApWfGr4DAT (開達実施要領一括承認のLC用Call群)
共通: C#。コメント「開達実施要領一括承認のLC用」。`Method h4_PromoteDATFormatOfAppWFGr` に `destination`(NextState) と `sourceId`(this.getID()) を渡して apply(戻り値のエラー判定なし)、return this。呼び出し契機(推測): 開達書式一括承認(h4_AppWFGroupForDATFormat)LC各ステートの遷移時メソッド。

| No. | Method名 | id | NextState | 日本語 |
|---|---|---|---|---|
| 23 | h4_CallPromInPro4ApWfGr4DAT | 3A42CC63609F44CD88875386A8E53DE4 | InProgress | 作業中 |
| 24 | h4_CallPromInspEXP4ApWfGr4DAT | 24559711984F491F8B825F0509622DB2 | ReqApproval_InspEXP | 承認依頼(EXP検定) |
| 25 | h4_CallPromQ1Appr4ApWfGr4DAT | BCB0F51A1A54442F80B1D335C89B0B34 | ReqApproval_Q1Appr | 承認依頼(品質一課承認者) |
| 26 | h4_CallPromQ1Stf4ApWfGr4DAT | 7DA89D0688474D418C14FAA35D19690B | ReqApproval_Q1Stf | 承認依頼(品質一課担当者) |
| 27 | h4_CallPromRelApp4ApWfGr4DAT | 0DEAA3E9DF184B4DBCF680BB066B00B7 | ReleaseApproved | 公開承認 |
| 28 | h4_CallPromRelease4ApWfGr4DAT | CE0A279562564170B8C6279446204243 | Release | 公開 |
| 29 | h4_CallPromReqApp4ApWfGr4DAT | 6CADDDF73CC54921925C85DEBD6F8B97 | RequestApproval | 承認依頼 |
- 他Method呼出: h4_PromoteDATFormatOfAppWFGr。参考記載: h4_Call_Promote_InReview。

## 30. h4_callPullBack
- 言語: JavaScript / id 3D1A0F98B64A4C61A7D586B4D10C1641 / comments: 「ワークフローの引き戻しメソッドを呼ぶ」
- 概要: ワークフローの引き戻し(Pull Back)を実行するクライアントメソッド。結果メッセージ表示、サインオフ履歴更新、画面リフレッシュ。
- 呼び出し契機(推測): フォーム/ツールバーの「引き戻し」ボタン(クライアントイベント)。
- 入力: `parent.item`(id, typeId, type属性)。出力: resultItem。
- フロー: 対象型が h4_DATMaster / h4_DATFormat / h4_AppWFGroupForDATFormat 以外 → `Method h4_PullBack`、該当なら `Method h4_PullBack_DAT` を id/type(typeId)/typeName(type名)で呼出。typeId から approveItemType を設定(EC17A836...=h4_MQPage, DD0E19C0...=h4_ApprovalWFGroup, 984B394A...=h4_Test_Result, その他=h4_ReqDoc)(ただし直後に `var approveItemType = ""` で再宣言され実質未使用)。エラー時 getErrorString で分岐: "userError"→UserMessage `h4_S_E_0803`、"stateError"→`h4_S_E_0802`、他→`h4_S_E_0002` を AlertError。成功時 `h4_C_I_0801` を AlertSuccess、`Core_loadProcessReport()`(Workflow Process History レポートを `result_iframe_frame` に描画しサインオフタブ更新)、`aras.getMostTopWindowWithAras(window).onRefresh()`。最後にも onRefresh を呼び resultItem を返す。
- 他Method: h4_PullBack, h4_PullBack_DAT。
- 注意: `debugger;` 残存。approveItemType の宣言順序が不適切(巻き上げでundefined→再代入)。

## 31. h4_CallSetReqDocRejecter_AppWFGr
- 言語: C# / id 8369B5C4A2114B148A1FFF94BB03CFD5 / comments なし(コード冒頭「一括承認用」)
- 概要: 一括承認WFで却下(Reject)された際、承認対象のうちマルQページに対して必要資料の却下者設定Method(h4_MQPReject_SetReqDocRejecter)を呼ぶ。
- 呼び出し契機(推測): 一括承認WF(h4_ApprovalWFGroup)の却下パスのメソッド。this=WF Process。
- フロー: `h4_GetControlledItem`(this)でWF対象(h4_ApprovalWFGroup)取得 → `h4_ApprovalWFGroup_ApTarget`(source_id=対象)の related(ポリモーフィック)を走査 → 各 typeId(itemtype)+ID で実アイテム取得(エラーは h4_S_E_0002、件数≠1はスキップ) → 型が h4_MQPage の場合のみ `h4_MQPReject_SetReqDocRejecter`(type,id) を呼出(エラーは h4_S_E_0002)。必要資料等は何もしない。
- 他Method: h4_GetControlledItem, h4_MQPReject_SetReqDocRejecter。注意: targetIds リストは作成のみで未使用。

## 32. h4_CallSetReqDocRejecter_MQPage
- 言語: C# / id 862445233AAD47378981266AA38F4DA5 / comments なし(冒頭「マルQページ単独WF用」)
- 概要: 31の単独WF版。WF対象が h4_MQPage のときのみ `h4_MQPReject_SetReqDocRejecter`(type=h4_MQPage, id)を呼ぶ。
- フロー: h4_GetControlledItem(this) → 型が h4_MQPage 以外ならreturn this → 呼出しエラー時 h4_S_E_0002。
- 他Method: h4_GetControlledItem, h4_MQPReject_SetReqDocRejecter。

## 33. h4_CancelChangeYryrForWF
- 言語: C# / id 65DB3F0564D9447BAEB8CA827423DEDE / comments: 「WFでのやるやら承認の否認時のキャンセル動作」
- 概要: やるやら変更承認が否認/キャンセルされたとき、やるやら理由(h4_yryr_reason)を空にする(やるやら値自体は変更しない。変更する場合は承認時に変更)。
- 呼び出し契機(推測): やるやら承認依頼→作業中のパス(否認側)のメソッド。this=WF Process。
- フロー: Administrators権限。h4_GetControlledItem で対象取得、h4_ReqDoc 以外はreturn。`h4_ReqDoc` edit(version="0", serverEvents="0", h4_yryr_reason="")。エラー時 h4_S_E_0002。
- 他Method: h4_GetControlledItem。

## 34. h4_CancelRevisioDialig
- 言語: JavaScript / id D66B73DA350A4961BF9BE9196671245D / comments: 「改訂ダイアログをキャンセルで閉じる」
- 概要: 改訂ダイアログのキャンセルボタン処理。`parent.dialogArguments.dialog.close()` でダイアログを閉じる。入出力なし(return)。


