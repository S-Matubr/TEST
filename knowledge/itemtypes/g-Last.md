<!-- meta
legacy: knowledge/_legacy/機能設計書.md L1851-L2116
source: source/package/Last/Import/
-->
# 5. パッケージ Last (`Last\Import`)

含まれるファイル: Form(6) / ItemType(1) / Property(6) / RelationshipType(10) / h4_MQPage_Tree のデータアイテム(1)
(「Last」= 最後に取り込むパッケージ。他パッケージのItemTypeにプロパティや関係を追加する内容が主。)

## 5.1 ItemType: h4_MQPage_Tree (ラベル ja: マルQページ一覧 / en: MaruQ Page Tree)

| 項目 | 値 |
|---|---|
| name | h4_MQPage_Tree |
| instance_data | H4_MQPAGE_TREE |
| is_versionable | 0 |
| is_relationship / is_dependent | 0 / 0 |
| structure_view | tabs on |
| auto_search / enforce_discovery | 0 / 1 |
| show_parameters_tab | 1 |
| ITPresentationConfiguration | h4_MQPage_Tree_TOC_Configuration (client=js) |
| Can Add | Administrators |
| Allowed Permission | Administrators (既定=1) |

**ItemType "h4_MQPage_Tree" のプロパティ** (ItemType action=add)

| 名前 | ラベル(ja) | ラベル(en) | 型 | 長さ | 必須 | データソース | 既定値 | 読取専用 | Hidden1/2 | 備考 |
|---|---|---|---|---|---|---|---|---|---|---|
| h4_keyname_property | キーネーム用プロパティ | Keyname Property | string | 32 | 0 |  | マルQページ一覧 | 0 | 1/1 | keyed_name_order=1 |



イベント: サーバーイベント/クライアントイベントなし。View: default / role=World。

データアイテム `h4_MQPage_Tree\マルQページ一覧.xml`: `<Item type=h4_MQPage_Tree>` のインスタンス1件、h4_keyname_property=「マルQページ一覧」。

## 5.2 Property(他ItemTypeへのプロパティ追加)

| 対象ItemType(source) | 名前 | ラベル(ja) | 型 | データソース | 必須 | 読取専用 | Hidden1/2 | 備考 |
|---|---|---|---|---|---|---|---|---|
| Document | file_item | 添付ファイル (en: Download File) | item | File | 0 | 0 | 0/0 | item_behavior=float |
| Document | h4_parent_config_id | (ラベルなし) | string(32) | - | 0 | 0 | 1/1 | |
| h4_MQPage | h4_approval_group_item | 一括承認リンク | item | h4_ApprovalWFGroup | 0 | 1 | 0/1 | item_behavior=float |
| h4_Test_Result | h4_parent | 親必要資料 | item | h4_ReqDoc | 0 | 1 | 1/1 | item_behavior=float |
| h4_PointOut | h4_rel_reqdoc | 対象：必要資料 | item | h4_ReqDoc | 0 | 0 | 0/0 | 列幅=240 |
| h4_PointOut | h4_rel_testrsult | 対象：検証結果・根拠 | item | h4_Test_Result | 0 | 0 | 0/0 | |

## 5.3 RelationshipType

**RelationshipType "h4_MQPage CLN"** (ラベル ja=担当者一覧)

- source(親)=h4_MQPage / related(子)=Identity
- behavior=float / related_option=2 / related_notnull=0 / new_show_related=0 / create_related=0 / copy_permissions=0 / auto_search=1 / hide_in_all=0 / is_list_type=0 / inc_rel_key_name=1 / inc_related_key_name=1 / grid_view=right
- リレーションシップ用ItemType: name=h4_MQPage CLN / instance_data=H4_MQPAGE_CLN / label_ja=
- (同ファイル内) View action=delete where=source_id='5EA460A360BE4EC4B68931B5D99C1EC2' (既定のView/Formを削除する指示)
- (同ファイル内) Form action=delete where=name='h4_MQPage CLN' (既定のView/Formを削除する指示)



**ItemType "h4_MQPage CLN" のプロパティ** (ItemType action=add)

| 名前 | ラベル(ja) | ラベル(en) | 型 | 長さ | 必須 | データソース | 既定値 | 読取専用 | Hidden1/2 | 備考 |
|---|---|---|---|---|---|---|---|---|---|---|
| h4_check_required | 必須 |  | boolean |  | 0 |  |  | 0 | 0/0 |  |
| h4_workflow_role | 役割 |  | list | 256 | 1 | h4_Workflow_Role |  | 0 | 0/0 |  |



**ItemType "h4_MQPage CLN" のイベント・付随設定**

その他の付随設定

- ITPresentationConfiguration : client=js, related_id=h4_MQPage CLN_TOC_Configuration
- Item Action : related_id=h4_SubstituteApprover



**RelationshipType "h4_MQPage PointOut"** (ラベル ja=指摘)

- source(親)=h4_MQPage / related(子)=h4_PointOut
- behavior=float / related_option=1 / related_notnull=1 / new_show_related=1 / create_related=0 / copy_permissions=0 / auto_search=1 / hide_in_all=0 / is_list_type=0 / inc_rel_key_name=1 / inc_related_key_name=1 / grid_view=
- リレーションシップ用ItemType: name=h4_MQPage PointOut / instance_data=H4_MQPAGE_POINTOUT / label_ja=
- (同ファイル内) View action=delete where=source_id='57BF4E5D41C34DCDBA1075E36E3B1A9C' (既定のView/Formを削除する指示)
- (同ファイル内) Form action=delete where=name='h4_MQPage PointOut' (既定のView/Formを削除する指示)



**ItemType "h4_MQPage PointOut" のイベント・付随設定**

その他の付随設定

- ITPresentationConfiguration : client=js, related_id=h4_MQPage PointOut_TOC_Configuration



**RelationshipType "h4_MQPage ReqDoc"** (ラベル ja=必要資料一覧)

- source(親)=h4_MQPage / related(子)=h4_ReqDoc
- behavior=float / related_option=2 / related_notnull=1 / new_show_related=1 / create_related=0 / copy_permissions=0 / auto_search=1 / hide_in_all=0 / is_list_type=0 / inc_rel_key_name=1 / inc_related_key_name=1 / grid_view=
- リレーションシップ用ItemType: name=h4_MQPage ReqDoc / instance_data=H4_MQPAGE_REQDOC / label_ja=
- (同ファイル内) View action=delete where=source_id='4A519E2817044835894AF1900EE5AC6A' (既定のView/Formを削除する指示)
- (同ファイル内) Form action=delete where=name='h4_MQPage ReqDoc' (既定のView/Formを削除する指示)



**ItemType "h4_MQPage ReqDoc" のプロパティ** (ItemType action=edit)

| 名前 | ラベル(ja) | ラベル(en) | 型 | 長さ | 必須 | データソース | 既定値 | 読取専用 | Hidden1/2 | 備考 |
|---|---|---|---|---|---|---|---|---|---|---|
| sort_order | 並び順 |  | integer |  | 0 |  |  | 0 | 1/0 | (標準プロパティのedit) |



**ItemType "h4_MQPage ReqDoc" のイベント・付随設定**

サーバーイベント(発火タイミング順。同一イベント内はsort_order順)

| イベント(発火タイミング) | Method | sort_order | is_required |
|---|---|---|---|
| onAfterAdd | h4_ChangeSortOrderOfGI62 | 128 | 0 |

その他の付随設定

- ITPresentationConfiguration : client=js, related_id=h4_MQPage ReqDoc_TOC_Configuration



**RelationshipType "h4_MQPage ReqDocN PointOut"** (ラベル ja=必要資料指摘一覧)

- source(親)=h4_MQPage / related(子)=h4_PointOut
- behavior=float / related_option=0 / related_notnull=1 / new_show_related=0 / create_related=0 / copy_permissions=0 / auto_search=1 / hide_in_all=0 / is_list_type=0 / inc_rel_key_name=1 / inc_related_key_name=1 / grid_view=
- リレーションシップ用ItemType: name=h4_MQPage ReqDocN PointOut / instance_data=H4_MQPAGE_REQDOCN_POINTOUT / label_ja=
- (同ファイル内) View action=delete where=source_id='D97F10F9C16D46DD8ADC74D639E76706' (既定のView/Formを削除する指示)
- (同ファイル内) Form action=delete where=name='h4_MQPage ReqDocN PointOut' (既定のView/Formを削除する指示)



**ItemType "h4_MQPage ReqDocN PointOut" のプロパティ** (ItemType action=edit)

| 名前 | ラベル(ja) | ラベル(en) | 型 | 長さ | 必須 | データソース | 既定値 | 読取専用 | Hidden1/2 | 備考 |
|---|---|---|---|---|---|---|---|---|---|---|
| source_id |  |  | item |  | 0 | h4_MQPage |  | 0 | 0/1 | item_behavior=float; (標準プロパティのedit) |



**ItemType "h4_MQPage ReqDocN PointOut" のイベント・付随設定**

その他の付随設定

- ITPresentationConfiguration : client=js, related_id=h4_MQPage ReqDocN PointOut_TOC_Configuration



**RelationshipType "h4_MQPage Tree Tree"** (ラベル ja=ツリー)

- source(親)=h4_MQPage_Tree / related(子)=(なし: related_idなし=関係先アイテムを持たない)
- behavior=float / related_option=2 / related_notnull=0 / new_show_related=0 / create_related=0 / copy_permissions=0 / auto_search=1 / hide_in_all=0 / is_list_type=0 / inc_rel_key_name=1 / inc_related_key_name=1 / grid_view=
- リレーションシップ用ItemType: name=h4_MQPage Tree Tree / instance_data=H4_MQPAGE_TREE_TREE / label_ja=
- Relationship View : related_id=World, start_page=../../Solutions/h4_Tree/ModTop/index.html



**ItemType "h4_MQPage Tree Tree" のイベント・付随設定**

その他の付随設定

- View : client=js, related_id=h4_MQPage Tree Tree, role=World, show_ssvc=0, type=default



**RelationshipType "h4_MQSingOff1"** (ラベル ja=サインオフ)

- source(親)=h4_MQPage / related(子)=(なし: related_idなし=関係先アイテムを持たない)
- behavior=float / related_option=2 / related_notnull=0 / new_show_related=0 / create_related=0 / copy_permissions=0 / auto_search=1 / hide_in_all=0 / is_list_type=0 / inc_rel_key_name=1 / inc_related_key_name=1 / grid_view=
- リレーションシップ用ItemType: name=h4_MQSingOff1 / instance_data=H4_MQSINGOFF1 / label_ja=
- Relationship View : form=h4_WFSignOffsForMQReqDoc, related_id=World



**ItemType "h4_MQSingOff1" のイベント・付随設定**

その他の付随設定

- View : client=js, related_id=h4_MQSingOff1, role=World, show_ssvc=0, type=default
- View : client=js, related_id=h4_MQSingOff, role=World, show_ssvc=0, type=default



**RelationshipType "h4_MQWijimo"** (ラベル ja=やるやら表)

- source(親)=h4_MQPage / related(子)=(なし: related_idなし=関係先アイテムを持たない)
- behavior=float / related_option=2 / related_notnull=0 / new_show_related=0 / create_related=0 / copy_permissions=0 / auto_search=1 / hide_in_all=0 / is_list_type=0 / inc_rel_key_name=1 / inc_related_key_name=1 / grid_view=
- リレーションシップ用ItemType: name=h4_MQWijimo / instance_data=H4_MQWIJIMO / label_ja=
- Relationship View : related_id=World, start_page=../../Solutions/h4_Table/h4_EventSumTable/html/index.html



**ItemType "h4_MQWijimo" のイベント・付随設定**

その他の付随設定

- View : client=js, related_id=h4_MQWijimo, role=World, show_ssvc=0, type=default



**RelationshipType "h4_TGVMQRDocPointOut"** (ラベル ja=指摘一覧(TGV))

- source(親)=h4_MQPage / related(子)=(なし: related_idなし=関係先アイテムを持たない)
- behavior=float / related_option=2 / related_notnull=0 / new_show_related=0 / create_related=0 / copy_permissions=0 / auto_search=1 / hide_in_all=0 / is_list_type=0 / inc_rel_key_name=1 / inc_related_key_name=1 / grid_view=
- リレーションシップ用ItemType: name=h4_TGVMQRDocPointOut / instance_data=H4_TGVMQRDOCPOINTOUT / label_ja=
- Relationship View : parameters='tgvdId=60E7C2F89A4640CFAF0AED5A674D815A&startConditionProvider=ItemDefault({"id":"id"})', related_id=World, start_page=../Modules/aras.innovator.TreeGridView/Views/MainPage.html



**ItemType "h4_TGVMQRDocPointOut" のイベント・付随設定**

その他の付随設定

- View : client=js, related_id=h4_TGVMQRDocPointOut, role=World, show_ssvc=0, type=default



**RelationshipType "h4_TGVRevQueryMQ"** (ラベル ja=サインオフ)

- source(親)=h4_MQPage / related(子)=(なし: related_idなし=関係先アイテムを持たない)
- behavior=float / related_option=2 / related_notnull=0 / new_show_related=0 / create_related=0 / copy_permissions=0 / auto_search=1 / hide_in_all=0 / is_list_type=0 / inc_rel_key_name=1 / inc_related_key_name=1 / grid_view=
- リレーションシップ用ItemType: name=h4_TGVRevQueryMQ / instance_data=H4_TGVREVQUERYMQ / label_ja=
- Relationship View : parameters='tgvdId=5091CF5756E143CDB42C99872E2D9DFE&startConditionProvider=ItemDefault({"id":"id"})', related_id=World, start_page=../Modules/aras.innovator.TreeGridView/Views/MainPage.html



**ItemType "h4_TGVRevQueryMQ" のイベント・付随設定**

その他の付随設定

- View : client=js, related_id=h4_TGVRevQueryMQ, role=World, show_ssvc=0, type=default



**RelationshipType "h4_AppWFGr4DATFormat PointOut"** (ラベル ja=指摘)

- source(親)=h4_AppWFGroupForDATFormat / related(子)=h4_PointOut
- behavior=float / related_option=1 / related_notnull=1 / new_show_related=1 / create_related=0 / copy_permissions=0 / auto_search=1 / hide_in_all=0 / is_list_type=0 / inc_rel_key_name=1 / inc_related_key_name=1 / grid_view=
- リレーションシップ用ItemType: name=h4_AppWFGr4DATFormat PointOut / instance_data=H4_APPWFGR4DATFORMAT_POINTOUT / label_ja=
- (同ファイル内) View action=delete where=source_id='8D82340E5FA34DCFA32DB99500BA69E5' (既定のView/Formを削除する指示)
- (同ファイル内) Form action=delete where=name='h4_AppWFGr4DATFormat PointOut' (既定のView/Formを削除する指示)



補足
- `h4_MQPage ReqDocN PointOut` は related=h4_PointOut、関係ItemTypeに追加プロパティ `source_id`(item, data_source=h4_MQPage, Hidden1/2=0/1)を持つ。
- `h4_MQPage Tree Tree`(source=h4_MQPage_Tree)は Relationship View の start_page=`../../Solutions/h4_Tree/ModTop/index.html`(Aras標準ページではなくカスタムページ)。`h4_MQWijimo`(やるやら表)は start_page=`../../Solutions/h4_Table/h4_EventSumTable/html/index.html`。
- TGV表示のRelationshipType(`h4_TGVMQRDocPointOut`=指摘一覧(TGV) / `h4_TGVRevQueryMQ`=サインオフ)は Relationship View の parameters で `tgvdId`(TGV定義ID)を指定: `h4_TGVMQRDocPointOut`→`60E7C2F8…`、`h4_TGVRevQueryMQ`→`5091CF57…`。これに対応するTGV定義は WFMap パッケージの `h4_TGVMQRDocPointOut` / `h4_TGVRevQueryMQ`(`_c.md`)。GUID突合までは未確認。
- `h4_MQSingOff1` の Relationship View は Form `h4_WFSignOffsForMQReqDoc`(4.3.2)。`h4_MQSingOff1` は View を2件(Form `h4_MQSingOff1`, `h4_MQSingOff`)持つ。

## 5.4 Form(全てBodyのみ。699x234)

| Form | フィールド | イベント |
|---|---|---|
| h4_MQPage_Tree | なし | onload → `Matsubara_Test`(コメント「アコーディオン最大化状態で表示したい」。フォームロード時に第2アコーディオン(`.aras-accordion` の2番目)が展開されていなければ `expanded` クラスを追加) |
| h4_MQSingOff | なし | なし |
| h4_MQSingOff1 | なし | なし |
| h4_MQWijimo | なし | なし |
| h4_TGVMQRDocPointOut | なし | なし |
| h4_TGVRevQueryMQ | なし | なし |

(これらのFormは RelationshipType の View として参照されるのみ。)



