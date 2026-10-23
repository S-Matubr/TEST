<!-- meta
legacy: knowledge/_legacy/機能設計書.md L4786-L4898
source: source/package/Independent/Import/Method/
-->
# B_method1a: Method AML 調査 (No.1〜10)

対象: `...\Independent\Import\Method`(ファイル名昇順)。共通事項: 全Method `execution_allowed_to` はWorld(A73B6557...)または Administrators(2618D6F5...)。コード中の「呼び出し契機」は推測と明記。エラー時は多くが `CCO.ErrorLookup.Lookup("h4_S_E_0002")` を返す。

## 1. h4_addDatFormatCheck
- 言語: JavaScript / id 4170505CD11047F9A80EE689AB693914 / comments: 「室課マルＱマスタの開達書式追加時の」(途切れ)
- 概要: 室課マルQマスタ/帳票マスタに開達書式(h4_DATFormat)をリレーション追加した際、既に同名の開達書式が存在すれば警告して追加行を削除する。
- 呼び出し契機(推測): リレーションシップタブの onInsertRow/追加後(クライアントイベント。`relationshipTypeName`,`relatedID`,`relationshipID` が暗黙変数として使われる)。
- 入力: クライアントコンテキスト変数 relationshipTypeName / relatedID / relationshipID、`parent.document.item`(親アイテムXML)。出力: `this`。
- 処理フロー:
  1. UserMessage(get)を準備。親ドキュメント(`parent.document` か `parent.parent`)の `Relationships` 子ノードを取得。
  2. 最後の行(追加した行)の related item の `name` を取得。name が無い/空なら何もせず終了(新規追加は確認不要)。
  3. 最終行を除く既存行を走査。各行の `h4_datformat_name` があればその値、なければ related item の `name` と比較(name無しはスキップ)。
  4. 同名なら UserMessage `h4_C_I_0302` を取得して `aras.AlertWarning` 表示、`aras.getItemRelationshipsEx` で(一時行が2件未満の場合)リレーション再取得後、`Relationships/Item[@id=relationshipID]` を `remove()` して終了。
- 他Method呼出: なし。
- 注意: `debugger;` 文が残っている。DOM構造(childNodes末尾=追加行)に依存。

## 2. h4_AddItemWhenSave
- 言語: C# / id 03D36675958B4E86BCEB174CD31D03C9 / comments: 「マルQページ保存時、必要資料の指摘にアイテムを紐づける。」
- 概要: マルQページに紐づく指摘のうち、必要資料(h4_rel_reqdoc)を持つものを、その必要資料の指摘タブ(h4_ReqDoc PointOut)に未紐づけなら追加する。
- 呼び出し契機(推測): h4_MQPage の onAfterUpdate 等のサーバーイベント(他Methodのコメントに「onAfterUpdateに変更」とあり)。
- 入力: コンテキストアイテム(h4_MQPage)のID。出力: this / エラー時 h4_S_E_0002。
- 処理フロー: `h4_MQPage PointOut`(source_id=this, select=related_id(h4_rel_reqdoc))をDBから取得 → 各 related(h4_PointOut)の `h4_rel_reqdoc` が非空なら `h4_ReqDoc PointOut`(source_id=h4_rel_reqdoc, related_id=指摘ID)を検索 → 0件なら add(doGetItem=0)のAML断片を溜める → まとめて `inn.applyAML("<AML>...</AML>")` で一括実行。
- ItemType: h4_MQPage PointOut, h4_ReqDoc PointOut, h4_PointOut(プロパティ h4_rel_reqdoc)。
- 注意: C#メソッド末尾に `internal void Dummy(){` を置くテンプレ形式。applyAML結果のエラー判定はしていない。

## 3. h4_AddRelPointOutMQPage
- 言語: C# / id 20A39240F8964EDEA4193DAED62B08C8 / comments: 「マルQページ保存時、必要資料指摘一覧を追加する」
- 概要: マルQページの「必要資料指摘一覧」タブ(h4_MQPage ReqDocN PointOut)へ、(a)マルQページ直下の指摘のうち必要資料(h4_rel_reqdoc)を持つもの、(b)マルQページ配下の必要資料(h4_MQPage ReqDoc)が持つ指摘(h4_ReqDoc PointOut)、を未登録分だけ追加。
- 呼び出し契機(推測): h4_MQPage の onAfterUpdate(コメントに「onAfterUpdateに変更するのでコンテキストアイテムからリレーションを取らない」)。
- 入出力: this(h4_MQPage)のID。出力 this / エラー時 h4_S_E_0002。
- 処理フロー:
  1. `h4_MQPage PointOut` をDB取得 → `AddValidPointOutIds`: related_id の h4_PointOut を取得(related item が無ければ getItemById)、`h4_rel_reqdoc` が非空のIDだけ h4_RelList へ(空の場合は再取得して確認)。
  2. `h4_MQPage ReqDoc` を取得 → 各必要資料の `h4_ReqDoc PointOut` の related_id を全て h4_RelList へ(`AddPointOutIdsFromRelationships`)。
  3. 既存 `h4_MQPage ReqDocN PointOut` の related_id を MQPageRelList へ。
  4. `h4_RelList.Except(MQPageRelList)` を `h4_MQPage ReqDocN PointOut` に add(source_id=this, related_id=ID)し即 `apply`。
- 注意: 追加は即時apply(エラー判定なし)。重複排除は Except(IDベース)。

## 4. h4_AddRelPointOutReqDoc
- 言語: C# / id 6F6FF9C641DF47FFB53AB8BEA04DCE2B / comments: 「必要資料保存時、親のマルQページのタブに指摘を追加する。」
- 概要: 必要資料保存時、その指摘(h4_ReqDoc PointOut)を親マルQページの必要資料指摘一覧(h4_MQPage ReqDocN PointOut)へ追加。ただし親マルQページが編集中(ロック中)の場合は何もしない(マルQ保存時のh4_AddRelPointOutMQPageに任せる)。
- 呼び出し契機(推測): h4_ReqDoc の保存後イベント。
- 入力: this(h4_ReqDoc)。プロパティ `h4_pare_mq`。出力: this / エラー時 h4_S_E_0002。
- フロー: `h4_pare_mq` で h4_MQPage 取得 → `fetchLockStatus()!=0` なら return this → `h4_ReqDoc PointOut`(source_id=this) の related_id 一覧、`h4_MQPage ReqDocN PointOut`(source_id=mqId) の related_id 一覧 → 必要資料側のみにあるIDを `h4_MQPage ReqDocN PointOut` に add(doGetItem=0)。
- 注意: 0件時は早期return。

## 5. h4_AddReqDocCLN
- 言語: C# / id 5A42C9B69C3C4301BDA860FE80A9813D / comments なし
- 概要: 必要資料の担当者一覧(h4_ReqDoc CLN)へ、作成者/確認者/承認者を登録(空の既存行があれば再利用)。
- 呼び出し契機(推測): 必要資料の担当者一覧設定ダイアログ(h4_cui_ivrcb_SetReqDocCLN_init 系)から。
- 入力(this のプロパティ): type, id, createrList, reviewerList, approverList, createrRequiredList, reviewerRequiredList, approverRequiredList(カンマ区切り。*Requiredは各担当の必須フラグ)。出力: this / エラー時 h4_S_E_0002。
- フロー: h4_ReqDoc を get(select h4_directaplist,h4_yryr)。**h4_yryr=="1" かつ h4_directaplist=="InProgress" の場合のみ**実行。既存 `h4_ReqDoc CLN` のうち related_id が空の行IDを deleterellist に収集。作成者→確認者→承認者の順で、空でない各IDについて、deleterellist に残があればその行を edit(related_id, h4_check_required, h4_workflow_role)して使い回し、無ければ `h4_ReqDoc CLN` を add(doGetItem=0, version=0, serverEvents=0)。ロール値は `Creater`/`Reviewer`/`Approver`(綴りはコードのまま)。
- 注意: Required配列の添字は担当者配列と同じ添字で参照(長さ不一致で例外)。作成者追加時のみ edit行にも h4_check_required を設定。

## 6. h4_Approve_Related_Item
- 言語: C# / id 1B521BD98DC14CF6B1997201FC710868 / comments: 「Call用：特定のマルQページの必要資料を承認に遷移させる」
- 概要: マルQページ承認時に配下の必要資料、必要資料承認時に配下のテスト結果を承認状態にする。
- 呼び出し契機(推測): 各ワークフロー昇格時のCallメソッド等から。
- 入力(this): applovedItem(`h4_ReqDoc` or `h4_Test_Result`), destination(h4_directaplistに設定する値), sorceItemID(必要資料の場合はマルQページID、テスト結果の場合は必要資料ID)。出力: this / エラー時 h4_S_E_0002。
- フロー: `Aras PLM` Identityで権限昇格(CCO.Permissions.GrantIdentity)。
  - h4_ReqDoc: `h4_MQPage ReqDoc`(source_id=sorceItemID)→各 h4_ReqDoc を get(id,state,h4_yryr)、state が "Approved" または "Unapproved" なら除外、それ以外を対象に。
  - h4_Test_Result: `h4_ReqDoc TestResult`(source_id=必要資料)→各 h4_Test_Result を get(id,h4_parent,state)、h4_parent が sorceItemID と異なるものは除外、state=="Approved" は除外。
  - 対象ごとに edit(version=0)で `h4_directaplist=destination` を設定。コメント「サーバーメソッドでList変更したらStateを変える処理が入ってる」→ h4_directaplist変更で別イベントがステートを遷移させる想定。
- 注意: コード上の除外は Approved/Unapproved のみ(コメントの「やるやら×」除外は state 判定のみでは行っていない。h4_yryr取得はするが未使用)。

## 7. h4_beforePdfConv
- 言語: C# / id 43474484F37441E3ACFF39E21C6A8798 / comments: 「親がDocument以外のFileアイテムのコンバージョンタスクを作成しないよう制御する」
- 概要: Fileアイテム(this)が Document の file_item として参照されているか確認し、結果を "1"(参照あり=変換対象) / "0" で返す。
- 呼び出し契機(推測): PDF変換(Conversion Task作成)前のイベント/条件判定。
- 入出力: this.getID() → `Document` get(file_item=ID)。エラーまたは0件→`newResult("0")`、それ以外 `newResult("1")`。

## 8. h4_Call_Copy_MQPage
- 言語: C# / id 8DA80CD3BDEA4A6DAC42FC01DCD5BBDD / comments: 「マルQページの複製」(コード冒頭コメントは「イベントアップ処理…h4_MQPage_ivicb_event_upから呼び出される」)
- 概要: 選択したマルQページを新イベント/設定で複製し、必要資料・指摘をコピーする(Administrators権限で実行)。
- 呼び出し契機(推測): マルQページの複製/イベントアップのダイアログ(h4_MQPage_ivicb_event_up、h4_cui_ivicb_copy_init 系)の実行ボタン。
- 入力(this): ItemId, EvaluationUnit, My, ModelName, ModelNameId, ModelCode, Event, ManagedById, Destination(@→,置換), DeltaVersion, Group, Section。出力: 作成した h4_MQPage Item / エラー時 `inn.newError(e.Message)`。
- フロー:
  1. List `h4_events` の Filter Value(inactive=0, filter=DeltaVersion)から label→value 辞書を作成。Event ラベルに対応する value を `h4_event` に使用。
  2. dicPrmValue: h4_evaluation_unit, h4_my, h4_model_name(=ModelNameId), h4_model_code, h4_event, managed_by_id, h4_destination, h4_group, h4_section。
  3. `CopyMQPage`: 元h4_MQPageを取得し、新規h4_MQPageをadd(h4_directaplist=InProgress、引継ぎ: h4_approve_style, h4_class, h4_delta_version, h4_dept, h4_developmentbase, h4_pre_event, h4_src_mq_master, h4_unique_event, h4_variations)。`h4_MQPage ReqDoc` と `h4_MQPage PointOut` の各related(h4_ReqDoc/h4_PointOut)を `clone(true)`してapply、新アイテムとリレーションを作成。必要資料は `h4_ReqDoc FormatN` も取得してclone。reqDocIDMap(クローンID→元ID)を保持。
  4. ソースマルQマスタ(h4_src_mq_master)の `h4_DMQMaster DATFormat` → h4_DATFormat(name) → `h4_DATFormat Doc` → Document(file_item) から datNames/formatFileIds(最新の書式ファイル)を収集。
  5. 新ページ上の不要タブ整理: `h4_MQPage PointOut` は related の `h4_checked=="1"` のリレーションを delete。`h4_MQPage ReqDoc` は各必要資料を再作成: 元必要資料から多数プロパティ(h4_class,h4_yryr,managed_by_id,h4_delta_version,h4_dept,h4_destination,h4_developmentbase,h4_equipment,h4_event,h4_model_code,h4_model_name,h4_my,h4_category,h4_unique_event,h4_variations,h4_datformat_name,name,h4_doc_attached,h4_yryr_classification、h4_group/h4_section は入力値)をコピーし h4_approve_style=isUseWF, h4_directaplist=InProgress, h4_pare_mq=新ページ、入力値上書きで add → `h4_MQPage ReqDoc` を追加 → 複製した必要資料の `h4_ReqDoc PointOut`/`h4_ReqDoc TestResult` リレーションを全削除 → 必要資料名が datNames に含まれる場合は既存 `h4_ReqDoc FormatN` を全削除し、最新書式ファイル(h4_format_file)を merge で再作成 → 元必要資料(reqDocIDMap経由)の `h4_ReqDoc Doc`(成果物)を新必要資料に同じ related_id で add → `h4_ReqDoc` merge → クローン由来の旧 `h4_MQPage ReqDoc` リレーションを delete。
- 他Method呼出: なし(内部メソッド CopyMQPage)。
- 注意: 必要資料はクローン→再作成の二重処理(クローンは旧リレーション削除で廃棄)。reqDocIDMapにキーが無いと `h4_S_E_0002` メッセージで例外。

## 9. h4_Call_create_deptmaruq
- 言語: C# / id EC6DC4FB5FC446A7AEFB44F09712BE50 / comments なし(冒頭コメント「室課マルQページの作成」)
- 概要: 室課マルQマスタ(h4_DeptMQMaster)から、室課(Gr)用マルQページと必要資料を作成。選択した既存マルQページから指摘・必要資料配下アイテムもコピー。
- 呼び出し契機(推測): 室課マルQ作成ダイアログ(h4_cui_svcb_deptmaruqcreat_init)。
- 入力(this): DeptMQMasterId, TargetType, Dept, Group, Section, UseWF, ManagedById, DeltaVersion, ModelCode, My, Dest, ModelName, Event, Developmentbase, Variations, Class, SelMqPageIds(カンマ区切り)。出力: 作成した MQPage Item / エラー時 newError(e.Message)。
- フロー:
  1. h4_DeptMQMaster 取得 → `h4_DMQMaster DATFormat`(related_id(name,h4_event,h4_category), sort_order, h4_datformat_name)を走査し、書式名ごとに イベント配列(h4_eventをカンマ分割)/related_id/書式名/資料分類/並び順 の辞書を作成(重複名は除外)。
  2. TargetType の新規ページ(add)を作成: h4_class, h4_approval_round="1", h4_directaplist="InProgress", h4_delta_version, h4_model_code, h4_my, h4_destination, h4_model_name, h4_event, h4_src_mq_master, h4_developmentbase, h4_variations, h4_dept/h4_group/h4_section("None"でなければ設定), h4_approve_style=UseWF, managed_by_id。
  3. SelMqPageIds の各 h4_MQPage について: (a)`h4_MQPage PointOut` の h4_PointOut のうち h4_checked!="1" を `clone(true)`し新ページに紐づけ(serverEvents=0)。(b)`h4_MQPage ReqDoc` の必要資料は、名称がマスタ書式名に含まれるものだけ対象。同名が既に作成済みなら、作成済み必要資料に対して `addReqDocRels`(成果物/指摘/テスト結果コピー)のみ実行(20260715修正コメント)。未作成なら `h4_ReqDoc FormatN`(h4_format_file)を取得、h4_ReqDoc を add(name, h4_datformat_name, h4_category, h4_pare_mq, managed_by_id, h4_approve_style, dept/group/section, **h4_yryr: マスタの書式イベントに Event が含まれれば "1"、無ければ "0"**, h4_class, h4_approval_round=1, h4_directaplist=InProgress 他)、FormatN を add、`addReqDocRels`、`h4_MQPage ReqDoc` を sort_order付で add。
  4. `addReqDocRels(元必要資料ID,新必要資料ID)`: `h4_ReqDoc Doc` / `h4_ReqDoc PointOut` / `h4_ReqDoc TestResult` を元からコピー。指摘は h4_checked=="1" を除外し clone して新IDで紐づけ。
  5. 最後にページを再apply。UseWF=="1" の場合のみ `inn.applyMethod("h4_setDefaultCLNItem", "<type>..</type><idlist>..</idlist>")` を h4_MQPage と h4_ReqDoc(作成IDリスト)それぞれに実行(20250903追加:担当者一覧タブにデフォルト項目を追加)。
- 他Method呼出: h4_setDefaultCLNItem。
- 注意: 日付コメント 20250903/20260715 の修正履歴あり。events リストは使わず strEvent をそのまま比較。

## 10. h4_Call_Create_MQPage
- 言語: C# / id 6A51E3A8D1E44CC8A97896A2A554FC88 / comments: 「マルQページの作成」
- 概要: 選択したマルQマスタから、マルQページとその必要資料(開達書式ごと)を新規作成。
- 呼び出し契機(推測/コメントに記載): 冒頭コメント「h4_svcb_create_MQPageから呼び出される」。
- 入力(this): Event, My, Destination(@→,), ModelCode, ModelName, ModelNameId, ManagedById, DeltaVersion, Dept, MQMasterId, UseWF, EvaluationUnit, Group, Section。出力: 作成した MQPage / エラー時 newError(e.Message)。
- フロー:
  1. List `h4_events` + Filter Value(inactive=0, filter=DeltaVersion)から label→value を取得し、Event(ラベル)を値へ変換。
  2. h4_MQPage を add(h4_directaplist=InProgress, **h4_class="Sec"固定**, h4_model_name=ModelNameId, h4_src_mq_master=MQMasterId, h4_dept, h4_approve_style=UseWF, managed_by_id, h4_evaluation_unit, h4_group, h4_section 他)。
  3. `h4_DMQMaster DATFormat` を走査。各行について書式名・並び順・資料分類(h4_category)・イベント一覧(h4_event)を取得、`h4_DATFormat Doc` の related Document(file_item)を取得。h4_ReqDoc を add(name=書式名, h4_datformat_name, h4_dept, h4_class="Sec", h4_event, **h4_yryr: マスタ書式のイベントにEventが含まれれば"1"、既定"0"**, h4_evaluation_unit, h4_group, h4_section, h4_category, h4_pare_mq 等)。`h4_ReqDoc FormatN`(h4_format_file=file_item) を add、`h4_MQPage ReqDoc`(sort_order付)を add。
  4. ページを再apply。UseWF=="1" のとき Method `h4_setDefaultCLNItem` を `newItem("Method", ...)`+type/idlist で呼出(h4_MQPage と h4_ReqDoc各々)。
- 他Method呼出: h4_setDefaultCLNItem。
- 注意: `events[strEvent]` を直接参照(キー無しだと例外)。ループ末尾の `relFormat` は newItem のみで apply しておらず実質無効。コメントに「250807: Documentアクセス権不足が根本原因」と記載。


