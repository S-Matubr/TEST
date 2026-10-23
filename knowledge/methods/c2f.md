<!-- meta
legacy: knowledge/_legacy/機能設計書.md L5881-L5943
source: source/package/Independent/Import/Method/
-->
# Method AML 調査 C_method2f (157〜165番目: h4_ivrcb_MultiWFStart 〜 h4_MQPage_ivicb_auto_event_init)

---
## [157] h4_ivrcb_MultiWFStart
- 言語: JavaScript / comments: 必要資料リレーションシップグリッドの選択アイテムからWFの親を作成するメソッド
- 概要: マルQページの必要資料リレーションの選択行から、一括承認WFの親アイテム `h4_ApprovalWFGroup` を作成して開く。
- 呼び出し契機(推測): 必要資料リレーションタブ(`h4_MQPage ReqDoc`)ツールバーの「一括WF開始」ボタン。
- 入力: `this.grid`(選択行)。出力: なし(新規 h4_ApprovalWFGroup を `aras.uiShowItem` で表示)。
- 処理フロー:
  1. 確認ダイアログ(UserMessage `h4_C_I_0802` 本文、`h4_C_I_0001` タイトル)でOKの場合のみ実行。
  2. 選択0件なら `h4_C_E_0003`。
  3. 選択行のリレーション(`grid._itemType.name`, id in 選択)の related(select `keyed_name,h4_approve_style,h4_yryr,state`)を取得し、`allItemIDList` に related ID を蓄積。次のいずれかに該当する必要資料があれば、そのkeyed_nameを `<br>` で連結し `h4_C_E_0502`(`{0}` 置換)で警告して終了: `h4_approve_style === "0"`(WFなし)、`h4_yryr !== "1"`(やるやら対象外)、state が `Approved`/`Unapproved`/`YryrRequestApproval`(`unCreatableStateName`)。
  4. Method `h4_CheckDuplicatAppTarget`(allItemIDList を `','` 区切りで渡す)で既に承認対象になっていないか確認。エラーならそのメッセージを表示して終了。
  5. `h4_ApprovalWFGroup` を新規(add)。先頭選択行の `h4_MQPage ReqDoc` から related の `h4_delta_version, h4_dept, h4_destination, h4_event, h4_model_code, h4_model_name, h4_my, h4_evaluation_unit, h4_unique_event` を取得して WF親へ設定(`h4_directaplist`="InProgress")。選択行ごとに `h4_ApprovalWFGroup_ApTarget`(related_id=必要資料ID)を子リレーションとして追加。
  6. `apply` し、エラー時は `h4_C_E_0007` を表示。続けて Method `h4_setDefaultCLNItem`(`<type>h4_ApprovalWFGroup</type><idlist>WF親ID</idlist>`)で担当者一覧の既定値を追加し、`aras.uiShowItem` で表示。例外時 `h4_C_E_0002`。
- 呼出す他Method: `h4_CheckDuplicatAppTarget`, `h4_setDefaultCLNItem`。
- 注意点: `debugger;` 残存。5.のselectは `related_id, h4_delta_version, h4_dept, h4_destination, h4_event, h4_model_code, h4_model_name, h4_my` で、`h4_evaluation_unit`/`h4_unique_event` は select に含まれない(コード上の事実)。`wfItem.apply()` がエラーでも後続で `wfItem.getID()` を使う流れ。

## [158] h4_List_By_Promote_MQPage ReqDoc
- 言語: C# / comments: プロモート後に、ListとStateが食い違っていた時にListをStateに合わせる(必要資料とテスト結果用)
- 概要: プロモート後、プロパティ `h4_directaplist`(List) とライフサイクルのステート名が一致しなければ List をステートに合わせる(direct遷移対応など)。サーバーイベントは動かさない(`serverEvents=0`)。
- 呼び出し契機(推測): `h4_ReqDoc`/`h4_Test_Result` ライフサイクル遷移の Post メソッド(`this.getAttribute("idlist")`, `this.getType()` を使用)。
- 入力: this の属性 `idlist`(カンマ区切りID)、this の型。
- 処理: `Administrators` 権限。各IDを get(select `h4_directaplist,current_state`)、`Life Cycle State` の name を取得。一致しなければ(ロック状態が1(自分でロック)ならいったんアンロック)、state名が `InProgress, InReview, ProvisionalApproved(必要資料のみ), RequestApproval, Approved, Unapproved(必要資料のみ), YryrRequestApproval(必要資料のみ)` のいずれかなら同名を `h4_directaplist` に設定(それ以外は既定 `InProgress`)。`edit` に `version="0"`, `serverEvents="0"` を付与。アンロックした場合は再ロック。
- 呼出す他Method: なし。

## [159] h4_List_By_Promote_MQPage
- 言語: C# / comments: プロモート後に、ListとStateが食い違っていた時にListをStateに合わせる(MQページ用)
- 処理: [158]と同一構造。対応ステート名は `InProgress, InReview, ProvisionalApproved, RequestApproval, Approved` のみ(Unapproved, YryrRequestApproval なし)。

## [160] h4_ListByPromoteApWFGroup
- 言語: C# / comments: プロモート後に、ListとStateが食い違っていた時にListをStateに合わせる(一括承認用)
- 処理: [159]と同一(対応ステートも同じ5種)。コメントに「direct遷移は一括承認にはない」とある。

## [161] h4_MainFormMin
- 言語: JavaScript / comments: マルQページ一覧ツリー、イベント横通しテーブルを表示した際にメインフォームを最小化する
- 概要: フォーム表示時に、メインフォーム部分(`.aras-accordion` の先頭)を、ログインユーザーが Administrators でなければ閉じ、Administrators なら開く。
- 処理: `document.thisItem` の `id` が空(新規作成時)なら何もしない(設定画面表示のため)。`aras.getIdentityList()` の各IdentityをkeyedName確認し、`Administrators` があれば `adminCheck=false`。`accordions[0].toggle(adminCheck)`(true: Close, false: Open)。
- 呼び出し契機(推測): フォームの onLoad イベント。注意点: Identity毎に `getItemById` を実行(往復多め)。owned_by_id/created_by_id判定はコメントアウト。

## [162] h4_MQMaster_Copy
- 言語: C# / comments: MQMster_Copy
- 概要: マルQマスタ(`h4_DeptMQMaster`)を複製する。呼び出し元: `h4_MQMaster_ivicb_copy` / `h4_MQMaster_svcb_copy`(コード内コメント)。
- 入力: `id`, `type`。出力: 複製した h4_DeptMQMaster(失敗時 `newError("cloneError")` または add 結果のエラー文字列)。
- 処理: `Administrators` 権限。元を get、新IDで `h4_DeptMQMaster` を add(`h4_class, h4_dept, h4_group, h4_section, h4_approve_style, managed_by_id, owned_by_id, h4_delta_version, name, h4_base_format_master` をコピー)。リレーション `h4_DMQMaster DATFormat`, `h4_DMPMaster Table` を走査するが、複製処理が実装されているのは `h4_DMQMaster DATFormat`(`h4_datformat_name` を保持して related_id=同一開達書式IDで add)のみ。`h4_DMPMaster Table` は取得するだけで複製処理なし。
- 注意点: `targetIds`, `targetCategories` は宣言のみで未使用。開達書式自体は複製せず、同一アイテムを参照する。

## [163] h4_MQMaster_ivicb_copy
- 言語: JavaScript / comments: MQMaster_Copy
- 概要: アイテムビューの複製ボタン。確認ダイアログ(UserMessage `h4_C_I_0402` 本文、`h4_C_I_0001` タイトル、`h4_cmn_ShowMessage_Arg` 経由)→ `h4_MQMaster_Copy`(id=選択行または表示中アイテムID, type)→ 複製アイテムを `aras.uiShowItem`。⊿バージョン・名称入力ダイアログは無い([95]と差異)。例外時 `h4_C_E_0002`。
- 呼出す他Method: `h4_cmn_ShowMessage_Arg`, `h4_MQMaster_Copy`。

## [164] h4_MQMaster_svcb_copy
- 言語: JavaScript / comments: MQMaster_Copy / 実行許可: Administrators
- 概要: [163]のサーチビュー版。`options.getState().grid.selectedRows[0]` のアイテム(select=managed_by_id、結果は未使用)を複製。確認後 `h4_MQMaster_Copy` を呼び、結果を表示。

## [165] h4_MQPage_ivicb_auto_event_init
- 言語: JavaScript / comments: なし
- 概要: 「自動イベント」等のボタン初期化。`h4_directaplist` が `Approved` のときのみ活性。
- 処理: `disableFlag=true` をデフォルトにし、`aras.getItemProperty(this.getItem(),"h4_directaplist")=="Approved"` なら `hiddenFlag=false; disableFlag=false`。戻り値 `{disabled: disableFlag}`。
- 注意点: `hiddenFlag` は宣言がコメントアウトされた状態で代入されている(承認済み時に未宣言変数への代入になる; コード上の事実)。`debugger;` 残存。


