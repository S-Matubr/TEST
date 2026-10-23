<!-- meta
legacy: knowledge/_legacy/機能設計書.md L6102-L6302
source: source/package/Independent/Import/Method/
-->
# D_method3a: Method AML 解析 (No.183〜208)

凡例: 呼び出し契機は全て「推測」。execution_allowed_to は特記なき限り World(A73B655731924CD0B027E4F4D5FCC0A9)。
共通: メッセージは `CCO.ErrorLookup.Lookup("...")` 経由(h4_S_E_xxxx)。権限昇格は `CCO.Permissions.GrantIdentity(Identity.GetByName("Administrators"/"Aras PLM"))`。

---
## 183. h4_Promote_By_List_MQPage
- ID: 5B38FBF3B506400DB67C37F29E386E25 / 言語: C#
- 概要: マルQページ(ダイレクト承認)のプロモートメソッド(comments)。リスト項目 h4_directaplist の値のステートへプロモートする。
- 契機(推測): マルQページのダイレクト承認用リスト変更時(onAfterUpdate等)。
- 入力: this=対象アイテム。プロパティ `h4_directaplist`(遷移先ステート名), `current_state`, `locked_by_id`。出力: this。
- 処理: Administrators権限で実行。`current_state` から "Life Cycle State" を getItemById し name を現在ステート名として取得。`h4_directaplist` と異なる場合のみ処理。ロック中(getLockStatus()==1)なら一旦 unlockItem、switch で InProgress / InReview / ProvisionalApproved / RequestApproval / Approved のいずれかに `promote(state,"Promote message")`、その後ロックしていたなら lockItem で再ロック。
- 呼出Method: なし。
- 注意: case 以外の値は何もしない。promoteの結果エラーはチェックしていない。currentUserId/lockedById は未使用。

## 184. h4_Promote_WFGroup_ApTarget
- ID: 7C02AC36AF274219BD9D02F00C63B183 / C#
- 概要: 一括承認用。WF(一括承認アイテム)の親LC遷移時に子アイテムのLCを遷移する。
- 契機(推測): h4_ApprovalWFGroup のWF/LC遷移時(Method呼び出しで引数付き)。
- 入力: `destination`(遷移先ステート), `sourceId`(一括承認アイテムID)。出力: this。
- 処理: ItemType `h4_ApprovalWFGroup_ApTarget` を source_id=sourceId で取得→各リレーションの RelatedItem を取得。`state == destination` のものはスキップ、他を List に追加。Aras PLM権限で各 itm.promote(destination,"Promote message")。
- 注意: promote結果のエラー判定なし。

## 185. h4_PromoteDATFormatOfAppWFGr
- ID: 7620ECD22B534BA8848455B7E9192B02 / C#
- 概要: 開達実施要領一括承認配下の開達書式をプロモート。
- 入力: `destination`, `sourceId`。出力: this。
- 処理: Administrators権限で ItemType `h4_AppWFGr4DATFormat DATFormat`(source_id=sourceId) を取得→RelatedItem。destinationと同ステートはスキップ。Aras PLM権限で個別に promote(destination,"Promote message")。
- 注意: 184の開達書式版。エラー判定なし。

## 186. h4_PromoteForClient
- ID: B670802E172544D6BCCD931C11BC3ACB / C#
- 概要: クライアント用汎用プロモート。最新版を探してプロモート。
- 入力: `configID`, `targetType`, `newState`。出力: this、失敗時 newError(h4_S_E_0002)。
- 処理: targetType を config_id=configID かつ is_current=1 で get → ID で新規getアイテムを作り、Aras PLM権限で `promote(newState,"promoted by direct promote")`。isError なら h4_S_E_0002。
- 契機(推測): クライアントJSからのダイレクトプロモートボタン。

## 187. h4_propDeltaFilter
- ID: C83007067D544B5BBB8D8A95EB050E06 / JavaScript / execution_allowed_to=Administrators(2618D6F5A90949BAA7E920D1B04C7EE1)
- 概要: 開達書式選択時のフィルター(comments)。
- 処理: `thisItem.getItemByIndex(0).getProperty("h4_delta_version")` を取り、`Filter["h4_delta_version"]={filterValue:deltaVersion,isFilterFixed:true}` を返す(固定フィルタ)。
- 契機(推測): ItemTypeプロパティ(Item型)の「フィルタ」メソッド(検索ダイアログのプロパティフィルタ)。

## 188. h4_propIsExpFilter
- ID: 930634316E38474EB29BD2B11891107B / JavaScript / Administrators
- 概要: 開達書式選択時にEXP仕様有無でカテゴリを絞り込む検索条件を設定。
- 処理: `thisItem.getItemByIndex(0).getProperty("h4_isexp")` が "1" なら categoryList1=["EXPTest"]、それ以外は ["format","guideline","deptDoc"]。`<OR><h4_category condition='like'>値</h4_category>…</OR>` を組み、h4_DATFormat の get AML(page=1,pagesize=100, select に h4_category,h4_class,h4_delta_version,h4_doc_class,h4_doc_description,h4_doc_link1-3,h4_event,h4_guideline_link1-3,h4_state,current_state,h4_supplementary_materials1/2,h4_updatedate,name,owned_by_id,config_id,major_rev,css,keyed_name,generation,release_date,effective_date,is_current 等)を `inArgs.QryItem.loadXML` で設定。
- 注意: `debugger;` 残存。コメントアウトされた旧criteriaAml(format/guidelineのみ)あり。契機(推測): Itemプロパティの検索ダイアログ用フィルタ(onSearchDialog系)。

## 189. h4_PullBack
- ID: FAA5918340264F69B94390903F1DABCD / C#
- 概要: ワークフローの引き戻し(マルQページ/必要資料/一括承認/テスト結果)。引戻し後メール通知。
- 契機(推測): WFの「引き戻し」ボタン(クライアントからMethod呼び出し)。
- 入力: `id`(対象アイテムID), `type`, `typeName`(対象ItemType名)。出力: temp アイテム(getValue="success")。エラー: "systemError"/"stateError"/"userError"/h4_S_E_0002。
- 処理フロー:
  1. ログインユーザーの Alias(source_id=userID)を取得→現在のAlias Identity ID。User.cmn_name を送信者名に。
  2. Administrators権限: 対象アイテム get(失敗 h4_S_E_0002)→ "Workflow"(source_id=id)→"Workflow Process"→"Workflow Process Activity"(関連Activity.state=Active)→Active Activity(id,name)と Activity Assignment 取得。引戻し前のアサイン先Identityをリスト化(メールTO用)。
  3. 現在Activity名で分岐: "InReview"→戻り先 InProgress/ロール Creater。"RequestApproval"→対象ItemTypeに応じ CLN(h4_MQPage CLN / h4_ReqDoc CLN / h4_ApprovalWFGroup CLN / h4_Test_Result CLN)から Reviewer有無を判定(内部関数GetInReviewIdentityList)。確認者なし→InProgress/Creater(パス名 "pullBack_RA_IP")、あり→InReview/Reviewer(パス名 "pullback")。それ以外ItemTypeは return this。その他Activity名は "stateError"。
  4. 全Activityから戻り先名の closed_date が最新のものを特定(deleteActivity)。その Activity Assignment のうち closed_on 有りのIdentity→Alias→Userが実行ユーザーと一致する場合のみ実行可(is_RunPullBack)。不一致は "userError"。
  5. "Workflow Process Path"(source=現Activity,related=戻り先Activity,name=パス名)を取得。ログインユーザーAliasを現Activityに Activity Assignment 作成(voting_weight=100,is_required=0)。
  6. `<Item type='Activity' action='EvaluateActivity'>` を Path指定・Comments="Approver PullBack"・Complete=1 で実行。
  7. メール: "EMail Message" name="h4_pullBackMail" を取得、from_user のメールをFrom、body_htmlの `{runUser}`(実行者名)、`{ItemURL}`(`CCO.Request`のScheme/Host/PathBaseから "Server"末尾除去しURL＋"?StartItem=型%3Aid")、subject の `{KeyName}`(keyed_name)を置換。TO=引戻し前アサイン先、CC=該当CLNで h4_workflow_role=searchRoleName の related_id(Alias経由でUserのemail)。`CCO.Email.SetupSmtpMailServerAndSend`。
- 内部Method: GetInReviewIdentityList(担当一覧から h4_workflow_role=="Reviewer" かつ is_alias=="1" のIdentity ID一覧)。
- 注意: 引戻し後に再取得した Activity(deleteActivityTo/From) 等は取得するだけで未使用(空ループ)。deleteActivity が null の場合の考慮なし。

## 190. h4_PullBack_DAT
- ID: 6CD3B711F41F4D39ABBB7C3CAD444F03 / C#
- 概要: 帳票マスタ・開達書式(・一括承認)のWF引き戻し。
- 入力/出力: 189と同様(id,type,typeName→temp getValue=success)。
- 189との差分:
  - Workflowが複数ある場合、Workflow Process.active_date が最新のものを採用。
  - 現Activityが "RequestApproval" または "ReqApproval_InspEXP" の場合のみ可(それ以外 "stateError")。戻り先は常に "InProgress"、パス名 "pullback"。
  - EvaluateActivity に Activity Task(source_id=activityId の1件)を `<Task id=... completed='1'>` として指定。
  - CC判定: typeName=="h4_DATFormat": h4_category=="EXPTest" なら "h4_DATFormat EXPCLN"(role=InspEXPStaff)、それ以外は "h4_DATFormat CLN"(role=Creater)。typeName=="h4_AppWFGroupForDATFormat": h4_isexp=="1" なら "h4_AppWFGrForDATFormat EXPCLN"(InspEXPStaff)、そうでなければ "h4_AppWFGrForDATFormat CLN"(Creater)。それ以外(else、h4_DATMaster想定): "h4_DATMaster CLN"(Creater)。
  - メールは同じ h4_pullBackMail を使用。
- 注意: 構造上 if(h4_DATFormat){...} と if(h4_AppWFGroupForDATFormat){...}else{DATMaster} が別々のif/elseなので、h4_DATFormat のときも後続の else(h4_DATMaster CLN, Creater)が実行され CC が追加される(コード上そう読める)。コメントアウトされた Member展開処理が残存。

## 191. h4_ReAssign_AfterCopy_DATFormat
- ID: 0D55A874EF254E77AEBF11A0A5CA37A4 / C#
- 概要: 帳票マスタ複製後の開達書式WFの再アサイン。
- 入力: `targetIds`(対象アイテムID), `targetCategories`("h4_DATMaster" / "EXPTest" / その他)。出力: 対象アイテム(アサイン対象なし時)または this。エラー h4_S_E_0002。
- 処理: targetCategories=="h4_DATMaster" なら h4_DATMaster、それ以外は h4_DATFormat を get。そのWorkflow(複数なら Workflow Process.active_date 最新)の Workflow Process Activity から name=="InProgress" のActivity(複数時は created_on 最新)を特定。リレーション: EXPTestなら "h4_DATFormat EXPCLN"、そうでなければ "h4_DATFormat CLN"(h4_DATMasterなら "h4_DATMaster CLN")。Aras PLM権限で担当一覧(h4_workflow_role, h4_check_required, 関連Identity.is_alias)から is_alias=="1" のIdentityのみ役割別に集計し、現Activity名で割当対象ロールを決定(InProgress: EXPならInspEXPStaff/それ以外Creater、RequestApproval: Approver、ReqApproval_InspEXP: InspEXPApprover、ReqApproval_Q1Stf: Q1Staff、ReqApproval_Q1Appr: Q1Approver、ReleaseApproved: ReleaseApprover)。既存 Activity Assignment を where source_id で全削除→再追加。
- voting_weight: 必須(h4_check_required=1)がなければ全員100。必須者がいる場合、必須者=Ceiling(100/必須者数)(最小1)、非必須者=0。
- 内部メソッド: GetIdentityList, GetIdentityList2(必須者リスト), AddActivityAssignment(applyAMLでActivity Assignment add), DeleteActivityAssignment。コメントで「h4_setWfAssignWhenOnActiveと同様の処理」。
- 注意: 担当者0件なら何もせず targetItem を返す。`targetItem.apply()` の戻りを代入していない(isErrorは元アイテムに対して判定)。

## 192. h4_ReAssignInProgress
- ID: C5A437A213E144A4882FF534A162D137 / C#
- 概要: 作業中の変更(担当者変更)があった場合、WFのInProgressアクティビティのアサインを再割り当て。一括承認・単体承認・テスト結果対応。
- 契機(推測): アイテムの onAfterUpdate(コメント「アイテムのOnAfterUpdateで作業中のみ実行される」)。
- 入力: this。出力: this/h4_S_E_0002。
- 処理: Administrators権限。型が h4_ApprovalWFGroup 以外は `h4_approve_style`=="0"(ダイレクト)なら何もしない。`state`!="InProgress" なら何もしない。"Workflow"(source_id=id、件数が1でなければエラー)→Workflow Process Activity から name=="InProgress" のActivity(複数は created_on 最新)。型別に CLN: h4_MQPage→"h4_MQPage CLN"、h4_ReqDoc→"h4_ReqDoc CLN"、h4_ApprovalWFGroup→"h4_ApprovalWFGroup CLN"、h4_Test_Result→"h4_Test_Result CLN"、他は処理しない。Aras PLM権限で担当者取得→既存アサイン全削除→再作成。
- ロール: h4_workflow_role が "RequestApproval"/"ProvisionalApproved"/"Approved" の場合は "Approver" に読替。Creater/Reviewer/Approver。InProgress→Creater、InReview→Reviewer、RequestApproval/ProvisionalApproved/Approved→Approver。voting_weight計算は191と同じ。
- 注意: AddMember は「h4未使用」とコメント。

## 193. h4_ReAssignInProgressForDat
- ID: 7E75D7DB46294D64854A0BA8BDE37FC9 / C#
- 概要: 192の帳票マスタ・開達書式・開達書式一括版。新規作成時は別プログラムで対応(コメント)。
- 処理: state=="InProgress" のみ。最新WF(active_date)→最新のInProgressアクティビティ。型別CLN: h4_DATMaster→"h4_DATMaster CLN"、h4_DATFormat→EXPTest(h4_category)なら "h4_DATFormat EXPCLN" else "h4_DATFormat CLN"、h4_AppWFGroupForDATFormat→h4_isexp=="1" なら "h4_AppWFGrForDATFormat EXPCLN" else "h4_AppWFGrForDATFormat CLN"、他は処理しない。ロールと割当は191と同じ(EXP系ロール InspEXPStaff 等)。既存アサイン削除→再作成。担当者0件なら変更なし。

## 194. h4_RecordUpdateDate
- ID: 3CC723DD66644F069A01FBD6DD64F44C / C#
- 概要: 帳票マスタ・開達書式共通。更新日(h4_updatedate)に modified_on の値を入力。
- 入力: `id`, `type`。出力: this/h4_S_E_0002。
- 処理: 対象を get(select=modified_on)→ edit で `h4_updatedate`=modified_on をセット。`version="0"`, `serverEvents="0"` で版・サーバーイベントを発生させない。Administrators権限。
- 契機(推測): 公開(Release)時。コメント: 一括承認アイテムでの公開/1回目公開/改定(WF)公開/改定(すぐ承認)公開。

## 195. h4_ReleaseChildrenDATFormat
- ID: 9716EEC729B54AE0A8334BDA2528A5DF / C#
- 概要: 帳票マスタ配下の開達書式を公開にする。コメントで `h4_PostApprovalLCProcForDAT` から呼出。
- 入力: `id`(帳票マスタID)。出力: this/h4_S_E_0002。
- 処理: "h4_DATMaster DATFormat"(source_id=id)→関連 h4_DATFormat を取得。state が "Release" または "InRevision" 以外のものを対象に Aras PLM権限で `promote("Release","帳票マスタに紐づいた開達書式の公開")`。エラー時 h4_S_E_0002。
- 注意: コメント「adminでも権限昇格しないとプロモートできない」。

## 196. h4_ReplaceDATFormatAtRelease
- ID: 320F8E7AC5B34CA6BD5D26BF0FBC07E1 / C#
- 概要: 開達書式公開時、親(帳票マスタ・マルQマスタ)に付いている旧版の開達書式のリレーションを自身(公開した版)に差し替える。
- 入力: `id`(公開した開達書式ID), `configID`。出力: this/h4_S_E_0002。
- 処理: 同 config_id で generation>0 の h4_DATFormat 全版のIDを取得。
  - 帳票マスタ: "h4_DATMaster DATFormat" で related_id in(全版ID) のリレーションを取得し、各親(h4_DATMaster)について h4_CherckParent(is_current,config_id,state)。最新(is_current=1)かつ state が InProgress/InRevision(float振る舞い)以外ならリレーションの related_id を公開版に edit(version=0)で差替。さらに同configの is_released=1 で generation 最大の親(h4_GetRelesedItem)が別にあり、それに全版IDのいずれかの開達書式が付いていれば、そのリレーションも差替。
  - マルQマスタ: "h4_DMQMaster DATFormat"(親 h4_DeptMQMaster) で最新(is_current=1)なら差替。リリース概念がないため released 判定は不使用(コメントアウトされた旧コード有り)。
- 内部関数: h4_CherckParent, h4_GetRelesedItem, h4_replaceRelatedID。
- 契機(推測): 開達書式の公開(Release)遷移後。

## 197. h4_ReqDoc_IVRCB_DirectApp_init
- ID: 1BD249C841AB434E9A8895A52F636C9F / JavaScript
- 概要: マルQページ必要資料リレーションシップ用メニューボタン(ダイレクト承認)初期化。親の `h4_approve_style`(ワークフローの有無)で表示制御。ON(=1)は非表示、OFFは表示。
- 処理: 親アイテム(itemTypeName,itemID)を get(select h4_approve_style,locked_by_id,managed_by_id,created_by_id)。canPromote = ログインユーザーが作成者 or identityListに managed_by_id / Super User(6B14D33C4A7D41C188CCF2BC15BD01A3) / Aras PLM(56A96DA9E981481688563E2D14D5D878) / administrators(2618D6F5A90949BAA7E920D1B04C7EE1) を含む。戻り値 `{hidden: wfOption==1, disabled: !canPromote}`。
- 契機(推測): リレーションシップビューのコマンドバーボタン初期化(ivrcb_init)。

## 198. h4_ReqDoc_ivrcb_MultiWFStart_ini
- ID: 9CF8117520EF48AEB6D4907E56B4AD21 / JavaScript
- 概要: 197の逆。WF起動(複数)ボタン。`hidden: wfOption == 0`、disabled=!canPromote(判定は同一)。

## 199. h4_ReqDocsNDocGridEventAdd
- ID: F52FB698388D4387A8376B6F93D4ACBF / JavaScript
- 概要: 成果物追加時、必要資料の「添付資料の有無」(h4_doc_attached)を "1" にする。
- 処理: `aras.getMostTopWindowWithAras(window).itemID` で h4_ReqDoc を getItemById し、`aras.setItemProperty(targetItem,"h4_doc_attached","1")`。契機(推測): 成果物(Doc)グリッドの行追加イベント。

## 200. h4_ReqDocsNDocGridEventDel
- ID: 6350EBB904994D6B9476BE3D4CC9490B / JavaScript
- 概要: 199の削除版。h4_doc_attached を "0" にする(成果物の存在確認はしていない。コメントは「チェックを外す」)。

## 201. h4_ReSetPermisson_After
- ID: 79A86196F08D4F01A0F2EEBB5111FCBE / C#
- 概要: 親アイテムからドキュメントとの紐づきを削除した際、ドキュメントのパーミッションを更新(Before/Afterの After)。
- 契機(推測): 親アイテムの更新後(onAfterUpdate)。Before(h4_ReSetPermisson_Before)がセットした RequestState[型名] を使用。
- 処理: RequestState[typename] の更新前リスト("config_id,parent_order_no")が無い/0件なら終了。Method `h4_GetDocumentRelationName`(typename)でドキュメントリレーションのItemType名一覧→各々に `h4_GetDocRelParentConfigID`(relitemtypeName, sourceID)で現在のリレーションの config_id/parent_order_no 一覧を作成。前後比較で消えたものを特定し、各ドキュメント(config_id)に `h4_GetDocRelOrderNoAnParentState`(docConfigID) を呼び:
  - `minParentOrderNo`=="-1"(関連が全て無くなった): Permission(keyed_name="h0_admin_document")のIDを取得し、SQLで `update [Document] set permission_id=..., h4_parent_config_id='' where id=currentDocID`。
  - `isChangeFirstParent`=="1"(最初のリレーションが消えた): `firstParentParmission` と `firstParentConfigID` を Document の permission_id / h4_parent_config_id にSQLで更新。
  - それ以外は何もしない。SQL失敗時 h4_S_E_0011 の例外。最後に RequestState.Remove。
- 呼出Method: h4_GetDocumentRelationName, h4_GetDocRelParentConfigID, h4_GetDocRelOrderNoAnParentState。
- 注意: SQL直接実行(applySQL)。defpermission取得のエラー判定で docInfoAndRelation を参照している(変数取り違い)。SH-974対応コメントあり。

## 202. h4_ReSetPermisson_Before
- ID: B3FFA0ADE71F4C2B9ED8921401BF4A46 / C#
- 概要: 更新前(onBeforeUpdate)に、紐づいているドキュメントの "config_id,parent_order_no" 文字列リストを RequestState[型名] に保存(既存キーは Remove してから)。h4_GetDocumentRelationName, h4_GetDocRelParentConfigID を呼ぶ。0件なら RequestState に追加しない。エラー時 h4_S_E_0002 または例外文字列。

## 203. h4_RevisionHistory_ivicb_copy
- ID: A69BF6BE6FA947D992567EEDF270D3B9 / JavaScript
- 概要: 改訂履歴ItemビューのItemビューコマンドバーボタン「関連改訂履歴作成」処理。
- 処理: 確認ダイアログ(UserMessage h4_C_I_1001/タイトル h4_C_I_0001、`ArasModules.Dialog.confirm`)でOK→ 現アイテムID(`getMostTopWindowWithAras(window).itemID`)が h4_RevisionHistory.h4_newest_revision_history と一致しなければ h4_C_E_1001 でエラー(他者が作成済み)。新規 h4_RevisionHistory を add(newID 採番): `h4_revision_sub_number`=現在+1、`h4_newest_revision_history`=新ID、コピー項目 h4_revision_number, h4_rel_dat_format, h4_rel_dat_master, managed_by_id, h4_revision_summary, h4_revision_reason。`h4_confirmation_status`="not_confirmed"。リレーション "h4_RevisionHistory Doc"(related_id)を複製、"h4_RevisionHistory RevHist" は元アイテムID＋元の関連先全てを新アイテムに追加。apply後 `aras.uiShowItem` で表示し1秒後 `onEditCommand()` で編集モードにする。例外時 h4_C_E_0002。
- 注意: 新アイテムの h4_newest_revision_history 更新(旧履歴側)は本メソッドでは行っていない(コードに無い)。

## 204. h4_RevisionHistory_ivicb_init
- ID: A61C6E25935141E8A933011E34216F3F / JavaScript / execution_allowed_to=Administrators
- 概要: 改訂履歴の関連作成ボタン活性制御。編集モード、または枝番が最新でない場合は非活性。参考元 h4_PointOut_ivicb_init。
- 処理: this.isEditMode なら disabled。itemID と thisItem.h4_newest_revision_history が一致する場合のみ活性。さらに親アイテム(managed_by_id)取得、取得0件なら disabled。作成者/管理者(managed_by_id所属)/Super User/Aras PLM/administrators のみ有効。例外時 h4_C_E_0002。
- 注意: select に created_by_id を含めていないため createdByID は未取得(コード上 managed_by_id のみselect)。`debugger;` 残存。

## 205. h4_SaveCheckhApprovalWFGroup
- ID: 230AA4AFC07F45C6A1ED101081CB0E65 / C#
- 概要: 一括承認(h4_ApprovalWFGroup)保存時のチェック。
- 契機(推測): h4_ApprovalWFGroup の onBeforeAdd/onBeforeUpdate。
- 処理: リレーション `h4_ApprovalWFGroup_ApTarget`(delete除く)の各RelatedItemに対し:
  ①複数アイテムタイプ混在→ h4_S_E_0801。
  ②他の(現行版 is_current=1 かつ config_id が自分と異なる)一括承認に既に紐づいている→ h4_S_E_0804(keyed_name, 一括のkeyed_nameを<br>連結)。
  ③RelatedItem.h4_approve_style=="0"→ h4_S_E_0805。
  ④⑤state が "Approved" または "Unapproved"→ h4_S_E_0806。
  ⑥h4_yryr=="0"(やるやら×)→ h4_S_E_0807。
  例外時 h4_S_E_0002。
- 注意: コメントでは⑤「承認却下(必要資料のみ)」⑥「必要資料のみ」とあるが、コードは全対象型に適用。

## 206. h4_SaveCheckPointOut
- ID: AEBAEE289A264493B9547FE8A1B92E73 / C#
- 概要: 指摘アイテム保存時、対象マルQページ(h4_rel_mq)と対象必要資料(h4_rel_reqdoc)の両方に値がある場合、その必要資料がマルQページ配下か("h4_MQPage ReqDoc"リレーション)チェック。不整合なら h4_S_E_0601。例外時 h4_S_E_0002。

## 207. h4_SaveCKAppWFGroup4DATFormat
- ID: 3E845715CBAF4B7FB4CED08DE8D419E7 / C#
- 概要: 開達書式の一括承認(h4_AppWFGroupForDATFormat)保存時のチェック。h4_SaveCheckhApprovalWFGroup を参考。
- 処理: リレーション "h4_AppWFGr4DATFormat DATFormat"(delete除く)の各開達書式について:
  1. 他の一括(is_current=1, 自分以外)に紐づく→ h4_S_E_0810(keyed_name, 一括名)。(リレーション取得エラーは h4_C_E_0002)
  2. h4_category=="EXPTest"→1 / 他→0 が一括の h4_isexp と不一致→ h4_S_E_0808。
  3. state が "InProgress" 以外→ h4_S_E_0809。
  例外時 h4_S_E_0002。

## 208. h4_SaveTestResult
- ID: 1CF711CE6E0243999D9ACDDAA8BC314B / C#
- 概要: テスト結果(h4_Test_Result)保存時、担当(`h4_name`)が空なら、担当一覧 "h4_Test_Result CLN" の h4_workflow_role=="Creater"(delete除く)のうち sort_order 最小の related_id を `h4_name` にセット。h4_name設定済みなら何もしない。例外時 h4_S_E_0002。


