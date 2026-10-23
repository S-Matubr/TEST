<!-- meta
legacy: knowledge/_legacy/機能設計書.md L3853-L4138
source: source/package/
-->
## 5. Form (フォーム) 17件

- 各Formは `Body` と、その下の `Field`(画面部品)で構成される。イベントは Form Event(`onload`)と Field Event(`onclick`)。イベントのJavaScriptはForm XML内に `sk_method_code` として**インライン**で格納され、`related_id` で Method 名(`h4_frm_*` 等)を参照している(今回は Form XML 内のインラインコードを読んで記載)。
- 17件のうち、フィールドを持たない空フォーム(Bodyのみ)が 8件(`SingOff` 3件、`TGVRevQuery`、`DATMAster Table`、`DMPMaster Table`、`MQPage Tree Tree`、`TGVWFGDATFormatRevHistory`)。残り9件のうち `h4_ReqDoc FormatN`(ファイル項目のみ)を除く8件は**ダイアログ用フォーム**(呼び出し元から `dialogArguments` を受け取り、OKボタンで `dialog.close(値)` により値を返す)。
- ダイアログの呼び出し元(どのCommandBarボタン/Methodが開くか)はForm XMLからは読み取れない。
- field_type の値: `html`(html_codeでHTML部品を直接記述)、`button`、`checkbox`、`text`、`textarea`、`label`、`file item`。
- x,y はフォーム上の配置座標(px)。

### 5.0 フォーム一覧(サマリ)

| # | Form名 | 説明 | フィールド数 | Form Event | 備考 |
|---|---|---|---|---|---|
| 1 | h4_AppWFGrForDATFormat SingOff | (なし) | 0 | なし | 空フォーム(XML上はBodyのみ) |
| 2 | h4_DATFormat SingOff | (なし) | 0 | なし | 空 |
| 3 | h4_DATFormat TGVRevQuery | (なし) | 0 | なし | 空 |
| 4 | h4_DATMaster SingOff | (なし) | 0 | なし | 空 |
| 5 | h4_DATMAster Table | (なし) | 0 | なし | 空 |
| 6 | h4_DATMasterCopyInputInitVal | 帳票マスタ複製時の初期値入力画面 | 3 | onload | ダイアログ |
| 7 | h4_DeptMaruQInitVal | (なし) | 8 | onload | ダイアログ |
| 8 | h4_DMPMaster Table | (なし) | 0 | なし | 空 |
| 9 | h4_Input_CheckBoxes_Value | 複数のチェックボックス用の入力ダイアログ | 2 | onload | ダイアログ |
| 10 | h4_Input_Check_Value | Listをチェックボックスで複数選択させる | 2 | onload | ダイアログ |
| 11 | h4_MQPage Tree Tree | (なし) | 0 | なし | 空 |
| 12 | h4_MQPageEventUpInputInitVal | SH: マルQページ初期値入力画面 | 8 | onload | ダイアログ(width=95, height=80) |
| 13 | h4_ReqDoc FormatN | (なし) | 1 | なし | ファイル項目(`h4_format_file`)のみ |
| 14 | h4_ReqDocChangeYryr | やるやら変更時入力画面 | 4 | なし | ダイアログ(400x130) |
| 15 | h4_RevisioDialog | 改訂ボタンで表示される改訂ダイアログ | 5 | なし | ダイアログ |
| 16 | h4_SetReqDocCLN_Input | (なし) | 46 | なし | ダイアログ(担当者一覧の一括設定、1000x300) |
| 17 | h4_TGVWFGDATFormatRevHistory | (なし) | 0 | なし | 空 |

### 5.x Form毎の詳細(フィールド名・型・紐づくMethod/イベント)

以下は XML から自動抽出した表(フィールドは sort_order 順)。「紐づく項目/HTML」は Property 参照(`file item`)または html_code の内容。


### 5.1 h4_AppWFGrForDATFormat SingOff

- ファイル: `Form\h4_AppWFGrForDATFormat SingOff.xml`
- 説明: (なし) / サイズ: 699 x 234
- Formイベント: なし
- フィールド: なし(Bodyのみの空フォーム)

### 5.2 h4_DATFormat SingOff

- ファイル: `Form\h4_DATFormat SingOff.xml`
- 説明: (なし) / サイズ: 699 x 234
- Formイベント: なし
- フィールド: なし(Bodyのみの空フォーム)

### 5.3 h4_DATFormat TGVRevQuery

- ファイル: `Form\h4_DATFormat TGVRevQuery.xml`
- 説明: (なし) / サイズ: 699 x 234
- Formイベント: なし
- フィールド: なし(Bodyのみの空フォーム)

### 5.4 h4_DATMaster SingOff

- ファイル: `Form\h4_DATMaster SingOff.xml`
- 説明: (なし) / サイズ: 699 x 234
- Formイベント: なし
- フィールド: なし(Bodyのみの空フォーム)

### 5.5 h4_DATMAster Table

- ファイル: `Form\h4_DATMAster Table.xml`
- 説明: (なし) / サイズ: 699 x 234
- Formイベント: なし
- フィールド: なし(Bodyのみの空フォーム)

### 5.6 h4_DATMasterCopyInputInitVal

- ファイル: `Form\h4_DATMasterCopyInputInitVal.xml`
- 説明: 帳票マスタ複製時の初期値入力画面 / サイズ: 699 x 234
- Formイベント: `onload` -> Method `h4_frm_init_DATMasterCopydelta` (コメント: 帳票マスタ複製時の初期値入力ダイアログの⊿バージョン設定)

| name | field_type | ラベル(ja) | x,y | 紐づく項目/HTML | イベント -> Method(コメント) |
|---|---|---|---|---|---|
| h4_frm_deltaVersion | html | ⊿バージョン | 33,13 | html: `<select id="DeltaVersion" name="DeltaVersion" style="width:100px ; height:20px"> </select>` |  |
| h4_frm_OK | button | OK | 383,63 |  | onclick -> `h4_frm_get_value_DATMasterCopy` (帳票マスタ複製時の初期値入力ダイアログ終了メソッド) |
| h4_frm_name | html | 名称 | 160,11 | html: `<input type="text" id="Name" name="Name" style="width:200px ; height:15px"> </select>` |  |

### 5.7 h4_DeptMaruQInitVal

- ファイル: `Form\h4_DeptMaruQInitVal.xml`
- 説明: (なし) / サイズ: 699 x 234
- Formイベント: `onload` -> Method `h4_frm_init_DeptMaruQInitVal` (コメント: 室課/GroupマルQ作成フォームの初期化)

| name | field_type | ラベル(ja) | x,y | 紐づく項目/HTML | イベント -> Method(コメント) |
|---|---|---|---|---|---|
| h4_frm_Use_WF | html | ワークフローの有無 | 15,95 | html: `<input type="checkbox" id="UseWF" name="UseWF" size=10> </Input>` |  |
| h4_frm_Dept | html | 室課 | 10,55 | html: `<input id="Dept" name="Dept" size=10> </input>` |  |
| h4_ok | button | OK | 255,140 |  | onclick -> `h4_frm_get_dept_init_value` (室課/グループマルQページ作成時の入力パラーメータ取得画面の値の取得) |
| h4_frm_managed_by_id | html | 利用者(同室課) | 131,95 | html: `<input id="Managed_by_id" name="Managed_by_id" size=15> </input>` |  |
| button1 | button | 選択 | 255,105 |  | onclick -> `h4_frm_set_Managed_by_id` |
| h4_frm_Group | html | グループ | 120,55 | html: `<input id="Group" name="Group" size=10> </input>` |  |
| h4_frm_Section | html | セクション | 230,55 | html: `<input id="Section" name="Section" size=10> </input>` |  |
| h4_frm_Class | html | タイプ | 6,15 | html: `<label><input type="radio" id="h4_radio_dept" name="h4_frm_radio_class" value="dept" checked>Dept</label> <label><input type="radio" id="h4_radio_group" name="h4_frm_radio_class" value="group">Group</label>` |  |

### 5.8 h4_DMPMaster Table

- ファイル: `Form\h4_DMPMaster Table.xml`
- 説明: (なし) / サイズ: 699 x 234
- Formイベント: なし
- フィールド: なし(Bodyのみの空フォーム)

### 5.9 h4_Input_Check_Value

- ファイル: `Form\h4_Input_Check_Value.xml`
- 説明: Listをチェックボックスで複数選択させる / サイズ: 699 x 234
- Formイベント: `onload` -> Method `h4_setCheckInit` (コメント: Listの複数選択ダイアログ 初期化)

| name | field_type | ラベル(ja) | x,y | 紐づく項目/HTML | イベント -> Method(コメント) |
|---|---|---|---|---|---|
| button0 | button | OK | 10,15 |  | onclick -> `h4_getSettingCheckBox` (h4_Input_Check_Value 画面で設定した値の取得) |
| h4_developmentbase | html |  | 10,50 | html: `<div id="checkBoxField" class="inputRow" style="font-size:12px"> </div>` |  |

### 5.10 h4_Input_CheckBoxes_Value

- ファイル: `Form\h4_Input_CheckBoxes_Value.xml`
- 説明: 複数のチェックボックス用の入力ダイアログ / サイズ: 699 x 234
- Formイベント: `onload` -> Method `h4_setCheckBoxInit` (コメント: 開発拠点選択ダイアログ 初期化)

| name | field_type | ラベル(ja) | x,y | 紐づく項目/HTML | イベント -> Method(コメント) |
|---|---|---|---|---|---|
| button0 | button | OK | 10,15 |  | onclick -> `h4_frm_getSettingCheckBox` (チェックボックス設定画面で設定した値の取得) |
| h4_CheckBoxes | html |  | 10,50 | html: `<div id="checkBoxes1" class="inputRow" style="font-size:12px"> </div> <div id="checkBoxes2" class="inputRow" style="font-size:12px"> </div>` |  |

### 5.11 h4_MQPage Tree Tree

- ファイル: `Form\h4_MQPage Tree Tree.xml`
- 説明: (なし) / サイズ: 699 x 234
- Formイベント: なし
- フィールド: なし(Bodyのみの空フォーム)

### 5.12 h4_MQPageEventUpInputInitVal

- ファイル: `Form\h4_MQPageEventUpInputInitVal.xml`
- 説明: SH: マルQページ初期値入力画面 / サイズ: 95 x 80
- Formイベント: `onload` -> Method `h4_frm_init_setDeltaVersion` (コメント: なし)

| name | field_type | ラベル(ja) | x,y | 紐づく項目/HTML | イベント -> Method(コメント) |
|---|---|---|---|---|---|
| h4_frm_event | html | イベント | 10,95 | html: `<select class="event-list" id="Event" name="Event"> </select>` |  |
| button0 | button | OK | 280,110 |  | onclick -> `h4_frm_get_eventup_value` (マルQページ － イベントアップの初期値入力画面の設定値の取得) |
| h4_frm_Dept | html | 室課 | 10,15 | html: `<input id="Dept" name="Dept" size=10> </input>` |  |
| h4_frm_model_name | html | 機種呼称 | 10,55 | html: `<input id="ModelName" name="ModelName" size=15> </input>` |  |
| h4_frm_model_code | html | 機種コード | 130,55 | html: `<input id="ModelCode" name="ModelCode" size=8 readOnly=true> </input>` |  |
| h4_frm_DeltaVersion | html | ⊿バージョン | 10,60 | html: `<input id="DeltaVersion" name="DeltaVersion" size=5> </input>` |  |
| h4_frm_Gr | html | グループ | 100,15 | html: `<input id="Gr" name="Gr" size=10> </input>` |  |
| h4_frm_Sec | html | セクション | 190,15 | html: `<input id="Sec" name="Sec" size=10> </input>` |  |

### 5.13 h4_ReqDoc FormatN

- ファイル: `Form\h4_ReqDoc FormatN.xml`
- 説明: (なし) / サイズ: 699 x 234
- Formイベント: なし

| name | field_type | ラベル(ja) | x,y | 紐づく項目/HTML | イベント -> Method(コメント) |
|---|---|---|---|---|---|
| h4_format_file | file item | フォーマットファイル | 10,10 | Property: h4_format_file |  |

### 5.14 h4_ReqDocChangeYryr

- ファイル: `Form\h4_ReqDocChangeYryr.xml`
- 説明: やるやら変更時入力画面 / サイズ: 400 x 130
- Formイベント: なし

| name | field_type | ラベル(ja) | x,y | 紐づく項目/HTML | イベント -> Method(コメント) |
|---|---|---|---|---|---|
| h4_description | label | やるやらを「○」から「×」に変更します。 | 12,6 |  |  |
| h4_yryr_reason | text | *やるやら変更理由 | 31,36 |  |  |
| h4_ok | button | OK | 153,80 |  | onclick -> `h4_change_yryr_frm_get_value` |
| h4_cancel | button | Cancel | 258,80 |  | onclick -> `h4_change_yryr_frm_close` |

### 5.15 h4_RevisioDialog

- ファイル: `Form\h4_RevisioDialog.xml`
- 説明: 改訂ボタンで表示される改訂ダイアログ / サイズ: 699 x 234
- Formイベント: なし

| name | field_type | ラベル(ja) | x,y | 紐づく項目/HTML | イベント -> Method(コメント) |
|---|---|---|---|---|---|
| h4_frm_revision_summary | textarea | * 改訂内容 | 15,22 |  |  |
| h4_frm_revision_reason | textarea | * 改訂理由 | 15,158 |  |  |
| h4_frm_check | checkbox | すぐに公開 | 228,291 |  |  |
| h4_frm_ok | button | OK | 111,325 |  | onclick -> `h4_GetInputRevisioDialig` (改訂ダイアログで入力した内容を取得する) |
| h4_frm_cancel | button | Cancel | 350,325 |  | onclick -> `h4_CancelRevisioDialig` (改訂ダイアログをキャンセルで閉じる) |

### 5.16 h4_SetReqDocCLN_Input

- ファイル: `Form\h4_SetReqDocCLN_Input.xml`
- 説明: (なし) / サイズ: 1000 x 300
- Formイベント: なし

| name | field_type | ラベル(ja) | x,y | 紐づく項目/HTML | イベント -> Method(コメント) |
|---|---|---|---|---|---|
| h4_creater1 | html | 担当者1 | 5,20 | html: `<input id="" name="h4_creater1" size=15 readonly> </input>` |  |
| h4_creater2 | html | 担当者2 | 255,20 | html: `<input id="" name="h4_creater2" size=15 readonly> </input>` |  |
| h4_creater3 | html | 担当者3 | 505,20 | html: `<input id="" name="h4_creater3" size=15 readonly> </input>` |  |
| h4_creater4 | html | 担当者4 | 755,20 | html: `<input id="" name="h4_creater4" size=15 readonly> </input>` |  |
| h4_creater5 | html | 担当者5 | 1005,20 | html: `<input id="" name="h4_creater5" size=15 readonly> </input>` |  |
| h4_reviewer1 | html | 確認者1 | 5,80 | html: `<input id="" name="h4_reviewer1" size=15 readonly> </input>` |  |
| h4_reviewer2 | html | 確認者2 | 255,80 | html: `<input id="" name="h4_reviewer2" size=15 readonly> </input>` |  |
| h4_reviewer3 | html | 確認者3 | 505,80 | html: `<input id="" name="h4_reviewer3" size=15 readonly> </input>` |  |
| h4_reviewer4 | html | 確認者4 | 755,80 | html: `<input id="" name="h4_reviewer4" size=15 readonly> </input>` |  |
| h4_reviewer5 | html | 確認者5 | 1005,80 | html: `<input id="" name="h4_reviewer5" size=15 readonly> </input>` |  |
| h4_approver1 | html | 承認者1 | 5,140 | html: `<input id="" name="h4_approver1" size=15 readonly> </input>` |  |
| h4_approver2 | html | 承認者2 | 255,140 | html: `<input id="" name="h4_approver2" size=15 readonly> </input>` |  |
| h4_approver3 | html | 承認者3 | 505,140 | html: `<input id="" name="h4_approver3" size=15 readonly> </input>` |  |
| h4_approver4 | html | 承認者4 | 755,140 | html: `<input id="" name="h4_approver4" size=15 readonly> </input>` |  |
| h4_approver5 | html | 承認者5 | 1005,140 | html: `<input id="" name="h4_approver5" size=15 readonly> </input>` |  |
| h4_frm_setcreater1 | button | 選択 | 140,35 |  | onclick -> `h4_frm_set_ReqDocCLN` |
| h4_frm_setreviewer1 | button | 選択 | 140,95 |  | onclick -> `h4_frm_set_ReqDocCLN` |
| h4_frm_setapprover1 | button | 選択 | 140,155 |  | onclick -> `h4_frm_set_ReqDocCLN` |
| h4_frm_setcreater2 | button | 選択 | 390,35 |  | onclick -> `h4_frm_set_ReqDocCLN` |
| h4_frm_setreviewer2 | button | 選択 | 390,95 |  | onclick -> `h4_frm_set_ReqDocCLN` |
| h4_frm_setapprover2 | button | 選択 | 390,155 |  | onclick -> `h4_frm_set_ReqDocCLN` |
| h4_frm_setcreater3 | button | 選択 | 640,35 |  | onclick -> `h4_frm_set_ReqDocCLN` |
| h4_frm_setreviewer3 | button | 選択 | 640,95 |  | onclick -> `h4_frm_set_ReqDocCLN` |
| h4_frm_setapprover3 | button | 選択 | 640,155 |  | onclick -> `h4_frm_set_ReqDocCLN` |
| h4_frm_setcreater4 | button | 選択 | 895,35 |  | onclick -> `h4_frm_set_ReqDocCLN` |
| h4_frm_setreviewer4 | button | 選択 | 895,95 |  | onclick -> `h4_frm_set_ReqDocCLN` |
| h4_frm_setapprover4 | button | 選択 | 895,155 |  | onclick -> `h4_frm_set_ReqDocCLN` |
| h4_frm_setcreater5 | button | 選択 | 1138,35 |  | onclick -> `h4_frm_set_ReqDocCLN` |
| h4_frm_setreviewer5 | button | 選択 | 1137,95 |  | onclick -> `h4_frm_set_ReqDocCLN` |
| h4_frm_setapprover5 | button | 選択 | 1141,155 |  | onclick -> `h4_frm_set_ReqDocCLN` |
| h4_SetReqDocCLN_OK | button | OK | 1143,210 |  | onclick -> `h4_frm_SetReqDocCLN_GetValue` |
| creater1_required | checkbox | 必須 | 140,15 |  |  |
| reviewer1_required | checkbox | 必須 | 140,75 |  |  |
| approver1_required | checkbox | 必須 | 140,135 |  |  |
| creater2_required | checkbox | 必須 | 390,15 |  |  |
| reviewer2_required | checkbox | 必須 | 390,75 |  |  |
| approver2_required | checkbox | 必須 | 390,135 |  |  |
| creater3_required | checkbox | 必須 | 640,15 |  |  |
| reviewer3_required | checkbox | 必須 | 640,75 |  |  |
| approver3_required | checkbox | 必須 | 640,135 |  |  |
| creater4_required | checkbox | 必須 | 895,15 |  |  |
| reviewer4_required | checkbox | 必須 | 895,75 |  |  |
| approver4_required | checkbox | 必須 | 895,135 |  |  |
| creater5_required | checkbox | 必須 | 1138,15 |  |  |
| reviewer5_required | checkbox | 必須 | 1140,75 |  |  |
| approver5_required | checkbox | 必須 | 1141,135 |  |  |

### 5.17 h4_TGVWFGDATFormatRevHistory

- ファイル: `Form\h4_TGVWFGDATFormatRevHistory.xml`
- 説明: (なし) / サイズ: 699 x 234
- Formイベント: なし
- フィールド: なし(Bodyのみの空フォーム)


### 5.y Form内インラインコードの動作(コードから読み取れる内容)

各ダイアログ共通: 呼び出し元から渡された引数を `parent.frameElement.dialogArguments`(または `parent.dialogArguments`)から受け取り、OKで `parent.dialogArguments.dialog.close(返却値)` を呼ぶ。エラー表示は `UserMessage` を `name` で検索した `text` を `aras.AlertError` で表示する。

| Form | イベント / Method | 動作 |
|---|---|---|
| h4_DATMasterCopyInputInitVal | onload `h4_frm_init_DATMasterCopydelta` | `dialogArguments.deltaVersion`(値配列)と `dialogArguments.label`(表示配列)から、`name="DeltaVersion"` の`select`に `option` を追加する |
| 〃 | OKボタン onclick `h4_frm_get_value_DATMasterCopy` | `select[name=DeltaVersion]` の値と `input[name=Name]` の値を取得し、`close("⊿バージョン値,名称")` で返す |
| h4_DeptMaruQInitVal | onload `h4_frm_init_DeptMaruQInitVal` | `input` の name を `Dept`→`h4_frm_Dept`、`Group`→`h4_frm_Group`、`Section`→`h4_frm_Section`、`UseWF`→`h4_frm_Use_WF`、`Managed_by_id`→`h4_frm_managed_by_id` に付け替え。Dept/Group/Section は空・編集可、UseWF は未チェック・有効、利用者(同室課)は必須・読み取り専用にする |
| 〃 | 「選択」ボタン onclick `h4_frm_set_Managed_by_id` | Identity の SearchDialog(title「利用者(同室課)選択」、単一選択)を開き、選択結果の `keyed_name` を `h4_frm_managed_by_id` の value、itemID を id に設定 |
| 〃 | OKボタン onclick `h4_frm_get_dept_init_value` | ラジオ(`h4_frm_radio_class`: dept/group)→ 区分 "Dept" or "Gr"、室課/グループ/セクション/ワークフローの有無/利用者を取得。必須チェック: 室課・グループ・セクションが全て未入力 → UserMessage `h4_C_I_0702`(`{0}`=「室課/グループ/セクション」)、利用者(同室課)が空 → `h4_C_I_0702`(`{0}`=「利用者(同室課)」)。重複チェック: `h4_MQPage` を 室課(dialogArguments.dept)・機種呼称(modelName)・機種コード(modelCode)・イベント(eventValue)・グループ・セクション(未入力はNULL/空条件)で検索し、イベントが `special`(個別イベント)以外で1件以上あれば UserMessage `h4_C_E_0410` を表示して終了。問題なければ `close("室課,グループ,セクション,WF有無,利用者ID,区分")` |
| h4_Input_CheckBoxes_Value | onload `h4_setCheckBoxInit` | List `h4_DevelopmentBase`、`h4_destination` の Value の label を取得(取得失敗時 UserMessage `h4_C_E_0002`)。`checkBoxes1`(見出し「開発拠点」)、`checkBoxes2`(見出し「仕向設定」)に、1行8個ずつチェックボックスを生成(id/表示名=ラベル) |
| 〃 | OK(button0) onclick `h4_frm_getSettingCheckBox` | 各divのチェック済みidを集め、`close(JSON {strChecks1:[開発拠点], strChecks2:[仕向]})` |
| h4_Input_Check_Value | onload `h4_setCheckInit` | `dialogArguments.targetListName` で指定されたListのValue labelを取得し、`checkBoxField` に1行8個ずつチェックボックス生成(失敗時 `h4_C_E_0002`) |
| 〃 | OK(button0) onclick `h4_getSettingCheckBox` | チェック済みのidの配列を `close(配列)` で返す |
| h4_MQPageEventUpInputInitVal | onload `h4_frm_init_setDeltaVersion` | dialogArguments(deltaVersion, dept, grp, sec, eventValue, eventLabel, selEvent, modelName, modelNameId, modelCode ほか)から、イベントの `select` に option を追加し、⊿バージョン(「⊿」付き・読み取り専用)、室課(読み取り専用)、グループ/セクション(編集可)、機種呼称(読み取り専用、idに modelNameId)、機種コード等へ値を設定。input の name を `h4_frm_*` に付け替え、イベントの初期選択に `selEvent` を設定。(コード内には Unit/My/Destination/UseWF/Managed_by_id 用の分岐もあるが、本Formの定義済みフィールドにはそれらは無い) |
| 〃 | OK(button0) onclick `h4_frm_get_eventup_value` | 入力値(イベント、室課、グループ、セクション、⊿バージョン(「⊿」除去)、機種呼称、機種コード)を取得。検証1: List `h4_ModelName` の Filter Value で「filter=⊿バージョン かつ value=機種呼称」が存在しなければ UserMessage `h4_C_E_0404`。検証2: `h4_MQPage` を 室課・機種呼称・機種コード・イベント(・グループ・セクション)で検索し、`special` 以外が1件以上あれば UserMessage `h4_C_E_0408`。問題なければ `close("イベント,グループ,セクション")` |
| h4_ReqDocChangeYryr | Cancel onclick `h4_change_yryr_frm_close` | `dialog.close()`(値なし) |
| 〃 | OK onclick `h4_change_yryr_frm_get_value` | `h4_yryr_reason`(やるやら変更理由)が空なら UserMessage `h4_C_E_0503` を表示。入力があれば `close(理由)` |
| h4_RevisioDialog | Cancel onclick `h4_CancelRevisioDialig` | `dialog.close()` |
| 〃 | OK onclick `h4_GetInputRevisioDialig` | textarea `h4_frm_revision_summary`(改訂内容)、`h4_frm_revision_reason`(改訂理由)、チェック `h4_frm_check`(すぐに公開)を取得。改訂内容/理由のどちらかが空なら UserMessage `h4_C_E_0006`。問題なければ `close("改訂内容,改訂理由,チェック(true/false)")` |
| h4_SetReqDocCLN_Input | 「選択」ボタン15個 onclick `h4_frm_set_ReqDocCLN`(15ボタン同一コード) | ボタン名→入力欄名の対応表(`h4_frm_setcreater1..5`→`h4_creater1..5`、`h4_frm_setreviewer1..5`→`h4_reviewer1..5`、`h4_frm_setapprover1..5`→`h4_approver1..5`)に従い、Identity の SearchDialog(title「担当者選択」、単一選択、`sourceItemTypeName: h4_MQPage`、`sourcePropertyName: h4_approver`)を開き、選択結果の keyed_name を入力欄の value、itemID を id に設定 |
| 〃 | OK(`h4_SetReqDocCLN_OK`) onclick `h4_frm_SetReqDocCLN_GetValue` | 担当者1-5・確認者1-5・承認者1-5 の各Identity ID と「必須」チェック15個を取得し、カンマ区切り30値で `close()`。並び: 0-4=担当者ID、5-9=確認者ID、10-14=承認者ID、15-19=担当者必須(0/1)、20-24=確認者必須、25-29=承認者必須 |
| h4_ReqDoc FormatN | (イベントなし) | `file item` フィールド `h4_format_file`(ラベル「フォーマットファイル」)が Property `h4_format_file` を参照するのみ |

補足(XMLの事実): 第7章の Field `h4_pdf_file` は、Form名 `h0_Document`(`sk_parent_form`)の Body に属する(他パッケージ側のForm)。本章の17件には含まれない。




---

<!-- ===== 第4章 ===== -->

