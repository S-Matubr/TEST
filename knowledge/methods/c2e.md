<!-- meta
legacy: knowledge/_legacy/機能設計書.md L5783-L5880
source: source/package/Independent/Import/Method/
-->
# Method AML 調査 C_method2e (142〜156番目: h4_init_ivrcb_add_events 〜 h4_ivrcb_directDeleterow_init)

---
## [142] h4_init_ivrcb_add_events
- 言語: JavaScript / comments: イベント設定ボタン初期化メソッド
- 概要: リレーションタブのイベント設定ボタンの活性制御。編集モードかつグリッド選択が1行のときのみ活性。
- 処理: `isEditMode` かつ `this.grid.getSelectedItemIds().length == '1'` なら有効。戻り値 `{disabled: !isEnabled}`。(旧コード `options.getState().grid.selectedRows` はコメントアウト)
- 呼び出し契機(推測): リレーションタブ(ivrcb)ツールバーボタンの init。

## [143] h4_InitSetPermission
- 言語: C# / comments: マルQ版 子ドキュメントアイテムへ権限を継承する
- 概要: ドキュメント作成時、親アイテムタイプの権限(owned_by_id, managed_by_id, team_id, permission_id)をドキュメントに設定する(コード冒頭コメント)。
- 呼び出し契機(推測): 親ItemType(開達書式/必要資料等)のサーバーイベント(onAfterAdd/Update)。this=親Item。
- 処理: this の ItemType から `relationshiptype`(source=親ItemType, related=Document)を取得。親の `owned_by_id, managed_by_id, team_id, permission_id, id, config_id` を取得。各リレーションの related Document(select `id, parent_config_id`)について、`parent_config_id` が空または親の `config_id` と一致する場合に限り、`Administrators` 権限で SQL `update [Document] set owned_by_id, managed_by_id, team_id, permission_id, parent_id, parent_itemtype_id, parent_config_id where id=…` を直接実行。SQL失敗時は例外「ドキュメント更新に失敗しました」→ `inn.newError(ex.ToString())`。
- 注意点: SQL文字列連結(値はIDのみ)。末尾 `private void Dummy() {` は括弧合わせ。

## [144] h4_InitSetPermissionAndNo
- 言語: C# / comments: Document作成、リレーション紐づけ時、管理用の値を設定し、必要ならPermissionをセット
- 概要(コード冒頭コメント): 初めてDocumentを作って紐づけたなら親の permission/manager/owner を引き継ぐ。新規・既存アイテムを紐づけた場合、リレーションに紐づけた順番(`h4_parent_order_no`)を既存の最大値+1で記録(歯抜け対策、削除時のパーミッション変更でも問題ないように)。対象: 開達書式、必要資料、テスト結果、指摘。
- 呼び出し契機(推測): 上記親ItemTypeのサーバーイベント。this=親Item。
- 処理フロー:
  1. `h4_GetDocumentRelationName`(typename=this型)で親→Documentのリレーション名取得。親の `owned_by_id, managed_by_id, permission_id, id, config_id` 取得。
  2. 各リレーション(select `id, related_id, h4_parent_order_no`)の Document(select `config_id, owned_by_id, managed_by_id, h4_parent_config_id`)について: `h4_parent_config_id` が空(新規紐づけ)なら、既存の owner/manager が両方空のとき親の値を継承し、`Administrators` 権限のSQL updateで `owned_by_id, managed_by_id, permission_id, h4_parent_config_id`(=親config_id)を設定。リレーションの `h4_parent_order_no` が空なら `editTargetTaple`(docConfigId, parentConfigId, relType)に控える。
  3. 控えがあれば、対象親4種(`h4_DATFormat, h4_ReqDoc, h4_Test_Result, h4_PointOut`)のDocumentリレーション名をすべて収集。
  4. 控えごとに: 現行(is_current=1)のDocument IDと親IDを取得し、対象リレーション(source=親, related=Doc, select `id,h4_parent_order_no`)を取得。`h4_parent_order_no` が既にあればスキップ。無ければ、そのDocの全親リレーションの最大 `h4_parent_order_no` を調べ(同ループで同Docに付与済みなら辞書 `docNumMap` の値)、+1 を `edit`(where=`[リレーション名(空白→_)].id='…'`)で設定。
- 呼出す他Method: `h4_GetDocumentRelationName`。
- エラー: `h4_S_E_0002`、例外時 `inn.newError(ex.ToString())`。

## [145] h4_InputModifiedOnAndUserForHist
- 言語: C# / comments: 配下の改訂履歴に改訂日・改定者を入力
- 概要: 公開(Release)遷移時に、配下の改訂履歴(`h4_RevisionHistory`)の `h4_revised_by`(改訂者)・`h4_revision_date`(改訂日)が両方空なら入力。改訂履歴は事前のPreメソッドでアンロック確認済み(コメント)。
- 呼び出し契機(推測): `h4_DATMaster` / `h4_DATFormat` のライフサイクル「公開」遷移の Post メソッド。
- 入力: `id`, `type`, `modifiedOn`(親の更新日=公開日), `modifiedUser`(親の更新者=承認者)。
- 処理: type=`h4_DATMaster` → リレーション `h4_DATMaster RevisionHistory`、`h4_DATFormat` → `h4_DATFormat RevisionHistory`(それ以外は空文字のまま)。リレーション経由の `h4_RevisionHistory` を取得し、`h4_revised_by`/`h4_revision_date` のどちらかに値があれば再取得、両方空なら edit(version=0)で入力。続いて内部関数 `setReleaseInfoForRelationHist`: `h4_newest_revision_history` が自分自身(枝番1=最新)なら何もしない。それ以外は最新の履歴の `h4_revised_by`/`revision_date` を確認(空なら記入)、`h4_RevisionHistory RevHist`(source=最新)の各関連履歴も空なら記入。
- エラー: `h4_S_E_0002`。内部関数の失敗は `"katotest|"+errorString`(内部ID 'test1'〜'test5')を返す(デバッグ用文字列がコードに残存)。
- 注意点: 内部の最新履歴チェックでは select に `revision_date`(h4_ プレフィックスなし)を使用(コード上の記述: `id,h4_revised_by,revision_date`、判定は `revision_date`)。 末尾 `internal void Dummy() {` は括弧合わせ。

## [146] h4_ItemViewDone
- 言語: JavaScript / comments: 完了ボタンの置き換え / 実行許可: Administrators
- 概要: 完了時にサインオフタブを再読込する(保存/完了処理で担当者が更新されるため)。対象: マルQページ/必要資料/テスト結果/一括承認。
- 処理: ItemType→サインオフ用リレーション名: `h4_MQPage`→`h4_MQSingOff1`、`h4_ReqDoc`→`h4_ReqDoc SingOff1N`、`h4_Test_Result`→`h4_Test_Result SignOff`、`h4_ApprovalWFGroup`→`h4_ApprovalWFGroup_ApSignOff`。`window.onDoneCommand()`(標準完了処理)完了後、`frames.relationships.iframesCollection` を走査し、該当リレーション名のタブを `relationshipsControl.reload(queryString)` で再読込(editMode, tabbar, toolbar, where='tabview')。
- 呼び出し契機(推測): 標準「完了」ボタンの置換コマンド。

## [147] h4_ItemViewDoneForDAT
- 言語: JavaScript / comments: 帳票マスタと開達書式IV用完了メソッド(サインオフタブ更新＋改訂中時処理)
- 処理: [146]のリレーション名対応に、`h4_DATMaster`→`h4_DATMaster SingOff`、`h4_DATFormat`→`h4_DATFormat SingOff`、`h4_AppWFGroupForDATFormat`→`h4_AppWFGrForDATFormat SingOff` を追加。`onDoneCommand()` 後、state が `InRevision`(改訂中)なら Method `h4_PromoteForClient`(configID, targetType, newState=`Release`)を実行(エラーなら AlertError して中断)。その後サインオフタブを再読込。加えて、リレーション名が `h4_DATMaster Table` / `h4_DMPMaster Table` / `h4_MQWijimo` のタブ(Wijmoグリッド)も再読込(旧 h4_Table_DoneCli の機能)。
- 呼出す他Method: `h4_PromoteForClient`。

## [148] h4_ItemViewSave
- 言語: JavaScript / comments: 保存ボタンの置き換え。サインオフ画面の更新実施
- 処理: [146]と同じ4種のリレーション名対応。`window.onSaveCommand()` 後にサインオフタブ再読込。

## [149] h4_ItemViewSaveForDAT
- 言語: JavaScript / comments: 帳票マスタと開達書式IV用保存メソッド(サインオフタブ更新＋改訂中時処理)
- 処理: リレーション名対応は[147]と同じ7種。state が `InRevision` なら保存の代わりに `onDoneCommand()`(完了)を実行し、成功後に `h4_PromoteForClient`(newState=`Release`)→サインオフタブ再読込。それ以外は `onSaveCommand()` 後にサインオフタブと(`h4_DATMaster Table`/`h4_DMPMaster Table`/`h4_MQWijimo`)タブを再読込。
- 呼出す他Method: `h4_PromoteForClient`。

## [150] h4_IVICB_ChangeAccessRange
- 言語: JavaScript / comments: なし
- 概要: 公開範囲(`owned_by_id`)変更ボタン。マルQページ(と配下の必要資料)の `owned_by_id` を選択Identityに一括変更。
- 処理: 確認ダイアログ(`h4_cmn_ShowMessage` の `h4_C_I_0405` / タイトル `h4_C_I_0001`)でOKなら、Identity検索ダイアログ(title「公開範囲を選択」, sourceItemTypeName=`h4_MQPage`, sourcePropertyName=`owned_by_id`)を表示。選択結果で一括AMLを組み立て: メイン `<Item type=… id=… action="merge" select="owned_by_id" serverEvents='0'><owned_by_id>…</owned_by_id></Item>`(`options.itemId`/`options.itemTypeName` を優先)。対象が `h4_MQPage` なら `h4_MQPage ReqDoc` の related_id(必要資料)にも同様のmerge AMLを追加。Method `h4_GrantAuthority`(aml=一括AML)で実行(Administrators権限)。エラーなら「更新に失敗しました: …」。最後に `parent.onRefresh()`。
- 呼出す他Method: `h4_cmn_ShowMessage`, `h4_GrantAuthority`。
- 注意点: `debugger;` 残存。`itemId`/`itemType` は変数宣言なしで代入(グローバル/暗黙変数)。`this.itemTypeName` を使うが、内部関数 `h4_IVICB_ChangeAccessRange` 内の `this`・`targetType` 参照はコード上そのまま(動作はクライアント実行コンテキスト依存)。

## [151] h4_IVICB_ChangeAccessRange_init
- 言語: JavaScript / comments: なし
- 概要: [150]ボタンの表示/活性制御。表示: ログインユーザーが Application Managers(Identity)に属する場合のみ。活性: アイテムのステート(`h4_directaplist`)が `Approved` かつ ユーザーが利用者(同室課)(`managed_by_id`)に含まれる場合。
- 処理: Identity `Application Managers` のIDを取得。ログインユーザーの Alias(source_id=userID)→related_id(エイリアスIdentity)を取得し、`Member`(related_id=aliasId)で1階層上位Identityの `source_id` 群、さらに1階層上(2階層目)を取得。2階層目が空なら1階層目、あれば2階層目の中に Application Managers が含まれる(`TARGET_ID.includes(id)`)かで可視判定。`managed_by_id` が1階層目または2階層目に含まれるかで `ExistID`。戻り値 `{hidden: !isVisible, disabled: !(currentState==="Approved" && ExistID)}`。
- 注意点: `TARGET_ID.includes(id)` は文字列の部分一致判定(コード上の実装)。

## [152] h4_IVICB_WFActions_init
- 言語: JavaScript / comments: なし
- 概要: 「ワークフローの有無」プロパティ(`h4_approve_style`)に基づくWFメニューの表示制御。ON(1)なら非表示、OFFなら表示。
- 処理: 親Item get(`h4_approve_style, locked_by_id, managed_by_id, created_by_id, state`)。canPromote = ユーザID==created_by_id または identityList に managed_by_id / Super User(6B14D33C4A7D41C188CCF2BC15BD01A3) / Aras PLM(56A96DA9E981481688563E2D14D5D878) / administrators(2618D6F5A90949BAA7E920D1B04C7EE1)。戻り値 `{hidden: wfOption==1, disabled: isEditMode || lockStatus!=0 || !canPromote || state==="Approved"}`。0件なら hidden。

## [153] h4_ivrcb_directCreateHistory
- 言語: JavaScript / comments: なし
- 概要: 改訂履歴リレーションの「直接作成」ボタン。確認事項・改定理由を「-」で固定し履歴を作成する。
- 処理: Method `h4_CreateRelHistory`(parentId=itemID, parentType=itemTypeName, revision_summary="-"(確認事項), revision_reason="-"(改定理由))を実行。エラーなら AlertError。成功時 `parent.onRefresh()`。
- 呼出す他Method: `h4_CreateRelHistory`。

## [154] h4_ivrcb_directCreateHistory_ini
- 言語: JavaScript / comments: なし
- 概要: [153]ボタンの表示制御。親ステートが `InProgress`/`InRevision` の場合は非表示(作業中/改訂中は通常の追加を使う)。それ以外では、canEXE(created_by_id==ユーザ または managed_by_id/Super User/Aras PLM/administrators を保持)の場合のみ表示。tooltip は標準方式で `{0}` を関連ItemTypeラベルに置換。
- 注意点: select が `managed_by_id,state` のみで `created_by_id` を含まない(コード上の事実)。

## [155] h4_ivrcb_directDeleterow
- 言語: JavaScript / comments: なし
- 概要: 改訂履歴リレーションの選択行を直接削除。
- 処理: `this.grid.getSelectedItemIds()` の各IDについて Method `h4_DeleteRelHistory`(relId, relTypeName=`this.relationshipTypeName`)を apply。エラーなら AlertError して return(forEach 内なので次の行へは進む)。最後に `parent.onRefresh()`。
- 呼出す他Method: `h4_DeleteRelHistory`。

## [156] h4_ivrcb_directDeleterow_init
- 言語: JavaScript / comments: なし
- 概要: [155]ボタンの表示/活性制御。state が `InProgress`/`InRevision` なら非表示。canEXE でなければ非表示。選択行が0なら disabled。tooltip は `options.relationshipItemTypeLabel` で `{0}` を置換。
- 注意点: [154]同様 select に `created_by_id` を含まない。


