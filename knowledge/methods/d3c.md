<!-- meta
legacy: knowledge/_legacy/機能設計書.md L6459-L6568
source: source/package/Independent/Import/Method/
-->
# D_method3c: Method AML 解析 (No.230〜244)

凡例: 呼び出し契機は全て「推測」。execution_allowed_to は特記なき限り World(A73B655731924CD0B027E4F4D5FCC0A9)。

---
## 230. h4_SetItemManagedAndOwned_af
- ID: 79FD5AA5B0ED41D896A20BFC7C1DC50C / C#
- 概要: managed_by_id / owned_by_id が変更されたとき、配下の必要資料(h4_ReqDoc)の同項目も更新する(After側)。Before側は h4_SetItemManagedAndOwned_be。
- 契機(推測): マルQページの onAfterUpdate(RequestState を Before が設定)。
- 入力(RequestState): `managed_by_id`, `managed_by_id_clear`, `owned_by_id`, `owned_by_id_clear`。出力: this/h4_S_E_0401/h4_S_E_0002。
- 処理: managed/owned のいずれかが更新対象(値あり or clear=="1")のとき、"h4_MQPage ReqDoc"(source_id=this.getID())の関連 h4_ReqDoc を取得し、各必要資料の `fetchLockStatus()` が 0(未ロック)または 1(自分がロック)以外(他者ロック)の場合、そのkeyed_nameを集めて h4_S_E_0401(カンマ連結)でエラー。全て問題なければ各必要資料を edit(doGetItem=0, version=0, serverEvents=0)し、clear でなければ値設定、clear の場合は `setPropertyCondition(..., "is null")` を設定。AMLを連結し `applyAML` で一括実行。最後に RequestState の4キーを Remove(例外時も)。
- 注意: `flag` が一度 false になると以降の updateIdsList への追加は止まるが、keyednameList>0 ならエラー終了するため実害なし。clear 時に `setPropertyCondition("...","is null")` を使っているが、実際にNULL更新されるかはコードからは断定不可。applyAML結果のエラー判定なし。

## 231. h4_SetItemManagedAndOwned_be
- ID: AD76C617BE02454BA3ACEE4ABBF492D3 / C#
- 概要: 更新前(onBeforeUpdate想定)に、DB上の managed_by_id/owned_by_id と更新後値を比較し、変更があれば RequestState に値(`managed_by_id`/`owned_by_id`)、新値が空の場合は `*_clear`="1" を保存。h4_SetItemManagedAndOwned_af が参照。例外時 h4_S_E_0002。

## 232. h4_SetNos
- ID: FB3A6FB043B04FD19E425F3829AA1741 / C#
- 概要: 改訂履歴(h4_RevisionHistory)の新規作成保存時に改訂No(`h4_revision_number`)を "NOTE_001" 形式で採番。h4_StartRevision の処理を流用(コメント)。
- 契機(推測): h4_RevisionHistory の onAfterAdd。
- 入力: this(h4_RevisionHistory)。`h4_revision_number` が入力済みなら何もしない。`h4_rel_dat_master`(対象:帳票マスタ)があればそれを親、無ければ `h4_rel_dat_format` を親とする。
- 処理: h4_RevisionHistory を、親プロパティ(h4_rel_dat_master/h4_rel_dat_format)=親ID で get、`h4_revision_number desc` で並べ先頭の番号を取得。値を "_" で分割できれば数値+1、できなければ/0件なら "NOTE_001"。番号は "NOTE_" + 3桁0埋め。自アイテムを edit(version=0, doGetItem=0)で `h4_revision_number` を更新(Administrators権限)。失敗時 h4_S_E_0002。
- 注意: コメント(TODO)「No.が999を超えた場合ソートが正しく動かない」。親を保存せず複数作成した場合の重複回避のためリレーション経由でなく親プロパティ経由に変更した経緯のコメントあり。

## 233. h4_SetPathVisibility
- ID: FDB07BEC0B77437EB70606B6A50AE371 / C#
- 概要: 指定アクティビティから出る指定名のWorkflow Process Pathを表示/非表示(is_discontinued)に切り替える。オリジナルは h4_hidePullBack。同名パスが複数生成されるため一括変更。
- 入力: `acId`(アクティビティID), `targetPathName`, `isVisible`("0":非表示/"1":表示、既定"0")。出力: this/h4_S_E_0002。
- 処理: "Workflow Process Path"(source_id=acId, name=targetPathName)を取得。is_discontinued が目標値と異なるパスIDを集め、SQL `UPDATE innovator.[workflow_process_path] SET is_discontinued='…' WHERE id IN (…)` を applySQL で実行(非表示=is_discontinued "1")。Administrators権限。
- 呼び出し元: h4_SetVoteInProgress(inn.applyMethod)。

## 234. h4_setPropToPointOut
- ID: AE4EE1BA98EE4BBAAD7B31962C8B69ED / JavaScript
- 概要: 指摘アイテム(PointOut)新規作成時に親アイテムのプロパティをセット、指摘No.を採番。
- 契機(推測): 指摘のクライアント onAfterNew(parent.thisItem=リレーション元の親)。
- 処理: `parent.thisItem` が無い(TOCから作成)場合は UserMessage h4_C_E_0001 を表示して中止。親の型が h4_MQPage, h4_ReqDoc, h4_Test_Result, h4_ApprovalWFGroup, h4_AppWFGroupForDATFormat 以外はスキップ。
  - 親から引継: h4_delta_version, h4_destination, h4_event, h4_my, h4_evaluation_unit, h4_unique_event, h4_rel_testrsult。初期値 h4_point_sub_number="1"、h4_newest_pointout=自ID。
  - 親種別: 
    - h4_MQPage: リレーション "h4_MQPage PointOut"、h4_rel_mq セット、番号接頭辞 "MQ_"
    - h4_ReqDoc: "h4_ReqDoc PointOut"、h4_rel_reqdoc、"DOC_"
    - h4_Test_Result: "h4_Test_Result_PointOut"、h4_rel_testrsult、"RZ_"
    - h4_ApprovalWFGroup: "h4_ApprovalWFGroup PointOut"、h4_rel_approvalwfgroup、"AP_"
    - h4_AppWFGroupForDATFormat: "h4_AppWFGr4DATFormat PointOut"、h4_rel_appwfgroupfordatformat、"APD_"
  - アイテム型プロパティ: h4_model_name(HRDPMTypModelProject), managed_by_id(Identity) を `thisItem` から取得し keyed_name つきで setPropertyItem。
  - 指摘No.: 親の該当リレーション(`aras.getItemRelationshipsEx`)の related_id の h4_point_number("接頭辞_数字")の最大値、および新規作成中(isTemp=1)のリレーションXMLの値の最大値を求め +1、`接頭辞+3桁0埋め` を h4_point_number にセット。親が h4_ReqDoc のときは接頭辞 "MQ" のものを除外して最大値を計算。
  - 例外時 h4_C_E_0002。
- 注意: 引継対象に親の `h4_dept` 等はなし。`thisItem` と `parent.thisItem` が混在。

## 235. h4_setPropToReqDoc
- ID: A692165058C943F7B7DBB585CDD5D045 / JavaScript
- 概要: 必要資料新規作成時に親マルQページのプロパティを引継ぎ。
- 処理: 親の型が h4_MQPage 以外ならスキップ。引継: h4_dept, h4_approve_style, h4_model_code, h4_delta_version, h4_event, h4_my, h4_destination。h4_model_name(HRDPMTypModelProject)は keyed_name 付きで setPropertyItem。`h4_pare_mq` に親マルQページをセット。例外時 h4_C_E_0002。

## 236. h4_setPropToRevisionHistory
- ID: BD397589A4154551B4E10E246E34E13D / JavaScript
- 概要: 改訂履歴新規作成時に親(帳票マスタ/開達書式)から値を引継ぎ・デフォルト入力。改訂Noは保存時(h4_SetNos)で採番に変更済み。
- 処理: 親型が h4_DATMaster / h4_DATFormat 以外はスキップ。`h4_revision_sub_number`="1"、`h4_newest_revision_history`=自ID。h4_DATMaster なら `h4_rel_dat_master`、h4_DATFormat なら `h4_rel_dat_format` に親をセット。`managed_by_id`(Identity)は keyed_name 付きで setPropertyItem。例外時 h4_C_E_0002。
- 注意: 旧来のNo採番ロジックがコメントアウトで残存(保存時処理に移行)。`relItemNames` は取得するが未使用。

## 237. h4_setRelEvents
- ID: 0A1DAE6004EC4C9FB3A55666F98D1AA2 / JavaScript
- 概要: 帳票マスタ/マルQマスタの開達書式リレーションシップグリッドで選択した行のイベント設定ダイアログを表示。
- 処理: 選択行(relationships.currTabID のグリッド `getSelectedItemIds`)の先頭を取得。親(this.parent.item)の h4_delta_version を取得。リレーション名は "h4_DATMaster DATFormat"、itemTypeName=="h4_DeptMQMaster" なら "h4_DMQMaster DATFormat"。選択行に一致するリレーションの related item(開達書式)の h4_event を取得(related が null または見つからない場合 UserMessage h4_C_E_0301 を AlertError)。⊿バージョンが空なら中止。フォーム `h4_DATFormat_Input_Init_EventVal`(title "イベント設定",850x300)を表示し、戻り値を開達書式に `aras.setItemProperty(selRowItem,"h4_event",dlgRes)`。初期化は h4_setEventInit。
- 注意: `debugger;` 残存。

## 238. h4_SetReqDocCLN
- ID: 5625F78845CE477BAFB4D10641098C8B / JavaScript
- 概要: 担当者一覧の一括設定ダイアログ(フォーム h4_SetReqDocCLN_Input, "担当者一覧設定", 1300x250)の表示と適用。グリッド(this.grid)で選択した行のアイテムが対象。
- 処理: 選択IDで `grid._itemType.name` のアイテムを get。ダイアログ結果(カンマ区切り30要素)を 担当者5・確認者5・承認者5・担当者必須5・確認者必須5・承認者必須5 に分割。各対象アイテムの RelatedItem に対し Method `h4_AddReqDocCLN`(id,type,createrList,reviewerList,approverList,createrRequiredList,reviewerRequiredList,approverRequiredList)を呼び、`aras.AlertSuccess(aras.evalMethod("h4_cmn_ShowMessage","","h4_C_I_0501"))`。
- 呼出Method: h4_AddReqDocCLN, h4_cmn_ShowMessage。注意: 成功メッセージは対象件数ぶん繰り返し表示される。apply結果のエラー判定なし。

## 239. h4_setRevisionData
- ID: DA7F339FC1C74C2C8ACAA2B0ECDEAF2F / C#
- 概要: 必要資料の「フォーマット」リレーション(this)に、同名の開達書式の最新改訂履歴の改訂日・改訂内容を入力。
- 契機(推測): 必要資料-フォーマットリレーションの onBeforeAdd/Update 等。
- 処理: this の source_id→h4_ReqDoc→`h4_pare_mq`→h4_MQPage→`h4_src_mq_master`→h4_DeptMQMaster→"h4_DMQMaster DATFormat" から開達書式を巡回し、name が必要資料と同名のものを特定。"h4_DATFormat RevisionHistory" の各 h4_RevisionHistory で created_on 最新のものの `h4_revision_date`, `h4_revision_summary` を this の `h4_revision_date`, `h4_revision_summary` にセットして終了。改訂履歴が0件なら何もせず return this。取得失敗は例外→h4_S_E_0002。
- 注意: 同名開達書式が見つからない場合はループ後に return this(コードの末尾)。

## 240. h4_SetVoteInProgress
- ID: E7DB21B290AA4C6C9684B00C1453801A / C#
- 概要: 作業中ステートで、担当者設定により Vote(パス)の表示を切り替える。確認者あり→確認依頼パスのみ表示。確認者なし(エイリアスのみ)→承認依頼パスのみ表示。対象: マルQページ、必要資料、テスト結果、一括。
- 処理: Administrators権限。型が対象外・state!="InProgress"・(一括以外で h4_approve_style=="0")なら何もしない。Workflow(1件であること)→最新InProgressアクティビティ(created_on最新)。型別CLN("h4_MQPage CLN"/"h4_ReqDoc CLN"/"h4_ApprovalWFGroup CLN"/"h4_Test_Result CLN")から h4_workflow_role=="Reviewer" かつ is_alias=="1" のIdentityがあれば確認者あり。パス名: "Request Review"(確認中への遷移)を確認者ありなら表示、"DirectReview"(承認依頼への遷移)を確認者なしなら表示。`inn.applyMethod("h4_SetPathVisibility", "<targetPathName>…</targetPathName><acId>…</acId><isVisible>…</isVisible>")` を2回呼ぶ。
- 呼出Method: h4_SetPathVisibility。契機(推測): アイテム保存後(onAfterUpdate/onAfterAdd)や InProgress アクティビティの onActive。

## 241. h4_setWfAssignWhenOnActive
- ID: 7C69899CA7CC47D485A72470B81931FB / C#
- 概要: マルQページ/必要資料/一括承認/テスト結果のWF担当者(担当一覧のIdentity)を、アクティブになったアクティビティのアサインとして割り当てる。WFアクティビティの Server Method に OnActive で設定(コメント)。h2_setWorkflowAssignment_sel(20250714)参考。
- 入力: this=Activity。Method `h4_GetControlledItem`(アクティビティIDから管理対象アイテム取得)を呼ぶ。出力: this/h4_S_E_0002/取得エラー文字列。
- 処理: 管理対象の型別に CLN: h4_MQPage→"h4_MQPage CLN"、h4_ReqDoc→"h4_ReqDoc CLN"、h4_ApprovalWFGroup→"h4_ApprovalWFGroup CLN"、h4_Test_Result→"h4_Test_Result CLN"、他は処理しない。Administrators権限で担当一覧(h4_workflow_role, h4_check_required, 関連Identity.is_alias)取得。role が RequestApproval/ProvisionalApproved/Approved なら Approver に読み替え。is_alias=="1" のIdentityのみ役割別集計。アクティビティ名別のロール割当: InProgress→Creater、InReview→Reviewer、RequestApproval/ProvisionalApproved/Approved/YryrRequestApproval→Approver。重複排除後、既存 Activity Assignment を where source_id で削除、再作成(voting_weight: 必須者なし=100、必須者=Ceiling(100/必須者数) 最小1、非必須者(必須設定あり時)=0)。担当者0件なら変更せず this。
- 呼出Method: h4_GetControlledItem。

## 242. h4_setWfAssignWhenOnActiveForDAT
- ID: 0FE463B9367D4333B5B6202EE2E3364F / C#
- 概要: 241の帳票マスタ/開達書式/開達書式一括版。`h4_GetControlledItem` で管理対象取得。
- 処理: h4_DATMaster→"h4_DATMaster CLN"、h4_DATFormat→h4_category=="EXPTest" なら "h4_DATFormat EXPCLN" else "h4_DATFormat CLN"、h4_AppWFGroupForDATFormat→h4_isexp=="1" なら "h4_AppWFGrForDATFormat EXPCLN" else "h4_AppWFGrForDATFormat CLN"。Administrators+Aras PLM権限。アクティビティ名別: InProgress→(EXP: InspEXPStaff / 非EXP: Creater)、RequestApproval→Approver、ReqApproval_InspEXP→InspEXPApprover、ReqApproval_Q1Stf→Q1Staff、ReqApproval_Q1Appr→Q1Approver、ReleaseApproved→ReleaseApprover、それ以外は割当なし。削除→再作成、voting_weight計算は241と同じ。コメントで「h4_NewAssignInProgressForDat と同様」。

## 243. h4_SetWfForDATAtRevisio_After
- ID: AC989A2D3596441385966E6B50904E12 / C#
- 概要: 帳票マスタ・開達書式のメジャーリビジョンアップ時にWFを設定(デフォルトWF未設定のため)。OnBeforeVersion(h4_SetWfForDATAtRevisio_Before)/OnAfterVersionのセット。
- 処理: Before が RequestState["h4_DatBeforeMajorRev"] に保存した旧 major_rev と、`config_id` かつ is_current=1 の最新アイテムの major_rev を比較し同じなら終了。異なる場合(メジャー改訂)は、開達書式で `h4_category`=="EXPTest" なら Workflow Map "h4_DATFormatEXPWF"、そうでなければ "h4_DATFormatWF"(帳票マスタも通常WF)を取得し、新アイテムに `instantiateWorkflow(mapId)` → `apply("startWorkflow")` でWF起動。エラー時 h4_S_E_0002。
- 注意: `this.apply("getItemLastVersion")` で最新を取得。`beforeCategory` の get(誤って setAttribute("h4_category",""))は結果未使用。コメントで h4_ChangeWfForDATFormat のマイナーチェンジ版。

## 244. h4_SetWfForDATAtRevisio_Before
- ID: 051A865C8FAA41CA8A868FCDC8A873A6 / C#
- 概要: 上記のBefore側。改訂時の旧major_rev保存と、改訂時の更新日クリア・パーミッション戻し。
- 処理: Administrators権限で自アイテムの major_rev を取得して `RequestState.Add("h4_DatBeforeMajorRev", …)`。action=="version" のとき `h4_updatedate` を空に。さらに state=="Release"(改訂=承認を回して公開)なら Permission(name="h4_InProgress_DATMas"(帳票マスタ)/"h4_InProgress_DAT"(開達書式))を取得して `permission_id` にセット(作業中パーミッションへ戻す)。取得エラー h4_S_E_0002。
- 注意: `RequestState.Add` は既存キーがあれば例外の可能性(コードは Remove していない)。


