<!-- meta
legacy: knowledge/_legacy/機能設計書.md L4139-L4502
source: source/package/
-->
# E. Independent パッケージ (h4.01.Independent) 調査結果 (その3: ⑥⑦)

(その1 = `E_independent_a.md`: ①②③ / その2 = `E_independent_b.md`: ④List ⑤Form)

---

## 6. メニュー/ボタン (CommandBar*) の構成と呼出Method

### 6.0 概要

- Aras Innovator の CUI(Configurable UI)定義。構成要素:
  - **CommandBarButton**(ボタン。`on_click_handler`=クリック時に呼ぶMethod、`on_init_handler`=表示初期化時に呼ぶMethod(表示/非表示の制御等に使われる命名のものが多いが、処理内容はMethod側))
  - **CommandBarMenu**(メニュー。ボタン等の入れ物)
  - **CommandBarMenuButton**(メニュー内のボタン、またはTOC(左ツリー)のItemType入口)
  - **CommandBarMenuSeparator / CommandBarSeparator**(区切り線)
  - **CommandBarSection**(`location`=画面上の配置場所に項目を並べる単位。`CommandBarSectionItem` で `Add`/`Remove`/`Replace` する)
  - **PresentationConfiguration**(Section群をまとめたもの。第7章)
- `location` の種類: `TOC`(左のツリー)、`SearchView.CommandBar`(検索画面のコマンドバー)、`ItemView.ItemCommandBar`(アイテム画面のコマンドバー)、`ItemView.RelationshipsCommandBar`(アイテム画面のリレーションシップタブのコマンドバー)、`ItemView.RelationshipsGridContextMenu`(リレーションシップグリッドの右クリックメニュー)、`SearchDialog.CommandBar`(検索ダイアログのコマンドバー)。
- `include_events` はボタンの再初期化(on_init再実行)のトリガとなるイベント名(`UpdateTearOffWindowState` / `UpdateState` / `UpdateProps`)。
- 「標準」項目(`itemview.itemcommandbar.default.save` など `itemview.`/`searchview.` で始まる名前)はAras標準のCommandBarItemで、本パッケージでは Remove/Replace の対象として参照されているだけ(定義は標準側)。

### 6.0.1 全体の構造(要約)

**(a) 左ツリー(TOC)のメニュー構成**

```
h4_toc_menu_HND_SH (CommandBarMenu / ラベル「マルQ」)
├─ 書式・マスタ管理 (CommandBarMenu: com.aras.innovator.cui_default.toc_39E37F4C...)
│    ├─ 開達書式   (MenuButton h4_toc_menu_button_DATFormat)     ← Section h4_DATFormat_TOC_Content (World)
│    ├─ 帳票マスタ (MenuButton h4_toc_menu_button_DATMaster)     ← Section h4_DATMaster_TOC_Content (World)
│    └─ マルQマスタ (MenuButton h4_toc_menu_button_DeptMQMaster) ← Section h4_DeptMQMaster_TOC_Content (World)
├─ 指摘・承認 (CommandBarMenu: com.aras.innovator.cui_default.toc_D89CB8F4...)
│    ├─ 一括承認 (MenuButton ..toc_h4_ApprovalWFGroup_A650B5C8..) ← Section h4_ApprovalWFGroup_TOC_Content (World)
│    └─ 指摘     (MenuButton ..toc_h4_PointOut_CFCEFC54..)        ← Section h4_PointOut_TOC_Content (World)
├─ 開達実施要領一括承認 (MenuButton ..toc_h4_AppWFGroupForDATFormat_8B2E67FD..) ← Section h4_AppWFGroupForDATFormat_TOC_Content (role = h4_DATFormatBulkApplover のみ)
├─ マルQページ一覧 (MenuButton ..toc_h4_MQPage_Tree_A4E0F953.., itemId指定) ← Section h4_MQPage_Tree_TOC_Content の1件目 (World)
├─ 必要資料 (MenuButton ..toc_h4_ReqDoc_A7D38989..)            ← Section h4_ReqDoc_TOC_Content (World)
├─ 検証結果・根拠 (MenuButton ..toc_h4_Test_Result_6FCF4DB2..) ← Section h4_Test_Result_TOC_Content (World)
└─ マルQページ (MenuButton h4_toc_menu_button_MQPage)          ← Section h4_MQPage_TOC_Content (World)

D-JP-DESIGN-BODY_VR001テスト (CommandBarMenu / 親メニューなし)
└─ マルQページツリー (MenuButton ..toc_h4_MQPage_Tree_C09123CA..) ← Section h4_MQPage_Tree_TOC_Content の2件目 (role = Administrators のみ)
```

(TOC項目は `additional_data` の `itemTypeId`(一部 `itemId`)でItemTypeを指定。XML上はIDのみでItemType名は書かれていない。MenuButton名から推測した対応: ApprovalWFGroup=`DD0E19C0...`、AppWFGroupForDATFormat=`018E955A...`、MQPage Tree=`F93F069B...`、PointOut=`F4038554...`、ReqDoc=`D014A8C8...`、Test_Result=`984B394A...`、DATFormat=`A13E2920...`、DATMaster=`95C9A38F...`、DeptMQMaster=`B8AEEFB5...`、MQPage=`EC17A836...`)

**(b) ボタン/メニューのグループ構成(メニューの親子と呼出Method)**

| メニュー(CommandBarMenu) | 配置される場所(Section) | メニュー内ボタン → on_click Method |
|---|---|---|
| h4_MaruQMenu(ラベル「MaruQ」) | h4_MQPage_IVICB (アイテム画面) | Create(`h4_svcb_create_MQPage`) / EventUp(`h4_MQPage_ivicb_event_up`) / Copy(`h4_MQPage_ivicb_copy`) |
| h4_MaruQPageMenu(「マルQページ」、親=標準の「その他」メニュー `itemview.itemcommandbar.default.more`) | (標準Moreメニュー配下。本パッケージのSectionItemには未登場) | 複製(`h4_MQPage_ivicb_copy`) / 新規作成(`h4_svcb_create_MQPage`) / イベントUP(`h4_MQPage_ivicb_event_up`) |
| h4_svcb_MaruQPage(「MaruQ」) | h4_MQPage_SVCB (検索画面) | Gr・室課用作成(`h4_MQPage_svcb_deptmaruq_create`) / Copy(`h4_MQPage_ivicb_copy`) / Create(`h4_svcb_create_MQPage`) / EventUp(`h4_MQPage_ivicb_event_up`) |
| h4_IVICB_WFActions | h4_MQPage_IVICB, h4_ReqDoc_IVICB, h4_Test_Result_IVICB | ステータス変更 `h4_DirectApp`(`h4_DirectPromote_click`) |
| h4_SVCB_WFActions | h4_MQPage_SVCB | 一括WF作成 `h4_SVCB_MultiWFStart`(`h4_Create_ApWFG_from_MQP_SV`) |
| h4_ReqDoc_IVRCB_WFActions | h4_MQPage ReqDoc_IVRCB (MQPageのリレーション「必要資料」) | 一括ステータス変更(`h4_MultiDirectApprove`) / 区切り線 / 一括WF作成(`h4_ivrcb_MultiWFStart`) / 担当者一括設定(`h4_SetReqDocCLN`) / 差し戻し(仮)(ハンドラなし) |
| h4_ReqDoc_SVCB_WFActions | h4_ReqDoc_SVCB | 一括WF作成(`h4_Create_ApWFG_from_ReqDoc_SV`) |
| h4_DATFormat_SVCB_WFActions | h4_DATFormat_SVCB | 一括WF作成(`h4_DATFormatSVCB_MultiWFStart`) |
| h4_DATMaster_IVRCB_WFActions | h4_DATMaster DATFormat_IVRCB | 一括WF作成(`h4_DATFormatIRVCB_MultiWFStart`) |
| h4_DATMaster_IVICB_MasterMenu / h4_DATMaster_SVCB_MasterMenu(MasterMenu) | h4_DATMaster_IVICB / h4_DATMaster_SVCB | IVICB: Copy(`h4_DATMaster_ivicb_copy`) / 改訂(`h4_CreateRevisio`)。SVCB: Copy(`h4_DATMaster_svcb_copy`) / Create(標準 command_alias=OpenNewItem) |
| h4_MQMaster_IVICB_MasterMenu / h4_MQMaster_SVCB_MasterMenu(MasterMenu) | h4_DeptMQMaste_IVICB / h4_DeptMQMaster_SVCB | IVICB: Copy(`h4_MQMaster_ivicb_copy`)。SVCB: Copy(`h4_MQMaster_svcb_copy`) / マルQマスタ作成(`h4_svcb_create_deptMQMaster`) |

(上表の「メニュー内ボタン」は MenuButton の `parent_menu` による親子関係。`h4_DirectApp` は Section `h4_MQPage_IVICB` 等でも直接 Add されている。)

**(c) アイテム画面の標準 保存/完了/破棄/更新ボタンの置換(Replace)**

標準の `itemview.itemcommandbar.default.save` / `.done` / `.discard` / `.refresh` を、本パッケージ独自ボタンに置き換えている(Section の `Replace`)。

| 対象Section | 標準 save → | 標準 done → | 標準 discard → | 標準 refresh → |
|---|---|---|---|---|
| h4_ApprovalWFGroup_IVICB / h4_AppWFGroupForDATFormat_IVICB / h4_MQPage_IVICB / h4_ReqDoc_IVICB / h4_Test_Result_IVICB | h4_IVSave(`h4_ItemViewSave`) | h4_IVDone(`h4_ItemViewDone`) | - | - |
| h4_DATFormat_IVICB | h4_IVSaveForDAT(`h4_ItemViewSaveForDAT`) | h4_IVDoneForDAT(`h4_ItemViewDoneForDAT`) | - | - |
| h4_DATMaster_IVICB | h4_IVSaveForDAT | h4_IVDoneForDAT | h4_Table_Discard(`h4_Table_DiscardCli`) | h4_Table_Refresh(`h4_Table_RefreshCli`) |
| h4_DeptMQMaster_Change | h4_Table_Save(`h4_Table_SaveCli`) | h4_Table_Done(`h4_Table_DoneCli`) | h4_Table_Discard | h4_Table_Refresh |
| h4_MQPage_Change | - | - | - | h4_Table_Refresh |
| h4_MQPage_Tree_Change | - | - | - | h4_Tree_Refresh(`h4_Tree_RefreshCli`) |

(置換先はXML上 `alternate` のID。同一IDを持つCommandBarButton(`h4_IVSave` 等)のファイルで解決した。)

### 6.0.2 各画面の「標準ボタンの Remove」

Section の `Remove` は、標準の「新規(`searchview.commandbar.default.new`)」「他のアイテムから作成(`itemview.itemcommandbar.default.more.createnew`)」「リレーションシップの行追加/新規/削除/選択(`itemview.relationshipcommandbar.addrow`, `itemview.relationshipscommandbar.create_item`, `itemview.relationshipscommandbar.default.deleterow`, `...default.selectitems`)」「行コンテキストメニュー項目(`itemview.relationshipsrowcontextmenu.default.replace`)」を隠すために使われている。どのSectionがどれをRemoveしているかは 6.5 の表を参照。

### 6.1〜6.5 詳細(XMLから自動抽出)

#### 6.1 CommandBarButton (32件)

| name | ラベル(ja) | on_click_handler(Method) | on_init_handler(Method) | include_events | command_alias | image | tooltip(ja) | additional_data |
|---|---|---|---|---|---|---|---|---|
| h4_CreateRelationRevisionHistory | 関連改訂履歴作成 | `h4_RevisionHistory_ivicb_copy` | `h4_RevisionHistory_ivicb_init` | UpdateTearOffWindowState |  |  |  |  |
| h4_DATFormat_IVICB_Add_Events | イベント設定 | `h4_setEvents` | `h4_init_ivicb_add_events` | UpdateTearOffWindowState,UpdateState |  | ../images/Comment.svg |  |  |
| h4_DATFormatRevise | 改訂 | `h4_CreateRevisio` | `h4_DATReviseInit` | UpdateTearOffWindowState |  | ../images/UpArrow.svg |  |  |
| h4_DATHistRelIVCBNewItem |  | `cui_ivrcb_create_item_click` | `h4_DATHistIvrcbCreateInit` | UpdateTearOffWindowState |  | ../images/CreateRelatedItem.svg | 新規{0}を追加 |  |
| h4_DATHistRelIVCBRowDell |  | `cui_ivrcb_deleterow_click` | `h4_DATHistIvrcbDellInit` | UpdateTearOffWindowState |  | ../images/DeleteRow.svg | {0}を削除 |  |
| h4_DATMaster DATFormat_IVRCB_Add_Events | イベント設定 | `h4_setRelEvents` | `h4_init_ivrcb_add_events` | UpdateTearOffWindowState,UpdateState |  | ../images/Comment.svg |  |  |
| h4_DMQMaster DATFormat_IVRCB_Add_Events | イベント設定 | `h4_setRelEvents` | `h4_init_ivrcb_add_events` | UpdateTearOffWindowState,UpdateState |  | ../images/Comment.svg |  |  |
| h4_IVDone | 完了 | `h4_ItemViewDone` | `cui_hideitem_if_notsaveable` | UpdateTearOffWindowState |  | ../images/DoneWhite.svg | Done Editing | {"cssClass":"aras-button_primary"} |
| h4_IVDoneForDAT | 完了 | `h4_ItemViewDoneForDAT` | `cui_hideitem_if_notsaveable` | UpdateTearOffWindowState |  | ../images/DoneWhite.svg | Done Editing | {"cssClass":"aras-button_primary"} |
| h4_IVICB_ChangeAccessRange | 公開範囲変更 | `h4_IVICB_ChangeAccessRange` | `h4_IVICB_ChangeAccessRange_init` |  |  |  |  |  |
| h4_IVICB_ChangeYryr | やるやら変更 | `h4_start_change_yryr` | `h4_change_yryr_init` | UpdateTearOffWindowState |  |  |  |  |
| h4_ivrcb_directCreateHistory |  | `h4_ivrcb_directCreateHistory` | `h4_ivrcb_directCreateHistory_ini` | UpdateTearOffWindowState |  | ../images/CreateRelatedItem.svg | 新規{0}を追加 |  |
| h4_ivrcb_directDeleterow |  | `h4_ivrcb_directDeleterow` | `h4_ivrcb_directDeleterow_init` | UpdateTearOffWindowState |  | ../images/DeleteRow.svg | {0}を削除 |  |
| h4_IVSave | 保存 | `h4_ItemViewSave` | `cui_hideitem_if_notsaveable` | UpdateTearOffWindowState | System.Xml.XmlElement | ../images/Save.svg | Save | {"cssClass":"aras-button_primary-light"} |
| h4_IVSaveForDAT | 保存 | `h4_ItemViewSaveForDAT` | `cui_hideitem_if_notsaveable` | UpdateTearOffWindowState | System.Xml.XmlElement | ../images/Save.svg | Save | {"cssClass":"aras-button_primary-light"} |
| h4_MQMaster_SelEvent | イベント設定 |  |  |  |  |  |  |  |
| h4_MQPage_Auto_Event_up | マルQページ：イベントUP | `h4_MQPage_ivicb_event_up` | `h4_MQPage_ivicb_auto_event_init` | UpdateState |  |  |  |  |
| h4_MQPage_Copy | マルQページ：複製 | `h4_MQPage_ivicb_copy` | `h4_MQPage_ivicb_auto_event_init` | UpdateState |  |  |  |  |
| h4_MQPage_New_Create | マルQページ：作成 | `h4_svcb_create_MQPage` |  |  |  |  |  |  |
| h4_MQPage_PointOut_Create | 関連指摘作成 | `h4_PointOut_ivicb_copy` | `h4_PointOut_ivicb_init` | UpdateTearOffWindowState |  |  |  |  |
| h4_MQPage_Withdraw_Ap |  |  |  |  |  |  |  |  |
| h4_SelectCheckBoxes | 開発拠点・仕向設定 | `h4_setDevBaseAndDestination` | `h4_init_ivicb_add_CheckList` | UpdateTearOffWindowState |  |  |  |  |
| h4_SelectDestination | 仕向け設定 | `h4_setDestination` | `h4_init_ivicb_add_CheckList` | UpdateTearOffWindowState |  |  |  |  |
| h4_ShowIdentityMembers | メンバー一覧表示 | `h4_ShowIdentityMembers_click` |  |  |  | ../images/Team.svg |  |  |
| h4_SVCB_ChangeAccessRange | 公開範囲変更 | `h4_SVCB_ChangeAccessRange` | `h4_SVCB_ChangeAccessRange_init` | UpdateState |  |  |  |  |
| h4_uu_svcb_create_deptMQMaster | マルQマスタ作成 | `h4_svcb_create_deptMQMaster` |  |  |  |  |  |  |
| h4_svcb_create_MQPage | マルQページ作成 | `h4_svcb_create_MQPage` |  |  |  |  |  |  |
| h4_Table_Discard | 破棄 | `h4_Table_DiscardCli` | `cui_hideitem_ifnotunlockable` | UpdateTearOffWindowState | System.Xml.XmlElement |  | 変更を破棄 | {"cssClass": "aras-button_secondary"} |
| h4_Table_Done | 完了 | `h4_Table_DoneCli` | `cui_hideitem_if_notsaveable` | UpdateTearOffWindowState |  | ../images/Apply.svg | 編集完了 | {"cssClass":"aras-button_primary"} |
| h4_Table_Refresh |  | `h4_Table_RefreshCli` | `hideButtonIfItemIsNew` | UpdateTearOffWindowState |  | ../images/Refresh.svg | Refresh |  |
| h4_Table_Save | 保存 | `h4_Table_SaveCli` | `cui_hideitem_if_notsaveable` | UpdateTearOffWindowState | System.Xml.XmlElement | ../images/Save.svg | 保存 | {"cssClass":"aras-button_primary-light"} |
| h4_Tree_Refresh |  | `h4_Tree_RefreshCli` | `hideButtonIfItemIsNew` | UpdateTearOffWindowState |  | ../images/Refresh.svg |  |  |

#### 6.2 CommandBarMenu (18件)

| name | ラベル(ja) | parent_menu | on_init_handler(Method) | include_events | image |
|---|---|---|---|---|---|
| com.aras.innovator.cui_default.toc_39E37F4C9B014DAA8A17600842A489EC | 書式・マスタ管理 | h4_toc_menu_HND_SH |  |  |  |
| com.aras.innovator.cui_default.toc_D89CB8F4836440ED8B201B9B1447E80C | 指摘・承認 | h4_toc_menu_HND_SH |  |  |  |
| com.aras.innovator.cui_default.toc_D-JP-DESIGN-BODY_VR001テスト | D-JP-DESIGN-BODY_VR001テスト |  |  |  |  |
| h4_DATFormat_SVCB_WFActions |  |  |  | UpdateTearOffWindowState | ../images/WorkflowMap.svg |
| h4_DATMaster_IVICB_MasterMenu | MasterMenu |  |  |  | ../images/XMLSchema.svg |
| h4_DATMaster_IVRCB_WFActions |  |  | `h4_DATMasterIVRCB_WFActionsInit` | UpdateTearOffWindowState | ../images/WorkflowMap.svg |
| h4_DATMaster_SVCB_MasterMenu | MasterMenu |  |  | UpdateState | ../images/XMLSchema.svg |
| h4_IVICB_WFActions |  |  | `h4_IVICB_WFActions_init` | UpdateTearOffWindowState | ../images/WorkflowMap.svg |
| h4_LinkURLOpen | 開達書式のリンクURLを開く |  |  |  |  |
| h4_MaruQMenu | MaruQ |  |  |  | ../images/XMLSchema.svg |
| h4_MaruQPageMenu | マルQページ | itemview.itemcommandbar.default.more |  |  |  |
| h4_MQMaster_IVICB_MasterMenu | MasterMenu |  |  | UpdateState | ../images/XMLSchema.svg |
| h4_MQMaster_SVCB_MasterMenu | MasterMenu |  |  | UpdateState | ../images/XMLSchema.svg |
| h4_ReqDoc_IVRCB_WFActions |  |  |  | UpdateState | ../images/WorkflowMapPath.svg |
| h4_ReqDoc_SVCB_WFActions |  |  |  |  | ../images/WorkflowMap.svg |
| h4_svcb_MaruQPage | MaruQ |  |  | UpdateState | ../images/XMLSchema.svg |
| h4_SVCB_WFActions |  |  |  |  | ../images/WorkflowMap.svg |
| h4_toc_menu_HND_SH | マルQ |  |  |  |  |

#### 6.3 CommandBarMenuButton (37件)

| name | ラベル(ja) | parent_menu | on_click_handler(Method) | on_init_handler(Method) | include_events | additional_data(対象ItemType等) |
|---|---|---|---|---|---|---|
| com.aras.innovator.cui_default.toc_h4_ApprovalWFGroup_A650B5C8064B42FE8E14E6D67E792E3E | 一括承認 | com.aras.innovator.cui_default.toc_D89CB8F4836440ED8B201B9B1447E80C |  |  |  | {"itemTypeId":"DD0E19C0D9DE43E986F27A243FBD2298"} |
| com.aras.innovator.cui_default.toc_h4_AppWFGroupForDATFormat_8B2E67FD255D427FBCFF2E5A8C602238 | 開達実施要領一括承認 | h4_toc_menu_HND_SH |  |  |  | {"itemTypeId":"018E955AA0DC4FAFBDE9BDC651E3188A"} |
| com.aras.innovator.cui_default.toc_h4_MQPage_Tree_A4E0F953018443E6AC3037077F66EB51 | マルQページ一覧 | h4_toc_menu_HND_SH |  |  |  | {"itemId":"C339FB6F1F21488E8551F7CDB3BF5147","itemTypeId":"F93F069B28D44478A7273C27C4645B87"} |
| com.aras.innovator.cui_default.toc_h4_MQPage_Tree_C09123CAAFDA40E8B0F7C2CC5DA132B4 | マルQページツリー | com.aras.innovator.cui_default.toc_D-JP-DESIGN-BODY_VR001テスト |  |  |  | {"itemTypeId":"F93F069B28D44478A7273C27C4645B87"} |
| com.aras.innovator.cui_default.toc_h4_PointOut_CFCEFC54C836496AA9DD1A39697AE5A7 | 指摘 | com.aras.innovator.cui_default.toc_D89CB8F4836440ED8B201B9B1447E80C |  |  |  | {"itemTypeId":"F4038554979841FD9C6A139C634710CF"} |
| com.aras.innovator.cui_default.toc_h4_ReqDoc_A7D3898977784DBDBF50BC87B5854056 | 必要資料 | h4_toc_menu_HND_SH |  |  |  | {"itemTypeId":"D014A8C89FAF461FB45AC076BEE4B2E4"} |
| com.aras.innovator.cui_default.toc_h4_Test_Result_6FCF4DB203754F9EB2FDB3F3C66BE76C | 検証結果・根拠 | h4_toc_menu_HND_SH |  |  |  | {"itemTypeId":"984B394A7FF14AD8B3E11EE939283344"} |
| h4_DATFormat_SVCB_MultiWFStart | 一括WF作成 | h4_DATFormat_SVCB_WFActions | `h4_DATFormatSVCB_MultiWFStart` |  | UpdateTearOffWindowState |  |
| h4_DATMaster_IVICB_Copy | Copy | h4_DATMaster_IVICB_MasterMenu | `h4_DATMaster_ivicb_copy` | `h4_cui_ivicb_copy_init` | UpdateState |  |
| h4_DATMaster_IVICB_Revise | 改訂 | h4_DATMaster_IVICB_MasterMenu | `h4_CreateRevisio` | `h4_DATReviseInit` |  |  |
| h4_DATMaster_IVRCB_MultiWFStart | 一括WF作成 | h4_DATMaster_IVRCB_WFActions | `h4_DATFormatIRVCB_MultiWFStart` |  | UpdateTearOffWindowState |  |
| h4_DATMaster_SVCB_Copy | Copy | h4_DATMaster_SVCB_MasterMenu | `h4_DATMaster_svcb_copy` | `h4_cui_svcb_copy_init` | UpdateState |  |
| h4_DATMaster_SVCB_Create | Create | h4_DATMaster_SVCB_MasterMenu |  |  |  |  |
| h4_DirectApp | ステータス変更 | h4_IVICB_WFActions | `h4_DirectPromote_click` |  |  |  |
| h4_MaruQCopy | Copy | h4_MaruQMenu | `h4_MQPage_ivicb_copy` | `cui_ivicb_more_new_init` | UpdateTearOffWindowState |  |
| h4_MaruQCreate | Create | h4_MaruQMenu | `h4_svcb_create_MQPage` | `cui_ivicb_more_new_init` | UpdateProps |  |
| h4_MaruQEventUp | EventUp | h4_MaruQMenu | `h4_MQPage_ivicb_event_up` | `h4_cui_ivicb_auto_event_init` | UpdateTearOffWindowState,UpdateState,UpdateProps |  |
| h4_MaruQPageCopy | 複製 | h4_MaruQPageMenu | `h4_MQPage_ivicb_copy` | `h4_cui_ivicb_auto_event_init` | UpdateTearOffWindowState |  |
| h4_MaruQPageCreate | 新規作成 | h4_MaruQPageMenu | `h4_svcb_create_MQPage` | `cui_ivicb_more_new_init` | UpdateProps |  |
| h4_MaruQPageEventUp | イベントUP | h4_MaruQPageMenu | `h4_MQPage_ivicb_event_up` | `h4_cui_ivicb_auto_event_init` | UpdateTearOffWindowState |  |
| h4_MQMaster_IVICB_Copy | Copy | h4_MQMaster_IVICB_MasterMenu | `h4_MQMaster_ivicb_copy` | `h4_cui_ivicb_MQMasterCopy_init` | UpdateState |  |
| h4_MQMaster_SVCB_Copy | Copy | h4_MQMaster_SVCB_MasterMenu | `h4_MQMaster_svcb_copy` | `h4_cui_svcb_MQMasterCopy_init` | UpdateState |  |
| h4_MQMaster_SVCB_Create | マルQマスタ作成 | h4_MQMaster_SVCB_MasterMenu | `h4_svcb_create_deptMQMaster` |  |  |  |
| h4_ReqDoc_IVRCB_DirectApp | 一括ステータス変更 | h4_ReqDoc_IVRCB_WFActions | `h4_MultiDirectApprove` | `h4_ReqDoc_IVRCB_DirectApp_init` | UpdateTearOffWindowState |  |
| h4_ReqDoc_IVRCB_MultiWFStart | 一括WF作成 | h4_ReqDoc_IVRCB_WFActions | `h4_ivrcb_MultiWFStart` | `h4_ReqDoc_ivrcb_MultiWFStart_ini` | UpdateTearOffWindowState |  |
| h4_ReqDoc_IVRCB_SetReqDocCLN | 担当者一括設定 | h4_ReqDoc_IVRCB_WFActions | `h4_SetReqDocCLN` | `h4_cui_ivrcb_SetReqDocCLN_init` | UpdateState |  |
| h4_ReqDoc_IVRCB_WFReject | 差し戻し(仮) | h4_ReqDoc_IVRCB_WFActions |  |  |  |  |
| h4_ReqDoc_SVCB_MultiWFStart | 一括WF作成 | h4_ReqDoc_SVCB_WFActions | `h4_Create_ApWFG_from_ReqDoc_SV` |  |  |  |
| h4_svcb_DeptMaruQCreate | Gr・室課用作成 | h4_svcb_MaruQPage | `h4_MQPage_svcb_deptmaruq_create` | `h4_cui_svcb_deptmaruqcreat_init` | UpdateState |  |
| h4_svcb_MQPage_Copy | Copy | h4_svcb_MaruQPage | `h4_MQPage_ivicb_copy` |  |  |  |
| h4_svcb_MQPage_Create | Create | h4_svcb_MaruQPage | `h4_svcb_create_MQPage` |  |  |  |
| h4_svcb_MQPage_EventUp | EventUp | h4_svcb_MaruQPage | `h4_MQPage_ivicb_event_up` | `h4_cui_svcb_auto_event_init` | UpdateState |  |
| h4_SVCB_MultiWFStart | 一括WF作成 | h4_SVCB_WFActions | `h4_Create_ApWFG_from_MQP_SV` |  |  |  |
| h4_toc_menu_button_DATFormat | 開達書式 | com.aras.innovator.cui_default.toc_39E37F4C9B014DAA8A17600842A489EC |  |  |  | {"itemTypeId":"A13E2920E0A2442286CFA172EE076880"} |
| h4_toc_menu_button_DATMaster | 帳票マスタ | com.aras.innovator.cui_default.toc_39E37F4C9B014DAA8A17600842A489EC |  |  |  | {"itemTypeId":"95C9A38FE49C46B5A5656226665D2EBC"} |
| h4_toc_menu_button_DeptMQMaster | マルQマスタ | com.aras.innovator.cui_default.toc_39E37F4C9B014DAA8A17600842A489EC |  |  |  | {"itemTypeId":"B8AEEFB599DB4EC2A4067C036DC3C0C3"} |
| h4_toc_menu_button_MQPage | マルQページ | h4_toc_menu_HND_SH |  |  |  | {"itemTypeId":"EC17A836496248498BC080344F060619"} |

#### 6.4 CommandBarMenuSeparator / CommandBarSeparator

- CommandBarMenuSeparator : `h4_ReqDoc_IVRCB_Separator1` (parent_menu: h4_ReqDoc_IVRCB_WFActions)
- CommandBarSeparator : `h4_ShowIdentityMembers_separator` (parent_menu: なし)

#### 6.5 CommandBarSection (65件) と所属するCommandBarSectionItem

action: Add=項目追加 / Remove=標準項目の非表示 / Replace=標準項目をalternate項目に置換。role は全て記載の通り。

| Section名 | 配置場所(location) | 項目(related_id) | action | 置換先(alternate) | role | sort_order |
|---|---|---|---|---|---|---|
| h4_ApprovalWFGroup CLN_IVRCB | ItemView.RelationshipsCommandBar | itemview.relationshipscommandbar.create_item | Remove |  | World | 128 |
|  |  | itemview.relationshipcommandbar.addrow | Remove |  | World | 512 |
| h4_ApprovalWFGroup_ApTarget_IVRCB | ItemView.RelationshipsCommandBar | itemview.relationshipcommandbar.addrow | Remove |  | World | 256 |
|  |  | itemview.relationshipscommandbar.create_item | Remove |  | World | 512 |
| h4_ApprovalWFGroup_ApTarget_IVRGCM | ItemView.RelationshipsGridContextMenu | itemview.relationshipsrowcontextmenu.default.replace | Remove |  | World | 128 |
| h4_ApprovalWFGroup_IVICB | ItemView.ItemCommandBar | itemview.itemcommandbar.default.save | Replace | h4_IVSave | World | 1 |
|  |  | itemview.itemcommandbar.default.done | Replace | h4_IVDone | World | 2 |
|  |  | itemview.itemcommandbar.default.more.createnew | Remove |  | World | 90266 |
|  |  | h4_SelectDestination | Add |  | World | 90394 |
| h4_ApprovalWFGroup_SVCB | SearchView.CommandBar | searchview.commandbar.default.new | Remove |  | World | 128 |
| h4_ApprovalWFGroup_TOC_Content | TOC | com.aras.innovator.cui_default.toc_h4_ApprovalWFGroup_A650B5C8064B42FE8E14E6D67E792E3E | Add |  | World | 128 |
| h4_AppWFGr4DATFormat_DATFormatIVRCB | ItemView.RelationshipsCommandBar | itemview.relationshipcommandbar.addrow | Remove |  | World | 128 |
|  |  | itemview.relationshipscommandbar.create_item | Remove |  | World | 256 |
| h4_AppWFGr4DATFormat_DATFormatIVRGCM | ItemView.RelationshipsGridContextMenu | itemview.relationshipsrowcontextmenu.default.replace | Remove |  | World | 128 |
| h4_AppWFGrForDATFormatCLNIVRCB | ItemView.RelationshipsCommandBar | itemview.relationshipscommandbar.create_item | Remove |  | World | 128 |
| h4_AppWFGrForDATFormatEXPCLNIVRCB | ItemView.RelationshipsCommandBar | itemview.relationshipscommandbar.create_item | Remove |  | World | 128 |
| h4_AppWFGroupForDATFormat_IVICB | ItemView.ItemCommandBar | itemview.itemcommandbar.default.save | Replace | h4_IVSave | World | 1 |
|  |  | itemview.itemcommandbar.default.done | Replace | h4_IVDone | World | 2 |
|  |  | itemview.itemcommandbar.default.more.createnew | Remove |  | World | 90266 |
| h4_AppWFGroupForDATFormat_TOC_Content | TOC | com.aras.innovator.cui_default.toc_h4_AppWFGroupForDATFormat_8B2E67FD255D427FBCFF2E5A8C602238 | Add |  | h4_DATFormatBulkApplover | 384 |
| h4_DATFormat Doc_IVRCB | ItemView.RelationshipsCommandBar | itemview.relationshipcommandbar.addrow | Remove |  | World | 256 |
| h4_DATFormat RevisionHistoryIVRCB | ItemView.RelationshipsCommandBar | itemview.relationshipcommandbar.addrow | Remove |  | World | 128 |
|  |  | itemview.relationshipscommandbar.default.selectitems | Remove |  | World | 256 |
|  |  | itemview.relationshipscommandbar.create_item | Replace | h4_DATHistRelIVCBNewItem | World | 384 |
|  |  | itemview.relationshipscommandbar.default.deleterow | Replace | h4_DATHistRelIVCBRowDell | World | 512 |
|  |  | h4_ivrcb_directCreateHistory | Add |  | World | 520 |
|  |  | h4_ivrcb_directDeleterow | Add |  | World | 524 |
| h4_DATFormat_IVICB | ItemView.ItemCommandBar | itemview.itemcommandbar.default.save | Replace | h4_IVSaveForDAT | World | 1 |
|  |  | itemview.itemcommandbar.default.done | Replace | h4_IVDoneForDAT | World | 2 |
|  |  | h4_DATFormat_IVICB_Add_Events | Add |  | World | 90010 |
|  |  | h4_DATFormatRevise | Add |  | World | 90138 |
|  |  | itemview.itemcommandbar.default.more.createnew | Remove |  | World | 90266 |
| h4_DATFormat_SVCB | SearchView.CommandBar | searchview.commandbar.default.new | Remove |  | World | 128 |
|  |  | h4_DATFormat_SVCB_WFActions | Add |  | World | 10000 |
|  |  | h4_DATFormat_SVCB_MultiWFStart | Add |  | World | 10010 |
| h4_DATFormat_TOC_Content | TOC | h4_toc_menu_button_DATFormat | Add |  | World | 128 |
| h4_DATFormatCLNIVRCB | ItemView.RelationshipsCommandBar | itemview.relationshipscommandbar.create_item | Remove |  | World | 128 |
| h4_DATFormatEXPCLNIVRCB | ItemView.RelationshipsCommandBar | itemview.relationshipscommandbar.create_item | Remove |  | World | 128 |
| h4_DATFormatLink_IVRGCM | ItemView.RelationshipsGridContextMenu | h4_LinkURLOpen | Add |  | World | 128 |
| h4_DATMaster DATFormat_IVRCB | ItemView.RelationshipsCommandBar | itemview.relationshipcommandbar.addrow | Remove |  | World | 256 |
|  |  | h4_DATMaster DATFormat_IVRCB_Add_Events | Add |  | World | 90010 |
|  |  | h4_DATMaster_IVRCB_WFActions | Add |  | World | 90138 |
|  |  | h4_DATMaster_IVRCB_MultiWFStart | Add |  | World | 90266 |
| h4_DATMaster_IVICB | ItemView.ItemCommandBar | itemview.itemcommandbar.default.save | Replace | h4_IVSaveForDAT | World | 1 |
|  |  | itemview.itemcommandbar.default.done | Replace | h4_IVDoneForDAT | World | 2 |
|  |  | itemview.itemcommandbar.default.discard | Replace | h4_Table_Discard | World | 3 |
|  |  | itemview.itemcommandbar.default.refresh | Replace | h4_Table_Refresh | World | 4 |
|  |  | h4_DATMaster_IVICB_MasterMenu | Add |  | World | 100000220 |
|  |  | h4_DATMaster_IVICB_Copy | Add |  | World | 100000230 |
|  |  | h4_DATMaster_IVICB_Revise | Add |  | World | 100000240 |
| h4_DATMaster_SVCB | SearchView.CommandBar | searchview.commandbar.default.new | Remove |  | World | 10128 |
|  |  | h4_DATMaster_SVCB_MasterMenu | Add |  | World | 100000220 |
|  |  | h4_DATMaster_SVCB_Copy | Add |  | World | 100000230 |
|  |  | h4_DATMaster_SVCB_Create | Add |  | World | 100000240 |
| h4_DATMaster_TOC_Content | TOC | h4_toc_menu_button_DATMaster | Add |  | World | 256 |
| h4_DATMasterCLNIVRCB | ItemView.RelationshipsCommandBar | itemview.relationshipscommandbar.create_item | Remove |  | World | 128 |
| h4_DeptMQMaste_IVICB | ItemView.ItemCommandBar | itemview.itemcommandbar.default.more.createnew | Remove |  | World | 90266 |
|  |  | h4_MQMaster_IVICB_MasterMenu | Add |  | World | 100000220 |
|  |  | h4_MQMaster_IVICB_Copy | Add |  | World | 100000230 |
| h4_DeptMQMaster_Change | ItemView.ItemCommandBar | itemview.itemcommandbar.default.save | Replace | h4_Table_Save | World | 128 |
|  |  | itemview.itemcommandbar.default.done | Replace | h4_Table_Done | World | 256 |
|  |  | itemview.itemcommandbar.default.discard | Replace | h4_Table_Discard | World | 384 |
|  |  | itemview.itemcommandbar.default.refresh | Replace | h4_Table_Refresh | World | 512 |
| h4_DeptMQMaster_SVCB | SearchView.CommandBar | searchview.commandbar.default.new | Remove |  | World | 10128 |
|  |  | h4_MQMaster_SVCB_MasterMenu | Add |  | World | 100000220 |
|  |  | h4_MQMaster_SVCB_Copy | Add |  | World | 100000230 |
|  |  | h4_MQMaster_SVCB_Create | Add |  | World | 100000240 |
| h4_DeptMQMaster_TOC_Content | TOC | h4_toc_menu_button_DeptMQMaster | Add |  | World | 384 |
| h4_DMQMaster DATFormat_IVRCB | ItemView.RelationshipsCommandBar | itemview.relationshipcommandbar.addrow | Remove |  | World | 256 |
|  |  | h4_DMQMaster DATFormat_IVRCB_Add_Events | Add |  | World | 90010 |
| h4_ivicb_MaruQPage | ItemView.ItemCommandBar | (項目なし) | | | | |
| h4_ivicb_MaruQPageMenu (label: MaruQ) | ItemView.ItemCommandBar | (項目なし) | | | | |
| h4_MQMaster | ItemView.ItemCommandBar | h4_MQMaster_SelEvent | Add |  | World | 10000 |
| h4_MQPage CLN_IVRCB | ItemView.RelationshipsCommandBar | itemview.relationshipcommandbar.addrow | Remove |  | World | 256 |
|  |  | itemview.relationshipscommandbar.create_item | Remove |  | World | 512 |
| H4_MQPage PointOut_Control | ItemView.RelationshipsCommandBar | itemview.relationshipscommandbar.default.deleterow | Remove |  | World | 384 |
| h4_MQPage ReqDoc_IVRCB | ItemView.RelationshipsCommandBar | itemview.relationshipscommandbar.default.selectitems | Remove |  | World | 128 |
|  |  | itemview.relationshipcommandbar.addrow | Remove |  | World | 256 |
|  |  | itemview.relationshipscommandbar.default.deleterow | Remove |  | World | 384 |
|  |  | itemview.relationshipscommandbar.create_item | Remove |  | World | 512 |
|  |  | h4_ReqDoc_IVRCB_WFActions | Add |  | World | 10100 |
|  |  | h4_ReqDoc_IVRCB_DirectApp | Add |  | World | 10110 |
|  |  | h4_ReqDoc_IVRCB_Separator1 | Add |  | World | 10120 |
|  |  | h4_ReqDoc_IVRCB_MultiWFStart | Add |  | World | 10130 |
|  |  | h4_ReqDoc_IVRCB_SetReqDocCLN | Add |  | World | 10140 |
| h4_MQPage_Change | ItemView.ItemCommandBar | itemview.itemcommandbar.default.refresh | Replace | h4_Table_Refresh | World | 512 |
| h4_MQPage_Command | ItemView.ItemCommandBar | (項目なし) | | | | |
| h4_MQPage_IVICB | ItemView.ItemCommandBar | itemview.itemcommandbar.default.save | Replace | h4_IVSave | World | 1 |
|  |  | itemview.itemcommandbar.default.done | Replace | h4_IVDone | World | 2 |
|  |  | itemview.itemcommandbar.default.more.createnew | Remove |  | World | 90266 |
|  |  | h4_MaruQMenu | Add |  | World | 100000200 |
|  |  | h4_MaruQCreate | Add |  | World | 100000210 |
|  |  | h4_MaruQEventUp | Add |  | World | 100000220 |
|  |  | h4_MaruQCopy | Add |  | World | 100000230 |
|  |  | h4_IVICB_WFActions | Add |  | World | 100000400 |
|  |  | h4_DirectApp | Add |  | World | 100000410 |
|  |  | h4_IVICB_ChangeAccessRange | Add |  | World | 100000420 |
|  |  | h4_SelectCheckBoxes | Add |  | World | 100000676 |
| h4_MQPage_SVCB | SearchView.CommandBar | h4_svcb_MaruQPage | Add |  | World | 10000 |
|  |  | h4_svcb_MQPage_Create | Add |  | World | 10010 |
|  |  | h4_svcb_MQPage_EventUp | Add |  | World | 10020 |
|  |  | h4_svcb_MQPage_Copy | Add |  | World | 10030 |
|  |  | h4_svcb_DeptMaruQCreate | Add |  | World | 10040 |
|  |  | h4_SVCB_WFActions | Add |  | World | 10100 |
|  |  | h4_SVCB_MultiWFStart | Add |  | World | 10110 |
|  |  | h4_SVCB_ChangeAccessRange | Add |  | World | 10120 |
|  |  | searchview.commandbar.default.new | Remove |  | World | 10238 |
| h4_MQPage_TOC_Content | TOC | h4_toc_menu_button_MQPage | Add |  | World | 256 |
| h4_MQPage_Tree_Change | ItemView.ItemCommandBar | itemview.itemcommandbar.default.refresh | Replace | h4_Tree_Refresh | World | 512 |
| h4_MQPage_Tree_TOC_Content | TOC | com.aras.innovator.cui_default.toc_h4_MQPage_Tree_A4E0F953018443E6AC3037077F66EB51 | Add |  | World | 128 |
|  |  | com.aras.innovator.cui_default.toc_h4_MQPage_Tree_C09123CAAFDA40E8B0F7C2CC5DA132B4 | Add |  | Administrators | 1536 |
| h4_PointOut Doc_IVRCB | ItemView.RelationshipsCommandBar | itemview.relationshipcommandbar.addrow | Remove |  | World | 256 |
| h4_PointOut History_IVRCB | ItemView.RelationshipsCommandBar | itemview.relationshipscommandbar.default.selectitems | Remove |  | World | 128 |
|  |  | itemview.relationshipcommandbar.addrow | Remove |  | World | 256 |
|  |  | itemview.relationshipscommandbar.default.deleterow | Remove |  | World | 384 |
| h4_PointOut_IVICB | ItemView.ItemCommandBar | itemview.itemcommandbar.default.more.createnew | Remove |  | World | 90266 |
|  |  | h4_MQPage_PointOut_Create | Add |  | World | 95000 |
|  |  | h4_SelectDestination | Add |  | World | 95128 |
| h4_PointOut_SVCB | SearchView.CommandBar | searchview.commandbar.default.new | Remove |  | World | 128 |
| h4_PointOut_TOC_Content | TOC | com.aras.innovator.cui_default.toc_h4_PointOut_CFCEFC54C836496AA9DD1A39697AE5A7 | Add |  | World | 256 |
| h4_ReqDoc CLN_IVRCB | ItemView.RelationshipsCommandBar | itemview.relationshipcommandbar.addrow | Remove |  | World | 256 |
|  |  | itemview.relationshipscommandbar.create_item | Remove |  | World | 512 |
| h4_ReqDoc Doc_IVRCB | ItemView.RelationshipsCommandBar | itemview.relationshipcommandbar.addrow | Remove |  | World | 256 |
| h4_ReqDoc FormatN_IVRCB | ItemView.RelationshipsCommandBar | itemview.relationshipcommandbar.addrow | Remove |  | World | 256 |
|  |  | itemview.relationshipscommandbar.default.deleterow | Remove |  | World | 384 |
| h4_ReqDoc PointOut_Control | ItemView.RelationshipsCommandBar | itemview.relationshipscommandbar.default.deleterow | Remove |  | World | 384 |
| h4_ReqDoc TestResult_IVRCB | ItemView.RelationshipsCommandBar | itemview.relationshipcommandbar.addrow | Remove |  | World | 256 |
| h4_ReqDoc_IVICB | ItemView.ItemCommandBar | itemview.itemcommandbar.default.save | Replace | h4_IVSave | World | 1 |
|  |  | itemview.itemcommandbar.default.done | Replace | h4_IVDone | World | 2 |
|  |  | itemview.itemcommandbar.default.more.createnew | Remove |  | World | 90266 |
|  |  | h4_IVICB_WFActions | Add |  | World | 100000400 |
|  |  | h4_DirectApp | Add |  | World | 100000410 |
|  |  | h4_IVICB_ChangeAccessRange | Add |  | World | 100000420 |
|  |  | h4_SelectCheckBoxes | Add |  | World | 100000676 |
|  |  | h4_IVICB_ChangeYryr | Add |  | World | 100000700 |
| h4_ReqDoc_SVCB | SearchView.CommandBar | h4_ReqDoc_SVCB_MultiWFStart | Add |  | World | 256 |
|  |  | h4_ReqDoc_SVCB_WFActions | Add |  | World | 10000 |
|  |  | h4_SVCB_ChangeAccessRange | Add |  | World | 10010 |
|  |  | searchview.commandbar.default.new | Remove |  | World | 10128 |
| h4_ReqDoc_TOC_Content | TOC | com.aras.innovator.cui_default.toc_h4_ReqDoc_A7D3898977784DBDBF50BC87B5854056 | Add |  | World | 512 |
| H4_ReqDocN PointOut_Control | ItemView.RelationshipsCommandBar | itemview.relationshipscommandbar.default.selectitems | Remove |  | World | 128 |
|  |  | itemview.relationshipcommandbar.addrow | Remove |  | World | 256 |
|  |  | itemview.relationshipscommandbar.default.deleterow | Remove |  | World | 384 |
|  |  | itemview.relationshipscommandbar.create_item | Remove |  | World | 512 |
| h4_RevisionHistory_IVCB | ItemView.ItemCommandBar | h4_CreateRelationRevisionHistory | Add |  | World | 100000 |
| h4_searchDialog_commandbar (label: アイデンティティ：検索グリッドコマンドバー) | SearchDialog.CommandBar | h4_ShowIdentityMembers_separator | Add |  | World | 3000 |
|  |  | h4_ShowIdentityMembers | Add |  | World | 3010 |
| h4_Test_Result CLN_IVRCB | ItemView.RelationshipsCommandBar | itemview.relationshipcommandbar.addrow | Remove |  | World | 256 |
|  |  | itemview.relationshipscommandbar.create_item | Remove |  | World | 512 |
| h4_Test_Result Doc_IVRCB | ItemView.RelationshipsCommandBar | itemview.relationshipcommandbar.addrow | Remove |  | World | 256 |
| h4_Test_Result_IVICB | ItemView.ItemCommandBar | itemview.itemcommandbar.default.save | Replace | h4_IVSave | World | 1 |
|  |  | itemview.itemcommandbar.default.done | Replace | h4_IVDone | World | 2 |
|  |  | itemview.itemcommandbar.default.more.createnew | Remove |  | World | 90266 |
|  |  | h4_IVICB_WFActions | Add |  | World | 100000400 |
|  |  | h4_DirectApp | Add |  | World | 100000410 |
|  |  | h4_IVICB_ChangeAccessRange | Add |  | World | 100000420 |
|  |  | h4_SelectDestination | Add |  | World | 100000548 |
| h4_Test_Result_PointOut_IVCB | ItemView.RelationshipsCommandBar | itemview.relationshipscommandbar.default.selectitems | Remove |  | World | 128 |
|  |  | itemview.relationshipcommandbar.addrow | Remove |  | World | 256 |
|  |  | itemview.relationshipscommandbar.default.deleterow | Remove |  | World | 384 |
| h4_Test_Result_SVCB | SearchView.CommandBar | searchview.commandbar.default.new | Remove |  | World | 128 |
|  |  | h4_SVCB_ChangeAccessRange | Add |  | World | 10010 |
| h4_Test_Result_TOC_Content | TOC | com.aras.innovator.cui_default.toc_h4_Test_Result_6FCF4DB203754F9EB2FDB3F3C66BE76C | Add |  | World | 640 |

---

