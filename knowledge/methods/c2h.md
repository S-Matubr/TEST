<!-- meta
legacy: knowledge/_legacy/機能設計書.md L6006-L6067
source: source/package/Independent/Import/Method/
-->
# Method AML 調査 C_method2h (172〜179番目: h4_NewAssignInProgressForDat 〜 h4_PostApprovalLCProcForDAT)

---
## [172] h4_NewAssignInProgressForDat
- 言語: C# / comments: アイテムの新規作成時に担当者を割り当てる (要：WF新規作成後に実行)
- 概要: 帳票マスタ(`h4_DATMaster`)/開達書式(`h4_DATFormat`)の紐づくWFの「作業中(`InProgress`)」アクティビティのアサインメントを、担当者一覧(CLN)の内容で入れ替える。作業中ステートで担当者に変更があった場合に呼ぶ(コード冒頭コメント: 一括承認でも単体承認でも同様; 新規作成時は別プログラム `h4_SetWfForDATMasterAtAdd` を事前に実行; LC制御により作業中は別室課はディスカバーのみ; アイテムの OnAfterUpdate で作業中のみ実行される)。
- 呼び出し契機: コメントより「アイテムのOnAfterUpdate(作業中のみ)」および新規作成後。
- 入力: this = 対象アイテム(`h4_DATMaster` / `h4_DATFormat`)。他の型なら何もせず this を返す。出力: this / エラー(`h4_S_E_0002`)。
- 処理フロー:
  1. `Administrators` 権限で `Workflow`(source_id=this ID) → `Workflow Process`(先頭) → `Workflow Process Activity` を取得し、name=`InProgress` のアクティビティを特定。無ければ `h4_S_E_0002`。
  2. 担当者リレーション名決定: `h4_DATMaster`→`h4_DATMaster CLN`、`h4_DATFormat`→ `h4_category=="EXPTest"` なら `h4_DATFormat EXPCLN`(isEXP=true)、それ以外 `h4_DATFormat CLN`。
  3. `Aras PLM` 権限(入れ子の昇格)で `GetIdentityList`: リレーション(select `h4_workflow_role, source_id, related_id, h4_check_required`, related=Identity select `id, is_alias`)を取得。`is_alias=="1"` のIdentityのみ役割別辞書 `memberList[role]` に追加、`h4_check_required=="1"` なら `checkList[role]` にも追加。辞書の役割キー: `Creater, ReleaseApprover, InspEXPStaff, InspEXPApprover, Q1Staff, Q1Approver, Approver`。対象アクティビティ名に応じて割当先を決定: `InProgress`→ EXPなら `InspEXPStaff`、それ以外 `Creater`; `RequestApproval`→`Approver`; `ReqApproval_InspEXP`→`InspEXPApprover`; `ReqApproval_Q1Stf`→`Q1Staff`; `ReqApproval_Q1Appr`→`Q1Approver`; `ReleaseApproved`→`ReleaseApprover`; その他(Release以降)は空。`GetIdentityList2` で同様に必須チェックリスト(cdenList)を作成。
  4. 割当先が0件なら何もせず this を返す。重複排除後、対象アクティビティの既存 `Activity Assignment`(where source_id=アクティビティID)を削除し、`AddActivityAssignment` で追加: AML `Activity Assignment` add(source_id=アクティビティ, related_id=Identity, `voting_weight`)。重み計算: 必須(cdenList)が0件なら全員100、必須ありなら必須者は `ceil(100/必須人数)`(最小1)、必須でない担当者は0(コメント「h2の実装にのっとる」)。失敗時 `h4_S_E_0002`。
- 呼出す他Method: なし(内部関数のみ)。`h4_SetWfForDATMasterAtAdd` は前提としてコメントに記載(別Method)。
- 注意点: コード内コメントに「h4_NewAssignInProgressForDatと同様の処理」とあり、同ロジックのコピー流用。`DeleteActivityAssignment` の戻り値は未使用(削除失敗でも継続)。`memberList`/`checkList` はクラスのフィールドとして初期化。末尾 `private void Dummy() {` は括弧合わせ。

## [173] h4_OpenUrlDATFormatLink
- 言語: JavaScript / comments: 開達書式のリンクタブの右クリックメニューでURLを開く
- 概要: リンクタブで選択した行の `h4_urllink` を新しいブラウザタブで順に開く。URLのバリデーションなし。ブラウザ側がポップアップを標準ブロックするので、ブロックしない設定が必要(コード内コメント: さもないと1つ目のURLしか表示されない)。
- 処理: `options.getState().grid.selectedRows`(0件なら終了)の各idについて `rows.get(id,'h4_urllink')` を取得し、値があれば `window.open(url, '_blank'+timestamp+count)`(固有タブ名)。
- 呼び出し契機: 開達書式リンクタブのグリッド右クリックメニュー(CUI)。

## [174] h4_optimize_tab_form_size
- 言語: JavaScript / comments: sk：アコーディオンタブフォームサイズ最適化
- 概要: Topアコーディオンに複数タブを置くレイアウトで、メイン以外のタブのiframe領域を、Formの `height`/`width` に合わせる(コード内コメント)。
- 処理: `document.formID`, `document.itemTypeID` から、`RelationshipType`(source_id=現ItemTypeID)で `Relationship View`(form=現FormID)を参照するものを検索してIDを特定。`Form`(id=現FormID, select `height,width`)を取得し、`document` のiframe(id=RelationshipType ID)のstyleを `height:{h}px; width:{w}px; overflow:auto` に設定。(aras-switcher のスクロール制御はコメントアウト)
- 呼び出し契機(推測): フォームの onLoad。注意点: `debugger;` 残存。iframeが見つからない場合の例外処理なし(コード上)。

## [175] h4_PointOut_ivicb_copy
- 言語: JavaScript / comments: 指摘Itemビュー関連指摘作成ボタン処理
- 概要: 指摘(`h4_PointOut`)の「関連指摘作成」ボタン。表示中の指摘を元に枝番+1の新しい指摘を作成し、`h4_PointOut History` リレーションで過去の指摘を紐づけ、編集モードで開く。
- 処理フロー: 確認ダイアログ(UserMessage `h4_C_I_0601` / `h4_C_I_0001`)でOK時: 表示中アイテムID取得 → `h4_newest_pointout`(最新指摘ID)と一致しなければ `h4_C_E_0601` を表示して終了(他の人が既に関連指摘を作成済みの場合のエラーチェック)。新規 `h4_PointOut` を add(doGetItem=0, 新ID, `h4_point_sub_number`=元+1, `h4_newest_pointout`=新ID)、以下をコピー: `h4_destination, h4_event, h4_my, h4_point_number, h4_delta_version, h4_rel_mq, h4_rel_reqdoc, h4_model_name, managed_by_id, h4_evaluation_unit, h4_unique_event, h4_rel_testrsult, h4_rel_approvalwfgroup, h4_rel_appwfgroupfordatformat`。`h4_PointOut History`(source=元)の related 全件と元自身を、新アイテムの `h4_PointOut History` として追加。apply 後 `aras.uiShowItem` で表示し1秒後に `onEditCommand()` を実行。例外時 `h4_C_E_0002`。
- 注意点: `errStr` が宣言なしで代入される(コード上)。

## [176] h4_PointOut_ivicb_init
- 言語: JavaScript / comments: 編集モードまたは、枝番が最新ではない場合は、非活性化する制御
- 処理: 編集モードなら disabled。指摘のパーミッション名(`permission_id` の keyed_name、無ければPermissionを取得)が `h4_PendingApproval, h4_Approved, h4_PendingApproval_AppWFGr, h4_Approved_AppWFGr, h4_Approved_Test_Result` のいずれかなら disabled。それ以外は、表示中アイテムID == `h4_newest_pointout`(最新)のときのみ活性。例外時 `h4_C_E_0002`。

## [177] h4_Post_CallRejectAct_MQP_MQPRDN
- 言語: C# / comments: マルQと必要資料のLCで否認された際の遷移時動作
- 概要: ダイレクト承認(`h4_approve_style`=="0")のときだけ、否認時の後処理をまとめて実行(WF使用時はWF側でキックするためスキップ — コード内コメント)。
- 処理: `Administrators` 権限で、`h4_IncrementRoundForMQPageDirect`(type, id)を実行(次数上げ+必要資料クローン)。エラーなら `getErrorString()`。type が `h4_MQPage` の場合は続けて `h4_MQPReject_SetReqDocRejecter`(type,id)を実行(やるやら×の必要資料に否認者・日時を設定)、エラーなら `h4_S_E_0002`。
- 呼び出し契機(推測): `h4_MQPage` / `h4_ReqDoc` のLCで否認(Reject)遷移の Post。
- 呼出す他Method: `h4_IncrementRoundForMQPageDirect`([138]), `h4_MQPReject_SetReqDocRejecter`([170])。
- 注意点: コード内に「h4 ログ出力を入れる」というTODOコメントあり。

## [178] h4_Post_RejectMQPage_InReview
- 言語: C# / comments: なし(内部: 否認時の実行処理のまとめ)
- 処理: ダイレクト(`h4_approve_style`=="0")のときのみ `h4_MQPReject_SetReqDocRejecter`(type,id)を実行し、エラーなら `h4_S_E_0002`。次数上げ・クローンは行わない([177]との差)。
- 呼び出し契機(推測): マルQページ確認中(InReview)からの否認遷移の Post。

## [179] h4_PostApprovalLCProcForDAT
- 言語: C# / comments: なし(内部: 帳票マスタ、開達書式のLCの承認遷移時(Post)の追加処理)
- 処理フロー(this=対象アイテム):
  1. type が `h4_DATMaster` なら `h4_ReleaseChildrenDATFormat`(id, h4_approve_style=this値(既定"0"; WFか否か))を `Administrators` 権限で実行し、配下の開達書式を公開(ロック確認はWF側のPreで実施の前提 — コメント)。エラーはそのまま返却。
  2. 共通: `h4_RecordUpdateDate`(type,id)を実行(改訂日を入力)。
  3. 共通: `h4_InputModifiedOnAndUserForHist`(type, id, modifiedOn=this.modified_on, modifiedUser=this.modified_by_id)を実行(配下の改訂履歴に改訂日・改訂者入力)。
  4. type が `h4_DATFormat` なら `h4_ReplaceDATFormatAtRelease`(id, configID)を実行(親アイテムについている旧版の開達書式を自身に差し替え)。
- 呼出す他Method: `h4_ReleaseChildrenDATFormat`, `h4_RecordUpdateDate`, `h4_InputModifiedOnAndUserForHist`([145]), `h4_ReplaceDATFormatAtRelease`。
- 呼び出し契機(推測): `h4_DATMaster` / `h4_DATFormat` のLC「承認」→公開遷移の Post。


