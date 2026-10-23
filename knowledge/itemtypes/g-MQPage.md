<!-- meta
legacy: knowledge/_legacy/機能設計書.md L708-L1022
source: source/package/MQPage/Import/
-->
# G. マルQ・指摘・必要資料・検証結果・WF 系パッケージ 読込メモ (その1: MQPage / PointOut)

ベース: `C:\Claude\TEST\HND-マルQ Step3パッケージ\Step3パッケージ`

## 共通の読み方・注意

- 対象は各パッケージの `Import` 配下のXML全て。AMLの `Item` を機械的に展開した上で全件を確認した。
- **Method本体(サーバー側C#等)は、これらのImportには含まれない**。ItemType/RelationshipType/Workflow から「Method名」で参照されているだけである。したがって「Methodが何をするか」は名前以外コードに無く、本書では推測を書かない。例外は、Form/Field のイベントに**インライン記述されたJavaScript**(`sk_method_code`)で、これは内容を要約して記す。
- プロパティ表の「Hidden1/2」は AML の `is_hidden` / `is_hidden2` の値(1=true)。意味の解釈は書かない。「必須」は `is_required`、「読取専用」は `readonly`。「長さ」は `stored_length`(string/list系のみ)。
- データソースは list/filter list は List名、item は参照先ItemType名。
- 「ラベル(ja)」は `i18n:label xml:lang="ja"`、「ラベル(en)」は `label xml:lang="en"`。
- サーバーイベントは発火タイミング順(Before系→After系)に並べ、同一イベント内は `sort_order` 順に実行される並びで示した(実際の実行順序はAras仕様に依存し、ここでは並べ替えのみ)。
- ID(GUID)は省略し、名前で記載。

---

# 1. パッケージ MQPage (`MQPage\Import`)

含まれるファイル: cui_Control(3) / cui_WindowSection(3) / Form(4) / ItemType(2: h4_MQPage, h4_destination History) / qry_QueryDefinition(1) / rb_TreeGridViewDefinition(1)

## 1.1 ItemType: h4_MQPage (ラベル ja/en: マルQページ / Maru Q Page)

### 設定

| 項目 | 値 |
|---|---|
| name | h4_MQPage |
| label / label_plural | マルQページ(ja), Maru Q Page(en) |
| instance_data(テーブル) | H4_MQPAGE |
| implementation_type | table |
| is_versionable | 1 (manual_versioning=0) |
| is_relationship / is_dependent | 0 / 0 |
| structure_view | tabs on |
| default_page_size | 100 |
| auto_search / enforce_discovery / hide_where_used | 0 / 1 / 0 |
| allow_private_permission | 1 |
| show_parameters_tab | 0 |
| unlock_on_logout | 1 |
| use_src_access | 0 |
| history_template / revisions | Default / Default |
| icon(large/open) | ../images/AdvancedImageViewerOn.svg |
| class_structure | `<class id="(自ItemTypeのID)" />`(単一ノードのみ) |
| ITPresentationConfiguration | h4_MQPage_TOC_Configuration (client=js) |

### プロパティ・サーバーイベント・付随設定

**ItemType "h4_MQPage" のプロパティ** (ItemType action=add)

| 名前 | ラベル(ja) | ラベル(en) | 型 | 長さ | 必須 | データソース | 既定値 | 読取専用 | Hidden1/2 | 備考 |
|---|---|---|---|---|---|---|---|---|---|---|
| h4_approval_date | 承認日時 |  | date |  | 0 |  |  | 1 | 1/0 |  |
| h4_approval_round | 次数 |  | integer |  | 0 |  | 1 | 1 | 0/0 |  |
| h4_approve_style | ワークフローの有無 |  | boolean |  | 0 |  |  | 1 | 0/1 |  |
| h4_approver | 承認者 |  | item |  | 0 | User |  | 1 | 1/0 | item_behavior=float; GridEvent: onsearchdialog→h4_identity_grid_event_alias |
| h4_class | 区分 |  | list | 256 | 0 | h4_class |  | 0 | 0/0 | 列幅=50; GridEvent: onsearchdialog→h4_deptmqmaster_grid_event |
| h4_deadline | 提出期限 |  | date |  | 0 |  |  | 0 | 0/0 |  |
| h4_delta_version | ⊿バージョン | Delta Ver. | list | 256 | 1 | h4_DeltaVersion |  | 1 | 1/1 | 列幅=128 |
| h4_dept | 室課 |  | string | 32 | 0 |  |  | 1 | 0/0 |  |
| h4_destination | 仕向け | Destination | text |  | 0 |  |  | 1 | 0/0 | keyed_name_order=5; 列幅=128 |
| h4_developmentbase | 開発拠点 |  | text |  | 0 |  |  | 1 | 1/1 |  |
| h4_directaplist | ステート |  | list | 256 | 1 | h4_MQLCS | InProgress | 1 | 1/1 |  |
| h4_equipment | 装備 |  | string | 256 | 0 |  |  | 0 | 1/1 |  |
| h4_evaluation_unit | 評価単位 |  | string | 256 | 0 |  |  | 0 | 0/0 | keyed_name_order=6 |
| h4_event | イベント | Event | filter list | 256 | 0 | h4_Events |  | 0 | 0/0 | keyed_name_order=3; pattern=h4_delta_version; 列幅=64 |
| h4_group | グループ |  | string | 32 | 0 |  |  | 1 | 0/0 |  |
| h4_model_code | 機種コード |  | string | 32 | 1 |  | - | 1 | 0/0 |  |
| h4_model_name | 機種呼称 |  | item |  | 1 | HRDPMTypModelProject |  | 1 | 0/0 | keyed_name_order=2; item_behavior=float; GridEvent: change→h4_set_my, change→h4_changeModelName |
| h4_my | MY | MY | list | 256 | 0 | h4_ModelYear |  | 1 | 0/0 | keyed_name_order=1; 列幅=128 |
| h4_note | 備考 |  | text |  | 0 |  |  | 0 | 1/1 |  |
| h4_pre_event | 前イベント |  | item |  | 0 | h4_MQPage |  | 1 | 1/1 | item_behavior=float |
| h4_section | セクション |  | string | 32 | 0 |  |  | 1 | 0/0 |  |
| h4_src_mq_master | ソースマルQマスタ |  | item |  | 0 | h4_DeptMQMaster |  | 1 | 1/1 | item_behavior=float |
| h4_test_schedule | 検証会日程 |  | date |  | 0 |  |  | 0 | 0/0 |  |
| h4_unique_event | 個別イベント名 |  | string | 256 | 0 |  |  | 0 | 1/1 | keyed_name_order=4 |
| h4_variations | バリエーション |  | string | 256 | 0 |  |  | 0 | 1/1 |  |

**ItemType "h4_MQPage" のプロパティ** (ItemType action=edit)

| 名前 | ラベル(ja) | ラベル(en) | 型 | 長さ | 必須 | データソース | 既定値 | 読取専用 | Hidden1/2 | 備考 |
|---|---|---|---|---|---|---|---|---|---|---|
| created_on |  |  | date |  | 1 |  |  | 1 | 1/1 | pattern=short_date_time; 列幅=150; (標準プロパティのedit) |
| current_state | ステート |  | item |  | 0 | Life Cycle State |  | 1 | 0/1 | item_behavior=float; (標準プロパティのedit) |
| managed_by_id | 編集者 | 利用者(同室課) | item |  | 1 | Identity |  | 0 | 1/1 | item_behavior=float; (標準プロパティのedit) |
| modified_by_id |  |  | item |  | 0 | User |  | 1 | 0/1 | item_behavior=float; 列幅=160; (標準プロパティのedit) |
| modified_on |  |  | date |  | 0 |  |  | 1 | 0/1 | pattern=short_date_time; 列幅=150; (標準プロパティのedit) |
| owned_by_id | 閲覧者 | 利用者(別室課) | item |  | 0 | Identity |  | 0 | 1/1 | item_behavior=float; GridEvent: onsearchdialog→h4_identity_grid_event; (標準プロパティのedit) |
| superseded_date |  | Superseded Date | date |  | 0 |  |  | 0 | 1/1 | pattern=short_date_time; (標準プロパティのedit) |



**ItemType "h4_MQPage" のイベント・付随設定**

サーバーイベント(発火タイミング順。同一イベント内はsort_order順)

| イベント(発火タイミング) | Method | sort_order | is_required |
|---|---|---|---|
| onBeforeUpdate | h4_SetYaruYara | 528 | 0 |
| onBeforeUpdate | h4_SetItemManagedAndOwned_be | 784 | 0 |
| onAfterUpdate | h4_AddItemWhenSave | 8 | 0 |
| onAfterUpdate | h4_SetItemManagedAndOwned_af | 16 | 0 |
| onAfterUpdate | h4_Promote_By_List_MQPage | 128 | 0 |
| onAfterUpdate | h4_AddRelPointOutMQPage | 384 | 0 |
| onAfterUpdate | h4_ReAssignInProgress | 400 | 0 |
| onAfterUpdate | h4_SetVoteInProgress | 410 | 0 |
| onAfterUpdate | h4_checkModelName | 912 | 0 |
| onBeforeGet | h4_sort_control | 656 | 0 |
| onBeforeLock | h4_checkDeadline | 1040 | 0 |
| onAfterPromote | h4_List_By_Promote_MQPage | 100 | 0 |
| onAfterPromote | h4_UpdatePointOutPermission | 101 | 0 |

クライアントイベント

| イベント | Method |
|---|---|
| OnNew | h4_ControlItemCreation |

その他の付随設定

- ITPresentationConfiguration : client=js, related_id=h4_MQPage_TOC_Configuration
- View : client=js, related_id=h4_MQPage, role=World, show_ssvc=0, type=default
- ItemType Life Cycle : related_id=h4_MQPageLC
- Allowed Workflow : is_default=1, related_id=h4_ApprovalWFMQAndReqDoc
- Can Add : can_add=1, related_id=World
- Allowed Permission : is_default=1, related_id=h4_Everyone_Full_Control



- ライフサイクル: h4_MQPageLC。許可ワークフロー: h4_ApprovalWFMQAndReqDoc(既定)。→ ワークフロー詳細は `G_mq_wf_packages_c.md`(WFMap)参照。
- グリッドイベント(プロパティ側)は上表「備考」に記載。まとめ: h4_approver(onsearchdialog→h4_identity_grid_event_alias) / h4_class(onsearchdialog→h4_deptmqmaster_grid_event) / h4_model_name(change→h4_set_my, h4_changeModelName) / owned_by_id(onsearchdialog→h4_identity_grid_event)。
- 「標準プロパティのedit」行は同ファイル内の2つ目の `ItemType action="edit"` による設定。created_on(必須・読取専用・短い日時書式)、current_state(ラベル「ステート」、Life Cycle State参照)、managed_by_id(ラベル ja「編集者」/ en「利用者(同室課)」、必須)、owned_by_id(ラベル ja「閲覧者」/ en「利用者(別室課)」)、modified_by_id、modified_on、superseded_date。

### 関係ItemType(このパッケージ内)
h4_MQPage を source とする RelationshipType は `Last` パッケージ側にある(本書 `_b.md` の Last 節参照)。このパッケージのItemTypeとしての関係は下の 1.2 のみ。

## 1.2 ItemType: h4_destination History (関係ItemType相当)

| 項目 | 値 |
|---|---|
| name | h4_destination History |
| instance_data | H4_DESTINATION_HISTORY |
| is_relationship | 1 (is_versionable=0, use_src_access=1, structure_view=tabs off, enforce_discovery=0) |
| プロパティ | なし(コード上に定義なし) |
| View | default / role=World (client=js) |
| イベント | なし |

対応するForm `h4_destination History` は Body のみ(フィールド・イベントなし、width=699 height=234)。この名前を参照するRelationshipType定義は、調査した全パッケージ(Step3パッケージ配下全XML)の中にこの4ファイル(ItemType/Form/qry_QueryDefinition/rb_TreeGridViewDefinition)以外に存在しない。同名のQuery定義とTreeGridView定義が下記 1.5 / 1.6 にある(事実のみ。Relationship Viewへの紐付けはコード上に無い)。

## 1.3 Form

### 1.3.1 h4_MQPage (classification=Responsive, 1024x172, stylesheet=../styles/default.css, description「SH: マルQページ」)

フィールド(Body、位置はx,y)

| フィールド名 | 型 | ラベル(ja) | 対応プロパティ | x,y | 備考 |
|---|---|---|---|---|---|
| h4_my | dropdown | MY | h4_my | 0,0 | |
| h4_delta_version | dropdown | ⊿バージョン | h4_delta_version | 95,0 | |
| h4_destination | dropdown | 仕向け | h4_destination | 185,0 | |
| h4_model_name | text | 機種呼称 | (propertytype_idはa0=未解決/非バインド) | 265,0 | |
| h4_model_code | text | 機種コード | h4_model_code | 410,0 | |
| h4_event | dropdown | イベント | h4_event | 0,44 | orientation=vertical |
| h4_wf_status | text | MQページのステータス | (a0=非バインド) | 200,48 | |
| h4_src_mq_master | item | ソースマルQマスタ | h4_src_mq_master | 407,47 | |
| h4_directaplist | dropdown | ステート(Direct) | h4_directaplist | 4,99 | |
| h4_approve_style | checkbox | ワークフローを使用 | h4_approve_style | 236,100 | |
| h4_approval_round | text | 次数 | h4_approval_round | 102,104 | is_disabled=1 |

フォームイベント

| イベント | Method | 内容(インラインJS要約) |
|---|---|---|
| onload | h4_ControlTabbar | コメント「WFの仕様有無によってサインオフタブの表示を制御する」。マルQページ・必要資料・テスト結果のロード時に実行。Top画面のアイテムの `h4_approve_style` を取得(=WF使用有無)。h4_MQPage の場合: WF不使用→リレーションタブ `h4_MQSingOff1` / `h4_TGVRevQueryMQ` / `h4_MQPage CLN` を全て非表示。WF使用時は `h4_ApprovalWFGroup_ApTarget`(related_id=自アイテムID)をgetし、1件以上ある(=一括承認WFの対象)なら単数サインオフタブ `h4_MQSingOff1` を非表示、無ければ複数用 `h4_TGVRevQueryMQ` を非表示。h4_ReqDoc の場合は `h4_ReqDoc SingOff1N` / `h4_ReqDoc TGVRevQuery` / `h4_ReqDoc CLN` を同様に制御(3段目アコーディオンのためDOMの `aras-tabs__tab` の style=display:none で非表示)。h4_Test_Result の場合: WF不使用なら `h4_Test_Result SignOff` / `h4_Test_Result CLN` を非表示(テスト結果は一括承認の対象外のためそれ以上処理なし)。タブIDは RelationshipType をname検索して取得。 |
| onload | h4_MQPage_MainFormMin | コメント「マルQアイテムを開いたときに1stアコーディオンを閉じる」。新規作成時(idなし)は何もしない。既存アイテムなら `aras-accordion` の先頭を toggle(true) で閉じる。 |

FormComposite: h4_MQPage (ItemType h4_MQPage と対応づけ)。

### 1.3.2 h4_MQPageInputInitVal (マルQページ初期値入力画面, 460x250, description「SH: マルQページ初期値入力画面」)

ダイアログ型フォーム。HTMLフィールド(input/select)とボタンで構成。

| フィールド名 | 型 | ラベル(ja) | x,y | 備考 |
|---|---|---|---|---|
| h4_frm_Dept | html(input Dept size=10) | 室課 | 10,15 | |
| h4_frm_Gr | html(input Gr size=10) | グループ | 100,15 | |
| h4_frm_Sec | html(input Sec size=10) | セクション | 190,15 | |
| h4_frm_unit | html(input Unit size=15) | 評価単位 | 300,15 | |
| h4_frm_DeltaVersion | html(input size=5) | ⊿バージョン | 10,60 | 初期化時にreadOnly・required |
| h4_frm_my | html(input My size=5) | MY | 80,60 | |
| h4_frm_model_name | html(input ModelName size=15) | 機種呼称 | 150,60 | |
| h4_frm_setModeName | button | 選択 | 285,70 | onclick: h4_frm_set_ModelName |
| h4_frm_event | html(select Event class=event-list) | イベント | 380,60 | |
| h4_frm_model_code | html(input ModelCode size=8) | 機種コード | 490,60 | |
| h4_frm_Destination | html(input Destination size=15) | 仕向け | 10,105 | |
| h4_frm_setDestination | button | 選択 | 140,115 | onclick: h4_setDestinations |
| h4_frm_managed_by_id | html(input Managed_by_id size=15) | 利用者(同室課) | 250,105 | |
| button3 | button | 選択 | 380,115 | onclick: h4_frm_set_Managed_by_id |
| h4_frm_ok | button | OK | 510,115 | onclick: h4_frm_get_value |

フィールドイベント(ボタン→Method)

| ボタン(フィールド) | イベント | Method | インラインJS要約 |
|---|---|---|---|
| h4_frm_setModeName | onclick | h4_frm_set_ModelName | 「機種呼称選択ボタンのクリックイベント」。SearchDialog(itemtypeName='HRDPMTypModelProject', タイトル「Project選択」, 単一選択)を表示し、選択結果の keyed_name を `h4_frm_model_name` に、IDをその要素idに設定。また選択ProjectItemの `iq_model_year` を `h4_frm_my` に設定。 |
| h4_frm_setDestination | onclick | h4_setDestinations | 「イベント設定ダイアログの表示」。フォーム `h4_DATFormat_Input_Init_DestVal`(タイトル「仕向け設定」460x200、ShowFormAsADialog.html)をダイアログ表示し、返却された仕向け値配列を `h4_frm_Destination` に設定。 |
| button3 | onclick | h4_frm_set_Managed_by_id | 「利用者(同室課)選択ボタン」。SearchDialog(itemtypeName='identity', タイトル「利用者(同室課)選択」, 単一選択)を表示し、結果を `h4_frm_managed_by_id` に設定。 |
| h4_frm_ok | onclick | h4_frm_get_value | 「初期値入力画面の設定値の取得」。入力値を取得し検証: 機種呼称空→UserMessage `h4_C_E_0402`、機種コード空→`h4_C_E_0403`、仕向け空→`h4_C_E_0405`、利用者(同室課)空→`h4_C_E_0406`。List `h4_ModelName` の Filter Value で「⊿バージョン⇔機種呼称」の対応が存在するか確認し、無ければ `h4_C_E_0404`。同一 [室課][機種呼称ID][機種コード][イベント](グループ・セクションは未入力ならNULL/空条件)の h4_MQPage が既に存在(event=special は除外)するとき `h4_C_E_0408` を表示。問題なければダイアログを閉じ、`イベントラベル,MY,仕向け(カンマは@へ置換),機種コード,機種呼称,機種呼称ID,利用者ID,評価単位,グループ,セクション` のカンマ区切り文字列を返す。 |

フォームイベント

| イベント | Method | 内容 |
|---|---|---|
| onload | h4_frm_init_setDeltaVersion | 「初期値設定画面の初期化」。`dialogArguments`(deltaVersion, dept, grp, sec, eventValue, eventLabel, selEvent, my, destination, isUseWF, modelName, modelNameId, modelCode, managedById, unit)を受け取り、イベントselectや仕向けselectにoptionを追加、各inputの名前を `h4_frm_*` に付け替えて初期値を設定(⊿バージョンは先頭に「⊿」を付与、required/readOnly設定)。(全137行。先頭約45行確認。以降は同種の初期値反映処理) |

FormComposite: h4_MQPageInputInitVal。

### 1.3.3 h4_uu_ReqDoc DocsInfoForm (ファイル名 h4_ReqDoc DocsInfoForm.xml, 699x105)

| フィールド名 | 型 | ラベル(ja) | 対応プロパティ | x,y |
|---|---|---|---|---|
| h4_custom01 | text | プロパティ名 | h4_custom01 | 0,0 |
| h4_custom02 | text | プロパティ値 | h4_custom02 | 130,0 |
| h4_custom03 | text | データタイプ | h4_custom03 | 260,0 |

フォームイベント: onload → h4_optimize_tab_form_size(コメント「sk：アコーディオンタブフォームサイズ最適化」。トップアコーディオン上に複数タブを表示するレイアウトで、メイン以外のタブの表示領域を調整。現Form IDを `Relationship View` で参照する RelationshipType をAMLで特定し、そのIDで制御対象iFrameを特定、Formの height/width を使用して制御。全63行)。
FormComposite: h4_ReqDoc DocsInfoForm。

### 1.3.4 h4_destination History (699x234)
Bodyのみ。フィールド・イベントなし。

## 1.4 画面定義(cui_Control / cui_WindowSection)

ボタン(cui_CommandBarButton等)の定義はこのパッケージに無く、**画面構成は FormControl と WindowSection のみ**。ボタン→Method対応は 1.3 のForm内フィールドイベントで定義されている。

| cui_WindowSection | location | WindowSectionControl(related cui_Control) |
|---|---|---|
| h4_MQPage | ItemView | ItemView.Form (classification=Data Model) |
| h4_MQPageInputInitVal | ItemView | h4_MQPageInputInitVal |
| h4_ReqDoc DocsInfoForm | ItemView | h4_ReqDoc DocsInfoForm |

| cui_Control | control_type | parent_control | 備考 |
|---|---|---|---|
| h4_MQPageInputInitVal | FormControl | ItemView.FormTab | 追加フィールドなし |
| h4_ReqDoc DocsInfoForm | FormControl | ItemView.FormTab | 追加フィールドなし |
| ItemView.Form | FormControl | ItemView.FormTab | cui_ControlFormField 29件(下記) |

ItemView.Form(MQPage用)のレイアウト(`additional_data` の layout JSON。上から行順、`{}`=行/列セット、`|`=列区切り、`,`=同一列内縦積み):

```
行1: {{h4_dept | h4_group | h4_section} | {h4_class | h4_approval_round}}
行2: {{h4_directaplist | h4_approve_style} | {h4_src_mq_master | h4_approval_group_item}}
行3: {{{h4_delta_version | h4_model_code} | {h4_my | h4_destination} | {h4_model_name | h4_event} | h4_pre_event}}
行4: {{{h4_developmentbase | h4_equipment} | {h4_variations | h4_unique_event} | {h4_evaluation_unit}}}
行5: {{managed_by_id, owned_by_id | h4_test_schedule, h4_deadline | h4_approver, h4_approval_date}}
行6: {h4_note}
```
(列比率: 行1〜2 は3:3:2:1、行5 は 1:1:1:2 など。minWidth=72)

cui_ControlFormField 一覧(全て role=World、全て readonly=1・required=1 を override 指定ではなく `cui_FormField` として定義; field_type)

| データソース(プロパティ) | field_type | | データソース | field_type |
|---|---|---|---|---|
| h4_src_mq_master | item | | h4_directaplist | filterList |
| h4_event | filterList | | h4_unique_event | text |
| h4_destination | filterList および text(2件定義あり) | | h4_equipment | text |
| h4_delta_version | filterList | | h4_variations | text |
| h4_dept | text | | h4_class | filterList |
| h4_pre_event | item | | h4_group | text |
| h4_approve_style | checkbox | | h4_section | text |
| h4_deadline | date | | owned_by_id / managed_by_id | item |
| h4_test_schedule | date | | h4_developmentbase | text |
| h4_approval_round | integer | | h4_evaluation_unit | text |
| h4_approver | item | | h4_my | filterList |
| h4_approval_date | date | | h4_model_name | item |
| h4_approval_group_item | item | | h4_model_code | text |
| h4_note | text | | | |

(注: cui_FormField側の `readonly=1 / required=1 / hidden=0 / disabled=0 / show_label=1 / show_help=1` は全29フィールド共通値で定義されている。)

## 1.5 qry_QueryDefinition: h4_destination History

構造(QueryItem=参照ItemType、alias):

| ref | item_type | alias | 条件(filter_xml) | 選択プロパティ |
|---|---|---|---|---|
| 親(ルート) | h4_MQPage | h4_MQPage | `is_current = 1` | h4_dept, h4_group, h4_delta_version, h4_model_code, h4_my, h4_model_name, h4_destination, h4_section, h4_event |
| 子 | HRDPMTypModelProject | HRDPMTypModelProject | なし | name |

- ソート: h4_MQPage.h4_event **desc**
- 結合(QueryReference): ルート h4_MQPage → HRDPMTypModelProject、条件 `親(h4_MQPage).h4_model_name = HRDPMTypModelProject.id`

## 1.6 rb_TreeGridViewDefinition: h4_destination History

| 項目 | 値 |
|---|---|
| query_definition | h4_destination History |
| max_query_depth / max_child_items | 2 / 100 |

行定義(rb_TreeRowDefinition): 行1=h4_MQPage(親・child)、行2=HRDPMTypModelProject(行1に対する join)

列定義(全てbuilder_method共通、cell_view_type=Text):

| 順 | ヘッダ(ja) | 幅 | テンプレート |
|---|---|---|---|
| 0 | イベント | 309 | `{h4_MQPage.h4_event}`(list_name=`h4_Events for TGV`、data_templateはtype=h4_MQPage, id=INVALID_ID_VALUE) |
| 1 | 室課 | 136 | `{h4_MQPage.h4_dept}` |
| 2 | グループ | 100 | `{h4_MQPage.h4_group}` |
| 3 | セクション | 100 | `{h4_MQPage.h4_section}` |
| 4 | ⊿バージョン | 100 | `{h4_MQPage.h4_delta_version}` |
| 5 | 機種コード | 100 | `{h4_MQPage.h4_model_code}` |
| 6 | MY | 100 | `{h4_MQPage.h4_my}` |
| 7 | 機種呼称 | 100 | `{HRDPMTypModelProject.name}` |
| 8 | 仕向け | 100 | `{h4_MQPage.h4_destination}` |

---

