<!-- meta
legacy: knowledge/_legacy/機能設計書.md L460-L532
source: source/package/AppWFGroupForDATFormat/Import/
-->
## 6. AppWFGroupForDATFormat（ItemType: h4_AppWFGroupForDATFormat「開達実施要領一括承認」）

ファイル: cui_Control/ItemView.Form.xml, cui_WindowSection/h4_AppWFGroupForDATFormat.xml, Form/(h4_AppWFGrForDATFormat CLN, h4_AppWFGrForDATFormat EXPCLN, h4_AppWFGroupForDATFormat), ItemType/h4_AppWFGroupForDATFormat.xml, PresentationConfiguration/(h4_AppWFGr4DATFormat_DATFormatCS, h4_AppWFGrForDATFormatCLNCS, h4_AppWFGrForDATFormatEXPCLNCS, h4_AppWFGroupForDATFormat_TOC_Configuration), RelationshipType/(h4_AppWFGrForDATFormat CLN, h4_AppWFGrForDATFormat EXPCLN, h4_AppWFGrForDATFormat SingOff, h4_TGVWFGDATFormatRevHistory)

### 6.1 基本設定
| 項目 | 値 |
|---|---|
| ラベル | ja: 開達実施要領一括承認（複数形同）, enラベルなし |
| ID | 018E955AA0DC4FAFBDE9BDC651E3188A |
| implementation_type / instance_data | table / H4_APPWFGROUPFORDATFORMAT |
| is_versionable / manual_versioning | 1 / 0 |
| revisions | Default |
| history_template | Default |
| unlock_on_logout | 0 |
| show_parameters_tab | 1 |
| structure_view | tabs on |
| アイコン | ../images/PackageDefinition.svg |
| ライフサイクル | h4_AppWFGroupForDATFormatLC |
| 許可ワークフロー | h4_DATFormatEXPWF（sort256）, h4_DATFormatWF（sort384）（is_default記載なし） |
| 許可アクセス権 | h4_Everyone_Full_Control（is_default=1, sort256） |
| Can Add | World |
| ITPresentationConfiguration | h4_AppWFGroupForDATFormat_TOC_Configuration |
| View | Form h4_AppWFGroupForDATFormat, World, default |

### 6.2 プロパティ表
| 名前 | ラベル(ja) | 型 | 長さ | 必須 | データソース | 既定値 | ソート | その他 |
|---|---|---|---|---|---|---|---|---|
| h4_approvalitemname | 承認項目 | string | 100 | - | - | - | 3456 | keyed_name_order=1 |
| h4_remarks | 備考 | text | - | - | - | - | 3584 | 非表示 |
| h4_state | ステータス | foreign | - | - | current_state → Life Cycle State.label | - | 3712 | - |
| h4_isexp | EXP検定： | boolean | - | - | - | - | 3840 | readonly |
システムプロパティ(edit): managed_by_id(管理者,非表示,896), superseded_date(非表示,3200)。

### 6.3 イベント
サーバー:
| タイミング | Method | sort |
|---|---|---|
| onBeforeGet | h4_sort_control | 128 |
| onAfterAdd | h4_SaveCKAppWFGroup4DATFormat | 200 |
| onAfterAdd | h4_ChangeWfForDATFormatAtAdd | 256 |
| onAfterUpdate | h4_SaveCKAppWFGroup4DATFormat | 300 |
| onAfterUpdate | h4_ReAssignInProgressForDat | 384 |
| onBeforeUpdate | h4_CheckManagedByIdRequired | 640 |
| onAfterPromote | h4_UpdatePointOutPermission | 512 |
クライアント: OnAfterNew → h4_ControlItemCreation（128）。

### 6.4 関係ItemType
| 名前 | ラベル(ja) | source | related | behavior | その他 | sort |
|---|---|---|---|---|---|---|
| h4_AppWFGr4DATFormat DATFormat | 承認対象 | h4_AppWFGroupForDATFormat | h4_DATFormat | float | DATFormatパッケージ側に定義（§1.6） | 128 |
| h4_AppWFGrForDATFormat SingOff | サインオフ | 本ItemType | - | float | Relationship View: Form h4_WFSignOffsForMQReqDoc, World | 200 |
| h4_AppWFGrForDATFormat CLN | 担当者一覧 | 本ItemType | Identity | float | grid_view=right | 256 |
| h4_AppWFGrForDATFormat EXPCLN | 担当者一覧（EXP検定） | 本ItemType | Identity | float | grid_view=right | 384 |
| h4_TGVWFGDATFormatRevHistory | 確認項目一覧 | 本ItemType | - | float | Relationship View: start_page=`../Modules/aras.innovator.TreeGridView/Views/MainPage.html`, parameters=`tgvdId=DDE13B5BC4EE4357A7EF7571DCFC4595&startConditionProvider=ItemDefault({"id":"id"})` | 512 |

### 6.5 Form
- **h4_AppWFGroupForDATFormat**（Responsive, 699x234）: Bodyのみ。Form Event `onload` → Method `h4_ControlTabbarForApWFGr4DAT`（コメント「開達書式の一括の担当者一覧タブの表示制御」）。コード: `parent.relationships` 未生成なら50msリトライ。thisItemの `h4_isexp` を取得し、`"1"` なら `h4_AppWFGrForDATFormat EXPCLN` タブを表示・`h4_AppWFGrForDATFormat CLN` タブを非表示、それ以外は逆。タブIDはRelationshipType名で検索して取得。
- **h4_AppWFGrForDATFormat CLN / EXPCLN**（699x234）: h4_workflow_role(dropdown 役割) / h4_check_required(checkbox 必須)。イベントなし。

### 6.6 画面
- cui_WindowSection h4_AppWFGroupForDATFormat → ItemView.Form(id 16B4FA7F…)。5フィールド: h4_approvalitemname(text), managed_by_id(item), h4_state(multiLingual), h4_remarks(textarea), h4_isexp(checkbox)。レイアウト: Column Set 0 = 承認項目/EXP検定/ステータス、Column Set 3 = managed_by_id、Column Set 1 = h4_remarks。全 readonly=1。

### 6.7 PresentationConfiguration
| 名前 | 参照CommandBarSection (sort) |
|---|---|
| h4_AppWFGr4DATFormat_DATFormatCS | h4_AppWFGr4DATFormat_DATFormatIVRCB (128), h4_AppWFGr4DATFormat_DATFormatIVRGCM (256) |
| h4_AppWFGrForDATFormatCLNCS | h4_AppWFGrForDATFormatCLNIVRCB |
| h4_AppWFGrForDATFormatEXPCLNCS | h4_AppWFGrForDATFormatEXPCLNIVRCB |
| h4_AppWFGroupForDATFormat_TOC_Configuration | h4_AppWFGroupForDATFormat_TOC_Content (128), h4_AppWFGroupForDATFormat_IVICB (128) |
（role=World）。CommandBarSection本体・ボタンは本パッケージに含まれない。

---

