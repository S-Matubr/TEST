<!-- meta
legacy: knowledge/_legacy/機能設計書.md L5196-L5298
source: source/package/Independent/Import/Method/
-->
# B_method1e: Method AML 調査 (No.61〜76)

## 61. h4_CheckUseYryrChange
- 言語: C# / id AC9D680E43BF4A28B867A995CC86D291 / comments: 「やるやらボタンの有効無効・実行時のチェック」
- 概要: やるやら変更の実行可否判定(ボタン初期化時と実行時の両方で使用)。冒頭コメントの条件: 最新アイテムか/(WFONなら)担当者・承認者が各1人以上か/一括承認に含まれていないか/他ユーザー使用中でないか。
- 入力(this): item_id, isApStyle("true"/"false"), isButtonInit(既定"false")。出力: this(可) / エラー(不可)。Administrators権限。
- フロー: h4_ReqDoc 取得(失敗 h4_S_E_0002)。is_current != "1" → `h4_S_E_0502`。state != "InProgress" → `h4_S_E_0504`。isButtonInit=="true" の場合のみ `fetchLockStatus()==2`(他者ロック)→`h4_S_E_0503`(実行時はクライアント側のクレイム処理と合わせて確認)。isApStyle=="true" の場合: isButtonInit!="true"(実行時)なら `h4_CheckDuplicatAppTarget`(allItemIDList=itemId)で一括承認重複チェック(エラーメッセージ伝播)、さらに `h4_CheckYryrUser` で担当者/承認者チェック(エラー伝播)。
- 呼出元: h4_change_yryr_init(isButtonInit=true)。他Method: h4_CheckDuplicatAppTarget, h4_CheckYryrUser。

## 62. h4_CheckValueUnchanged
- 言語: C# / id 2ED61F884C014F1F854D2A03C1F3EE0B / comments: 「対象:必要資料は、変更できないように制御する。」
- 概要: 指摘(h4_rel_reqdoc, h4_point_sub_number を持つアイテム)の「対象必要資料」(h4_rel_reqdoc)の変更を制御。
- 呼び出し契機(推測): 指摘の onBeforeUpdate。
- フロー: DBの旧値と新値を比較。旧値が空で新値が入った場合、枝番(h4_point_sub_number)が "1" 以外なら `h4_S_E_0604`。両方空は何もしない。それ以外(変更あり)は両IDの h4_ReqDoc の `config_id` を比較し、異なれば `h4_S_E_0605`(バージョン違いは許容)。例外は h4_S_E_0002。

## 63. h4_CheckYryrUser
- 言語: C# / id 3A74053EF4694D858662E8E2900CA288 / comments: 「やるやら変更するときに必要な担当者が設定されているか確認する」
- 概要: 必要資料の担当者一覧(h4_ReqDoc CLN)に、Creater と Approver(エイリアス=ユーザーのIdentity)が各1名以上いるか確認。
- 入力(this): item_id。出力: this / `h4_S_E_0501`(「やるやらの変更を行うには、担当者、承認者を設定してください」)/ 取得エラー h4_S_E_0002。Administrators権限。
- 注意: Reviewer は不要。related_idのIdentityの is_alias=="1" のみカウント。

## 64. h4_cmn_ShowMessage
- 言語: JavaScript / id 0288B375CEE24942B252CC1B4AA7CC92 / comments なし
- 概要: メッセージ名(inArgs)から UserMessage の text を返す共通クライアントメソッド。`aras.evalMethod` 等で呼ばれる(推測)。

## 65. h4_cmn_ShowMessage_Arg
- 言語: JavaScript / id E240CC1A5E884D14823943CE13D45587 / comments なし
- 概要: `arguments[1]` のカンマ区切り文字列を分割し、先頭を UserMessage 名として text を取得(1件ヒット時のみ)、2番目以降の要素で `{0}`,`{1}`... を `replaceAll` で置換して返す。引数にカンマを含む値は渡せない(コードの性質)。

## 66. h4_ControlItemCreation
- 言語: JavaScript / id 265EE7975CDC4CC385B175ACAF097EB8 / comments: 「アイテムの作成を制御する」
- 概要: TOC(目次)から直接作成する場合(`parent.thisItem` なし)、UserMessage `h4_C_E_0001` をAlertErrorして作成させない。その他は this を返す。例外時は `h4_C_E_0002`。
- 呼び出し契機(推測): ItemType の onBeforeNew 系クライアントイベント。

## 67. h4_ControlTabbar
- 言語: JavaScript / id 2AF5F3360A9346AAB6E3234F558D1718 / comments: 「WFの仕様有無によってサインオフタブの表示を制御する」
- 概要: マルQページ/必要資料/テスト結果のフォーム画面ロード時に実行(コード記載)。h4_approve_style(WF使用有無)により、サインオフ系/担当者一覧タブの表示/非表示を制御。
- 定数(RelationshipType名): h4_MQSingOff1, h4_TGVRevQueryMQ, h4_ReqDoc SingOff1N, h4_ReqDoc TGVRevQuery, h4_MQPage CLN, h4_ReqDoc CLN, h4_Test_Result SignOff, h4_Test_Result CLN。
- フロー: `parent.relationships` が出来るまで50ms待機の再試行。top の thisItem で型判定。
  - h4_MQPage: WF未使用ならサインオフ1/サインオフ2(TGV)/担当者一覧の3タブを非表示。WF使用時、`h4_ApprovalWFGroup_ApTarget`(related_id=自ID)が存在(一括承認に含まれる)なら単数サインオフ(SO1)を非表示、存在しなければ複数用(SO2:TGV)を非表示。`tabbar.SetTabVisible`。
  - h4_ReqDoc: 3段アコーディオンでタブバーに含まれないため、`parent.document` の `.aras-tabs__tab`(data-id)に対し `style=display:none` を設定。WF未使用:SO1/SO2/CLNを非表示、WF使用時は上記と同じ基準でSO1またはSO2を非表示。
  - h4_Test_Result: WF未使用なら SignOff と CLN を非表示。(一括承認対象ではないのでそれ以上は何もしない)。
  - 他型は何もしない。タブIDは RelationshipType を name で get して取得(`getTabID`)。
- 注意: コメントに「1つ目のタブでは使用できない(中身が表示しっぱなしになる)」。

## 68. h4_ControlTabbarForApWFGr4DAT
- 言語: JavaScript / id CC8F8ED575B5489EA286B3639E4119B7 / comments: 「開達書式の一括の担当者一覧タブの表示制御」
- 概要: 開達書式一括承認(h4_AppWFGroupForDATFormat)フォームで、h4_isexp=="1" なら `h4_AppWFGrForDATFormat EXPCLN` のみ表示(通常CLNは非表示)、それ以外は `h4_AppWFGrForDATFormat CLN` のみ表示。ステート判定は不要(資料分類が途中で変わらないため。コード記載)。`parent.relationships` 待機50ms再試行。

## 69. h4_ControlTabbarForDAT
- 言語: JavaScript / id 0E65D97DB8E54B5EBAD79BFC0F7D6348 / comments: 「開達書式の担当者一覧タブの表示制御」
- 概要: 開達書式(h4_DATFormat)フォームの担当者一覧/サインオフタブ制御。タブ名: `h4_DATFormat CLN`(SO1), `h4_DATFormat EXPCLN`(SO2), `h4_DATFormat SingOff`(SO3), `h4_DATFormat TGVRevQuery`(SO4)。
- フロー: `h4_AppWFGr4DATFormat DATFormat`(related_id=自ID)の source の h4_AppWFGroupForDATFormat が `is_current=="1"` なら「一括承認に含まれる」と判定(取得エラーは UserMessage `h4_C_E_0002` をAlertError)。
  - 一括に含まれる: CLN/EXPCLN/SingOff 非表示、TGVRevQuery 表示。
  - 含まれず state が InProgress または空: CLN, EXPCLN, SingOff 表示、TGV 非表示。
  - 作業中以外かつ h4_category=="EXPTest": EXPCLN, SingOff 表示、CLN/TGV 非表示。
  - 作業中以外かつEXPTest以外: CLN, SingOff 表示、EXPCLN/TGV 非表示。
- 注意: `debugger;` が残存。帳票マスタは制限バリエーションが無く対象外(コード記載)。

## 70. h4_Create_ApWFG_from_MQP_SV
- 言語: JavaScript / id C964F75692A24A61AC4948ADFCB4B0EF / comments: 「マルQページ　サーチビューから一括承認アイテムを作成する」
- 概要: マルQページ検索画面(サーチビュー)で選択した行から、一括承認アイテム(h4_ApprovalWFGroup)を作成する。
- 呼び出し契機(推測): サーチビューのツールバー/コンテキストメニューのボタン(`grid.getSelectedItemIds()` を使用)。
- フロー: 確認ダイアログ(UserMessage `h4_C_I_0802`/タイトル `h4_C_I_0001`)でOKなら実行。未選択→`h4_C_E_0003`。選択IDごとに h4_MQPage(h4_approve_style,state,keyed_name)を取得し、**h4_approve_style=="0"(WFなし)または state が "Approved" のものを NG** として収集、NGあれば `h4_C_E_0004`(`{0}`=名前カンマ連結)でエラー。`h4_CheckDuplicatAppTarget`(allItemIDList=ids.join("','"))で重複確認、エラーならメッセージ表示。先頭アイテムから h4_delta_version, h4_dept, h4_destination, h4_event, h4_model_code, h4_model_name, h4_my, h4_evaluation_unit, h4_unique_event を取って新規 h4_ApprovalWFGroup に設定、h4_directaplist="InProgress"、各IDを `h4_ApprovalWFGroup_ApTarget`(related_id)のリレーションとして追加して apply。失敗は `h4_C_E_0007`。作成後 `h4_setDefaultCLNItem`(type=h4_ApprovalWFGroup, idlist=ID)で担当者一覧初期化、`aras.uiShowItem` で開く。例外は `h4_C_E_0002`。
- 他Method: h4_CheckDuplicatAppTarget, h4_setDefaultCLNItem。注意: `debugger;` 残存。

## 71. h4_Create_ApWFG_from_ReqDoc_SV
- 言語: JavaScript / id 5E129CC78342430E97FFC15C3795B49E / comments: 「必要資料検索画面CBから一括承認アイテムを作成する」
- 概要: 70の必要資料版。NG条件は h4_approve_style=="0"、state が "Approved"/"Unapproved"/"YryrRequestApproval"、h4_yryr != "1"(やるやら×)。NG名は `<br>` 連結で `h4_C_E_0004` 表示。その他は70と同じ(重複チェック、先頭アイテムのプロパティ引継ぎ、ApTarget作成、h4_setDefaultCLNItem、画面表示)。
- 注意: apply失敗時(`h4_C_E_0007`表示)も return せず後続を続行する(コードのまま)。`debugger;` 残存。

## 72. h4_create_sort_order_index
- 言語: JavaScript / id 175D48B3ACE04B0CB7DEA0E6BA99B883 / comments なし
- 概要: 室課マルQマスタの開達書式(h4_DMQMaster DATFormat)の sort_order を扱う途中実装/デバッグ用コード。実質: 作業用グリッド(`top.main.work.grid`)の6行目(i==5)の h4_DeptMQMaster に紐づく `h4_DMQMaster DATFormat` の sort_order を `alert` 表示するだけで、`return;` で終了。以降のコードは到達不能。
- 注意: 本番処理としては意味を成さない未完成コード(alert/debugger残存、後続は到達不能コード)。

## 73. h4_CreateNewPointOut
- 言語: C# / id BDF8F8DCC5FB45448E80B1478165063A / comments: 「指摘アイテムを新規作成時の処理。」
- 概要: 指摘(h4_PointOut)の新版(枝番)を新規作成した際、`h4_PointOut History` で紐づく過去の指摘全てに、新アイテムを履歴として紐づけ、`h4_newest_pointout` を新アイテムIDに更新する。履歴の中にロック中のものがあればエラー。
- 呼び出し契機(推測): h4_PointOut の onAfterAdd。
- フロー: `h4_PointOut History`(source_id=this, related_id(h4_point_sub_number))を取得し、各 related について fetchLockStatus!=0 なら枝番(h4_point_sub_number)を lockNumber に収集。ロック無しの場合のみ edit の AML断片(h4_newest_pointout=thisId、`h4_PointOut History` add related_id=thisId、doGetItem=0, serverEvents=0)を追加。ロック収集ありなら枝番を数値昇順カンマ連結で `h4_S_E_0602` エラー、なければ applyAML で一括更新。例外は h4_S_E_0002。
- 注意: applyAML結果のエラー判定なし。

## 74. h4_CreateNewRevision
- 言語: C# / id 1760447CAE524CC2B3243C4389BDB586 / comments: 「改定時のリビジョンアップ＋画面更新」(冒頭: TEのPE_CreateNewRevisionを改造)
- 概要: リリース済み(state=="Release")アイテムの新リビジョンを、変更管理外で作成(version → unlock)。
- 呼び出し契機: コード記載「Called from a server action」(サーバーアクション)。
- フロー: 許可外 action を持つ子Itemがあれば InvalidOperationException。新規/一時アイテムは `PE_CreateNewRevision_MustBeSaved` エラー。state != "Release" なら `PE_ManualRelease_MustBeInReleasedState` エラー。(Owner判定はコメントアウト)。`this.apply("PE_CheckChangeItemUsage")` で変更アイテムでの使用を確認(エラーはそのまま返却)。Administrators権限(元は Aras PLM、コメントで変更)で `version` → `unlock` を apply して結果を返す。
- 他Method/Action: PE_CheckChangeItemUsage(アクション)。

## 75. h4_CreateNewRevisionHistory
- 言語: C# / id 7FEE7FF5CDAB48F3BDD6372D4C7E4B60 / comments: 「改訂履歴アイテムを新規作成時の処理。」(exec: Administrators)
- 概要: 改訂履歴(h4_RevisionHistory)新規作成時、`h4_RevisionHistory RevHist` で紐づく過去の改訂履歴に `h4_newest_revision_history` を新アイテムIDで更新し、履歴リレーションを追加する(73の改訂履歴版。参考: h4_CreateNewPointOut)。事前にNo(枝番)登録済みの前提。
- フロー: 関連アイテムのロック中枝番(h4_revision_sub_number)を収集、1件でもあれば昇順連結で `h4_S_E_1001` エラー、なければ edit AMLを applyAML で一括実行。例外は h4_S_E_0002。

## 76. h4_CreateRelHistory
- 言語: C# / id 7EF159C95B024815BF942E53076B4804 / comments なし
- 概要: 帳票マスタ(h4_DATMaster)/開達書式(h4_DATFormat)の初回改訂履歴(h4_RevisionHistory)とリレーションを新規作成。
- 入力(this): parentId, parentType(h4_DATMaster / h4_DATFormat), revision_summary(確認事項), revision_reason(改定理由)。出力: this / h4_S_E_0002。Administrators権限。
- フロー: 親を get(id,managed_by_id)。新ID生成、h4_RevisionHistory add: h4_revision_sub_number="1"、h4_newest_revision_history=自ID、managed_by_id=親の管理者、h4_revision_summary, h4_revision_reason、親種別により `h4_rel_dat_master` または `h4_rel_dat_format` に親IDを設定。リレーション `h4_DATMaster RevisionHistory` または `h4_DATFormat RevisionHistory` を add(source_id=親, related_id=新履歴)。
- 注意: 他の parentType では relItemNames が空のまま add を実行しエラーとなる(コード上の分岐なし)。


