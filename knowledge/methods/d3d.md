<!-- meta
legacy: knowledge/_legacy/機能設計書.md L6569-L6713
source: source/package/Independent/Import/Method/
-->
# D_method3d: Method AML 解析 (No.245〜267)

凡例: 呼び出し契機は全て「推測」。execution_allowed_to は特記なき限り World(A73B655731924CD0B027E4F4D5FCC0A9)。

---
## 245. h4_SetWfForDATMasterAtAdd
- ID: 81E4A33AFB8D44648691DEC329A74885 / C#
- 概要: 帳票マスタの新規作成時のWF設定。自動生成(デフォルトWF)を使わず、このメソッドで設定する(後続WFにユーザーをアサインする都合、コメント)。
- 契機(推測): h4_DATMaster の onAfterAdd。
- 処理: Workflow Map name="h4_DATFormatWF" を取得(Administrators権限)→ `this.instantiateWorkflow(mapId)` → `apply("startWorkflow")`。エラー時 h4_S_E_0002。this を返す。
- 注意: 帳票マスタでも使用WFは "h4_DATFormatWF"(定数名 NormalWF)。

## 246. h4_SetYaruYara
- ID: 2A0CA602BDD64358BCAEA010426D8118 / C#
- 概要: マルQページ保存時にやるやらテーブル(必要資料の h4_yryr)を更新。必要書類に定義されたイベントがマルQページで定義している場合○(1)、していない場合×(0)。
- 契機(推測): h4_MQPage の onBeforeUpdate 等。
- 処理: this の `h4_event` と DB上の保存前 h4_event が同じなら終了。`h4_src_mq_master` が空なら終了。h4_DeptMQMaster の "h4_DMQMaster DATFormat" リレーテッド(開達書式)の name→`h4_event`(ラベルのカンマ区切り) を辞書化。this の h4_event が空なら終了。List `h4_Events` の Filter Value(filter=マルQページの h4_delta_version, inactive=0)から ラベル→値 の辞書を作成。マルQページの "h4_MQPage ReqDoc" リレーテッド(必要資料)ごとに(Administrators権限)、必要資料名がマスタ側開達書式名に存在すれば、ロック状態が 0 以外なら h4_C_E_0401 エラー、h4_ReqDoc を edit(version=0, serverEvents=0)で h4_yryr="0" を設定し、マスタ側イベントのラベルを値に変換して this の h4_event と一致するものがあれば h4_yryr="1"。例外時 h4_S_E_0002。
- 注意: `Dictionary.Add` のキー重複(同名の開達書式/イベント)は例外になりうる(コード上の事実)。

## 247. h4_ShowIdentityMembers_click
- ID: 1024BBFCDB144DCA91B697EEBC877EB7 / JavaScript
- 概要: メンバー一覧表示ボタンクリック時処理。Identity検索グリッドで選択したIdentityのメンバー一覧をポップアップ表示。
- 処理: `window.grid.getSelectedId()` 未選択なら「アイデンティティを選択してください。」。Identity を get し "Member" リレーションを取得。`is_alias` が "1"/"true" なら「エイリアスアイデンティティは対象外です。」。各メンバーの cmn_last_name_ja, cmn_first_name_ja, cmn_department_ja, cmn_last_name_en, cmn_first_name_en, cmn_department_en を表(No/姓(漢字)/名(漢字)/姓(英語)/名(英語)/室課(漢字)/室課(英語))にして `window.open`(800x600 "IdentityMembers")に書き出す。メンバー0件は「メンバーは登録されていません。」。
- 注意: メッセージがハードコード(UserMessageを使わない)。メンバー情報はHTMLエスケープなしで出力。

## 248. h4_SMthCnvAttachFile
- ID: 481D3349316B4B4F9AC8BFCE7C14C346 / C#
- 概要: Conversion Framework(PDF変換)のサーバーメソッド。変換結果(ConversionTaskResult)のPDFファイルIDを、依存元Document(ConversionTaskDependency.dependency_id)の `h4_pdf_file` に設定。
- 処理: `task.Item` の Relationships から ConversionTaskResult[0].file_id を取得。空でなければ ConversionTaskDependency の dependency_id を全て集め、`<Item type='Document' id='id1,id2' action='edit' version='0' ServerEvents='0'><h4_pdf_file>…</h4_pdf_file></Item>` を applyAML。エラー時 h4_S_E_0002。task.Item を返す。
- 契機(推測): ConversionTask の変換完了時に呼ばれる Conversion Server Method。

## 249. h4_SMthCnvInitDependencies
- ID: ED493E4B2AAA426BB406DF57DD0433CE / C#
- 概要: 変換タスクの依存関係初期化。変換対象ファイル(`task.FileID`)を `file_item` に持つ Document を get し、`task.AddDependency(res)` で依存に登録。エラー時 h4_S_E_0002。task.Item を返す。

## 250. h4_SMthCnvSendErrorMail
- ID: 97791F3768C44BFDADE73A6897502D6D / C#
- 概要: 変換エラー時のメール送信。
- 処理: サーバー変数 `h4_SystemOperator`(CCO.Utilities.GetVarValue)のIdentityをkeyed_nameで取得。リクエストの Scheme/Host/PathBase から `{scheme}://{host}/{aliasName}/?StartItem=ConversionTask:{taskId}` を作成し、temp アイテムに StartItem, taskId を設定。Email Message "h4_MsgOfficeToConverterError" を `paramItem.email(emailTemplateItem, identityItem)` で送信。InnovatorServerException 時 h4_S_E_0002。

## 251. h4_sort_control
- ID: B098313389634B4FB735347527CC7ADF / C#
- 概要: `this.setAttribute("orderBy","modified_on DESC"); return this;`(更新日降順)。契機(推測): 検索(onBeforeGet)。

## 252. h4_start_change_yryr
- ID: 4BD40E78263645B3BC2E621133D2990D / JavaScript
- 概要: 必要資料の「やるやら変更」ボタン処理。やるやらの○×、ダイレクト承認か否かで動作が変わる。実行中はクレイム(ロック)して他ユーザーの影響を受けないようにする。非同期処理。
- 処理フロー:
  1. `h4_yryr`, `h4_approve_style` を取得。Method `h4_CheckUseYryrChange`(item_id, isApStyle, isButtonInit="false")を applyAsync でチェック。
  2. ロック状態: 2(他者ロック)なら UserMessage h4_C_E_0505 でエラー。0 なら lock 実行しフラグ needUnlock。
  3. 現在×("0"): 確認ダイアログ(h4_C_I_0502 「やるやらを「×」から「〇」に変更します。」/タイトル h4_C_I_0001)で OK なら Method `h4_ChangeYryr`(item_id, afterYryr="1")。
  4. 現在〇("1"): フォーム `h4_ReqDocChangeYryr`(title "やるやら理由入力", 400x130)で理由入力、Method `h4_ChangeYryrByFormResult`(item_id, isApStyle, yryrReason)を実行。エラーでなければ "h4_ReqDoc SingOff1N"(サインオフタブ)を再読込。
  5. catch: ロック時エラー→h4_C_E_0505、responseXML の faultstring があればそのメッセージ、それ以外は h4_C_E_0002。
  6. finally: needUnlock なら unlock、画面 onRefresh。
- 呼出Method: h4_CheckUseYryrChange, h4_ChangeYryr, h4_ChangeYryrByFormResult。
- 注意: `debugger;` 複数残存。

## 253. h4_StartRevision
- ID: 366809DEF8FA4462BF4E0CE916154AEE / C#
- 概要: 改訂ボタンクリック時に改訂履歴アイテムを作成。「すぐに公開」「承認を回して公開」で処理が異なる。
- 入力: `id`, `type`(h4_DATMaster/h4_DATFormat), `revision_summary`(確認事項), `revision_reason`(改定理由), `isPromoteNow`("true" でなければ false)。出力: 承認を回す場合は親アイテム、すぐ改訂の場合は null。エラー h4_S_E_0002。
- 処理(Administrators権限): 親(select id,managed_by_id)を取得。h4_RevisionHistory を add(新ID): h4_revision_sub_number="1", h4_newest_revision_history=自ID, managed_by_id=親の管理者, h4_revision_summary, h4_revision_reason、h4_DATMaster なら h4_rel_dat_master、h4_DATFormat なら h4_rel_dat_format=親ID。リレーション "h4_DATMaster RevisionHistory"/"h4_DATFormat RevisionHistory"(source=親,related=新履歴)を add。
  - isPromote==true(すぐに改訂): Method `h4_DirectPromote`(targetID,targetType,newState="InRevision")でプロモート後、親を edit(version=0, serverEvents=0)で effective_date, release_date を空/is null に(再公開時エラー防止のコメント)。
  - false(承認を回す): 親を返却し、リビジョンアップと画面更新はクライアントで別途実施。
- 注意: 改訂Noは h4_SetNos で採番(旧ロジックはコメントアウト)。`res.apply()` の結果を代入せず `res.isError()` を判定している。

## 254. h4_SVCB_ChangeAccessRange
- ID: 46A69261BBC4480BABD85F610EEF5CBD / JavaScript
- 概要: 検索グリッドのコマンドバーボタン「公開範囲変更」。選択アイテムの owned_by_id を選択したIdentityに変更。
- 処理: 確認ダイアログ(h4_C_I_0405 / h4_C_I_0001, `h4_cmn_ShowMessage`経由)→ OKで SearchDialog(title "公開範囲を選択", itemtypeName identity, 単一選択, sourceItemTypeName h4_MQPage, sourcePropertyName owned_by_id)を表示。選択後、グリッド選択行(h4_Test_Result のみ複数、それ以外は先頭1件)について `<Item type=… id=… action="merge" select="owned_by_id" serverEvents='0'><owned_by_id>選択ID</owned_by_id></Item>` を組み立て、`this.itemTypeName=="h4_MQPage"` の場合は "h4_MQPage ReqDoc" の必要資料も同様に追加。Method `h4_GrantAuthority`(aml)で一括更新。失敗時 alertError。
- 呼出Method: h4_cmn_ShowMessage, h4_GrantAuthority。
- 注意: 必要資料の取得は最後のループ変数 itemId を使用(MQPageは1件選択前提)。

## 255. h4_SVCB_ChangeAccessRange_init
- ID: DBFF76CEF4624F96B6EF1E00FBF5DD48 / JavaScript
- 概要: 254のボタンの表示/活性制御。Application Managers に属するログインユーザーのみ表示。
- 処理: Identity "Application Managers" のIDを取得。ログインユーザーの Alias の related_id から Member を2階層辿り(1階層目 firstLayerIds、2階層目 secondLayerIds)、2階層目があればそれで、なければ1階層で `TARGET_ID.includes(id)` 判定して表示(hidden=!isVisible)。活性: グリッド選択件数が(h4_Test_Result は1件以上、他は1件)、かつ選択行すべてで `h4_directaplist`=="Approved" かつ managed_by_id が上記1・2階層のIdentity IDに含まれる場合のみ活性化。
- 注意: `TARGET_ID.includes(id)` は文字列の部分一致(コード上の事実)。

## 256. h4_svcb_create_deptMQMaster
- ID: F1D4F84F83434E6D84BD8352AF0BF162 / JavaScript
- 概要: SH: マルQマスタ作成。マルQマスタ検索グリッドのコマンドバーボタンから。帳票マスタを選択し、マルQマスタとして複製。
- 処理: ダイアログ(title=h4_C_I_0301, SearchDialog, itemtypeName h4_DATMaster, 単一, sourceItemTypeName h4_DeptMQMaster, sourcePropertyName h4_base_format_master=「リリース済み＋公開ステート」フィルタ)で帳票マスタ選択。h4_DeptMQMaster を add: h4_base_format_master=選択ID、h4_delta_version/name=選択アイテムの値、h4_dept="室課"。"h4_DATMaster DATFormat" リレーション(select related_id,sort_order,name,h4_category)を取得し、h4_category が "guideline" 以外のものを "h4_DMQMaster DATFormat"(h4_datformat_name=開達書式名)として追加。apply 後 `aras.uiShowItem` で開く。例外時 h4_C_E_0002。
- 注意: `selectResult.itemID` の存在チェック前に selectResult の null チェックがない。

## 257. h4_svcb_create_MQPage
- ID: F6102F1FF4DD427E8355E8315DDC0ADE / JavaScript
- 概要: SH: マルQページ作成。マルQページ検索グリッドのコマンドバーボタンから。マルQマスタを選択しマルQページとして複製。
- 処理: スピナー表示。ダイアログ(title=h4_C_I_0403, SearchDialog h4_DeptMQMaster)でマルQマスタ選択。マスタの h4_delta_version, h4_dept, h4_group, h4_section, h4_approve_style を取得。List `h4_events` の Filter Value(filter=⊿バージョン, inactive=0)からイベントのラベル/値を取得(0件なら h4_C_E_0410)。List `h4_destination` の Value、"h4_DMQMaster DATFormat" を取得。フォーム `h4_MQPageInputInitVal`(title h4_C_I_0406, 620x150)に値を渡して入力させ、結果(カンマ区切り 0:イベント 1:MY 2:仕向け 3:機種コード 4:機種呼称 5:機種呼称ID 6:利用者(同室課) 7:評価単位 8:グループ 9:セクション)を XML `<Event><My><Destination><ModelCode><ModelName><ModelNameId><ManagedById><EvaluationUnit><DeltaVersion><Dept><MQMasterId><UseWF><Group><Section>` として Method `h4_Call_Create_MQPage` に渡す(`applyMethod`)。エラー時 alert、成功時 `aras.uiShowItem` で新規マルQページを開く。
- 呼出Method: h4_Call_Create_MQPage。
- 注意: 内部の catch で取得した h4_C_E_0407 メッセージは表示していない。

## 258. h4_table_1event_get
- ID: 6CF1CA99194844659C2BED6BA68027F9 / C#
- 概要: マルQページに紐づく必要資料を取得し、テーブル表示(Wijmo想定)用のJSONに整形(1イベント表示)。
- 入力: `itemId`(h4_MQPage ID)。出力: `inn.newResult(JSON文字列)`(単引用符のJSON風文字列)。エラー: "Error:"+Message+StackTrace。
- 処理: h4_MQPage の h4_event, h4_approval_round(次数N)を取得し、1〜Nの値リストと "イベント 1次" 等のヘッダーを作成。"h4_MQPage ReqDoc"(sort_order asc)から必要資料を取得、資料名(h4_datformat_name)の重複なしリスト DocList を作る。先頭要素に eventValueList, eventHeader, DocList を格納。各必要資料ごとに: modified_on/created_on(`d` + " T" + `t` 形式)、更新者・作成者(User.keyed_name、空は「更新者不明」「作成者不明」)、keyed_name、LCステート label(getItemStatus)、資料名、やるやら(1→○/0→×)、h4_yryr_reason(memo)、h4_approval_round、h4_yryr_classification、作成者/承認者(担当一覧 "h4_ReqDoc CLN" の Creater/Approver のIdentity name)、承認日(Workflow Process state=Closed の closed_date)を取得。ItemType h4_ReqDoc と Document のRelationshipTypeからドキュメントリレーション名を求め、紐づく Document ごとに fileid(file_item)/fileName を持つ行を出力(Document無しの場合も1行)。
- 出力項目: itemnamelabel, itemtypename, itemid, fileid, fileName, modifyon, modifyby, itemstatus, createon, createby, itemtypelabel("必要資料"), approvalround, docname, yaruyara, memo, yryr_class, creatorName, approverName, approvedDate。
- 注意: JSON文字列の値をエスケープしない(単引用符を含む値で壊れうる)。`getEventData` は未使用。ドキュメントリレーションタイプが存在しない場合、その必要資料の行は出力されない。

## 259. h4_table_AllEvent_get
- ID: D2E4904D059740FF998CD34A4E2E04BE / C#
- 概要: 特定の機種・仕向の全イベントの必要資料アイテムを抽出(マルQ イベント横通し表示、Wijmo用データ)。コードツリーから実行。検索は実行ユーザー権限で行い参照不能なアイテムは対象外。
- 入力: `itemId`(h4_AllEventTable のID)。出力: `inn.newResult(JSON)`(二重引用符のJSON、SafeJsonValueでエスケープ)。エラー h4_S_E_0002。
- 処理: h4_AllEventTable から h4_model_name, h4_dept, h4_group, h4_section, h4_model_code, h4_my, h4_delta_version を取得。⊿バージョンから List h4_Events の Filter Value(filter=deltaVer)でイベント値・ラベル取得(⊿が空なら null)。h4_MQPage を 機種・イベント(in)・室課・グループ/セクション(空は ''/is null の or)・機種コード・MY で検索し、"h4_MQPage ReqDoc"(sort_order asc)を取得。必要資料ごとに "h4_ReqDoc Doc"(sort_order asc)の Document(config_id, keyed_name)を取得。先頭要素に eventValueList, eventHeader, DocList、以降に reqdocid, reqdocname, event, documentid, documentconfigid, documentname, documentsortorder の行。該当マルQページがなければ BuildEmptyResult(noMqPage:true)。
- 注意: Filter Value の inactive は条件に入っていない。

## 260. h4_table_DATMaster_get
- ID: 4FF744BDAE6E4353939B1A39E9F025B7 / C#
- 概要: 帳票マスタに紐づく開達帳票の一覧(Wijmo表示用)取得。
- 入力: `itemId`(h4_DATMaster ID)。出力: newResult(JSON風文字列)。
- 処理: h4_DATMaster の h4_delta_version → List h4_Events の Filter Value(filter=⊿)でイベント値/ラベル。"h4_DATMaster DATFormat"(sort_order asc)から h4_DATFormat を取得、資料名(name)重複なしリスト。各開達書式の modified_on/created_on, 更新者/作成者名, keyed_name, name, h4_event(yaruyara欄に格納)を取得し、DocumentリレーションのうちIndex0の Document の file_item/name を fileid/fileName として1行出力。先頭にevent/DocList。
- 出力項目: itemnamelabel, itemtypename("h4_DATFormat"), itemid, fileid, fileName, modifyon, modifyby, createon, createby, itemtypelabel("開達書式"), docname, yaruyara(=h4_event)。
- 注意: JSON値エスケープなし。⊿バージョンが空だと eventList が null で例外(→Error文字列)。

## 261. h4_table_DATMaster_get_v2
- ID: 6680F6A75CCD4C9EA080455E7D17EC65 / C#
- 概要: 折り畳み表示に対応するデータ取得(comments)。260と同ロジックで、Documentが複数紐づく場合に Document ごとに1行を出力(ドキュメント無しの場合も1行)。出力項目は260と同じ。

## 262. h4_table_DeptMQMaster_get
- ID: 742D4B452307430A8A0BC8BE7ABCD751 / C#
- 概要: 室課マルQマスタデータ集計用(Wijmo表示用)。
- 入力: `itemId`(h4_DeptMQMaster ID)。処理は260とほぼ同様だが、リレーションは "h4_DMQMaster DATFormat"、資料名は リレーションの `h4_datformat_name`(docname)、DocList もこれの重複なし。Documentは Index0 のみ。出力項目は260と同じ。getItemStatus 関数は定義のみ未使用。

## 263. h4_Table_DiscardCli
- ID: 737B7EA581D340F1B5C941C22D9DC77A / JavaScript
- 概要: マルQテーブル表示の「破棄」ボタンクリック時処理。`options.commandFactory` で `target['command_alias@keyed_name']` のコマンドを `{itemNode: window.getItem()}` で生成し execute。

## 264. h4_Table_DoneCli
- ID: 7101F2B29FC345488060F2BAA7763562 / JavaScript
- 概要: 「完了」ボタン。`window.onDoneCommand()` 実行後、relationshipsタブのうち名称が "h4_DATMaster Table", "h4_DMPMaster Table", "h4_MQWijimo" のものを `relationshipsControl.reload` で再読込(editMode, tabview)。

## 265. h4_Table_RefreshCli
- ID: BC6EAE8C679C411A95D6E21A9EFB677C / JavaScript
- 概要: 「更新」ボタン。`cui_reinit_calc_tearoff_states` で isDirty なら破棄確認ダイアログ(common.refresh / common.discard_confirmationmessage)、OK で onRefresh()。dirty でなければ上記3タブを再読込し onRefresh()。

## 266. h4_Table_SaveCli
- ID: 2126ED7FE1524EA78CF20EF4F9207002 / JavaScript
- 概要: 「保存」ボタン。`window.onSaveCommand()` 実行後、上記3タブ(h4_DATMaster Table / h4_DMPMaster Table / h4_MQWijimo)を再読込。

## 267. h4_Tree_RefreshCli
- ID: 9DB178E8B10F4EB8BE9CA17D2422789C / JavaScript
- 概要: マルQページツリー表示のリフレッシュ。265と同様に isDirty 時は確認、タブ名 "h4_MQPage Tree Tree" を再読込して onRefresh()。


