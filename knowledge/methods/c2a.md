<!-- meta
legacy: knowledge/_legacy/機能設計書.md L5384-L5537
source: source/package/Independent/Import/Method/
-->
# Method AML 調査 C_method2a (92〜106番目: h4_DATHistIvrcbCreateInit 〜 h4_frm_get_destination)

共通事項: 全Methodとも `execution_allowed_to` は World(A73B655731924CD0B027E4F4D5FCC0A9) または Administrators(2618D6F5A90949BAA7E920D1B04C7EE1)。「呼び出し契機」は特記なき限りコードコメント/名称からの推測。

---
## [92] h4_DATHistIvrcbCreateInit
- 言語: JavaScript
- コメント(comments): 帳票マスタ・開達書式の改訂履歴リレーションのボタン表示の表示基準変更
- 概要: 標準 `cui_ivrcb_create_item_init` の改造版。親アイテムのステートが作業中/改訂中のときだけ「新規作成(追加)」ボタンを表示する。
- 呼び出し契機(推測): リレーションタブ(改訂履歴リレーション)の「新規作成」ボタン(CUI Command Bar item)の init イベント。
- 入力: `itemTypeName`, `itemID`(親), `options.relationshipTypeNode`, `options.relatedItemTypeId`, `options.relatedItemTypeNode`, `options.relatedTypeName`, `target.tooltip_template`。出力: `{hidden, disabled, tooltip_template}`。
- 処理フロー:
  1. 親Itemを get(select=`managed_by_id,state`)。取得0件(新規作成時)なら `{hidden:true}`。
  2. `state` が `InProgress` でも `InRevision` でもなければ `{hidden:true}`。
  3. 標準処理: RelationshipType の `related_option` / `related_id` 取得。`options.relatedItemTypeId` があれば関連ItemTypeの `label` で tooltip_template の `{0}` を置換。
  4. 戻り値 `disabled: !(window.computeCorrectControlState && window.computeCorrectControlState('new'))`、`hidden: relId==='' || !(relOption==='1' || relOption==='2')`。
- 呼出す他Method: なし(`window.computeCorrectControlState` は標準)。
- 注意点: 「対象ユーザーなら親の状態に関係なく追加」という旧コメントがあるが、現コードは状態InProgress/InRevisionのみ表示。`managed_by_id` は取得するが未使用。

## [93] h4_DATHistIvrcbDellInit
- 言語: JavaScript
- 概要: 標準 `cui_ivrcb_deleterow_init` の改造版。改訂履歴リレーションの「行削除」ボタンを、親ステートがInProgress/InRevision以外なら非表示にする。
- 呼び出し契機(推測): 改訂履歴リレーションタブの行削除ボタンの init。
- 入力: `itemTypeName`, `itemID`, `options.relationshipItemTypeLabel`, `target.tooltip_template`。出力: `{hidden}` または `{disabled, tooltip_template}`。
- 処理フロー: 親Item get(`managed_by_id,state`) → 0件なら hidden → state が `InProgress`/`InRevision` 以外なら hidden → `window.computeCorrectControlState('delete')` で disabled 判定 → tooltip の `{0}` を関係ItemTypeラベルで置換。
- 呼出す他Method: なし。 注意点: `managed_by_id` 取得は未使用。

## [94] h4_DATMaster_Copy
- 言語: C#
- コメント: 帳票マスタの複製メソッド
- 概要: 帳票マスタ(h4_DATMaster)を、配下の開達書式(h4_DATFormat)・リンク・書式ドキュメント・担当者一覧等ごと複製する。
- 呼び出し契機: コード冒頭コメントより `h4_DATMaster_ivicb_copy` / `h4_DATMaster_svcb_copy` から呼ばれる(コード記載)。
- 入力(this のプロパティ): `id`(複製元ID), `deltaVersion`, `name`, `type`(ItemType名)。出力: 複製後の h4_DATMaster Item(失敗時 `inn.newError`)。
- 処理フロー:
  1. `Administrators` 権限(`CCO.Permissions.GrantIdentity`)で実行。
  2. 複製元 h4_DATMaster を get。新ID(`getNewID`)で `h4_DATMaster` を add(`doGetItem=0`)し、`h4_delta_version`=入力deltaVersion, `name`=入力name, `h4_updatedate`="" , `effective_date`="" , `managed_by_id`=元の値。エラーなら `newError("cloneError")`。
  3. 複製元の `h4_DATMaster DATFormat`, `h4_DATMaster CLN` の両リレーションをfetchして各行を処理。
     - `h4_DATMaster DATFormat`: 元の h4_DATFormat を get し新IDで add(`h4_delta_version`=入力値、`name, h4_category, h4_class, h4_doc_class, h4_doc_link1-3, h4_guideline_link1-3, h4_supplementary_materials1-2, managed_by_id, owned_by_id(閲覧者), h4_document_content(資料内容), h4_doc_description`をコピー)。`targetIds`/`targetCategories` に新IDとカテゴリ(h4_category)を蓄積。`h4_DATMaster DATFormat` リレーションを(source=複製マスタ, related=複製開達書式)で add。さらに開達書式の下位リレーションを複製:
        - `h4_DATFormatLink`: `h4_itemname, h4_description, h4_event, h4_datformatlink, h4_urllink` をコピーし source_id=複製開達書式で add。
        - `h4_DATFormat Doc`: Document を get→add(`item_number, name, file_item, h0_classification1, h0_classification2, h0_image, h0_url, h4_pdf_file`)し `h4_DATFormat Doc` リレーション追加。元Documentの `Document File` リレーションを複製Documentへ `sort_order=(m+1)` で追加(ファイルItemは同一IDを関連付け)。
        - `h4_DATFormat CLN`(担当者一覧): `h4_check_required, h4_workflow_role` と `related_id` をコピー。
        - `h4_DATFormat EXPCLN`(担当者一覧(EXP検定)): 同上。
     - `h4_DATMaster CLN`: `h4_check_required, h4_workflow_role`, `related_id` をコピーして複製マスタへ追加。
  4. 各 add が失敗したら `getErrorString()` を `newError` で返却。
  5. 複製後に Method `h4_ReAssign_AfterCopy_DATFormat` を呼ぶ: まず複製マスタID(`targetIds`)・`targetCategories`=type で1回、続いて複製した各開達書式ID・カテゴリで繰り返し。エラーなら返却。
  6. 複製した h4_DATMaster を返却。
- 呼出す他Method: `h4_ReAssign_AfterCopy_DATFormat`(複数回)。
- 注意点: コード内の配列 `relItemNames_DATFormat` の順で処理。DATFormat・Document等の失敗判定は一部(DATFormatCopyItem, DATFormatDocCopyItem の apply 結果)で行っておらず、リレーション add 側のみチェック。ステート・ライフサイクルのコピーは明示されていない。

## [95] h4_DATMaster_ivicb_copy
- 言語: JavaScript
- コメント: 帳票マスタ複製メソッドを呼びだすメソッド(アイテムビュー)
- 概要: アイテムビューの「複製」ボタン。確認ダイアログ→⊿バージョン・名称の入力ダイアログ→`h4_DATMaster_Copy` 呼出→複製アイテムを開く。
- 呼び出し契機(推測): 帳票マスタ アイテムフォームのCUIボタン(ivicb=item view command bar)のクリック。
- 入力: `this.itemTypeName`, `options.getState().grid`(選択行)。出力: なし(新規アイテムを `aras.uiShowItem` で表示)。
- 処理フロー:
  1. `h4_cmn_ShowMessage_Arg` でメッセージ `h4_C_I_0001`(タイトル)・`h4_C_I_0402`(本文)を取得し `ArasModules.Dialog.confirm`。
  2. 'ok' なら フォーム `h4_DATMasterCopyInputInitVal` をダイアログ(`ShowFormAsADialog.html`, 600x300, title「帳票マスタ作成時の値設定」)表示。⊿バージョンはList `h4_DeltaVersion` の Value(label,value)を取得して渡す。
  3. ダイアログ結果(カンマ区切り 0:⊿バージョン,1:名称)を分解。gridの選択行があればその先頭、無ければ最上位ウィンドウの `itemID` を複製元IDとする。
  4. Method `h4_DATMaster_Copy` に `id, deltaVersion, name, type(=itemTypeName)` を設定して実行し、結果を `aras.uiShowItem(itemTypeName, result.getID())` で表示。
  5. 例外時は `h4_C_E_0002` を `aras.AlertError`。ダイアログを閉じた場合はスピナー停止のみ。
- 呼出す他Method: `h4_cmn_ShowMessage_Arg`, `h4_DATMaster_Copy`。
- 注意点: 定数 `relItemNames` 等は宣言のみで未使用。`h4_DATMaster_Copy` の結果エラー確認なし。

## [96] h4_DATMaster_svcb_copy
- 言語: JavaScript
- コメント: 帳票マスタ複製メソッドを呼びだすメソッド(サーチビュー)
- 概要: [95]のサーチビュー版。選択行(単一)のアイテムを複製。
- 呼び出し契機(推測): 帳票マスタ 検索グリッドのツールバー(svcb)ボタン(コメント上「選択アイテムが1つのときのみ実行される」)。
- 処理フロー: [95]とほぼ同一(`options.itemTypeName` を使用、複製元ID=`options.getState().grid.selectedRows[0]`)。追加で複製元を `select=state,managed_by_id` で get(結果は未使用)。確認ダイアログ→値設定ダイアログ→`h4_DATMaster_Copy`→`aras.uiShowItem`。
- 呼出す他Method: `h4_cmn_ShowMessage_Arg`, `h4_DATMaster_Copy`。 注意点: エラー時メッセージ `h4_C_E_0002`。

## [97] h4_DATMasterIVRCB_WFActionsInit
- 言語: JavaScript
- コメント: 帳票マスタの開達書式リレーションの一括WFメニューの表示切替
- 概要: 一括ワークフロー(WF)メニューの hidden/disabled 制御。
- 呼び出し契機(推測): 帳票マスタ 開達書式リレーションタブのCUIメニューの init。
- 入力: `itemTypeName`, `itemID`。出力: `{hidden, disabled}`。
- 処理フロー: 親Item get(`locked_by_id, managed_by_id, created_by_id, state`)。0件なら hidden。`canPromote` = (ログインユーザID==created_by_id) または identityList に `managed_by_id` を含む または administrators(2618D6F5A90949BAA7E920D1B04C7EE1)を含む。`hidden = !canPromote`。`disabled = window.isEditMode || lockStatus!=0 || state==="Release"`。
- 呼出す他Method: なし。 注意点: コード内コメントの「承認済み」は実際には state `Release`(公開)判定。SuperUser/ArasPLM判定はコメントアウト。

## [98] h4_DATReviseInit
- 言語: JavaScript
- コメント: 改定ボタンの表示制御(帳票マスタと開達書式共通)
- 概要: 「改訂」ボタンを、非編集・非ロック・権限あり・ステート`Release`のときだけ表示。
- 呼び出し契機(推測): 帳票マスタ/開達書式のアイテムビュー CUIボタン init。
- 処理フロー: 親Item get(select=`managed_by_id,state`)。0件なら hidden。canRevise = ユーザID==created_by_id または identityList に managed_by_id / Super User(6B14D33C4A7D41C188CCF2BC15BD01A3) / Aras PLM(56A96DA9E981481688563E2D14D5D878) / administrators(2618D6F5A90949BAA7E920D1B04C7EE1) のいずれか。`isView = !isEditMode && lockStatus==0 && canRevise && state==="Release"` → `{hidden:!isView, disabled:false}`。
- 注意点: select に `created_by_id` が含まれていないため `getProperty('created_by_id')` は取得できず空になる可能性(コード上の事実: select=`managed_by_id,state`)。

## [99] h4_DeleteRelHistory
- 言語: C#
- コメント: 改訂履歴リレーションを直接削除する
- 概要: リレーションアイテムを管理者権限で削除する。
- 入力: `relId`, `relTypeName`。出力: `this`(失敗時 `h4_S_E_0002` のエラー)。
- 処理: `Administrators` 権限で `newItem(relTypeName,"delete")`, `setID(relId)`, apply。エラーなら `CCO.ErrorLookup.Lookup("h4_S_E_0002")`。
- 呼び出し契機(推測): 改訂履歴リレーションの削除ボタン(クライアントMethodから呼ばれる)。

## [100] h4_Delta_Auto_input
- 言語: C#
- コメント: 開達書式に親マスタと同じデルタバージョンを自動入力する
- 概要: リレーション追加時に、関連(h4_DATFormat)の `h4_delta_version` が空なら親マスタの値を設定。
- 呼び出し契機(推測): リレーションItemType(`h4_DATMaster DATFormat` 等)のサーバーイベント(onAfterAdd 等)。
- 入力: this=リレーションItem(`source_id`, `related_id`, type名)。出力: this / エラー。
- 処理フロー: リレーションタイプが `h4_DATMaster DATFormat` なら親=`h4_DATMaster`、それ以外は `h4_DeptMQMaster`。親の `h4_delta_version` を取得、関連 `h4_DATFormat` の `h4_delta_version` を取得し、空なら h4_DATFormat を edit(`version`属性="0")で親の値をセット。取得エラー(`isError && getItemCount()==-1`)時は `h4_S_E_0002` を返す。
- 注意点: 既に値があれば上書きしない。

## [101] h4_deptmqmaster_grid_event
- 言語: JavaScript
- コメント: Gr・室課用マルQページ作成(マルQマスタ検索条件フィルタ)
- 概要: `h4_MQPage_ivicb_deptmaruq_create` / `h4_MQPage_svcb_deptmaruq_create` が開く検索ダイアログのフィルタ条件を設定。
- 入力: `inArgs.itemSelectedID[0]`(h4_MQPage), `inArgs.itemContext`(Gr/Dept)。出力: Filterオブジェクト。
- 処理フロー: h4_MQPage を get(select=h4_class)、取得失敗(count -1)なら `h4_C_E_0002` のエラー表示。`itemContext`=="Gr" → `Filter["h4_class"]={filterValue:"*Gr*", isFilterFixed:true}`、"Dept" → `"*Dept*"`、他はエラー表示して終了。
- 注意点: `debugger;` 文が残存。

## [102] h4_DeptMQMasterReleaseFilte
- 言語: JavaScript
- コメント: マルQマスタ作成時の帳票マスタのフィルタ(リリース済みのみ表示)
- 概要: 検索ダイアログのクエリを差し替え、`h4_DATMaster` を state=`Release`、queryType=Released、queryDate=現在日時 で取得。
- 入力: `inArgs.QryItem`。処理: AML(`pagesize='100'` 等・select=`h4_delta_version,h4_state,current_state,h4_updatedate,modified_by_id,...,is_current`)を作成して `inArgs.QryItem.loadXML`。
- 注意点: `debugger;` 残存。コメントに「SVのAMLを真似る」。

## [103] h4_DirectPromote
- 言語: C#
- コメント: 対象アイテムをプロモートする
- 入力: `targetID`, `targetType`, `newState`。出力: this / エラー(`h4_S_E_0002`)。
- 処理: `Aras PLM` 権限で `targetItem.promote(newState, "promoted by direct promote")`。例外時 `h4_S_E_0002`。
- 呼び出し元: `h4_DirectPromote_click` ほか(推測)。

## [104] h4_DirectPromote_click
- 言語: JavaScript
- コメント: ダイアログで指定したステートに変更するメソッド
- 概要: ダイアログで遷移先ステートを選択し直接プロモート。
- 呼び出し契機(推測): アイテムフォームのCUIボタンクリック(`thisItem` 参照)。
- 処理フロー: List `h4_States` の `Filter Value`(filter=アイテムタイプ名)から選択肢取得。遷移可否は下記辞書で制限:
  - h4_MQPage: InProgress→[InReview, RequestApproval, ProvisionalApproved, Approved]; InReview→[InProgress, RequestApproval]; RequestApproval→[InProgress, InReview, ProvisionalApproved, Approved]; ProvisionalApproved→[Approved]; Approved→[]
  - h4_ReqDoc: InProgress→[YryrRequestApproval, InReview, RequestApproval, ProvisionalApproved, Approved]; InReview→[InProgress, RequestApproval]; RequestApproval→[InProgress, InReview, ProvisionalApproved, Approved]; ProvisionalApproved→[Approved]; Approved/Unapproved→[]; YryrRequestApproval→[InProgress]
  - h4_Test_Result: InProgress→[InReview, RequestApproval, Approved]; InReview→[InProgress, RequestApproval]; RequestApproval→[InProgress, InReview, Approved]; Approved→[]
  フォーム `h4_MultiDirectApproveStateSelect` を 300x100 ダイアログ表示(タイトル=UserMessage `h4_C_I_0002`)。選択結果で Method `h4_DirectPromote`(targetID/targetType/newState)を実行、エラーなら AlertError、成功なら `parent.onRefresh()`。
- 呼出す他Method: `h4_DirectPromote`。

## [105] h4_frm_get_dept_init_value
- 言語: JavaScript
- コメント: 室課/グループマルQページ作成時の入力パラメータ取得画面の値の取得
- 概要: 初期値設定フォームの入力値(クラス/室課/グループ/セクション/WF有無/利用者(同室課))を収集・検証して親ダイアログへ返す。
- 処理フロー: `input` を走査。`h4_frm_radio_class`(id=`h4_radio_group` checked→"Gr"、既定"Dept")、`h4_frm_Dept`, `h4_frm_Group`, `h4_frm_Section`, `h4_frm_Use_WF`(checked→1)、`h4_frm_managed_by_id`(value=名称、id=ID)。室課/グループ/セクションが全て"None"、または利用者未設定なら UserMessage `h4_C_I_0702` の `{0}` を「室課/グループ/セクション」「利用者(同室課)」に置換してエラー表示。
  重複チェック: `dialogArguments` から dept, modelName, modelCode, eventValue を取り、h4_MQPage を get(同 h4_dept/h4_model_name/h4_model_code/h4_event、group/section は未指定ならNULL/空を where で指定)。h4_event が "special" のものを除いて1件でもあれば `h4_C_E_0410` エラー。OKなら `dialog.close("室課,グループ,セクション,WF有無,managedById,クラス")`。
- 注意点: `strDept` が `dialogArguments.dept` で上書きされる(フォーム入力の室課値は検証後に置換される)。`debugger;` 残存。

## [106] h4_frm_get_destination
- 言語: JavaScript
- コメント: なし(内部コメント: マルQページ仕向け地の取得)
- 概要: ダイアログ内のチェック済みチェックボックスの `id` 配列を収集し `dialog.close(配列)` で返す。


