<!-- meta
legacy: knowledge/_legacy/機能設計書.md L5299-L5383
source: source/package/Independent/Import/Method/
-->
# B_method1f: Method AML 調査 (No.77〜91)

## 77. h4_CreateReqDocPointOut_af
- 言語: C# / id 34A1378A491B483FA2479B253053E2ED / comments: 「保存時に、必要資料のリレーションシップに紐づけを行う。」
- 概要: 指摘(h4_PointOut)保存の After 処理。Before側(h4_CreateReqDocPointOut_be)が `RequestState` に積んだ `h4_rel_mq`/`h4_rel_reqdoc` を使い、必要資料の指摘タブとマルQページの必要資料指摘一覧タブへ紐づけ。
- 呼び出し契機(推測): h4_PointOut の onAfterAdd/onAfterUpdate。`RequestState["h4_rel_mq"]`,`["h4_rel_reqdoc"]` を使用。
- フロー: RequestState のどちらかが非空の場合のみ、`h4_MQPage PointOut`(source_id=this.h4_rel_mq, related_id=this)が存在(=マルQページの指摘タブに既に紐づいている)なら、h4_rel_reqdoc があれば `h4_ReqDoc PointOut`(source=必要資料)、h4_rel_mq があれば `h4_MQPage ReqDocN PointOut`(source=マルQページ)を add(doGetItem=0)。紐づいていない場合は紐づけない(マルQ保存時に追加される。コメント)。最後に RequestState から両キーを Remove。例外は h4_S_E_0002。

## 78. h4_CreateReqDocPointOut_be
- 言語: C# / id 32A710CF288547A28D4FEB8550EF1582 / comments: 「保存時に、必要資料のリレーションシップにロックされているかチェックする。」
- 概要: 指摘保存の Before 処理。枝番(h4_point_sub_number)が "1" の指摘のみ対象。必要資料のロック確認と、After用の RequestState 設定を行う(コメント: ロック状態はbeforeでしか確認できず、リレーション追加はafterでしか上手くいかないため分離)。
- フロー: h4_point_sub_number != "1" ならスキップ。h4_rel_mq と h4_rel_reqdoc が両方ある場合、`h4_ReqDoc PointOut`(source=h4_rel_reqdoc, related_id=this)が未存在(0件)なら: 必要資料の `fetchLockStatus()!=0` で UserMessage `h4_S_E_0603` エラー。RequestState に `h4_rel_reqdoc` をセット。さらにマルQページが `fetchLockStatus()!=0`(編集中)ならここで終了(マルQ保存時処理に任せる)。そうでなければ RequestState に `h4_rel_mq` もセット。例外は h4_S_E_0002。
- 注意: 46(h4_CheackWhenSaveAddItem)と同種のロックチェックロジックで、条件式も同じ(`lockStatus != 0` でエラー)。

## 79. h4_CreateRevisio
- 言語: JavaScript / id 42578FAD875B41D985B27A8619D90EC1 / comments: 「改訂ダイアログを出し、OKしたら改訂処理の開始」
- 概要: 帳票マスタ・開達書式の改訂を実施するクライアントメソッド(冒頭コメントの後半「マルQページ作成…」は流用コメントの残り)。
- 呼び出し契機(推測): 帳票マスタ/開達書式フォームの「改訂」ボタン。
- フロー: スピナー表示。UserMessage `h4_C_I_0003`(ダイアログタイトル)。フォーム `h4_RevisioDialog` を `ArasModules.MaximazableDialog`(550x380、ShowFormAsADialog.html)で表示。戻り値(カンマ区切り): [0]確認事項, [1]改定理由, [2]すぐに公開チェック。キャンセル(戻り値なし)なら終了。[0]/[1]が空なら `aras.AlertError("katotest 必須項目に入力が必要")` を表示するが処理は続行(return無し)。`Method h4_StartRevision`(id,type,revision_summary,revision_reason,isPromoteNow=[2])を呼出、エラーなら AlertError して終了。[2]=="false"(文字列)の場合: 親アイテムに action="h4_CreateNewRevision" をセットして `aras.soapSend('ApplyMethod', ...)` を実行(エラーはAlertError)、結果XMLで `aras.uiReShowItemEx` により画面を再表示。最後に `parent.onRefresh()`。
- 他Method: h4_StartRevision, h4_CreateNewRevision(アクション名として)。
- 注意: 必須チェックのメッセージ「katotest 必須項目に入力が必要」は仮文言(コメントに「メッセージ作る」)、チェック後にreturnしない。`debugger;` 残存。スピナーOFFはasync完了を待たず即実行される構造。

## 80. h4_CreateTestResult
- 言語: JavaScript / id 22A2F8C03C6E4D6D8FA4E14D864CF5DF / comments: 「必要資料”指摘アイテム”から作成時の処理。」(実際はテスト結果新規作成時の初期値設定)
- 概要: テスト結果(this)を新規作成する際、親が必要資料(h4_ReqDoc)の場合に、親の値を引継いでセットする。
- 呼び出し契機(推測): h4_Test_Result の onAfterNew/onBeforeNew(クライアントイベント)。
- フロー: `parent.thisItem` が無い(TOCから作成)→ `h4_C_E_0001` AlertError で作成不可。親の型が h4_ReqDoc 以外ならスキップ。親から h4_dept, h4_event, h4_my, h4_destination, h4_model_code, h4_approve_style, h4_delta_version, h4_evaluation_unit, h4_unique_event をコピー。アイテム型プロパティ `h4_model_name`(HRDPMTypModelProject), `managed_by_id`(Identity)は keyed_name 付きの item を取得して `setPropertyItem`(**値の取得元は thisItem=this自身のプロパティ**)。`h4_parent` に親アイテムを `setPropertyItem`。例外は `h4_C_E_0002`。
- 注意: アイテム型プロパティは親ではなくthisItemから値を取得(コードどおり。親からのコピー対象ではない可能性)。

## 81. h4_ctrl_keyed_name
- 言語: C# / id 2FCFBEAC076C4C45A0861156055148B8 / comments: 「キーネームの先頭にΔを付けて表示する」
- 概要: this の keyed_name の先頭に "⊿" を付与して返す。呼び出し契機(推測): keyed_name 表示加工(onAfterGet 等)。

## 82. h4_cui_ivicb_auto_event_init
- 言語: JavaScript / id 32D26EFE450E4CA593F1F8FCB64B9311 / comments なし
- 概要: ItemView(フォーム画面)コマンドバー「イベントアップ」ボタンの初期化(CUI初期化メソッド)。アイテムの h4_directaplist が "Approved" または "ProvisionalApproved" 以外なら disabled:true。それ以外は disabled:false。戻り値: `{disabled: ...}`。

## 83. h4_cui_ivicb_copy_init
- 言語: JavaScript / id 9D961713AB4D4B82A313B0C104030619 / comments: 「帳票マスタの複製ボタンの初期化メソッド」(exec: Administrators)
- 概要: ItemView上の「複製」ボタンの表示/活性制御。
- ロジック: `managed_by_id`(管理者)がログインユーザーのIdentityリスト(`aras.getIdentityList()`)に含まれる場合のみ表示(hidden:false)、含まれない/空なら hidden:true,disabled:true。表示時、state=="Release" のときのみ活性(disabled:false)、それ以外は disabled:true。Alias(ユーザーのエイリアスIdentity)取得処理は行うが aliasId は判定に未使用。

## 84. h4_cui_ivicb_MQMasterCopy_init
- 言語: JavaScript / id F17D0FAC5836431B97481ECEB1571AC1 / comments: 「MQMaster_Copy_ivicb_init」
- 概要: マルQマスタフォーム上の複製ボタンの初期化。83と同ロジックだが、ステート条件なし(disabledFlg 初期 false)。管理者(managed_by_idがIdentityリストに含まれる)のみ表示かつ活性、それ以外は hidden:true,disabled:true。

## 85. h4_cui_ivrcb_SetReqDocCLN_init
- 言語: JavaScript / id F37BCB6022CD41D18D4499089BB9626B / comments なし
- 概要: リレーションシップグリッド(RelationshipView)の「担当者一括設定(必要資料CLN設定)」ボタンの表示/活性制御。
- ロジック: 親アイテム(itemTypeName,itemID)の h4_approve_style が "0"(WFなし)、または取得不可なら hidden:true。グリッドの選択行(`grid.getSelectedItemIds()`)の関連アイテム(グリッドのItemType=リレーションタイプ)を取得。選択なしなら disabled:true。選択行の related item の `managed_by_id` が全てログインユーザーのIdentityリストに含まれる場合のみ活性(1件でも含まれなければ disabled:true)。取得エラー時は `h4_C_E_0002` を AlertError。
- 注意: 選択行ごとに Alias取得を繰り返す(結果は未使用)。

## 86. h4_cui_svcb_auto_event_init
- 言語: JavaScript / id 01909C7FE14E403DB61164A4A02024D4 / comments: 「検索グリッド上のイベントアップボタンの制御」
- 概要: 検索グリッド(SearchView)のイベントアップボタン制御。選択行が1件で、その state が "Approved" または "ProvisionalApproved" の場合のみ活性。それ以外 disabled:true。
- 補足(コードコメント): メニューボタン初期化メソッドを行選択で発火させるには、自身の include_events に加え親メニューの include_events でも「ステートの更新」を有効化する必要がある(250728記載)。

## 87. h4_cui_svcb_copy_init
- 言語: JavaScript / id 0F8973516399491DAF84722C5E821B86 / comments なし
- 概要: 検索グリッド上の帳票マスタ複製ボタンの表示/活性制御。選択行ごとに state, managed_by_id を取得。取得エラーなら hidden:true,disabled:true で終了。管理者(managed_by_idがIdentityリスト)でない行があれば hidden:true,disabled:true で終了。state=="Release" で活性。選択行が1件でなければ disabled:true(コメント「公開の帳票マスタが1つ選択されている時のみ活性化、管理者のみボタンを表示」)。戻り値 `{hidden, disabled}`。

## 88. h4_cui_svcb_deptmaruqcreat_init
- 言語: JavaScript / id FA17476F1AA74FB8939C8EF414DE3DD0 / comments: 「Gr・室課用作成ボタン初期化メソッド(検索ビュー用)」
- 概要: マルQページ検索ビューの「室課／GroupマルQページ作成」ボタン制御。複数選択可。選択した全マルQページが、(state が "Approved" または "ProvisionalApproved") かつ (h4_class が "Gr" または "Sec") であること。さらに選択行の区分(h4_class)が2種類以上混在する場合は disabled:true。選択0件は disabled:true。
- 注意: ヘッダコメントは「ステータスが[承認]」とあるが、コードは仮承認(ProvisionalApproved)も許可。`debugger;` 残存。

## 89. h4_cui_svcb_MQMasterCopy_init
- 言語: JavaScript / id 069C8DAC1F3E4C7DA58F00B5D27E93E3 / comments なし
- 概要: 検索グリッド上のマルQマスタ複製ボタン制御。選択行の managed_by_id がログインユーザーのIdentityリストに含まれる場合のみ表示・活性(含まれない行があれば hidden:true,disabled:true で終了)。選択行が1件でなければ disabled:true。ステート条件は無い(コメントには「公開の…」とあるがコードにstate判定なし)。

## 90. h4_DATFormatIRVCB_MultiWFStart
- 言語: JavaScript / id A1B66A1FD4C740D08ED5DD9D8E0F1A86 / comments: 「開達書式リレーションシップグリッドの選択アイテムから一括WFを作成する」
- 概要: 開達書式のリレーションシップグリッド(帳票マスタ等の開達書式タブ)で選択した行から、開達書式一括承認(h4_AppWFGroupForDATFormat)を作成して開く。
- 呼び出し契機(推測): 帳票マスタ等の開達書式リレーションタブのコマンドバーボタン(`this.grid`, `this.itemTypeName`)。
- 制限(冒頭コメント): 公開までのアイテム(コメント)/他の一括に含まれない/EXP検定と非EXPのどちらか一方のみ。ただしコード上の判定: `unCreatableStateName=["InProgress"]` に含まれない state(=作業中以外)をNGとする(コメントの「公開まで」と実装の表現は異なるが、コードは「作業中のものはNG、それ以外はOK」ではなく「リストに含まれなければNG」=作業中のみ許可、の判定。コード読みとしては `includes(state) == false` → NG)。
- フロー: 確認ダイアログ(`h4_C_I_0803`/`h4_C_I_0001`)でOKなら実行。未選択→`h4_C_E_0003`。選択リレーション行を `in` 条件で取得(related_id(keyed_name,h4_category,state))。各開達書式について、最初の資料分類(EXPTest か否か)と異なる、または state が InProgress でないものを keyed_name で収集、あれば `h4_C_E_0201`(`{0}`置換)で AlertError。`h4_CheckDuplicatAppTargetForDat`(allItemIDList=ids.join("','"))で重複確認。`h4_AppWFGroupForDATFormat` を add: h4_isexp=EXP("1")/非EXP("0")、各開達書式を `h4_AppWFGr4DATFormat DATFormat`(related_id)リレーションで追加(リレーション行IDから `getRelatedItemID()` で related_id を取得)して apply(失敗は `h4_C_E_0008`)。`h4_setDefaultCLNItemForDAT`(type=h4_AppWFGroupForDATFormat, idlist=ID)で担当者一覧初期化後、`aras.uiShowItem` で表示。例外は `h4_C_E_0002`。
- 他Method: h4_CheckDuplicatAppTargetForDat, h4_setDefaultCLNItemForDAT。
- 注意: `debugger;` 残存。コメント「作成して開く画面では担当者がクリエイターのままだが、担当者を適切に入れてないとVoteはできないため問題ない」。

## 91. h4_DATFormatSVCB_MultiWFStart
- 言語: JavaScript / id 741F2E864C924516B8F43844311632BC / comments: 「開達書式SVの選択アイテムから一括WFを作成する」
- 概要: 90の検索ビュー(SV)版。`grid.getSelectedItemIds()` が直接 h4_DATFormat のID。取得は `h4_DATFormat` を in条件(keyed_name,h4_category,state)。制限(冒頭コメント): 作業中のアイテム/他の一括に含まれない/EXP検定と非EXPのどちらか一方のみ。チェック・メッセージ(h4_C_E_0201/0003/0002/0008、h4_C_I_0803/0001)・重複確認(h4_CheckDuplicatAppTargetForDat)・h4_AppWFGroupForDATFormat 作成(h4_isexp設定、h4_AppWFGr4DATFormat DATFormat追加、h4_setDefaultCLNItemForDAT 呼出、`aras.uiShowItem`)は90と同じ。
- 90との差: 選択IDをそのまま related_id に使う(リレーション行→related_id変換が不要)。`debugger;` はこの版にはない。


