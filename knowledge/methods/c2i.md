<!-- meta
legacy: knowledge/_legacy/機能設計書.md L6068-L6101
source: source/package/Independent/Import/Method/
-->
# Method AML 調査 C_method2i (180〜182番目: h4_Pre_CallApproved_MQP_MQPRDN 〜 h4_Promote_By_List_MQPage ReqDoc)

分割ファイル一覧: C_method2a(92-106) / b(107-125) / c(126-128) / d(129-141) / e(142-156) / f(157-165) / g(166-171) / h(172-179) / i(180-182)。計91件。

---
## [180] h4_Pre_CallApproved_MQP_MQPRDN
- 言語: C# / comments: マルQページと必要資料のLCの承認時処理
- 概要: 承認時処理のまとめ(コード内コメント「承認時処理(Post)の実行処理のまとめ。マルQページ・必要資料・テスト結果共通」)。承認者・承認日時を記録し、親が承認された場合は配下を連動して承認する。
- 呼び出し契機(推測): `h4_MQPage` / `h4_ReqDoc` / `h4_Test_Result` のLCで承認(Approved)へ遷移する際のメソッド。名称は Pre だが冒頭コメントは Post と記載(コード上の不一致)。
- 入力: this = 対象アイテム。出力: this / エラー。`Administrators` 権限で実行。
- 処理フロー:
  1. Method `h4_Set_ApprovalInfo_On_Approve` を呼ぶ(`type`, `id`, `h4_approve_style`(WFか否か; 既定"0"))。type が `h4_ReqDoc` の場合は `sourceID`=`h4_pare_mq`(親マルQのID)、`h4_Test_Result` の場合は `sourceID`=`h4_parent`(親ID)を追加。sourceID が空なら `h4_S_E_0003`。呼び出しエラー時はそのエラー文字列を返す。
  2. type が `h4_MQPage` の場合: `h4_Approve_Related_Item`(applovedItem=`h4_ReqDoc`, destination=`Approved`, sorceItemID=マルQのID)を実行(必要資料を適時承認する: `h4_directaplist`(StateList)を変更してサーバーイベントで遷移メソッドをキックする — コード内コメント)。
  3. type が `h4_ReqDoc` の場合: `h4_Approve_Related_Item`(applovedItem=`h4_Test_Result`, destination=`Approved`, sorceItemID=必要資料のID)を実行(配下のテスト結果を適時承認)。
- 呼出す他Method: `h4_Set_ApprovalInfo_On_Approve`, `h4_Approve_Related_Item`。
- 注意点: パラメータ名 `applovedItem` / `sorceItemID` は綴りのまま(呼び出し先と合わせる必要あり)。

## [181] h4_PreAppFromInRevForDAT
- 言語: C# / comments: LCの改訂中から公開への遷移時の処理
- 概要: 帳票マスタ・開達書式共通の、LC「改訂中(InRevision)→公開(Release)」遷移時のチェック。WFのMethodから呼んでいるチェックをここでも利用する(コード内コメント)。
- 処理: `Administrators` 権限で、type が `h4_DATMaster` の場合は `h4_CheckIsLockRelatedDAT_Core`(Item ID=this、配下開達書式のアンロックチェック)を実行し、エラーなら `getErrorString()` を返す。共通で `h4_CheckLockHist_Core`(ID=this, `type`=this型; 配下改訂履歴のアンロックチェック)を実行しエラーなら返す。問題なければ this。
- 呼出す他Method: `h4_CheckIsLockRelatedDAT_Core`, `h4_CheckLockHist_Core`。
- 呼び出し契機(推測): `h4_DATMaster` / `h4_DATFormat` LC の「改訂中→公開」遷移の Pre。

## [182] h4_Promote_By_List_MQPage ReqDoc
- 言語: C# / comments: 必要資料とテスト結果のダイレクト承認のプロモートメソッド
- 概要: アイテムの `h4_directaplist`(List値)を目標ステートとみなし、現在のライフサイクルステート名と異なる場合に、その値へ `promote` する(ダイレクト遷移対応など。コード内コメント: 必要資料とテスト結果で利用)。[158]のList←State同期とは逆方向(List→State)。
- 呼び出し契機(推測): `h4_ReqDoc` / `h4_Test_Result` の `h4_directaplist` 変更時のサーバーイベント(例: OnAfterUpdate)。[180] の `h4_Approve_Related_Item` がStateListを変更してサーバーイベントで遷移メソッドをキックする、というコメントと整合(推測)。
- 入力: this(`h4_directaplist`, `current_state`)。出力: this。
- 処理: `Administrators` と `Aras PLM` の二重の権限昇格下で、`current_state`(Life Cycle State ID)から現ステート名を取得。`h4_directaplist` と異なる場合、ロック状態が1(自分でロック)ならアンロックしてから、`h4_directaplist` の値に応じ `promote(<ステート名>, "Promote message")` を実行: `InProgress`, `InReview`, `ProvisionalApproved`(必要資料のみ), `RequestApproval`, `Approved`, `Unapproved`(必要資料のみ)。それ以外の値は何もしない。アンロックしていた場合は再ロック。
- 呼出す他Method: なし。
- 注意点: `YryrRequestApproval` は switch に含まれない(コード上)。`promote` の戻り値/エラーは確認しない。`currentUserId` は未使用。


