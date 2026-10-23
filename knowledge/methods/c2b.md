<!-- meta
legacy: knowledge/_legacy/機能設計書.md L5538-L5647
source: source/package/Independent/Import/Method/
-->
# Method AML 調査 C_method2b (107〜125番目: h4_frm_get_eventup_value 〜 h4_GetInputRevisioDialig)

共通: execution_allowed_to は World(A73B655731924CD0B027E4F4D5FCC0A9) または Administrators(2618D6F5A90949BAA7E920D1B04C7EE1)。「呼び出し契機」は特記なき限り推測。`h4_frm_*` はダイアログ用フォームのOK/初期化/ボタンイベントで使われるクライアントMethod(フォーム側イベント、推測)。いずれも `parent.dialogArguments.dialog.close(...)` / `parent.frameElement.dialogArguments` を利用する。

---
## [107] h4_frm_get_eventup_value
- 言語: JavaScript / comments: マルQページ － イベントアップの初期値入力画面の設定値の取得
- 概要: イベントアップ用のダイアログのOKボタン処理。入力値を収集→検証→カンマ区切りでダイアログを閉じる。
- 入力(フォーム要素名): select `h4_frm_event`(値とラベル), input `h4_frm_Dept`, `h4_frm_Gr`, `h4_frm_Sec`, `h4_frm_DeltaVersion`(「⊿」を除去), `h4_frm_model_name`(valueと id=機種呼称ID), `h4_frm_model_code`。
- 処理フロー:
  1. List `h4_ModelName` の `Filter Value`(select=filter,label,value)を取得し、「filter==⊿バージョン かつ value==機種呼称」が存在するか確認。無ければ `h4_C_E_0404` を AlertError して終了。
  2. `h4_MQPage` を get(select=`id, h4_delta_version, h4_dept, h4_model_name, h4_model_code, h4_event`)。条件: h4_dept, h4_model_name(=機種呼称ID), h4_model_code, h4_event。グループ(`h4_group`)/セクション(`h4_section`)は入力があれば条件に、なければ「NULLまたは空」を where に追加。⊿バージョンは条件に含めない(コメントアウト)。
  3. `h4_event`が "special"(大文字小文字無視)のものは除外。残りが1件以上あれば `h4_C_E_0408`(既に同一の[室課][機種呼称][機種コード][イベント]が存在)を表示。
  4. なければ `dialog.close(イベント + "," + グループ + "," + セクション)`。
- 呼出す他Method: なし。 注意点: 機種呼称・⊿バージョンマップ確認を行う。

## [108] h4_frm_get_value
- 言語: JavaScript / comments: マルQページ － 初期値入力画面の設定値の取得 / 実行許可: World
- 概要: マルQページ作成の初期値入力ダイアログのOK処理。[107]に近いが入力項目が多い。
- 入力: select `h4_frm_event`; input `h4_frm_unit`(評価単位), `h4_frm_Dept`, `h4_frm_Gr`, `h4_frm_Sec`, `h4_frm_DeltaVersion`(「⊿」除去), `h4_frm_my`, `h4_frm_model_name`(id=ID), `h4_frm_model_code`, `h4_frm_Destination`(「,」を「@」に置換), `h4_frm_managed_by_id`(value=名称, id=ID)。
- 処理フロー: 必須チェック(機種呼称空→`h4_C_E_0402`、機種コード空→`h4_C_E_0403`、仕向け空→`h4_C_E_0405`、利用者(同室課)空→`h4_C_E_0406`)。続いて[107]と同じ ⊿バージョン/機種呼称マップ確認(`h4_C_E_0404`)と h4_MQPage 重複チェック(special除外、`h4_C_E_0408`)。OKなら `dialog.close(イベントラベル,MY,仕向け,機種コード,機種呼称,機種呼称ID,利用者ID,評価単位,グループ,セクション)`(コメント順: 0:イベント,1:MY,2:仕向け,3:機種コード,機種呼称,機種呼称ID,利用者(同室課),評価単位,グループ,セクション)。
- 注意点: `debugger;` 残存。

## [109] h4_frm_get_value_DATMasterCopy
- 言語: JavaScript / comments: 帳票マスタ複製時の初期値入力ダイアログ終了メソッド
- 処理: select `DeltaVersion` の値と input `Name` の値を取得し `dialog.close(⊿バージョン + "," + 名称)`。[95][96]が結果を `split(',')` で使用。

## [110] h4_frm_get_value_multi_direct_ap
- 言語: JavaScript / comments: 必要資料複数ダイレクト承認の遷移先選択フォーム終了
- 処理: select `State` の値を `dialog.close(state)` で返す。(呼び出し元は `h4_MultiDirectApprove` 等と推測)

## [111] h4_frm_getSettingCheckBox
- 言語: JavaScript / comments: チェックボックス設定画面で設定した値の取得
- 概要: 開発拠点設定画面のOKボタンで動作(コード内コメント)。`h4_frm_getSettingEvents` と同形式で仕様変更に備え別Methodにしてある(コード内コメント)。
- 処理: `#checkBoxes1`(開発拠点)と `#checkBoxes2`(仕向け)内のチェック済みcheckboxのidを配列で収集し、`dialog.close(JSON.stringify({strChecks1, strChecks2}))`。

## [112] h4_frm_getSettingEvents
- 言語: JavaScript / comments: イベント設定画面で設定した値の取得
- 処理: フォーム全体のチェック済みcheckboxのidを配列で収集し `dialog.close(配列)`。`debugger;` 残存。

## [113] h4_frm_init_DATMasterCopydelta
- 言語: JavaScript / comments: 帳票マスタ複製時の初期値入力ダイアログの⊿バージョン設定
- 処理: `dialogArguments.deltaVersion` / `label` 配列から、name が `DeltaVersion` で始まる select に option(text=label, value=deltaVersion)を追加。([95][96]が渡す配列に対応)

## [114] h4_frm_init_DeptMaruQInitVal
- 言語: JavaScript / comments: 室課/GroupマルQ作成フォームの初期化 / 実行許可: Administrators
- 処理: input を走査し name の先頭一致で改名・初期化: `Dept*`→`h4_frm_Dept`(編集可・空)、`Group*`→`h4_frm_Group`、`Section*`→`h4_frm_Section`、`UseWF*`→`h4_frm_Use_WF`(有効・未チェック)、`Managed_by_id*`→`h4_frm_managed_by_id`(required・readOnly)。[105]が取得側。`debugger;` 残存。

## [115] h4_frm_init_setDeltaVersion
- 言語: JavaScript / comments: なし(内部: マルQページの初期値設定画面の初期化メソッド)
- 概要: マルQページ初期値入力画面([108]/[107]の対象)の初期化。`dialogArguments` から deltaVersion, dept, grp, sec, eventValue, eventLabel, selEvent, my, destination, isUseWF, modelName, modelNameId, modelCode, managedById, unit を読み取る。
- 処理: select の `Event*` に eventValue/eventLabel のoptionを追加、`Destination*` に destinations のoptionを追加。input を name先頭一致で改名・設定:
  - `Unit*`→`h4_frm_unit`(任意・編集可・値=unit)
  - `DeltaVersion*`→`h4_frm_DeltaVersion`(必須・読取専用・"⊿"+値)
  - `Dept*`→`h4_frm_Dept`(必須・読取専用)、`Gr*`→`h4_frm_Gr`(編集可)、`Sec*`→`h4_frm_Sec`(編集可)
  - `My*`→`h4_frm_my`(必須・読取専用)
  - `UseWF*`→`h4_frm_Use_WF`(disabled。isUseWF=="1"ならchecked)
  - `ModelName*`→`h4_frm_model_name`(必須・読取専用、value=機種呼称、id=機種呼称ID)
  - `ModelCode*`→`h4_frm_model_code`(任意)
  - `Destination*`→`h4_frm_Destination`(必須・読取専用)
  - `Managed_by_id*`→`h4_frm_managed_by_id`(必須・読取専用・値空)
  最後にイベント select の name を `h4_frm_event` に改名し `selEvent` を選択値に設定。

## [116] h4_frm_init_setState
- 言語: JavaScript / comments: 必要資料複数ダイレクト承認の遷移先選択フォーム初期化
- 処理: `dialogArguments.state`/`label` 配列から name が `State` で始まる select に option を追加。

## [117] h4_frm_set_Managed_by_id
- 言語: JavaScript / 実行許可: Administrators
- 概要: マルQページ作成時の「利用者(同室課)」選択ボタン押下時の動作。
- 処理: `MaximazableDialog.show('iframe', {title:'利用者(同室課)選択', type:'SearchDialog', itemtypeName:'identity', multiselect:false})` で Identity検索ダイアログを表示。選択結果の `itemID` があれば `h4_frm_managed_by_id` の input に value=`keyed_name`, id=`itemID` を設定。エラー時は `aras.alertError`。`debugger;` 残存。

## [118] h4_frm_set_ModelName
- 言語: JavaScript / comments: マルQページ：機種呼称選択ボタンのクリックイベント
- 処理: `SearchDialog`(itemtypeName=`HRDPMTypModelProject`, タイトル「Project選択」)で選択。`h4_frm_model_name` の value=keyed_name, id=itemID、`h4_frm_my` の value=選択Itemの `iq_model_year`。

## [119] h4_frm_set_ReqDocCLN
- 言語: JavaScript / comments: なし(内部: 担当者選択ボタン押下時の動作)
- 処理: ボタン名(`h4_frm_setcreater1-5`/`h4_frm_setreviewer1-5`/`h4_frm_setapprover1-5`)を対応する input 名(`h4_creater1-5`/`h4_reviewer1-5`/`h4_approver1-5`)に写像する辞書を持つ。Identity検索ダイアログ(title「担当者選択」, itemtypeName=identity, sourceItemTypeName=`h4_MQPage`, sourcePropertyName=`h4_approver`)を表示し、選択結果の keyed_name を value、itemID を id に設定。`debugger;` 残存。

## [120] h4_frm_SetReqDocCLN_GetValue
- 言語: JavaScript / comments: なし(内部: 担当者一覧設定画面の設定を取得)
- 処理: input から `h4_creater1-5`,`h4_reviewer1-5`,`h4_approver1-5` の id(空なら"")と、`creater1-5_required`,`reviewer1-5_required`,`approver1-5_required` の checked("1"/"0")を収集し、30要素のカンマ区切り文字列で `dialog.close`。順序: 0-4 creater1-5, 5-9 reviewer1-5, 10-14 approver1-5, 15-19 creater必須, 20-24 reviewer必須, 25-29 approver必須。

## [121] h4_GetControlledItem
- 言語: C# / comments: なし
- 概要: ワークフロー(Activity)Item(this)から、そのワークフローが管理する現行アイテムを返す(標準メソッドの改造と思われる; 推測)。
- 処理: `Workflow`(select source_id,source_type)→`Workflow Process`→`Workflow Process Activity`(related_id=this.getID())で検索。0件、source_idが32桁でない、source_type の keyed_name が空ならエラー(`h4_S_E_0002`)。source_type が複数異なってもエラー。source_id を `'...',` で連結し、`contType`(keyed_name)のアイテムを `is_current=1`・`id in (...)` で get し、件数が1以外ならエラー(`h4_S_E_0002`)。1件ならそのItemを返す。

## [122] h4_GetDocRelOrderNoAnParentState
- 言語: C# / comments: ドキュメントのリレーションの順番と、親アイテムのステートを取得して返す
- 入力: `docConfigID`。出力: Result Item(プロパティ `minParentOrderNo`(最小リレーション番号, 無ければ-1), `firstParentParmission`(最初に紐づいた親のpermission_id), `firstParentConfigID`, `isChangeFirstParent`("0"/"1"), `currentDocID`)。子リレーションとして Item(`parentID`,`parentPermissionID`,`parentSate`,`parentType`)を各親ごとに追加。
- 処理: `Administrators` 権限。Document(config_id=入力)を get(select id,h4_parent_config_id)。対象親ItemType `h4_DATFormat`,`h4_ReqDoc`,`h4_Test_Result`,`h4_PointOut` ごとに Method `h4_GetDocumentRelationName` を呼びリレーション名を収集。各リレーションを related_id=docID で get(select `source_id(id,state,permission_id,config_id,is_current)`,`h4_parent_order_no`)。親が `is_current=="1"` のもののみ対象。`h4_parent_order_no` が最小の親の config_id / permission_id を保持。ドキュメントの `h4_parent_config_id` と最小親の config_id が異なれば `isChangeFirstParent="1"`。
- 呼出す他Method: `h4_GetDocumentRelationName`。 エラー時 `h4_S_E_0002`。

## [123] h4_GetDocRelParentConfigID
- 言語: C# / comments: 親IDとrelationshipを渡して、子のドキュメントのコンフィグIDを返す
- 入力: `relitemtypeName`, `sourceID`。出力: Result の子に Item(`config_id`=Documentのconfig_id, `parent_order_no`=リレーションの `h4_parent_order_no`)。
- 処理: Administrators権限。リレーション(source_id=sourceID)を get(select config_id, related_id, id, h4_parent_order_no)。各行の related_id の Document を get(select config_id)し結果へ追加。エラー時 `h4_S_E_0002`。

## [124] h4_GetDocumentRelationName
- 言語: C# / comments: 任意のアイテムから、ドキュメントへのリレーション名を取得する
- 入力: `typename`。出力: `relationshiptype` の get 結果(name)。処理: Administrators権限で ItemType(typename)と ItemType(Document)のIDを取得し、`relationshiptype`(source_id=親, related_id=Document)を get して返却。エラー/個数チェックは呼び出し元任せ(コメント)。

## [125] h4_GetInputRevisioDialig
- 言語: JavaScript / comments: 改訂ダイアログで入力した内容を取得する
- 処理: textarea `h4_frm_revision_summary`(tmp1), `h4_frm_revision_reason`(tmp2)、input `h4_frm_check`(checked, tmp3)。tmp1/tmp2 いずれか空なら UserMessage `h4_C_E_0006` を AlertError。それ以外は `dialog.close(要約 + "," + 理由 + "," + チェック)`。
- 注意点: 入力値に「,」を含むと区切りが崩れうる(コードはエスケープなし)。


