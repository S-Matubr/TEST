<!-- meta
legacy: knowledge/_legacy/機能設計書.md L5698-L5782
source: source/package/Independent/Import/Method/
-->
# Method AML 調査 C_method2d (129〜141番目: h4_GrantAuthority 〜 h4_init_ivicb_add_events)

---
## [129] h4_GrantAuthority
- 言語: C# / comments: なし
- 概要: 渡されたAMLを `Administrators` 権限で実行する汎用ラッパー。
- 入力: `aml`(文字列)。出力: `inn.applyAML(aml)` の結果Item。
- 処理: aml が空なら `newError("AMLが指定されていません")`。`GrantIdentity(Administrators)` 下で `applyAML` 実行、エラーならそのまま返却。例外は `"エラーが発生しました: " + ex.Message`。
- 呼び出し契機(推測): クライアント/他Methodから権限昇格が必要なAML実行時。
- 注意点: 任意AMLを管理者権限で実行できる(呼び出し元の制限はコード上なし。実行許可はWorld)。

## [130] h4_hidePath
- 言語: C# / comments: WFの指示を指定して、それを非表示にする
- 概要: 指定パス名のWFパスを現在のアクティビティで非表示にする(オリジナルは h4_hidePullBack — コメント)。
- 入力: `acId`(Activity ID), `targetPathName`。処理: `h4_SetPathVisibility` を `<targetPathName>…</targetPathName><acId>…</acId><isVisible>0</isVisible>` で `applyMethod`。エラーならエラー文字列を返す。戻り値 this。
- 呼出す他Method: `h4_SetPathVisibility`。

## [131] h4_hidePullBack
- 言語: C# / comments: ワークフローアクティビティ画面の引き戻し指示を隠す
- 処理: this の `id`(Activity)と固定パス名 `pullBack` で `h4_hidePath` を `applyMethod`。エラー時はエラー文字列。
- 呼び出し契機(推測): WFアクティビティの OnActivate 等のイベントMethod。

## [132] h4_hidepullBack_RA_IP
- 言語: C# / comments: ワークフローアクティビティ画面の承認依頼から作業中への引き戻し指示を隠す
- 処理: [131]と同様、固定パス名 `pullBack_RA_IP`(承認依頼(RA)→作業中(IP)への引き戻し)で `h4_hidePath` を呼ぶ。

## [133] h4_hideYryrRequestApproval
- 言語: C# / comments: ワークフローアクティビティ画面のやるやら承認依頼指示を隠す
- 処理: [131]と同様、固定パス名 `YryrReview` で `h4_hidePath` を呼ぶ。`Administrators` 権限(GrantIdentity)内で実行。
- 呼出す他Method: `h4_hidePath`。

## [134] h4_identity_grid_event
- 言語: JavaScript / 実行許可: Administrators
- 概要: Identity検索ダイアログのフィルタ設定。`name` に `**`(固定なし)、`is_alias`=`0`(固定) → エイリアスでないIdentityのみ。
- 戻り値: Filterオブジェクト。(呼び出し契機(推測): Identity選択用プロパティのgrid event として指定)

## [135] h4_identity_grid_event_alias
- 言語: JavaScript / 実行許可: World
- 概要: 上記のエイリアス版。`name`=`**`(固定なし)、`is_alias`=`1`(固定)。担当者(ユーザーに紐づくエイリアスIdentity)選択用(推測)。

## [136] h4_IncrementRound
- 言語: C# / comments: 承認対象の差し戻し時にインクリメントと次数上げ(一括承認用)
- 概要: 一括承認WF(ApprovalWFGroup)が差し戻された際に、WFアイテム・承認対象マルQページの承認次数(`h4_approval_round`)を+1し、配下の「やるやら」対象の未承認必要資料を複製(新次数)して元を却下(`Unapproved`)へ遷移させる。
- 呼び出し契機(推測): `h4_ApprovalWFGroup` WFの差し戻し(Reject)パス/アクティビティのイベント。
- 入力: this = WFのアクティビティ側Item(`this.getID()` を `h4_GetControlledItem` に渡す)。出力: this / エラー(`h4_S_E_0002`)。全体を `Administrators` 権限で実行。
- 処理フロー:
  1. `h4_GetControlledItem` でWFが管理する Item(h4_ApprovalWFGroup)を取得し、`h4_incRoundTargetItem` で `h4_approval_round` を+1。
  2. `h4_ApprovalWFGroup_ApTarget`(source_id=WF)で承認対象一覧を取得し、各対象を `typeId`=`itemtype` プロパティとIDで get。件数1以外はスキップ。
  3. 対象が `h4_MQPage` の場合のみ: マルQページの次数+1 → `h4_MQPage ReqDoc`(source_id=マルQ)の各必要資料(`h4_ReqDoc`)について、`h4_yryr`=="0"(やるやら×)はスキップ。state が `InProgress, InReview, RequestProvisionalApproval, RequestApproval, ProvisionalApproved` のいずれかなら:
     a. 必要資料を `clone(false)` して新規作成(`sort_order`="" , `current_state`="" , `permission_id`="" , `h4_directaplist`="InProgress")。
     b. 関連リレーション `h4_ReqDoc CLN, h4_ReqDoc DocsInfoGridN, h4_ReqDoc FormatN, h4_ReqDoc PointOut, h4_ReqDoc SingOff1N, h4_ReqDoc TestResult, h4_ReqDoc TGVRevQuery`(成果物除く)を `h4_setRelation` でクローン先に複製。`h4_ReqDoc TestResult` は、テスト結果(`h4_Test_Result`)の `h4_parent` が元必要資料なら新必要資料へ edit(version=0, serverEvents=0)で差し替え。
     c. 成果物 `h4_ReqDoc Doc`(related=Document)ごとに Document を clone(version=0)、リレーション `h4_ReqDoc Doc` を新必要資料に add、`Document File` の各File を `copyAsNew`(useInputProperties=1, filename=リレーションのname)して新Documentへ `Document File` を clone(source/related差替)。
     d. 元の必要資料を get し `Aras PLM` 権限で `promote("Unapproved","WF却下プロモート")`。
     e. clone先の次数を+1。`h4_MQPage ReqDoc` の元リレーションを clone して(related=新必要資料、`sort_order`="", version=0)追加。
- 内部関数: `h4_incRoundTargetItem`(`h4_approval_round` +1 の edit。version=0、serverEvents=0 で履歴/サーバーイベントを発生させない)、`h4_setRelation`(リレーション複製)。末尾に `private void dummy() {` という未完のスタブがあり、Methodラッパーとの括弧合わせ用(コード上の事実)。
- 呼出す他Method: `h4_GetControlledItem`。
- 注意点: `reqDocName4SQL` は未使用。必要資料以外(他タイプの承認対象)は次数変更のみでMQPage以外は何もしない(コメント「他のパターン(必要資料)では何もしない」)。

## [137] h4_IncrementRoundForMQPage
- 言語: C# / comments: 承認対象の差し戻し時にインクリメントと次数上げ(マルQ用) — マルQページ単独WF用
- 概要: [136]のマルQページ単独WF版。WFが管理するItem(`h4_GetControlledItem`)が `h4_MQPage` でなければ何もせず終了。マルQの次数+1後、配下必要資料に対し[136]と同じ複製・却下処理(clone, 関連リレーション複製, 成果物Document/File複製, 元を `Unapproved` へプロモート(Aras PLM権限), 次数+1, `h4_MQPage ReqDoc` リレーション複製)を実施。
- 相違点: `h4_ApprovalWFGroup_ApTarget` は使わない。`tmpRelBase` 取得は `isError || count!=1` でエラー。
- 呼出す他Method: `h4_GetControlledItem`。

## [138] h4_IncrementRoundForMQPageDirect
- 言語: C# / comments: 承認対象の差し戻し時にインクリメントと次数上げ(マルQダイレクト用)
- 概要: ダイレクト承認遷移時用。入力が `type`/`id` で渡される点と、`h4_approve_style`=="0"(コメント上「directの遷移でのみ実行」)のときのみ実行する点が [137] と異なる。それ以外の複製・却下処理は同一。
- 入力: this の `type`, `id`。`type`≠`h4_MQPage` なら終了。マルQを select=`id,h4_approve_style,h4_approval_round` で取得し、取得失敗/0件で `h4_S_E_0002`。`h4_approve_style`≠"0" なら終了。
- 呼出す他Method: なし(`h4_GetControlledItem` は使わない)。

## [139] h4_IncrementSequenceNumber
- 言語: JavaScript / comments: 担当一覧追加時、追加した順番が保存時(Before)でわかるようにsort_orderに値を入れておく
- 概要: 標準「Increment Sequence Number」参考。リレーション追加時にsort_orderを自動採番(現在の最大値+128、無ければ128)。
- 入力: `relationshipTypeName`, `relationshipID`(標準リレーションイベントの変数)。処理: `parent.document.item` または `parent.parent` の item から `@isTemp="1"` の新規リレーションが2件未満なら `aras.getItemRelationshipsEx` で読込み、XPathで最大 `sort_order` を求め、対象リレーションItem に `sort_order` を設定。
- 呼び出し契機(推測): 担当者一覧(CLN)リレーションの onInsertRow 等のクライアントイベント。

## [140] h4_init_ivicb_add_CheckList
- 言語: JavaScript / comments: 開発拠点追加ボタンの初期化
- 処理: `{disabled: !this.isEditMode}` を返す(編集モード時のみ活性)。

## [141] h4_init_ivicb_add_events
- 言語: JavaScript / comments: イベント設定ボタン初期化メソッド
- 処理: `{disabled: !this.isEditMode}` を返す(編集モード時のみ活性)。


