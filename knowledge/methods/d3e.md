<!-- meta
legacy: knowledge/_legacy/機能設計書.md L6714-L6785
source: source/package/Independent/Import/Method/
-->
# D_method3e: Method AML 解析 (No.268〜273)

凡例: 呼び出し契機は全て「推測」。execution_allowed_to は全て World(A73B655731924CD0B027E4F4D5FCC0A9)。

---
## 268. h4_treeModGet
- ID: 0F18E14FC9734224B6422C0E9D95A62E / C#
- 概要: マルQページツリーに表示するアイテムを取得する(comments)。
- 契機(推測): マルQページツリー(タブ "h4_MQPage Tree Tree" 等)の表示データ取得。
- 入力: なし(this のプロパティは使用しない)。出力: `inn.newResult(JSON風文字列)`(単引用符)。例外時 "Error:"+Message+StackTrace。
- 処理: 表示対象タイプは固定 "h4_MQPage"。`created_on ASC` で全件取得(権限は実行ユーザー)。各マルQページについて `h4_model_name`(機種)が空なら除外。機種(HRDPMTypModelProject)を取得して keyed_name(機種名)と iq_model_year(なければ「モデルイヤーなし」、あれば末尾に "M")を取得。ItemType label を取得。keyed_name を title(`\`,`"` をエスケープ、タブを全角スペースに)、current_state→LC Stateの label(空は「ステータス不明」)、modified_on/created_on(T→スペース)、更新者/作成者名(User.keyed_name、不明は「更新者不明」「作成者不明」)、h4_dept, h4_destination, h4_event を取得。
- 出力項目: status, item_name, modified_on, modified_by_man, created_on, created_by_man, itemId, itemType, currentModelYear, currentItemTypeName, dept, dest, event_name, currentPjName。各要素末尾 "," を TrimEnd して配列化。
- 注意: 全マルQページを全件ループし、1件ごとに複数回の個別取得(N+1)。コメントアウトされた h2_comment/h2_keyword と複数アイテムタイプ対応コードが残存。コード中に Aras の C# ラッパー対策の `}` / `private void Dummy()` 構造がある。

## 269. h4_UnSetApprovalGroupProperty
- ID: 998123E6C2C5458EB26496BE54DAA313 / C#
- 概要: 承認対象のリレーション削除時に、元の配下アイテムの一括承認リンク(`h4_approval_group_item`)を空にする。対象: 親=一括承認/開達実施要領一括承認、子=マルQページ/必要資料/開達書式。
- 契機(推測): リレーションItemType("h4_ApprovalWFGroup_ApTarget" / "h4_AppWFGr4DATFormat DATFormat")の onBeforeDelete 等(削除前にDBのリレーションから source_id/related_id を取得するため)。h4_SetApprovalGroupProperty の逆処理。
- 処理: this の type/id でリレーションを get(select related_id, source_id)。型が "h4_AppWFGr4DATFormat DATFormat" なら子型 h4_DATFormat、"h4_ApprovalWFGroup_ApTarget" なら h4_ApprovalTarget(ポリアイテム)から getType() で子型判別。子を edit(doGetItem=0, version=0, serverEvents=0)し `h4_approval_group_item`="" を設定。エラー時 h4_S_E_0002。this を返す。

## 270. h4_UpdatePermission
- ID: B848E38F817F47639D5963CFDCD62950 / C#
- 概要: マルQ版。プロモート時に子ドキュメントの権限(permission_id)を親アイテムの権限に合わせる。
- 契機(推測): 親アイテムの onAfterPromote。
- 入力: this(親アイテム。id が空の場合は `idlist` 属性で get して先頭ID)。出力: this。例外時はエラー(ex.ToString())。
- 処理(Administrators権限): 親の `permission_id`, `config_id` を取得。ItemType(親)と "Document" の RelationshipType を name 取得し、各リレーション(source_id=親ID)の related_id の Document を get(select permission_id, parent_config_id)。`parent_config_id == 親の config_id` かつ Document の permission_id が親と異なる場合、SQL `update [Document] set permission_id='親permission' where id='…'` を applySQL。失敗時は例外「ドキュメント更新に失敗しました」。
- 注意: 更新するのは親が最初にドキュメントを紐づけた親(parent_config_id が一致する)場合のみ。

## 271. h4_UpdatePermissionForPromote
- ID: D3781B8BA66845C9A0D6872DADFB18D3 / C#
- 概要: 親Itemがプロモートした際、配下ドキュメントが紐づいている親が全て承認になっている場合、最後の親のプロモート後のパーミッションをドキュメントに与える。対象: 開達書式、必要資料、テスト結果(指摘は承認LCなしのため対象外、ただし ParentItemNameList に h4_PointOut はあるが ParentActivityMap にない)。
- 契機(推測): 親アイテムの onAfterPromote。
- 入力: this(親; id なしなら idlist 先頭)。出力: this/h4_S_E_0002/例外文字列。
- 処理: Method `h4_GetDocumentRelationName`(typename)でドキュメントリレーション名一覧→各々 `h4_GetDocRelParentConfigID`(relitemtypeName, sourceID)で紐づくドキュメントの config_id 一覧。ドキュメントごとに Method `h4_GetDocRelOrderNoAnParentState`(docConfigID)を呼び、返却リレーションシップ(parentSate, parentType, parentID, parentPermissionID)で、承認相当ステート(ParentActivityMap: h4_DATFormat→"Release"、h4_ReqDoc→"Approved"、h4_Test_Result→"Approved")でない親を重複なしでカウント(unApproved, 2以上で中断)。
  - 未承認親が2以上なら次ドキュメントへ。
  - 未承認が1件: 自アイテムの permission_id が、その未承認親の permission(setPermissionID)と異なる場合は「親が承認になったタイミング」と判断しスキップ。
  - 未承認0件(最後のプロモート): setPermissionID=自アイテムの permission_id。
  - SQL `update [Document] set permission_id=… where id=currentDocID`(currentDocID は上記Methodの戻り値)で更新。失敗時 h4_S_E_0011 の例外(SH-974対応)。
- 呼出Method: h4_GetDocumentRelationName, h4_GetDocRelParentConfigID, h4_GetDocRelOrderNoAnParentState。
- 注意: コメントで「最後から2番目のWFが完了した際、OnAfterPromoteのタイミングでは未承認は残り1つに見える」ためパーミッション比較で防いでいる。指摘(h4_PointOut)は ParentActivityMap にないためカウント対象外。

## 272. h4_UpdatePointOutPermission
- ID: 72A53846CCDC44AF8E64FAB75ADF28CB / C#
- 概要: 仮承認・承認にプロモートされた時、紐づく指摘(h4_PointOut)の permission_id を変更。指摘側の確認済み(h4_checked=="1")のみ更新対象。親のOnAfterPromote時に実行(コメント)。
- 入力: this(親; id なしなら idlist 先頭)。出力: this/エラー文字列(接頭 "h4_UpdatePointOutPermission: ")。
- 親タイプ別 遷移後state → 付与Permission名:

| 親 | state → Permission |
|---|---|
| h4_MQPage, h4_ReqDoc | ProvisionalApproved → h4_PendingApproval / Approved → h4_Approved |
| h4_ApprovalWFGroup | ProvisionalApproved → h4_PendingApproval_AppWFGr / Approved → h4_Approved_AppWFGr |
| h4_AppWFGroupForDATFormat | Release → h4_Approved_AppWFGr |
| h4_Test_Result | Approved → h4_Approved_Test_Result |

- 子指摘リレーション: h4_MQPage→"h4_MQPage PointOut","h4_MQPage ReqDocN PointOut"、h4_ReqDoc→"h4_ReqDoc PointOut"、h4_Test_Result→"h4_Test_Result_PointOut"、h4_ApprovalWFGroup→"h4_ApprovalWFGroup PointOut"、h4_AppWFGroupForDATFormat→"h4_AppWFGr4DATFormat PointOut"。
- 処理フロー(Administrators権限): 対象外型は何もしない。state が空なら DB から取得。対象外state(承認依頼中など)は何もしない。Permission(name)を取得(0件は「未登録」エラー)。リレーション経由の指摘IDを集め(リレーション取得エラーは continue)、さらに "h4_PointOut History" を source/related 両方向にキューで辿って関連指摘(旧版等)も追加収集。各指摘を get(h4_checked, permission_id)し、h4_checked!="1" または既に同一permissionなら skip。`edit`(serverEvents="0", doGetItem="0")で permission_id を更新(失敗は h4_S_E_0011 の例外)。
- 追加処理: 親が h4_AppWFGroupForDATFormat の場合、"h4_AppWFGr4DATFormat PointOut" リレーションの related_id が旧世代を指し続けるケースに備え、指摘の config_id が同じ is_current=1 の最新指摘IDへ related_id を edit(doGetItem=0)で補正。
- 注意: 親が h4_AppWFGroupForDATFormat のときの対象stateは Release のみ。

## 273. Matsubara_Test
- ID: D3F284450F21418C96BACE51EA7C9086 / JavaScript
- 概要: コメント「アコーディオン最大化状態で表示したい」。テスト用と見られるMethod(名称より推測)。
- 処理: `function onFormLoad()` を定義するのみ(呼出コードなし)。`.aras-accordion` 要素を取得し2つ以上あれば2番目に `expanded` クラスを付与(未付与の場合)。
- 注意: 関数定義のみで自動実行されない。ArasのUI構造に依存(DOM クラス名 `aras-accordion` はコメントどおり推測ベース)。




---

<!-- ===== 第6章 ===== -->

