# 要確認事項(open-questions)

`機能設計書.md` で「推測」と明記された記述の一覧。原典で確認できたら状態・確認日・結果を更新する。

## 食い違い記録

公式書類・追加仕様書と原典(`source/`)の食い違いをここに追記する。原典を正とする。

| 日付 | 対象 | 食い違いの内容 | 採用 |
|---|---|---|---|

## 「推測」記述の確認状況

| # | 該当ファイル | 元の行 | 記述 | 状態 | 確認日 | 結果 |
|---|---|---|---|---|---|---|
| 1 | knowledge/common/00-overview.md | L8 | \| 注意 \| Method本体・画面コードに記載のない事項は書かず、呼出契機など読み取れない点は「推測」と明記している。各章は読取担当ごとに作成したため見出し番号は章内で完結している \| | 未確認 |  |  |
| 2 | knowledge/common/f-9-横断メモ.md | L698 | - ItemView.Form の cui_ControlFormField に同一プロパティの重複登録がある（DATFormat 33件中ユニーク約21、DATMaster 7件中ユニーク5 等）。実際に画面に出るのは layout の children に載っているものと推測されるが、レイアウト優先の挙動はXMLからは断定しない。 | 未確認 |  |  |
| 3 | knowledge/itemtypes/g-MQPage.md | L715 | - **Method本体(サーバー側C#等)は、これらのImportには含まれない**。ItemType/RelationshipType/Workflow から「Method名」で参照されているだけである。したがって「Methodが何をするか」は名前以外コードに無く、本書では推測を書かない。例外は、Form/Field のイベントに**インライン記述されたJavaScript**(`sk_method_code`)で、これは内容を要約して記す。 | 未確認 |  |  |
| 4 | knowledge/common/e-パッケージ構成.md | L2574 | 方針: XMLに書かれている事実のみ記載。Method本体(コード)は調査対象外のため、Methodは「名前」だけを記載し、処理内容は推測しない。権限・ロール等はXMLの値をそのまま転記した。 | 未確認 |  |  |
| 5 | knowledge/common/e-CommandBar.md | L4183 | (TOC項目は `additional_data` の `itemTypeId`(一部 `itemId`)でItemTypeを指定。XML上はIDのみでItemType名は書かれていない。MenuButton名から推測した対応: ApprovalWFGroup=`DD0E19C0...`、AppWFGroupForDATFormat=`018E955A...`、MQPage Tree=`F93F069B...`、PointOut=`F4038554...`、ReqDoc=`D014A8C8...`、Test_Result=`984B394A...`、DATFormat=`A13E2920...`、DATMaster=`95C9A38F...`、DeptMQMaster=`B8AEEFB5...`、MQPage=`EC17A836...`) | 未確認 |  |  |
| 6 | knowledge/methods/b1a.md | L4788 | 対象: `...\Independent\Import\Method`(ファイル名昇順)。共通事項: 全Method `execution_allowed_to` はWorld(A73B6557...)または Administrators(2618D6F5...)。コード中の「呼び出し契機」は推測と明記。エラー時は多くが `CCO.ErrorLookup.Lookup("h4_S_E_0002")` を返す。 | 未確認 |  |  |
| 7 | knowledge/methods/b1a.md | L4793 | - 呼び出し契機(推測): リレーションシップタブの onInsertRow/追加後(クライアントイベント。`relationshipTypeName`,`relatedID`,`relationshipID` が暗黙変数として使われる)。 | 未確認 |  |  |
| 8 | knowledge/methods/b1a.md | L4806 | - 呼び出し契機(推測): h4_MQPage の onAfterUpdate 等のサーバーイベント(他Methodのコメントに「onAfterUpdateに変更」とあり)。 | 未確認 |  |  |
| 9 | knowledge/methods/b1a.md | L4815 | - 呼び出し契機(推測): h4_MQPage の onAfterUpdate(コメントに「onAfterUpdateに変更するのでコンテキストアイテムからリレーションを取らない」)。 | 未確認 |  |  |
| 10 | knowledge/methods/b1a.md | L4827 | - 呼び出し契機(推測): h4_ReqDoc の保存後イベント。 | 未確認 |  |  |
| 11 | knowledge/methods/b1a.md | L4835 | - 呼び出し契機(推測): 必要資料の担当者一覧設定ダイアログ(h4_cui_ivrcb_SetReqDocCLN_init 系)から。 | 未確認 |  |  |
| 12 | knowledge/methods/b1a.md | L4843 | - 呼び出し契機(推測): 各ワークフロー昇格時のCallメソッド等から。 | 未確認 |  |  |
| 13 | knowledge/methods/b1a.md | L4854 | - 呼び出し契機(推測): PDF変換(Conversion Task作成)前のイベント/条件判定。 | 未確認 |  |  |
| 14 | knowledge/methods/b1a.md | L4860 | - 呼び出し契機(推測): マルQページの複製/イベントアップのダイアログ(h4_MQPage_ivicb_event_up、h4_cui_ivicb_copy_init 系)の実行ボタン。 | 未確認 |  |  |
| 15 | knowledge/methods/b1a.md | L4874 | - 呼び出し契機(推測): 室課マルQ作成ダイアログ(h4_cui_svcb_deptmaruqcreat_init)。 | 未確認 |  |  |
| 16 | knowledge/methods/b1a.md | L4888 | - 呼び出し契機(推測/コメントに記載): 冒頭コメント「h4_svcb_create_MQPageから呼び出される」。 | 未確認 |  |  |
| 17 | knowledge/methods/b1b.md | L4904 | - 呼び出し契機(推測/コメント記載): コメントに「h4_MQPage_ivicb_event_upから呼び出される」。 | 未確認 |  |  |
| 18 | knowledge/methods/b1b.md | L4915 | 共通: C#。`this`=WF対象アイテムID。`Method h4_Promote_WFGroup_ApTarget` を `destination`(遷移先ステート名ハードコード) と `sourceId`(this.getID())で呼ぶ。コメントはいずれも「〜にWFの親LC遷移時に子アイテムのLCを遷移するメソッドを呼び出す」。呼び出し契機(推測): 承認WFグループ(h4_ApprovalWFGroup)のライフサイクルの各ステート遷移後/遷移時メソッド。戻り値 this。 | 未確認 |  |  |
| 19 | knowledge/methods/b1b.md | L4931 | - 呼び出し契機(推測): 担当者一覧タブのコンテキストメニュー/ボタンの可否(canExecute)判定。 | 未確認 |  |  |
| 20 | knowledge/methods/b1b.md | L4953 | - 呼び出し契機(推測): 担当者一覧タブの「代理承認依頼」メニュー/ボタン(18と対)。 | 未確認 |  |  |
| 21 | knowledge/methods/b1b.md | L4963 | 共通: C#。コメント「開達実施要領一括承認のLC用」。`Method h4_PromoteDATFormatOfAppWFGr` に `destination`(NextState) と `sourceId`(this.getID()) を渡して apply(戻り値のエラー判定なし)、return this。呼び出し契機(推測): 開達書式一括承認(h4_AppWFGroupForDATFormat)LC各ステートの遷移時メソッド。 | 未確認 |  |  |
| 22 | knowledge/methods/b1b.md | L4979 | - 呼び出し契機(推測): フォーム/ツールバーの「引き戻し」ボタン(クライアントイベント)。 | 未確認 |  |  |
| 23 | knowledge/methods/b1b.md | L4988 | - 呼び出し契機(推測): 一括承認WF(h4_ApprovalWFGroup)の却下パスのメソッド。this=WF Process。 | 未確認 |  |  |
| 24 | knowledge/methods/b1b.md | L5001 | - 呼び出し契機(推測): やるやら承認依頼→作業中のパス(否認側)のメソッド。this=WF Process。 | 未確認 |  |  |
| 25 | knowledge/methods/b1c.md | L5030 | - 概要: やるやら変更ダイアログを値なしで閉じる(`parent.dialogArguments.dialog.close()`)。呼び出し契機(推測): キャンセルボタン。 | 未確認 |  |  |
| 26 | knowledge/methods/b1c.md | L5035 | - 呼び出し契機(推測): やるやら変更ダイアログのOKボタン。 | 未確認 |  |  |
| 27 | knowledge/methods/b1c.md | L5048 | - 呼び出し契機(推測): 機種呼称プロパティのonChange(クライアントイベント。`value`,`itemId` を使用)。 | 未確認 |  |  |
| 28 | knowledge/methods/b1c.md | L5054 | - 概要: リレーション(h4_MQPage ReqDoc と推測)の related の必要資料名が "技-62" の場合、リレーションの sort_order を "1" にする。 | 未確認 |  |  |
| 29 | knowledge/methods/b1c.md | L5055 | - 呼び出し契機(推測): 必要資料リレーションの追加後/更新イベント(this=リレーションアイテム)。 | 未確認 |  |  |
| 30 | knowledge/methods/b1c.md | L5062 | - 呼び出し契機(推測): h4_DATFormat(および一括)の onAfterUpdate 等。コメント「Updateイベントが2回走ることがある」。 | 未確認 |  |  |
| 31 | knowledge/methods/b1c.md | L5070 | - 呼び出し契機(推測): 新規作成後(onAfterAdd)。 | 未確認 |  |  |
| 32 | knowledge/methods/b1c.md | L5080 | - 呼び出し契機(推測): やるやら変更ボタン(クライアント)→ダイアログで理由入力後。 | 未確認 |  |  |
| 33 | knowledge/methods/b1c.md | L5090 | - 概要: 指摘(h4_PointOut と推測。プロパティ h4_rel_mq, h4_rel_reqdoc, h4_point_sub_number を持つ)の初回保存時、対象マルQページと対象必要資料が指定されている場合、必要資料が編集(ロック)状態かチェック。 | 未確認 |  |  |
| 34 | knowledge/methods/b1c.md | L5097 | - 呼び出し契機(推測): WFの最初のパス(作業中→次)の遷移前チェック。this=WF Process。 | 未確認 |  |  |
| 35 | knowledge/methods/b1c.md | L5104 | - 呼び出し契機(推測): 保存前(onBeforeAdd/Update)。入力: this(fetchRelationships で取得)。他型を渡すとdict例外→h4_S_E_0002。 | 未確認 |  |  |
| 36 | knowledge/methods/b1d.md | L5112 | - 呼び出し契機(推測): WFの最初のパスのメソッド。入力は this.id = Activity ID(`this.getProperty("id")`)。 | 未確認 |  |  |
| 37 | knowledge/methods/b1d.md | L5125 | - 呼び出し契機(推測): 対象ItemTypeの onBeforeUpdate/onBeforeLock など(マルQページ/必要資料等。リレーション名を `this.getType()+" CLN"` で組むため担当者一覧(CLN)を持つ型)。 | 未確認 |  |  |
| 38 | knowledge/methods/b1d.md | L5168 | - 呼び出し契機(推測): onBeforeUpdate(this=マルQページ/必要資料等、コンテキストの Relationships を使用)。 | 未確認 |  |  |
| 39 | knowledge/methods/b1d.md | L5183 | - 呼び出し契機(推測): h4_MQPage の onBeforeAdd/Update。 | 未確認 |  |  |
| 40 | knowledge/methods/b1e.md | L5208 | - 呼び出し契機(推測): 指摘の onBeforeUpdate。 | 未確認 |  |  |
| 41 | knowledge/methods/b1e.md | L5219 | - 概要: メッセージ名(inArgs)から UserMessage の text を返す共通クライアントメソッド。`aras.evalMethod` 等で呼ばれる(推測)。 | 未確認 |  |  |
| 42 | knowledge/methods/b1e.md | L5228 | - 呼び出し契機(推測): ItemType の onBeforeNew 系クライアントイベント。 | 未確認 |  |  |
| 43 | knowledge/methods/b1e.md | L5258 | - 呼び出し契機(推測): サーチビューのツールバー/コンテキストメニューのボタン(`grid.getSelectedItemIds()` を使用)。 | 未確認 |  |  |
| 44 | knowledge/methods/b1e.md | L5275 | - 呼び出し契機(推測): h4_PointOut の onAfterAdd。 | 未確認 |  |  |
| 45 | knowledge/methods/b1f.md | L5304 | - 呼び出し契機(推測): h4_PointOut の onAfterAdd/onAfterUpdate。`RequestState["h4_rel_mq"]`,`["h4_rel_reqdoc"]` を使用。 | 未確認 |  |  |
| 46 | knowledge/methods/b1f.md | L5316 | - 呼び出し契機(推測): 帳票マスタ/開達書式フォームの「改訂」ボタン。 | 未確認 |  |  |
| 47 | knowledge/methods/b1f.md | L5324 | - 呼び出し契機(推測): h4_Test_Result の onAfterNew/onBeforeNew(クライアントイベント)。 | 未確認 |  |  |
| 48 | knowledge/methods/b1f.md | L5330 | - 概要: this の keyed_name の先頭に "⊿" を付与して返す。呼び出し契機(推測): keyed_name 表示加工(onAfterGet 等)。 | 未確認 |  |  |
| 49 | knowledge/methods/b1f.md | L5372 | - 呼び出し契機(推測): 帳票マスタ等の開達書式リレーションタブのコマンドバーボタン(`this.grid`, `this.itemTypeName`)。 | 未確認 |  |  |
| 50 | knowledge/methods/c2a.md | L5386 | 共通事項: 全Methodとも `execution_allowed_to` は World(A73B655731924CD0B027E4F4D5FCC0A9) または Administrators(2618D6F5A90949BAA7E920D1B04C7EE1)。「呼び出し契機」は特記なき限りコードコメント/名称からの推測。 | 未確認 |  |  |
| 51 | knowledge/methods/c2a.md | L5393 | - 呼び出し契機(推測): リレーションタブ(改訂履歴リレーション)の「新規作成」ボタン(CUI Command Bar item)の init イベント。 | 未確認 |  |  |
| 52 | knowledge/methods/c2a.md | L5406 | - 呼び出し契機(推測): 改訂履歴リレーションタブの行削除ボタンの init。 | 未確認 |  |  |
| 53 | knowledge/methods/c2a.md | L5437 | - 呼び出し契機(推測): 帳票マスタ アイテムフォームのCUIボタン(ivicb=item view command bar)のクリック。 | 未確認 |  |  |
| 54 | knowledge/methods/c2a.md | L5452 | - 呼び出し契機(推測): 帳票マスタ 検索グリッドのツールバー(svcb)ボタン(コメント上「選択アイテムが1つのときのみ実行される」)。 | 未確認 |  |  |
| 55 | knowledge/methods/c2a.md | L5460 | - 呼び出し契機(推測): 帳票マスタ 開達書式リレーションタブのCUIメニューの init。 | 未確認 |  |  |
| 56 | knowledge/methods/c2a.md | L5469 | - 呼び出し契機(推測): 帳票マスタ/開達書式のアイテムビュー CUIボタン init。 | 未確認 |  |  |
| 57 | knowledge/methods/c2a.md | L5479 | - 呼び出し契機(推測): 改訂履歴リレーションの削除ボタン(クライアントMethodから呼ばれる)。 | 未確認 |  |  |
| 58 | knowledge/methods/c2a.md | L5485 | - 呼び出し契機(推測): リレーションItemType(`h4_DATMaster DATFormat` 等)のサーバーイベント(onAfterAdd 等)。 | 未確認 |  |  |
| 59 | knowledge/methods/c2a.md | L5510 | - 呼び出し元: `h4_DirectPromote_click` ほか(推測)。 | 未確認 |  |  |
| 60 | knowledge/methods/c2a.md | L5516 | - 呼び出し契機(推測): アイテムフォームのCUIボタンクリック(`thisItem` 参照)。 | 未確認 |  |  |
| 61 | knowledge/methods/c2b.md | L5540 | 共通: execution_allowed_to は World(A73B655731924CD0B027E4F4D5FCC0A9) または Administrators(2618D6F5A90949BAA7E920D1B04C7EE1)。「呼び出し契機」は特記なき限り推測。`h4_frm_*` はダイアログ用フォームのOK/初期化/ボタンイベントで使われるクライアントMethod(フォーム側イベント、推測)。いずれも `parent.dialogArguments.dialog.close(...)` / `parent.frameElement.dialogArguments` を利用する。 | 未確認 |  |  |
| 62 | knowledge/methods/c2b.md | L5567 | - 処理: select `State` の値を `dialog.close(state)` で返す。(呼び出し元は `h4_MultiDirectApprove` 等と推測) | 未確認 |  |  |
| 63 | knowledge/methods/c2b.md | L5624 | - 概要: ワークフロー(Activity)Item(this)から、そのワークフローが管理する現行アイテムを返す(標準メソッドの改造と思われる; 推測)。 | 未確認 |  |  |
| 64 | knowledge/methods/c2c.md | L5659 | - 呼び出し契機(推測): MQPage / ReqDoc / Test_Result / ApprovalWFGroup 各ライフサイクルの Activity(ワークフロー)の OnClose/OnVote 系イベントのMethod(`this`=Activity、`this.getProperty("id")`=ActivityID)。次アクティビティで `h4_sendMail`(コメント記載)がRequestStateを使用。 | 未確認 |  |  |
| 65 | knowledge/methods/c2d.md | L5706 | - 呼び出し契機(推測): クライアント/他Methodから権限昇格が必要なAML実行時。 | 未確認 |  |  |
| 66 | knowledge/methods/c2d.md | L5718 | - 呼び出し契機(推測): WFアクティビティの OnActivate 等のイベントMethod。 | 未確認 |  |  |
| 67 | knowledge/methods/c2d.md | L5732 | - 戻り値: Filterオブジェクト。(呼び出し契機(推測): Identity選択用プロパティのgrid event として指定) | 未確認 |  |  |
| 68 | knowledge/methods/c2d.md | L5736 | - 概要: 上記のエイリアス版。`name`=`**`(固定なし)、`is_alias`=`1`(固定)。担当者(ユーザーに紐づくエイリアスIdentity)選択用(推測)。 | 未確認 |  |  |
| 69 | knowledge/methods/c2d.md | L5741 | - 呼び出し契機(推測): `h4_ApprovalWFGroup` WFの差し戻し(Reject)パス/アクティビティのイベント。 | 未確認 |  |  |
| 70 | knowledge/methods/c2d.md | L5772 | - 呼び出し契機(推測): 担当者一覧(CLN)リレーションの onInsertRow 等のクライアントイベント。 | 未確認 |  |  |
| 71 | knowledge/methods/c2e.md | L5790 | - 呼び出し契機(推測): リレーションタブ(ivrcb)ツールバーボタンの init。 | 未確認 |  |  |
| 72 | knowledge/methods/c2e.md | L5795 | - 呼び出し契機(推測): 親ItemType(開達書式/必要資料等)のサーバーイベント(onAfterAdd/Update)。this=親Item。 | 未確認 |  |  |
| 73 | knowledge/methods/c2e.md | L5802 | - 呼び出し契機(推測): 上記親ItemTypeのサーバーイベント。this=親Item。 | 未確認 |  |  |
| 74 | knowledge/methods/c2e.md | L5814 | - 呼び出し契機(推測): `h4_DATMaster` / `h4_DATFormat` のライフサイクル「公開」遷移の Post メソッド。 | 未確認 |  |  |
| 75 | knowledge/methods/c2e.md | L5824 | - 呼び出し契機(推測): 標準「完了」ボタンの置換コマンド。 | 未確認 |  |  |
| 76 | knowledge/methods/c2f.md | L5887 | - 呼び出し契機(推測): 必要資料リレーションタブ(`h4_MQPage ReqDoc`)ツールバーの「一括WF開始」ボタン。 | 未確認 |  |  |
| 77 | knowledge/methods/c2f.md | L5902 | - 呼び出し契機(推測): `h4_ReqDoc`/`h4_Test_Result` ライフサイクル遷移の Post メソッド(`this.getAttribute("idlist")`, `this.getType()` を使用)。 | 未確認 |  |  |
| 78 | knowledge/methods/c2f.md | L5919 | - 呼び出し契機(推測): フォームの onLoad イベント。注意点: Identity毎に `getItemById` を実行(往復多め)。owned_by_id/created_by_id判定はコメントアウト。 | 未確認 |  |  |
| 79 | knowledge/methods/c2g.md | L5950 | - 呼び出し契機(推測): マルQページ アイテムビュー(ivicb)の「複製」ボタン。※`options.getState().grid` の選択行があればそれ、無ければ表示中ウィンドウの `itemID` を使うので検索グリッドからも共用される形(コード上)。 | 未確認 |  |  |
| 80 | knowledge/methods/c2g.md | L5958 | - 呼出す他Method: `h4_Call_Copy_MQPage`。ダイアログのOK処理は `h4_frm_get_value` 系(推測: フォームのOKボタン→ [108]相当)。 | 未確認 |  |  |
| 81 | knowledge/methods/c2g.md | L5969 | - 呼出す他Method: `h4_Call_EventUp_MQPage`。ダイアログの入力取得は `h4_frm_get_eventup_value`(推測)。 | 未確認 |  |  |
| 82 | knowledge/methods/c2g.md | L5992 | - 呼び出し契機(推測): マルQページ WF 否認(Reject)後の Post メソッド。 | 未確認 |  |  |
| 83 | knowledge/methods/c2g.md | L6000 | - 呼び出し契機(推測): 必要資料リレーションタブのツールバーボタン。 | 未確認 |  |  |
| 84 | knowledge/methods/c2g.md | L6002 | - 呼出す他Method: `h4_Change_Direct_Approve_List`。選択肢構築の初期化は `h4_frm_init_setState`、OKは `h4_frm_get_value_multi_direct_ap`(推測、フォーム側)。 | 未確認 |  |  |
| 85 | knowledge/methods/c2h.md | L6032 | - 呼び出し契機(推測): フォームの onLoad。注意点: `debugger;` 残存。iframeが見つからない場合の例外処理なし(コード上)。 | 未確認 |  |  |
| 86 | knowledge/methods/c2h.md | L6048 | - 呼び出し契機(推測): `h4_MQPage` / `h4_ReqDoc` のLCで否認(Reject)遷移の Post。 | 未確認 |  |  |
| 87 | knowledge/methods/c2h.md | L6055 | - 呼び出し契機(推測): マルQページ確認中(InReview)からの否認遷移の Post。 | 未確認 |  |  |
| 88 | knowledge/methods/c2h.md | L6065 | - 呼び出し契機(推測): `h4_DATMaster` / `h4_DATFormat` のLC「承認」→公開遷移の Post。 | 未確認 |  |  |
| 89 | knowledge/methods/c2i.md | L6076 | - 呼び出し契機(推測): `h4_MQPage` / `h4_ReqDoc` / `h4_Test_Result` のLCで承認(Approved)へ遷移する際のメソッド。名称は Pre だが冒頭コメントは Post と記載(コード上の不一致)。 | 未確認 |  |  |
| 90 | knowledge/methods/c2i.md | L6090 | - 呼び出し契機(推測): `h4_DATMaster` / `h4_DATFormat` LC の「改訂中→公開」遷移の Pre。 | 未確認 |  |  |
| 91 | knowledge/methods/c2i.md | L6095 | - 呼び出し契機(推測): `h4_ReqDoc` / `h4_Test_Result` の `h4_directaplist` 変更時のサーバーイベント(例: OnAfterUpdate)。[180] の `h4_Approve_Related_Item` がStateListを変更してサーバーイベントで遷移メソッドをキックする、というコメントと整合(推測)。 | 未確認 |  |  |
| 92 | knowledge/methods/d3a.md | L6104 | 凡例: 呼び出し契機は全て「推測」。execution_allowed_to は特記なき限り World(A73B655731924CD0B027E4F4D5FCC0A9)。 | 未確認 |  |  |
| 93 | knowledge/methods/d3a.md | L6111 | - 契機(推測): マルQページのダイレクト承認用リスト変更時(onAfterUpdate等)。 | 未確認 |  |  |
| 94 | knowledge/methods/d3a.md | L6120 | - 契機(推測): h4_ApprovalWFGroup のWF/LC遷移時(Method呼び出しで引数付き)。 | 未確認 |  |  |
| 95 | knowledge/methods/d3a.md | L6137 | - 契機(推測): クライアントJSからのダイレクトプロモートボタン。 | 未確認 |  |  |
| 96 | knowledge/methods/d3a.md | L6143 | - 契機(推測): ItemTypeプロパティ(Item型)の「フィルタ」メソッド(検索ダイアログのプロパティフィルタ)。 | 未確認 |  |  |
| 97 | knowledge/methods/d3a.md | L6149 | - 注意: `debugger;` 残存。コメントアウトされた旧criteriaAml(format/guidelineのみ)あり。契機(推測): Itemプロパティの検索ダイアログ用フィルタ(onSearchDialog系)。 | 未確認 |  |  |
| 98 | knowledge/methods/d3a.md | L6154 | - 契機(推測): WFの「引き戻し」ボタン(クライアントからMethod呼び出し)。 | 未確認 |  |  |
| 99 | knowledge/methods/d3a.md | L6191 | - 契機(推測): アイテムの onAfterUpdate(コメント「アイテムのOnAfterUpdateで作業中のみ実行される」)。 | 未確認 |  |  |
| 100 | knowledge/methods/d3a.md | L6207 | - 契機(推測): 公開(Release)時。コメント: 一括承認アイテムでの公開/1回目公開/改定(WF)公開/改定(すぐ承認)公開。 | 未確認 |  |  |
| 101 | knowledge/methods/d3a.md | L6224 | - 契機(推測): 開達書式の公開(Release)遷移後。 | 未確認 |  |  |
| 102 | knowledge/methods/d3a.md | L6230 | - 契機(推測): リレーションシップビューのコマンドバーボタン初期化(ivrcb_init)。 | 未確認 |  |  |
| 103 | knowledge/methods/d3a.md | L6239 | - 処理: `aras.getMostTopWindowWithAras(window).itemID` で h4_ReqDoc を getItemById し、`aras.setItemProperty(targetItem,"h4_doc_attached","1")`。契機(推測): 成果物(Doc)グリッドの行追加イベント。 | 未確認 |  |  |
| 104 | knowledge/methods/d3a.md | L6248 | - 契機(推測): 親アイテムの更新後(onAfterUpdate)。Before(h4_ReSetPermisson_Before)がセットした RequestState[型名] を使用。 | 未確認 |  |  |
| 105 | knowledge/methods/d3a.md | L6275 | - 契機(推測): h4_ApprovalWFGroup の onBeforeAdd/onBeforeUpdate。 | 未確認 |  |  |
| 106 | knowledge/methods/d3b.md | L6305 | 凡例: 呼び出し契機は全て「推測」。execution_allowed_to は特記なき限り World(A73B655731924CD0B027E4F4D5FCC0A9)。 | 未確認 |  |  |
| 107 | knowledge/methods/d3b.md | L6311 | - 契機(推測): WFアクティビティの遷移時に呼ぶサーバーメソッド(手動遷移のみ送信)。 | 未確認 |  |  |
| 108 | knowledge/methods/d3b.md | L6367 | - 契機(推測): マルQページフォームの機種呼称フィールド onChange 等。`itemId` はフォーム/クライアント側コンテキスト変数。 | 未確認 |  |  |
| 109 | knowledge/methods/d3b.md | L6378 | - 契機(推測): リレーションItemTypeの onAfterAdd(this=リレーション)。 | 未確認 |  |  |
| 110 | knowledge/methods/d3b.md | L6380 | - 注意: 削除時のクリアはこのMethodには無い(UnSet は別Method h4_UnSetApprovalGroupProperty と推測。名称からの推測)。 | 未確認 |  |  |
| 111 | knowledge/methods/d3b.md | L6404 | - 契機(推測): クライアント側 onAfterNew。 | 未確認 |  |  |
| 112 | knowledge/methods/d3b.md | L6419 | - 注意: Approver行の sort_order 設定が `relReviewer.setProperty("sort_order","96")` になっており、Reviewer行が96で上書き、Approver行はsort_order未設定(コード上のとおり)。applyAMLの結果エラー判定なし。契機(推測): 一括作成/コピー後などのクライアントJSからの呼出。 | 未確認 |  |  |
| 113 | knowledge/methods/d3b.md | L6440 | - 処理: フォーム上の text input `h4_frm_Destination` の値を取得し、フォーム `h4_DATFormat_Input_Init_DestVal`(460x200, title "仕向け設定")を表示、戻り値で `h4_frm_Destination` の value を更新。初期化は h4_setDestinaionInit と推測。 | 未確認 |  |  |
| 114 | knowledge/methods/d3b.md | L6445 | - 処理: フォーム `h4_Input_CheckBoxes_Value`(title "開発拠点・仕向設定", 850x300)を表示。戻り値 JSON(`strChecks1`,`strChecks2`)を `h4_developmentbase`, `h4_destination` にセット。初期化は h4_setCheckBoxInit(推測)。 | 未確認 |  |  |
| 115 | knowledge/methods/d3c.md | L6461 | 凡例: 呼び出し契機は全て「推測」。execution_allowed_to は特記なき限り World(A73B655731924CD0B027E4F4D5FCC0A9)。 | 未確認 |  |  |
| 116 | knowledge/methods/d3c.md | L6467 | - 契機(推測): マルQページの onAfterUpdate(RequestState を Before が設定)。 | 未確認 |  |  |
| 117 | knowledge/methods/d3c.md | L6479 | - 契機(推測): h4_RevisionHistory の onAfterAdd。 | 未確認 |  |  |
| 118 | knowledge/methods/d3c.md | L6494 | - 契機(推測): 指摘のクライアント onAfterNew(parent.thisItem=リレーション元の親)。 | 未確認 |  |  |
| 119 | knowledge/methods/d3c.md | L6534 | - 契機(推測): 必要資料-フォーマットリレーションの onBeforeAdd/Update 等。 | 未確認 |  |  |
| 120 | knowledge/methods/d3c.md | L6542 | - 呼出Method: h4_SetPathVisibility。契機(推測): アイテム保存後(onAfterUpdate/onAfterAdd)や InProgress アクティビティの onActive。 | 未確認 |  |  |
| 121 | knowledge/methods/d3d.md | L6571 | 凡例: 呼び出し契機は全て「推測」。execution_allowed_to は特記なき限り World(A73B655731924CD0B027E4F4D5FCC0A9)。 | 未確認 |  |  |
| 122 | knowledge/methods/d3d.md | L6577 | - 契機(推測): h4_DATMaster の onAfterAdd。 | 未確認 |  |  |
| 123 | knowledge/methods/d3d.md | L6584 | - 契機(推測): h4_MQPage の onBeforeUpdate 等。 | 未確認 |  |  |
| 124 | knowledge/methods/d3d.md | L6598 | - 契機(推測): ConversionTask の変換完了時に呼ばれる Conversion Server Method。 | 未確認 |  |  |
| 125 | knowledge/methods/d3d.md | L6611 | - 概要: `this.setAttribute("orderBy","modified_on DESC"); return this;`(更新日降順)。契機(推測): 検索(onBeforeGet)。 | 未確認 |  |  |
| 126 | knowledge/methods/d3e.md | L6716 | 凡例: 呼び出し契機は全て「推測」。execution_allowed_to は全て World(A73B655731924CD0B027E4F4D5FCC0A9)。 | 未確認 |  |  |
| 127 | knowledge/methods/d3e.md | L6722 | - 契機(推測): マルQページツリー(タブ "h4_MQPage Tree Tree" 等)の表示データ取得。 | 未確認 |  |  |
| 128 | knowledge/methods/d3e.md | L6731 | - 契機(推測): リレーションItemType("h4_ApprovalWFGroup_ApTarget" / "h4_AppWFGr4DATFormat DATFormat")の onBeforeDelete 等(削除前にDBのリレーションから source_id/related_id を取得するため)。h4_SetApprovalGroupProperty の逆処理。 | 未確認 |  |  |
| 129 | knowledge/methods/d3e.md | L6737 | - 契機(推測): 親アイテムの onAfterPromote。 | 未確認 |  |  |
| 130 | knowledge/methods/d3e.md | L6745 | - 契機(推測): 親アイテムの onAfterPromote。 | 未確認 |  |  |
| 131 | knowledge/methods/d3e.md | L6775 | - 概要: コメント「アコーディオン最大化状態で表示したい」。テスト用と見られるMethod(名称より推測)。 | 未確認 |  |  |
| 132 | knowledge/methods/d3e.md | L6777 | - 注意: 関数定義のみで自動実行されない。ArasのUI構造に依存(DOM クラス名 `aras-accordion` はコメントどおり推測ベース)。 | 未確認 |  |  |
| 133 | knowledge/screens/a-codetree.md | L6789 | 調査方法: 配下24ファイルを全文読了(バックアップ系は現行版との差分を比較)。サーバ側Method(h4_table_*, h4_treeModGet)の実装はこのツリーに含まれないため、本章では呼び出し側(クライアント)から読み取れる入出力のみ記載する。コードから確認できない事項は「推測」と明記する。 | 未確認 |  |  |
| 134 | knowledge/screens/a-codetree.md | L6836 | - 注意: 他のTable系HTMLと異なり `h0_getWijmolicense.js` の `<script>` 読込タグが**無い**のに、本文で `wijmo.setLicenseKey(h0_getWijmolicense())` を呼んでいる(読込漏れの可能性。推測: 親フレームでグローバルに定義済みなら動作する)。 | 未確認 |  |  |
| 135 | knowledge/screens/a-codetree.md | L6875 | - 更新ボタンは1秒ポーリングで活性制御(推測: 親アイテムがロック(編集中)の間は更新させない意図)。 | 未確認 |  |  |
| 136 | knowledge/screens/a-codetree.md | L6893 | - 戻りの文字列は `\` `"` `'`→`"` `/` 改行等をエスケープ置換してから `JSON.parse`(サーバ側の出力がシングルクォートJSON形式であることを示唆: 推測)。 | 未確認 |  |  |
| 137 | knowledge/screens/a-codetree.md | L6915 | - **`vallist` が未定義**: レイアウト復元部で `vallist.getItemCount()` を参照するが、`vallist` を作る処理(ItemType `FILTER VALUE`/`list` 検索、"SH-762修正" 関連)はコメントアウトされている。保存済みレイアウト(配列形式)が存在するユーザでは ReferenceError となる可能性が高い(推測: 保存データが無ければ到達しない)。 | 未確認 |  |  |
| 138 | knowledge/screens/a-codetree.md | L6930 | - 目的の違いは、サーバMethod側(本ツリー外)で決まる。**推測**: 部門(室課)マルQの開達書式を返すMethodで、クライアントは `h4_DATFormat` 前提のまま流用している。 | 未確認 |  |  |
| 139 | knowledge/screens/a-codetree.md | L6981 | - `checkboxStates` は初期化時の `ldThreeLines[].visible` 配列であり、列の表示/非表示を変更するUI(チェックボックス)がコード上に無いため、保存されるvisibleStatesは実質的に復元時の値の再保存(推測: 列ピッカー機能が削除/未実装)。フィルタ定義の保存が実質的な保存対象。 | 未確認 |  |  |
| 140 | knowledge/screens/a-codetree.md | L6991 | - 備考: 日付「260824」は他のbak日付(2509xx)より後の並びで、命名が年月日(2026/08/24)か否かは不明(推測)。 | 未確認 |  |  |
| 141 | knowledge/screens/a-codetree.md | L7008 | - 戻りは**シングルクォート形式のJSON風文字列**で、正規表現置換(`','`→`","`、`':'`→`":"`、`[{'`→`[{"`、`'}]`→`"}]`、`'},{'`→`"},{"`、改行→`\n`)で整形して `JSON.parse`。値内に `'`/`"` が含まれる場合の解析失敗リスクあり(推測)。 | 未確認 |  |  |
| 142 | knowledge/screens/a-codetree.md | L7026 | - 先頭の `wijmo = window;` で wijmo グローバルを上書きしている(モジュール内でのグローバル参照合わせの回避策: 推測)。 | 未確認 |  |  |
| 143 | knowledge/screens/a-codetree.md | L7034 | - 階層構築の「イベント探索ループ」は `itemSaveFlag==0` の判定がループ内にあり、イベント一覧の先頭要素が不一致の時点で新規イベントを追加して抜ける(同一仕向けに複数イベントが既にある場合、先頭以外のイベントへの追加が不正になる可能性。推測: ロジック上の懸念で、実害はデータ依存)。 | 未確認 |  |  |
| 144 | knowledge/screens/a-codetree.md | L7038 | - `app_251017bak.js`(16,857B): 階層=モデルイヤー→機種→仕向け→アイテム(`['pjName','dest','item']`)。現行より旧版で、イベント階層が未実装(推測: 現行はイベント階層を追加した改修)。 | 未確認 |  |  |
| 145 | knowledge/screens/a-codetree.md | L7039 | - `app - コピー.js`(14,432B): 階層=モデルイヤー→機種→**アイテムタイプ**→アイテム(`['pjName','itemType','item']`)。仕向け/イベントのキーを使わない旧々版相当(推測)。 | 未確認 |  |  |
| 146 | knowledge/screens/a-codetree.md | L7041 | - 備考: ファイル名の日付「251017」は他bakより未来日付(2025/10/17)で、他のbakとの時系列関係は不明(推測)。 | 未確認 |  |  |
| 147 | knowledge/screens/a-codetree.md | L7051 | 5. ユーザ別レイアウト保存先: ItemType `h2_SumLayoutSave`(プロパティ `h2_userid`, `h2_layoutjson`)。キーは `thisItemID + 機種ID`。h2_ プレフィックスのItemTypeであり、h4専用ではなく他モジュール共有の可能性(推測)。 | 未確認 |  |  |
