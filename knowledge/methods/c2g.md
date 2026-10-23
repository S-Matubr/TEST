<!-- meta
legacy: knowledge/_legacy/機能設計書.md L5944-L6005
source: source/package/Independent/Import/Method/
-->
# Method AML 調査 C_method2g (166〜171番目: h4_MQPage_ivicb_copy 〜 h4_MultiDirectApprove)

---
## [166] h4_MQPage_ivicb_copy
- 言語: JavaScript / comments: なし(内部: マルQページ：複製の実行)
- 概要: マルQページの複製。複製先の値を入力するダイアログ(フォーム `h4_MQPageInputInitVal`)を出し、サーバーMethod `h4_Call_Copy_MQPage` を呼ぶ。
- 呼び出し契機(推測): マルQページ アイテムビュー(ivicb)の「複製」ボタン。※`options.getState().grid` の選択行があればそれ、無ければ表示中ウィンドウの `itemID` を使うので検索グリッドからも共用される形(コード上)。
- 処理フロー:
  1. UserMessage `h4_C_I_0402`(本文)・`h4_C_I_0001`(タイトル)・`h4_C_I_0408`(フォームタイトル)取得(本文・タイトル変数は後で使われない)。
  2. 複製元ID取得。無ければ `h4_C_E_0409` を表示して終了。
  3. 複製元(`h4_MQPage`)の `h4_dept, h4_delta_version, h4_event, h4_my, h4_destination, h4_model_name(ID), h4_model_code, managed_by_id, h4_evaluation_unit, h4_group, h4_section` を取得。`HRDPMTypModelProject`(id=機種呼称ID, select id,name)から機種呼称名を取得。
  4. List `h4_events` の `Filter Value`(filter=⊿バージョン, inactive=0, select `id,filter,label,sort_order,value,inactive`)を取得。0件なら `h4_C_E_0410`。ラベル空はスキップし、イベント選択肢(label/value)を作成。
  5. ダイアログ(620x150, `ShowFormAsADialog.html`)にパラメータ(`deltaVersion, dept, grp, sec, eventLabel, eventValue, selEvent(現イベント), my, destination, modelName, modelNameId, modelCode, managedById, unit`)を渡して表示。
  6. 結果(カンマ区切り 0:イベント,1:MY,2:仕向け,3:機種コード,4:機種呼称,5:機種呼称ID,6:利用者(同室課),7:評価単位,8:グループ,9:セクション)を XML 化(`ItemId, Event, My, Destination, ModelCode, ModelName, ModelNameId, ManagedById, EvaluationUnit, DeltaVersion(複製元のもの), Dept(複製元のもの), Group, Section`)し、`applyMethod("h4_Call_Copy_MQPage", body)`。エラーなら `alert(エラー文字列)`。成功なら複製後のItemを `aras.uiShowItem`。例外時は `h4_C_E_0407` を取得するのみで表示しない(メッセージ未使用)。全体の例外は `h4_C_E_0002` を AlertError。
- 呼出す他Method: `h4_Call_Copy_MQPage`。ダイアログのOK処理は `h4_frm_get_value` 系(推測: フォームのOKボタン→ [108]相当)。
- 注意点: `relItemNames` 宣言のみ未使用。

## [167] h4_MQPage_ivicb_event_up
- 言語: JavaScript / comments: なし(内部: マルQページ：イベントアップの実行)
- 概要: マルQページの「イベントアップ」(次イベントのマルQページを作成)。フォーム `h4_MQPageEventUpInputInitVal` を表示して `h4_Call_EventUp_MQPage` を呼ぶ。
- 処理フロー:
  1. フォームタイトル UserMessage `h4_C_I_0407`、本文 `h4_C_I_0401`・タイトル `h4_C_I_0001`(未使用)。
  2. 選択行(または表示中アイテム)のIDから `h4_MQPage` の `h4_dept, h4_group, h4_section, h4_delta_version, h4_event, h4_destination, h4_model_name(ID), h4_model_code` 取得。機種呼称名を `HRDPMTypModelProject` から取得。
  3. List `h4_events` の `Filter Value`(filter=⊿バージョン, inactive=0)取得、0件なら `h4_C_E_0410`。ラベル空と `inactive==1` をスキップしてイベント選択肢を作成。現イベントの次の行(最後の場合は同じ行)の value を `nextEvent` とし、ダイアログの初期選択(`selEvent`)に設定。
  4. ダイアログ(400x160)を表示。結果(0:イベント,1:グループ,2:セクション)から `<ItemId>,<NewEvent>,<Group>,<Section>` のXMLで `h4_Call_EventUp_MQPage` を実行。エラー時は alert、成功時は新規Itemを `aras.uiShowItem`。例外時 `h4_C_E_0002`。
- 呼出す他Method: `h4_Call_EventUp_MQPage`。ダイアログの入力取得は `h4_frm_get_eventup_value`(推測)。
- 注意点: 次イベントは `filterValues` 全件(inactive含む)内の次の行から取るため、inactive行があると次イベントがinactiveを指す可能性がある(コード上の事実)。`selItem` は2回代入(後勝ちで `aras.getItemById`)。

## [168] h4_MQPage_MainFormMin
- 言語: JavaScript / comments: マルQアイテムを開いたときに1stアコーディオンを閉じる
- 処理: `document.thisItem` の `id` が空なら何もしない(新規作成時は設定画面表示のため)。それ以外は `.aras-accordion` の先頭を `toggle(true)`(Close)。[161]と異なり管理者判定なし。

## [169] h4_MQPage_svcb_deptmaruq_create
- 言語: JavaScript / comments: Gr・室課用マルQページ作成(検索ビュー用)
- 概要: 検索グリッドで選択した1件以上のマルQページを基に、Gr(グループ)/室課(Dept)用マルQページを作成する。検索ダイアログ表示時に `itemContext` を介してフィルタ用Method(IV/SV共通 = `h4_deptmqmaster_grid_event` [101])にマルQページのIDとクラスを渡す(コード冒頭コメント)。
- 処理フロー:
  1. 選択行ごとに `h4_dept, state, h4_class, h4_delta_version, h4_model_name, h4_event, h4_destination, h4_my, h4_model_code, h4_developmentbase, h4_variations` を取得。先頭を基準とし、2件目以降で `state`(ステータス)・`h4_class`(区分)・`h4_model_name`(機種呼称)・`h4_event`・`h4_destination`(仕向け)・`h4_model_code` が異なる場合はエラー要素に積む。`h4_developmentbase`/`h4_variations` が異なる場合は空文字にする。
  2. List `h4_events` の `Filter Value`(filter=基準⊿バージョン, inactive=0)を取得、0件なら `h4_C_E_0410`。⊿バージョンに合致し value==イベントのものを `wkEvent` とする(値で取得)。
  3. 不一致項目があれば、UserMessage `h4_C_I_0701`(`{0}` を「ステータス/区分/機種呼称/イベント/仕向け/機種コード」で置換)を連結して `alert` し終了。
  4. ダイアログ `h4_DeptMaruQInitVal`(title「マルQページ作成時の値設定」, 360x175, 渡す値: dept, modelName, modelCode, eventValue)で室課/グループ/セクション/WF有無/利用者(同室課)/クラス(Dept/Gr)を入力([105] `h4_frm_get_dept_init_value` が結果を返す)。
  5. SearchDialog(itemtypeName=`h4_DeptMQMaster`, sourceItemTypeName=`h4_MQPage`, sourcePropertyName=`h4_class`, `itemSelectedID`=選択ID, `itemContext`=結果のクラス results[5])でマルQマスタを選択(title=UserMessage `h4_C_I_0403`)。
  6. 選択後、`applyMethod("h4_Call_create_deptmaruq", body)`。body: `TargetType, DeptMQMasterId(選択マスタID), Dept, Group, Section, UseWF, ManagedById, DeltaVersion, ModelCode, My, Dest, ModelName, Event(wkEvent), Developmentbase, Variations, Class, SelMqPageIds(選択IDをカンマ区切り)`。エラー時は `h4_C_E_0407` + エラー文字列。成功時は新規Itemを `aras.uiShowItem`。
- 呼出す他Method: `h4_Call_create_deptmaruq`、(フィルタ) `h4_deptmqmaster_grid_event`、(ダイアログ)`h4_frm_get_dept_init_value`。
- 注意点: ロジック上、`wkEvent` 算出ループで比較に使う `propDeltaVersion` は最後に処理した行の値(`baseDeltaVersion` ではない)。`grid.getSelectedItemIds()` の `grid` は本コード内で宣言されていない(`options.getState().grid` 経由でのみ取得)。`addRelItem` は定義のみ未使用。`debugger;` 残存。

## [170] h4_MQPReject_SetReqDocRejecter
- 言語: C# / comments: MQPageReject_SetReqDocRejecterAndDate
- 概要: マルQページ否認時に、配下の「やるやら×(`h4_yryr`=="0")」の必要資料の承認者・承認日時に否認者・否認日時を設定する(コード内コメント)。承認済み(`Approved`)の必要資料は対象外。2度目以降の否認でも更新する。
- 呼び出し契機(推測): マルQページ WF 否認(Reject)後の Post メソッド。
- 入力: `type`, `id`(マルQページ)。出力: this / エラー(`h4_S_E_0002`)。
- 処理: `Administrators` 権限でマルQを取得(0件ならエラー)。`h4_MQPage ReqDoc` を取得(0件ならエラー)。各必要資料(`h4_ReqDoc`)を取得し、state=`Approved` ならスキップ、`h4_yryr`=="0" なら edit で `h4_approval_date`=現在日時(yyyy-MM-ddTHH:mm:ss), `h4_approver`=実行ユーザID を設定。
- 注意点: 配下の必要資料が0件でもエラーを返す(`getItemCount()==0` でエラー)。

## [171] h4_MultiDirectApprove
- 言語: JavaScript / comments: 必要資料複数ダイレクト承認のリスト選択値変更メソッドを呼ぶ
- 概要: 必要資料リレーションの選択行に対し、共通の遷移先ステートを選択して一括でダイレクトプロモートする。
- 呼び出し契機(推測): 必要資料リレーションタブのツールバーボタン。
- 処理フロー: 選択IDのリレーション(`grid._itemType.name`)の related の `state` を取得し、選択中に存在する state(InProgress/InReview/RequestApproval/ProvisionalApproved/Approved)のフラグを立てる。state別の遷移先: InProgress→[InReview, RequestApproval, ProvisionalApproved, Approved]、InReview→[InProgress, RequestApproval]、RequestApproval→[InProgress, InReview, ProvisionalApproved, Approved]、ProvisionalApproved→[Approved]、Approved→[]。選択された各stateの遷移先の共通部分(積集合)を算出し、List `h4_MQLDOCNULLLCS` の Value(label,value)に含まれるものだけを選択肢にする。ダイアログ(フォーム `h4_MultiDirectApproveStateSelect`, title「一括ステータス変更」, 300x100)で選択後、`aras.applyMethod("h4_Change_Direct_Approve_List", "<state>…</state><id1>…</id1>…")` を実行し、`parent.onRefresh()`。エラー時は `aras.AlertError(msg2)` を呼ぶ。
- 呼出す他Method: `h4_Change_Direct_Approve_List`。選択肢構築の初期化は `h4_frm_init_setState`、OKは `h4_frm_get_value_multi_direct_ap`(推測、フォーム側)。
- 注意点: エラー表示で `ms2` と `msg2` の変数名が不一致(`ms2` に代入し `msg2` を参照; コード上の事実)。選択行0件のとき `reduce` に初期値がなく例外になりうる(コード上)。`parent.onRefresh()` は `isError` 判定より前に呼ばれる。


