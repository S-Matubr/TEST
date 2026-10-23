<!-- meta
legacy: knowledge/_legacy/機能設計書.md L1023-L1194
source: source/package/PointOut/Import/
-->
# 2. パッケージ PointOut (`PointOut\Import`)

含まれるファイル: cui_Control(1) / cui_WindowSection(1) / Form(1) / ItemType(1) / RelationshipType(2)

## 2.1 ItemType: h4_PointOut (ラベル ja: 指摘 / 複数形 指摘)

### 設定

| 項目 | 値 |
|---|---|
| name | h4_PointOut |
| instance_data | H4_POINTOUT |
| is_versionable | 1 (manual_versioning=0) |
| is_relationship / is_dependent | 0 / 0 |
| structure_view | tabs on |
| default_page_size | 100 |
| auto_search / enforce_discovery | 0 / 1 |
| show_parameters_tab | 1 |
| unlock_on_logout | 0 |
| icon | ../images/DomainAccessControlDefinitionEditor.svg |
| ITPresentationConfiguration | h4_PointOut_TOC_Configulation (client=js) |

### プロパティ・イベント

**ItemType "h4_PointOut" のプロパティ** (ItemType action=add)

| 名前 | ラベル(ja) | ラベル(en) | 型 | 長さ | 必須 | データソース | 既定値 | 読取専用 | Hidden1/2 | 備考 |
|---|---|---|---|---|---|---|---|---|---|---|
| h4_answer_items | 回答事項 |  | text |  | 0 |  |  | 0 | 1/0 |  |
| h4_checked | 確認済 |  | list | 256 | 0 | h4_checkedList |  | 0 | 0/0 | 列幅=60 |
| h4_completed_by | 完了者 |  | item |  | 0 | User |  | 1 | 1/1 | item_behavior=float |
| h4_deadline | 対応期日 |  | date |  | 0 |  |  | 0 | 0/1 |  |
| h4_delta_version | ⊿バージョン |  | list | 256 | 0 | h4_DeltaVersion |  | 0 | 1/1 | 列幅=128 |
| h4_destination | 仕向け | Destination | text |  | 0 |  |  | 1 | 0/1 | keyed_name_order=5 |
| h4_evaluation_unit | 評価単位 |  | string | 256 | 0 |  |  | 1 | 0/0 | keyed_name_order=6 |
| h4_event | イベント |  | filter list | 256 | 0 | h4_Events |  | 1 | 0/1 | keyed_name_order=3; pattern=h4_delta_version |
| h4_indication_date | 指摘日 |  | date |  | 0 |  |  | 0 | 1/1 | 列幅=100 |
| h4_model_name | 機種呼称 |  | item |  | 0 | HRDPMTypModelProject |  | 1 | 0/1 | keyed_name_order=2; item_behavior=float |
| h4_my | MY |  | list | 256 | 0 | h4_ModelYear |  | 1 | 0/1 | keyed_name_order=1 |
| h4_newest_pointout | 最新 |  | item |  | 0 | h4_PointOut |  | 1 | 0/0 | item_behavior=float; 列幅=240 |
| h4_point_number | 指摘No. |  | string | 32 | 0 |  |  | 1 | 0/0 | keyed_name_order=0; 列幅=100 |
| h4_point_sub_number | 枝番 |  | integer |  | 0 |  | 1 | 1 | 0/0 | keyed_name_order=0; 列幅=50 |
| h4_pointer | 指摘者 |  | item |  | 0 | User |  | 0 | 0/0 | item_behavior=float; 列幅=120 |
| h4_points_to_note | 指摘事項 |  | text |  | 0 |  |  | 0 | 1/0 |  |
| h4_rel_appwfgroupfordatformat | 対象：開達実施要領一括承認 |  | item |  | 0 | h4_AppWFGroupForDATFormat |  | 0 | 0/0 | keyed_name_order=7; item_behavior=float; 列幅=240 |
| h4_rel_mq | 対象：マルQ |  | item |  | 0 | h4_MQPage |  | 1 | 0/0 | item_behavior=float; 列幅=240 |
| h4_respondent | 回答者 |  | item |  | 0 | User |  | 0 | 0/0 | item_behavior=float; 列幅=120 |
| h4_response_date | 回答日 |  | date |  | 0 |  |  | 0 | 1/1 | 列幅=100 |
| h4_unique_event | 個別イベント |  | string | 256 | 0 |  |  | 1 | 0/0 | keyed_name_order=4 |
| source_type |  |  | item |  | 0 | ItemType |  | 0 | 1/1 | item_behavior=float |

**ItemType "h4_PointOut" のプロパティ** (ItemType action=edit)

| 名前 | ラベル(ja) | ラベル(en) | 型 | 長さ | 必須 | データソース | 既定値 | 読取専用 | Hidden1/2 | 備考 |
|---|---|---|---|---|---|---|---|---|---|---|
| created_on |  |  | date |  | 1 |  |  | 1 | 1/1 | pattern=short_date_time; 列幅=150; (標準プロパティのedit) |
| managed_by_id | 編集者 | 利用者(同室課) | item |  | 1 | Identity |  | 0 | 1/1 | item_behavior=float; (標準プロパティのedit) |
| modified_by_id |  |  | item |  | 0 | User |  | 1 | 0/1 | item_behavior=float; 列幅=160; (標準プロパティのedit) |
| modified_on |  |  | date |  | 0 |  |  | 1 | 0/1 | pattern=short_date_time; 列幅=150; (標準プロパティのedit) |
| superseded_date |  | Superseded Date | date |  | 0 |  |  | 0 | 1/1 | pattern=short_date_time; (標準プロパティのedit) |



**ItemType "h4_PointOut" のイベント・付随設定**

サーバーイベント(発火タイミング順。同一イベント内はsort_order順)

| イベント(発火タイミング) | Method | sort_order | is_required |
|---|---|---|---|
| onBeforeAdd | h4_CheackWhenSaveAddItem | 16 | 0 |
| onBeforeAdd | h4_SaveCheckPointOut | 20 | 0 |
| onBeforeAdd | h4_SetCompletedByForAdd | 1024 | 0 |
| onBeforeAdd | h4_CheckLockRelationDoc | 1152 | 0 |
| onAfterAdd | h4_CreateNewPointOut | 128 | 0 |
| onAfterAdd | h4_InitSetPermissionAndNo | 1408 | 0 |
| onBeforeUpdate | h4_CreateReqDocPointOut_be | 16 | 0 |
| onBeforeUpdate | h4_CheckValueUnchanged | 32 | 0 |
| onBeforeUpdate | h4_SaveCheckPointOut | 64 | 0 |
| onBeforeUpdate | h4_SetCompletedByForUpdate | 896 | 0 |
| onBeforeUpdate | h4_CheckLockRelationDoc | 1280 | 0 |
| onBeforeUpdate | h4_ReSetPermisson_Before | 2048 | 0 |
| onAfterUpdate | h4_CreateReqDocPointOut_af | 512 | 0 |
| onAfterUpdate | h4_InitSetPermissionAndNo | 1536 | 0 |
| onAfterUpdate | h4_ReSetPermisson_After | 1792 | 0 |
| onBeforeDelete | h4_CheckLockRelationDoc | 1910 | 0 |
| onBeforeDelete | h4_ReSetPermisson_Before | 1920 | 0 |
| onAfterDelete | h4_ReSetPermisson_After | 1664 | 0 |
| onBeforeGet | h4_sort_control | 768 | 0 |

クライアントイベント

| イベント | Method |
|---|---|
| OnAfterNew | h4_setPropToPointOut |

その他の付随設定

- ITPresentationConfiguration : client=js, related_id=h4_PointOut_TOC_Configulation
- View : client=js, related_id=h4_PointOut, role=World, show_ssvc=0, type=default
- Can Add : can_add=1, related_id=World
- Allowed Permission : is_default=1, related_id=h4_PointOut
- Allowed Permission : is_default=0, related_id=h4_Everyone_Full_Control



- 許可パーミッション: h4_PointOut(既定=1)、h4_Everyone_Full_Control(既定=0)。Life Cycle / Allowed Workflow の定義なし(PointOut自体はWF対象として定義されていない)。
- ※プロパティ `h4_rel_reqdoc` / `h4_rel_testrsult` は PointOut 側のImportではなく `Last\Import\Property` でも別途 `add` されている(下記 Last節)。PointOut 側 ItemType の表にある `h4_rel_mq` / `h4_rel_appwfgroupfordatformat` と併せ、「対象：マルQ / 必要資料 / 検証結果・根拠 / 開達実施要領一括承認」への参照プロパティ(いずれも item、float)が揃う。`h4_rel_approvalwfgroup` は cui_Control には登場するが ItemType 定義には無い(コード上に定義なし)。

### 関係ItemType
PointOut を source とする RelationshipType: `h4_PointOut Doc`(関連資料)、`h4_PointOut History`(関連指摘)。下記 2.2。PointOut を related として参照する RelationshipType は `h4_MQPage PointOut`, `h4_ReqDoc PointOut`, `h4_Test_Result_PointOut`, `h4_MQPage ReqDocN PointOut`, `h4_AppWFGr4DATFormat PointOut`(それぞれ Last / ReqDoc / TestResult パッケージ)。

## 2.2 RelationshipType

**RelationshipType "h4_PointOut Doc"** (ラベル ja=関連資料)

- source(親)=h4_PointOut / related(子)=Document
- behavior=float / related_option=2 / related_notnull=0 / new_show_related=0 / create_related=0 / copy_permissions=0 / auto_search=1 / hide_in_all=0 / is_list_type=0 / inc_rel_key_name=1 / inc_related_key_name=1 / grid_view=
- リレーションシップ用ItemType: name=h4_PointOut Doc / instance_data=H4_POINTOUT_DOC / label_ja=
- (同ファイル内) View action=delete where=source_id='8AD1D81160704B1987FCD135E3CD6B3A' (既定のView/Formを削除する指示)
- (同ファイル内) Form action=delete where=name='h4_PointOut Doc' (既定のView/Formを削除する指示)



**ItemType "h4_PointOut Doc" のプロパティ** (ItemType action=add)

| 名前 | ラベル(ja) | ラベル(en) | 型 | 長さ | 必須 | データソース | 既定値 | 読取専用 | Hidden1/2 | 備考 |
|---|---|---|---|---|---|---|---|---|---|---|
| h4_parent_order_no |  |  | integer |  | 0 |  |  | 0 | 1/1 |  |



**RelationshipType "h4_PointOut History"** (ラベル ja=関連指摘)

- source(親)=h4_PointOut / related(子)=h4_PointOut
- behavior=float / related_option=0 / related_notnull=0 / new_show_related=0 / create_related=0 / copy_permissions=0 / auto_search=1 / hide_in_all=0 / is_list_type=0 / inc_rel_key_name=1 / inc_related_key_name=1 / grid_view=
- リレーションシップ用ItemType: name=h4_PointOut History / instance_data=H4_POINTOUT_HISTORY / label_ja=
- (同ファイル内) View action=delete where=source_id='065195251F6647FC8E4247DEA5157EB0' (既定のView/Formを削除する指示)
- (同ファイル内) Form action=delete where=name='h4_PointOut History' (既定のView/Formを削除する指示)



(`h4_PointOut History` はリレーションシップ用ItemType `h4_PointOut History`(instance_data=H4_POINTOUT_HISTORY)に ITPresentationConfiguration `h4_PointOut History_TOC_Configuration` を持つのみ。`h4_PointOut Doc` はリレーションシップ用ItemType に h4_parent_order_no(integer, hidden)を持つ。)

## 2.3 Form: h4_PointOut (classification=Responsive, 699x234)

| フィールド名 | 型 | ラベル(ja) | 対応プロパティ | x,y |
|---|---|---|---|---|
| h4_rel_reqdoc | item | 対象：必要資料 | h4_rel_reqdoc | 190,10 |
| h4_rel_mq | item | 対象：マルQ | h4_rel_mq | 190,60 |

イベント: なし(フォーム/フィールドイベント定義なし)。FormComposite: h4_PointOut。

## 2.4 画面定義

| cui_WindowSection | location | WindowSectionControl |
|---|---|---|
| h4_PointOut | ItemView | ItemView.Form (classification=Data Model) |

cui_Control `ItemView.Form` (FormControl, parent=ItemView.FormTab): ボタン/Method対応の定義はなし。レイアウト:

```
行1: {{h4_point_number | h4_point_sub_number | h4_newest_pointout}}
行2: {h4_rel_mq | h4_rel_reqdoc | h4_rel_testrsult | h4_rel_approvalwfgroup | h4_rel_appwfgroupfordatformat}
行3: {{h4_event | h4_my | h4_destination} | {h4_model_name | h4_unique_event | h4_evaluation_unit}}
行4: {{h4_checked | h4_completed_by}}
行5: {{h4_pointer | h4_indication_date | h4_deadline} | {h4_respondent | h4_response_date | managed_by_id}}
行6: {h4_points_to_note | h4_answer_items}
```

cui_ControlFormField(role=World)の対象プロパティ: h4_pointer, h4_indication_date, h4_points_to_note, h4_deadline, h4_answer_items, h4_response_date, h4_respondent, h4_event, h4_my, h4_point_sub_number, h4_newest_pointout, h4_rel_mq, h4_rel_reqdoc, h4_destination(2件), h4_model_name, h4_point_number, managed_by_id, h4_evaluation_unit, h4_unique_event, h4_checked, h4_rel_testrsult, h4_completed_by, h4_rel_approvalwfgroup, h4_rel_appwfgroupfordatformat (計25件)。


