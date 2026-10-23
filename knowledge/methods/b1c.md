<!-- meta
legacy: knowledge/_legacy/機能設計書.md L5010-L5106
source: source/package/Independent/Import/Method/
-->
# B_method1c: Method AML 調査 (No.35〜48)

## 35. h4_Change_Direct_Approve_List
- 言語: C# / id 2DE6A5F39E6E4A319C172E3D6ED3321B / comments: 「必要資料複数ダイレクト承認のリスト選択値変更」(Administrators権限)
- 概要: 複数の必要資料をダイレクト承認(WFなし)する際、選択ステート値(h4_directaplist のリスト値)へ一括変更。
- 呼び出し契機(コード記載): 冒頭コメント「h4_MultiDirectApproveから呼び出し」。
- 入力(this): state(変更先), id1,id2,...(連番。`h4_MQPage ReqDoc` リレーションのID。存在しなくなるまでループ)。出力: this / エラー h4_S_E_0002。
- フロー: 各idN について `h4_MQPage ReqDoc`(setID)を get(related_id) → 必要資料IDで h4_ReqDoc を get(current_state,locked_by_id,config_id) → `Life Cycle State` を getItemById して現在ステート名取得 → 新ステートと異なる場合のみ: ロック状態==1 ならアンロック(unlockFlag)、`h4_ReqDoc` edit(where=`config_id='..' and is_current='1'`, h4_directaplist=newState)、unlockFlagなら再ロック。
- 注意: 比較は LCステート名と newState 文字列。ロック再取得は `result.lockItem()`(unlockは newItem 側で別オブジェクト)。

## 36. h4_change_state_list
- 言語: C# / id B272400297BE415B846E57E2DB23510A / comments: 「Call用：WF遷移時にListのステート表示を変更する。」
- 概要: アイテムの現在LCステートと同名の値を h4_directaplist(リスト)にセットする(LCとListの関連付けが無いためここで突合)。
- 呼び出し契機: コード記載「LCのポスト時に動作」(WF/LCのポストメソッドからCall。旧名 h4_change_list_state)。
- 入力(this): type(ItemType名), id。出力: this。
- フロー: type/id でアイテムの state を get → LCName が InProgress/RequestProvisionalApproval/ProvisionalApproved/RequestApproval/Approved ならそのまま同名をセット値とし(その他は既定 "InProgress")、`edit`(version=0, serverEvents=0 でOnAfterUpdateのList同期処理を無効化)で `h4_directaplist` を更新。
- 注意: 5ステート以外(InReview等)は "InProgress" になる(コードどおり)。権限昇格なし。

## 37. h4_change_yryr_frm_close
- 言語: JavaScript / id A0C322A99E0B486AA2C2E67ED5A3FB96 / comments なし(冒頭コメントは「マルQページ初期値設定画面の設定を取得」だが処理は閉じるのみ)
- 概要: やるやら変更ダイアログを値なしで閉じる(`parent.dialogArguments.dialog.close()`)。呼び出し契機(推測): キャンセルボタン。

## 38. h4_change_yryr_frm_get_value
- 言語: JavaScript / id 2C1A640BA5E14409B07CE8375D17FEDD / comments なし
- 概要: やるやら変更ダイアログの確定ボタン処理。フォーム(MainDataForm)の `h4_yryr_reason` を取得し、空なら UserMessage `h4_C_E_0503` をAlertErrorして終了。入力があればその値を戻り値としてダイアログを閉じる(`dialog.close(reason)`)。
- 呼び出し契機(推測): やるやら変更ダイアログのOKボタン。

## 39. h4_change_yryr_init
- 言語: JavaScript / id B2A8D42EC59847E9AAB2FCC548C6E044 / comments: 「必要資料のやるやら変更ボタンの初期化method」
- 概要: 必要資料の「やるやら変更」ボタンの活性/不活性制御(ツールバー/コマンドバー初期化)。
- 条件: 非編集中(`window.isEditMode==false`)、ステート "InProgress"、ロック無し(`getLockStatus()==0`)、ログインユーザーのIdentityリストに `managed_by_id` が含まれる(編集者)ときのみ活性。編集中は常時不活性。新規作成時(アイテム取得不可)は不活性。さらに `h4_CheckUseYryrChange`(item_id, isApStyle(=h4_approve_style), isButtonInit=true)を呼び、エラーなら不活性。
- 出力: `{hidden:false, disabled:!isView}`。
- 他Method: h4_CheckUseYryrChange。
- 注意: `itemId`(小文字d)と `itemID` を混在して使用(`itemId = thisItem.getID()` はグローバル代入、`parentItem.setID(itemID)` は別変数。コードのまま)。

## 40. h4_changeModelName
- 言語: JavaScript / id D8A38D226C9E440597DEDA890DDECC79 / comments: 「機種呼称変更時の確認」(exec: Administrators)
- 概要: マルQページの機種呼称(h4_model_name)変更時、⊿バージョン(h4_delta_version)と機種呼称がList `h4_ModelName`(Filter Value)でマップされているか確認。
- 呼び出し契機(推測): 機種呼称プロパティのonChange(クライアントイベント。`value`,`itemId` を使用)。
- フロー: value が空/空白なら何もしない(20250821 修正)。`h4_MQPage` を取得し、`HRDPMTypModelProject`(value=ID)の name を取得、`h4_delta_version` を取得。List `h4_ModelName` の Filter Value で filter==⊿バージョン かつ value==機種名(name) があればOK(return this)。なければ UserMessage `h4_C_I_0404` をAlertError。
- 注意: エラー時もプロパティを元に戻す処理はコメントアウトされたまま。

## 41. h4_ChangeSortOrderOfGI62
- 言語: C# / id C493F371BE3C460E967BBF4BED210695 / comments: 「技62の必要資料を先頭にする（ソートオーダーを１にする）」
- 概要: リレーション(h4_MQPage ReqDoc と推測)の related の必要資料名が "技-62" の場合、リレーションの sort_order を "1" にする。
- 呼び出し契機(推測): 必要資料リレーションの追加後/更新イベント(this=リレーションアイテム)。
- フロー: related_id が空なら何もしない。h4_ReqDoc を get(エラーは h4_S_E_0002)。name=="技-62" なら this を edit(serverEvents=0, version=0, sort_order=1) に変更して Administrators権限で apply。
- 注意: 対象名は定数 TargetRecDocName="技-62" ハードコード。

## 42. h4_ChangeWfForDATFormat
- 言語: C# / id 2CE450011C9F4BD3AACE874CC5B40975 / comments: 「開達書式（一括の新規作成時も）のWFを切り替える」
- 概要: 開達書式の資料分類(h4_category)が EXPTest か否か変わった場合、ワークフローを切替(旧WFをキャンセルし新WFを紐づけ開始)。
- 呼び出し契機(推測): h4_DATFormat(および一括)の onAfterUpdate 等。コメント「Updateイベントが2回走ることがある」。
- フロー: ステートが "InProgress" 以外ならreturn。DBの変更前 h4_category と現在値を比較(EXPTest か否か)し、EXP区分が同じならreturn。切替先 Workflow Map 名: 通常 `h4_DATFormatWF`、EXP `h4_DATFormatEXPWF`(`Workflow Map` を name で取得)。`Workflow`(source_id=this) → `Workflow Process`(copied_from_string,id,state,created_on)を列挙、Cancelled以外をactiveWFPListへ、created_on最新を latestWFP とする。**最新WFPの copied_from_string が切替先マップIDと同じならUpdate二重実行とみなして無視**。activeWFPList を `CancelWorkflow` アクションでキャンセル後、`this.instantiateWorkflow(mapId)` → `startWorkflow` で開始。各操作は Administrators権限、エラーは h4_S_E_0002。
- 注意: `beforeCategory.setAttribute("h4_category","")`(select意図と思われる)の書き方は不自然だがコードのまま。

## 43. h4_ChangeWfForDATFormatAtAdd
- 言語: C# / id 049D95AE83594FDB99CB8702A14FFCD4 / comments: 「新規作成時のWFs設定（デフォルトWF未設定）」
- 概要: 開達書式・開達書式一括(h4_AppWFGroupForDATFormat)の新規作成時、自動WF割当をせずこのMethodでWFを紐づけ開始。
- フロー: `h4_isexp` が空(=開達書式)なら h4_category=="EXPTest" で `h4_DATFormatEXPWF` 他は `h4_DATFormatWF`。h4_isexp が非空(一括)なら "1" で EXPWF。`Workflow Map` を name 取得 → `instantiateWorkflow(mapId)` → `startWorkflow`(Administrators権限)。エラーは h4_S_E_0002。
- 呼び出し契機(推測): 新規作成後(onAfterAdd)。

## 44. h4_ChangeYryr
- 言語: C# / id 97AB09FAA52E4B35883AAE8AE0199BF2 / comments: 「必要資料のやるやらを反転させる」(実際は指定値へ設定)
- 概要: 指定必要資料の h4_yryr を指定値に変更。
- 入力(this): item_id, afterYryr。処理: h4_ReqDoc edit(h4_yryr=afterYryr, version=0, serverEvents=0)を Administrators権限でapply。エラー h4_S_E_0002。出力 this。
- 呼出元: h4_CallChangeYryrForWF, h4_ChangeYryrByFormResult(確認済み)。

## 45. h4_ChangeYryrByFormResult
- 言語: C# / id 3202EF91FEA942A48D7765C31AA13F08 / comments: 「やるやら変更フォームの結果とアイテムの状態からやるやらの変更やWFの遷移を行う」
- 呼び出し契機(推測): やるやら変更ボタン(クライアント)→ダイアログで理由入力後。
- 入力(this): item_id, isApStyle("true"/"false" 文字列), yryrReason。
- フロー:
  1. 共通: h4_ReqDoc edit(h4_yryr_reason=yryrReason, serverEvents=0。バージョン更新はする)を Administrators で実行。
  2. isApStyle=="false"(ダイレクト承認): `h4_ChangeYryr`(afterYryr="0")を呼び、やるやら〇→×。return this。
  3. 非ダイレクト: Workflow→Workflow Process(state=Active)→Workflow Process Activity→Activity(name="InProgress", state=Active)→Activity Assignment、Workflow Process Path(name="YryrReview") を1回のAML getで取得。アクティビティ配下の Activity Assignment のうちログインユーザーのIdentity(`CCO.Permissions.IdentityListHasId`)に一致するもの(なければ先頭)を選び `voting_weight=100` に edit。パスIDを取得(空ならエラー)。`Item type='Activity' action='EvaluateActivity'`(Activity, ActivityAssignment, Paths/Path id, DelegateTo=0, Comments「コマンドバーのボタンから遷移」, Complete=1)を applyAML して「やるやら承認依頼」へ遷移。やるやらの実変更はWF側(承認後)で実行(コメント)。WFからメール送信はWF側制御。
- 他Method: h4_ChangeYryr。エラーは主に h4_S_E_0002。

## 46. h4_CheackWhenSaveAddItem
- 言語: C# / id 3EFB90CE52CA43A6B733622F0CF04E58 / comments: 「保存するときに、必要資料がロックされているかチェックする。」
- 概要: 指摘(h4_PointOut と推測。プロパティ h4_rel_mq, h4_rel_reqdoc, h4_point_sub_number を持つ)の初回保存時、対象マルQページと対象必要資料が指定されている場合、必要資料が編集(ロック)状態かチェック。
- フロー: h4_point_sub_number != "1" ならスキップ。h4_rel_mq・h4_rel_reqdoc 両方に値がある場合、h4_ReqDoc の `fetchLockStatus()!=0` でなければ(ロックされていない) UserMessage `h4_S_E_0603` のエラー。例外時 h4_S_E_0002。
- 注意: 判定は `lockStatus != 0` でエラーを返す実装(コメントは「ロックされていない場合エラー」だが条件式は lockStatus!=0。fetchLockStatus の戻り値定義に依存。コードの記述のまま報告)。

## 47. h4_CheckCLN
- 言語: C# / id 4BBDD5F8066A4DFCAEAFCE139CD22361 / comments: 「WFの最初の遷移時に、担当者が入っているかを確認する」(Administrators権限)
- 概要: マルQページ/必要資料/一括承認(h4_ApprovalWFGroup)/テスト結果の担当者一覧に、作成者・確認者・承認者のロールが全て存在するか確認。
- 呼び出し契機(推測): WFの最初のパス(作業中→次)の遷移前チェック。this=WF Process。
- フロー: `h4_GetControlledItem` で対象取得(エラー/0件は newError)。型に応じて `h4_MQPage CLN` / `h4_ReqDoc CLN` / `h4_ApprovalWFGroup CLN` / `h4_Test_Result CLN` を選択(他型は何もしない)。担当一覧(h4_workflow_role, related Identity の id,is_alias,keyed_name)取得。0件→UserMessage `h4_S_E_0004`。各行で is_alias!="1"(ユーザーでない)はスキップ(errorUser記録のみ)、Creater/Reviewer/Approver の有無を判定。3つ揃えばOK、不足なら h4_S_E_0004。
- 他Method: h4_GetControlledItem。

## 48. h4_CheckCLNtab
- 言語: C# / id 52ACED2FF87F4F6E9294D93E4060C72F / comments: 「新規作成時、担当者一覧タブにrelated_idが設定されているかチェックする。」
- 概要: テスト結果(h4_Test_Result CLN)/必要資料(h4_ReqDoc CLN)の担当者一覧に related_id が空の行があればエラー(UserMessage `h4_S_E_0005`)。コメント: 新規作成時に related_id 空だと標準で「Object reference not set…」となり意味不明なため事前チェック。
- 呼び出し契機(推測): 保存前(onBeforeAdd/Update)。入力: this(fetchRelationships で取得)。他型を渡すとdict例外→h4_S_E_0002。


