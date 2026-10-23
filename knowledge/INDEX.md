# 仕様ナレッジ 索引

原典は `source/`。ここに載る記述は `機能設計書.md` から無改変で分割した二次情報で、各ファイル冒頭の meta に元の行範囲を持つ。

## ファイル一覧

| ファイル | 先頭見出し | 元の行 |
|---|---|---|
| common/00-overview.md | ﻿# HND-マルQ Step3 機能設計書 | L1-L56 |
| common/e-CommandBar.md | E. Independent パッケージ (h4.01.Independent) 調査結果 (その3: ⑥⑦) | L4139-L4502 |
| common/e-Form.md | 5. Form (フォーム) 17件 | L3853-L4138 |
| common/e-List.md | E. Independent パッケージ (h4.01.Independent) 調査結果 (その2: ④⑤) | L3398-L3852 |
| common/e-Permission.md | 3. Permission (アクセス権) 一覧 (26件) | L3345-L3397 |
| common/e-その他.md | 7. その他の定義 | L4503-L4785 |
| common/e-パッケージ構成.md | E. Independent パッケージ (h4.01.Independent) 調査結果 (その1: ①②③) | L2568-L2639 |
| common/f-0-共通事項.md | F. データ系パッケージ調査結果（Import配下XML全読） | L57-L72 |
| common/f-9-横断メモ.md | 9. 横断メモ（設計書化時の注意） | L695-L707 |
| itemtypes/f-1-DATFormat.md | 1. DATFormat（ItemType: h4_DATFormat 「開達書式」） | L73-L236 |
| itemtypes/f-2-DATFormatLink.md | 2. DATFormatLink（Form / cui のみ。ItemType定義はこのフォルダに無い） | L237-L257 |
| itemtypes/f-3-DATMaster.md | 3. DATMaster（ItemType: h4_DATMaster「帳票マスタ」＋ h4_RevisionHistory「改訂履歴」） | L258-L394 |
| itemtypes/f-4-DptMQMaster.md | 4. DptMQMaster（ItemType: h4_DeptMQMaster「マルQマスタ」） | L395-L448 |
| itemtypes/f-5-RevisionHistory.md | 5. RevisionHistory（Form/cuiのみ。ItemType定義は DATMaster パッケージ側 §3.5） | L449-L459 |
| itemtypes/f-6-AppWFGroupForDATFormat.md | 6. AppWFGroupForDATFormat（ItemType: h4_AppWFGroupForDATFormat「開達実施要領一括承認」） | L460-L532 |
| itemtypes/f-7-AppWFGr.md | 7. AppWFGr（ItemType: h4_ApprovalWFGroup「一括承認」, h4_ApprovalTarget「承認対象」, h4_ApprovalWFGroupSignOff） | L533-L644 |
| itemtypes/f-8-AllEventTable.md | 8. AllEventTable（ItemType: h4_AllEventTable「マルQ イベント横通し表示」） | L645-L694 |
| itemtypes/g-Last.md | 5. パッケージ Last (`Last\Import`) | L1851-L2116 |
| itemtypes/g-MQPage.md | G. マルQ・指摘・必要資料・検証結果・WF 系パッケージ 読込メモ (その1: MQPage / PointOut) | L708-L1022 |
| itemtypes/g-PointOut.md | 2. パッケージ PointOut (`PointOut\Import`) | L1023-L1194 |
| itemtypes/g-ReqDoc.md | G. マルQ・指摘・必要資料・検証結果・WF 系パッケージ 読込メモ (その2: ReqDoc / TestResult / Last) | L1195-L1597 |
| itemtypes/g-TestResult.md | 4. パッケージ TestResult (`TestResult\Import`) | L1598-L1850 |
| lifecycles/e-LifeCycleMap.md | 2. Life Cycle Map (7件) | L2640-L3344 |
| methods/b1a.md | B_method1a: Method AML 調査 (No.1〜10) | L4786-L4898 |
| methods/b1b.md | B_method1b: Method AML 調査 (No.11〜34) | L4899-L5009 |
| methods/b1c.md | B_method1c: Method AML 調査 (No.35〜48) | L5010-L5106 |
| methods/b1d.md | B_method1d: Method AML 調査 (No.49〜60) | L5107-L5195 |
| methods/b1e.md | B_method1e: Method AML 調査 (No.61〜76) | L5196-L5298 |
| methods/b1f.md | B_method1f: Method AML 調査 (No.77〜91) | L5299-L5383 |
| methods/c2a.md | Method AML 調査 C_method2a (92〜106番目: h4_DATHistIvrcbCreateInit 〜 h4_frm_get_destination) | L5384-L5537 |
| methods/c2b.md | Method AML 調査 C_method2b (107〜125番目: h4_frm_get_eventup_value 〜 h4_GetInputRevisioDialig) | L5538-L5647 |
| methods/c2c.md | Method AML 調査 C_method2c (126〜128番目: h4_getSettingCheckBox, h4_GetWFComment, h4_getWFComment_DAT) | L5648-L5697 |
| methods/c2d.md | Method AML 調査 C_method2d (129〜141番目: h4_GrantAuthority 〜 h4_init_ivicb_add_events) | L5698-L5782 |
| methods/c2e.md | Method AML 調査 C_method2e (142〜156番目: h4_init_ivrcb_add_events 〜 h4_ivrcb_directDeleterow_init) | L5783-L5880 |
| methods/c2f.md | Method AML 調査 C_method2f (157〜165番目: h4_ivrcb_MultiWFStart 〜 h4_MQPage_ivicb_auto_event_init) | L5881-L5943 |
| methods/c2g.md | Method AML 調査 C_method2g (166〜171番目: h4_MQPage_ivicb_copy 〜 h4_MultiDirectApprove) | L5944-L6005 |
| methods/c2h.md | Method AML 調査 C_method2h (172〜179番目: h4_NewAssignInProgressForDat 〜 h4_PostApprovalLCProcForDAT) | L6006-L6067 |
| methods/c2i.md | Method AML 調査 C_method2i (180〜182番目: h4_Pre_CallApproved_MQP_MQPRDN 〜 h4_Promote_By_List_MQPage ReqDoc) | L6068-L6101 |
| methods/d3a.md | D_method3a: Method AML 解析 (No.183〜208) | L6102-L6302 |
| methods/d3b.md | D_method3b: Method AML 解析 (No.209〜229) | L6303-L6458 |
| methods/d3c.md | D_method3c: Method AML 解析 (No.230〜244) | L6459-L6568 |
| methods/d3d.md | D_method3d: Method AML 解析 (No.245〜267) | L6569-L6713 |
| methods/d3e.md | D_method3e: Method AML 解析 (No.268〜273) | L6714-L6785 |
| screens/a-codetree.md | A. コードツリー(クライアント側 HTML/JS)機能設計 | L6786-L7055 |
| workflows/g-WFMap.md | G. マルQ・指摘・必要資料・検証結果・WF 系パッケージ 読込メモ (その3: WFMap) | L2117-L2567 |

## Method 索引

| Method | 該当ファイル |
|---|---|
| Matsubara_Test | methods/d3e.md |
| h4_AddItemWhenSave | methods/b1a.md |
| h4_AddRelPointOutMQPage | methods/b1a.md |
| h4_AddRelPointOutReqDoc | methods/b1a.md |
| h4_AddReqDocCLN | methods/b1a.md |
| h4_Approve_Related_Item | methods/b1a.md |
| h4_CallCanReqSubstitute_DAT | methods/b1b.md |
| h4_CallCanReqSubstitute_cmn | methods/b1b.md |
| h4_CallChangeYryrForWF | methods/b1b.md |
| h4_CallOpenReqSubstitute_DAT | methods/b1b.md |
| h4_CallOpenReqSubstitute_cmn | methods/b1b.md |
| h4_CallPromInPro4ApWfGr4DAT | methods/b1b.md |
| h4_CallPromInspEXP4ApWfGr4DAT | methods/b1b.md |
| h4_CallPromQ1Appr4ApWfGr4DAT | methods/b1b.md |
| h4_CallPromQ1Stf4ApWfGr4DAT | methods/b1b.md |
| h4_CallPromRelApp4ApWfGr4DAT | methods/b1b.md |
| h4_CallPromRelease4ApWfGr4DAT | methods/b1b.md |
| h4_CallPromReqApp4ApWfGr4DAT | methods/b1b.md |
| h4_CallSetReqDocRejecter_AppWFGr | methods/b1b.md |
| h4_CallSetReqDocRejecter_MQPage | methods/b1b.md |
| h4_Call_Copy_MQPage | methods/b1a.md |
| h4_Call_Create_MQPage | methods/b1a.md |
| h4_Call_EventUp_MQPage | methods/b1b.md |
| h4_Call_Promote_Approved | methods/b1b.md |
| h4_Call_Promote_InProgress | methods/b1b.md |
| h4_Call_Promote_InReview | methods/b1b.md |
| h4_Call_Promote_ProvApproved | methods/b1b.md |
| h4_Call_Promote_ReqProvApproval | methods/b1b.md |
| h4_Call_Promote_RequestApproval | methods/b1b.md |
| h4_Call_create_deptmaruq | methods/b1a.md |
| h4_CancelChangeYryrForWF | methods/b1b.md |
| h4_CancelRevisioDialig | methods/b1b.md |
| h4_ChangeSortOrderOfGI62 | methods/b1c.md |
| h4_ChangeWfForDATFormat | methods/b1c.md |
| h4_ChangeWfForDATFormatAtAdd | methods/b1c.md |
| h4_ChangeYryr | methods/b1b.md |
| h4_ChangeYryrByFormResult | methods/b1c.md |
| h4_Change_Direct_Approve_List | methods/b1c.md |
| h4_CheackWhenSaveAddItem | methods/b1c.md |
| h4_CheckCLN | methods/b1c.md |
| h4_CheckCLNtab | methods/b1c.md |
| h4_CheckDATWFStart | methods/b1d.md |
| h4_CheckDuplicatAppTarget | methods/b1d.md |
| h4_CheckDuplicatAppTargetForDat | methods/b1d.md |
| h4_CheckIsLockRelatedDAT | methods/b1d.md |
| h4_CheckIsLockRelatedDAT_Core | methods/b1d.md |
| h4_CheckLockHist | methods/b1d.md |
| h4_CheckLockHist_Core | methods/b1d.md |
| h4_CheckLockRelationDoc | methods/b1d.md |
| h4_CheckManagedByIdRequired | methods/b1d.md |
| h4_CheckReqDocYryrState | methods/b1d.md |
| h4_CheckUseYryrChange | methods/b1c.md |
| h4_CheckValueUnchanged | methods/b1e.md |
| h4_CheckYryrUser | methods/b1e.md |
| h4_ControlItemCreation | methods/b1e.md |
| h4_ControlTabbar | methods/b1e.md |
| h4_ControlTabbarForApWFGr4DAT | methods/b1e.md |
| h4_ControlTabbarForDAT | methods/b1e.md |
| h4_CreateNewPointOut | methods/b1e.md |
| h4_CreateNewRevision | methods/b1e.md |
| h4_CreateNewRevisionHistory | methods/b1e.md |
| h4_CreateRelHistory | methods/b1e.md |
| h4_CreateReqDocPointOut_af | methods/b1f.md |
| h4_CreateReqDocPointOut_be | methods/b1f.md |
| h4_CreateRevisio | methods/b1f.md |
| h4_CreateTestResult | methods/b1f.md |
| h4_Create_ApWFG_from_MQP_SV | methods/b1e.md |
| h4_Create_ApWFG_from_ReqDoc_SV | methods/b1e.md |
| h4_DATFormatIRVCB_MultiWFStart | methods/b1f.md |
| h4_DATFormatSVCB_MultiWFStart | methods/b1f.md |
| h4_DATHistIvrcbCreateInit | methods/c2a.md |
| h4_DATHistIvrcbDellInit | methods/c2a.md |
| h4_DATMasterIVRCB_WFActionsInit | methods/c2a.md |
| h4_DATMaster_Copy | methods/c2a.md |
| h4_DATMaster_ivicb_copy | methods/c2a.md |
| h4_DATMaster_svcb_copy | methods/c2a.md |
| h4_DATReviseInit | methods/c2a.md |
| h4_DeleteRelHistory | methods/c2a.md |
| h4_Delta_Auto_input | methods/c2a.md |
| h4_DeptMQMasterReleaseFilte | methods/c2a.md |
| h4_DirectPromote | methods/c2a.md |
| h4_DirectPromote_click | methods/c2a.md |
| h4_GetControlledItem | methods/b1b.md |
| h4_GetDocRelOrderNoAnParentState | methods/c2b.md |
| h4_GetDocRelParentConfigID | methods/c2b.md |
| h4_GetDocumentRelationName | methods/b1d.md |
| h4_GetInputRevisioDialig | methods/c2b.md |
| h4_GetWFComment | methods/c2c.md |
| h4_GrantAuthority | methods/c2d.md |
| h4_IVICB_ChangeAccessRange | methods/c2e.md |
| h4_IVICB_ChangeAccessRange_init | methods/c2e.md |
| h4_IVICB_WFActions_init | methods/c2e.md |
| h4_IncrementRound | methods/c2d.md |
| h4_IncrementRoundForMQPage | methods/c2d.md |
| h4_IncrementRoundForMQPageDirect | methods/c2d.md |
| h4_IncrementSequenceNumber | methods/c2d.md |
| h4_InitSetPermission | methods/c2e.md |
| h4_InitSetPermissionAndNo | methods/c2e.md |
| h4_InputModifiedOnAndUserForHist | methods/c2e.md |
| h4_ItemViewDone | methods/c2e.md |
| h4_ItemViewDoneForDAT | methods/c2e.md |
| h4_ItemViewSave | methods/c2e.md |
| h4_ItemViewSaveForDAT | methods/c2e.md |
| h4_ListByPromoteApWFGroup | methods/c2f.md |
| h4_List_By_Promote_MQPage | methods/c2f.md |
| h4_List_By_Promote_MQPage ReqDoc | methods/c2f.md |
| h4_MQMaster_Copy | methods/c2f.md |
| h4_MQMaster_ivicb_copy | methods/c2f.md |
| h4_MQMaster_svcb_copy | methods/c2f.md |
| h4_MQPReject_SetReqDocRejecter | methods/b1b.md |
| h4_MQPage_MainFormMin | methods/c2g.md |
| h4_MQPage_ivicb_auto_event_init | methods/c2f.md |
| h4_MQPage_ivicb_copy | methods/c2g.md |
| h4_MQPage_ivicb_event_up | methods/b1a.md |
| h4_MQPage_svcb_deptmaruq_create | methods/c2a.md |
| h4_MainFormMin | methods/c2f.md |
| h4_MultiDirectApprove | methods/c2b.md |
| h4_NewAssignInProgressForDat | methods/c2h.md |
| h4_OpenUrlDATFormatLink | methods/c2h.md |
| h4_PointOut_ivicb_copy | methods/c2h.md |
| h4_PointOut_ivicb_init | methods/c2h.md |
| h4_PostApprovalLCProcForDAT | methods/c2h.md |
| h4_Post_CallRejectAct_MQP_MQPRDN | methods/c2h.md |
| h4_Post_RejectMQPage_InReview | methods/c2h.md |
| h4_PreAppFromInRevForDAT | methods/c2i.md |
| h4_Pre_CallApproved_MQP_MQPRDN | methods/c2i.md |
| h4_PromoteDATFormatOfAppWFGr | methods/b1b.md |
| h4_PromoteForClient | methods/c2e.md |
| h4_Promote_By_List_MQPage | methods/c2i.md |
| h4_Promote_By_List_MQPage ReqDoc | methods/c2i.md |
| h4_Promote_WFGroup_ApTarget | methods/b1b.md |
| h4_PullBack | methods/b1b.md |
| h4_PullBack_DAT | methods/b1b.md |
| h4_ReAssignInProgress | methods/d3a.md |
| h4_ReAssignInProgressForDat | methods/d3a.md |
| h4_ReAssign_AfterCopy_DATFormat | methods/c2a.md |
| h4_ReSetPermisson_After | methods/d3a.md |
| h4_ReSetPermisson_Before | methods/d3a.md |
| h4_RecordUpdateDate | methods/c2h.md |
| h4_ReleaseChildrenDATFormat | methods/c2h.md |
| h4_ReplaceDATFormatAtRelease | methods/c2h.md |
| h4_ReqDoc_IVRCB_DirectApp_init | methods/d3a.md |
| h4_ReqDoc_ivrcb_MultiWFStart_ini | methods/d3a.md |
| h4_ReqDocsNDocGridEventAdd | methods/d3a.md |
| h4_ReqDocsNDocGridEventDel | methods/d3a.md |
| h4_RevisionHistory_ivicb_copy | methods/d3a.md |
| h4_RevisionHistory_ivicb_init | methods/d3a.md |
| h4_SMthCnvAttachFile | methods/d3d.md |
| h4_SMthCnvInitDependencies | methods/d3d.md |
| h4_SMthCnvSendErrorMail | methods/d3d.md |
| h4_SVCB_ChangeAccessRange | methods/d3d.md |
| h4_SVCB_ChangeAccessRange_init | methods/d3d.md |
| h4_SaveCKAppWFGroup4DATFormat | methods/b1d.md |
| h4_SaveCheckPointOut | methods/d3a.md |
| h4_SaveCheckhApprovalWFGroup | methods/d3a.md |
| h4_SaveTestResult | methods/d3a.md |
| h4_SetApprovalGroupProperty | methods/d3b.md |
| h4_SetCompletedByForAdd | methods/d3b.md |
| h4_SetCompletedByForUpdate | methods/d3b.md |
| h4_SetItemManagedAndOwned_af | methods/d3c.md |
| h4_SetItemManagedAndOwned_be | methods/d3c.md |
| h4_SetNos | methods/d3c.md |
| h4_SetPathVisibility | methods/c2d.md |
| h4_SetReqDocCLN | methods/d3c.md |
| h4_SetVoteInProgress | methods/d3c.md |
| h4_SetWfForDATAtRevisio_After | methods/d3c.md |
| h4_SetWfForDATAtRevisio_Before | methods/d3c.md |
| h4_SetWfForDATMasterAtAdd | methods/c2h.md |
| h4_SetYaruYara | methods/d3d.md |
| h4_Set_ApprovalInfo_For_ApWFG | methods/b1b.md |
| h4_Set_ApprovalInfo_On_Approve | methods/c2i.md |
| h4_ShowIdentityMembers_click | methods/d3d.md |
| h4_StartRevision | methods/b1f.md |
| h4_Table_DiscardCli | methods/d3d.md |
| h4_Table_DoneCli | methods/c2e.md |
| h4_Table_RefreshCli | methods/d3d.md |
| h4_Table_SaveCli | methods/d3d.md |
| h4_Tree_RefreshCli | methods/d3d.md |
| h4_UnSetApprovalGroupProperty | methods/d3b.md |
| h4_UpdatePermission | methods/d3e.md |
| h4_UpdatePermissionForPromote | methods/d3e.md |
| h4_UpdatePointOutPermission | methods/d3e.md |
| h4_addDatFormatCheck | methods/b1a.md |
| h4_beforePdfConv | methods/b1a.md |
| h4_callPullBack | methods/b1b.md |
| h4_changeModelName | methods/b1c.md |
| h4_change_state_list | methods/b1c.md |
| h4_change_yryr_frm_close | methods/b1c.md |
| h4_change_yryr_frm_get_value | methods/b1c.md |
| h4_change_yryr_init | methods/b1c.md |
| h4_checkDeadline | methods/b1d.md |
| h4_checkModelName | methods/b1d.md |
| h4_cmn_ShowMessage | methods/b1e.md |
| h4_cmn_ShowMessage_Arg | methods/b1e.md |
| h4_create_sort_order_index | methods/b1e.md |
| h4_ctrl_keyed_name | methods/b1f.md |
| h4_cui_ivicb_MQMasterCopy_init | methods/b1f.md |
| h4_cui_ivicb_auto_event_init | methods/b1f.md |
| h4_cui_ivicb_copy_init | methods/b1a.md |
| h4_cui_ivrcb_SetReqDocCLN_init | methods/b1a.md |
| h4_cui_svcb_MQMasterCopy_init | methods/b1f.md |
| h4_cui_svcb_auto_event_init | methods/b1f.md |
| h4_cui_svcb_copy_init | methods/b1f.md |
| h4_cui_svcb_deptmaruqcreat_init | methods/b1a.md |
| h4_deptmqmaster_grid_event | methods/c2a.md |
| h4_frm_SetReqDocCLN_GetValue | methods/c2b.md |
| h4_frm_getSettingCheckBox | methods/c2b.md |
| h4_frm_getSettingEvents | methods/c2b.md |
| h4_frm_get_dept_init_value | methods/c2a.md |
| h4_frm_get_destination | methods/c2a.md |
| h4_frm_get_eventup_value | methods/c2b.md |
| h4_frm_get_value | methods/c2b.md |
| h4_frm_get_value_DATMasterCopy | methods/c2b.md |
| h4_frm_get_value_multi_direct_ap | methods/c2b.md |
| h4_frm_init_DATMasterCopydelta | methods/c2b.md |
| h4_frm_init_DeptMaruQInitVal | methods/c2b.md |
| h4_frm_init_setDeltaVersion | methods/c2b.md |
| h4_frm_init_setState | methods/c2b.md |
| h4_frm_set_Managed_by_id | methods/c2b.md |
| h4_frm_set_ModelName | methods/c2b.md |
| h4_frm_set_ReqDocCLN | methods/c2b.md |
| h4_getSettingCheckBox | methods/c2c.md |
| h4_getWFComment_DAT | methods/c2c.md |
| h4_hidePath | methods/c2d.md |
| h4_hidePullBack | methods/c2d.md |
| h4_hideYryrRequestApproval | methods/c2d.md |
| h4_hidepullBack_RA_IP | methods/c2d.md |
| h4_identity_grid_event | methods/c2d.md |
| h4_identity_grid_event_alias | methods/c2d.md |
| h4_init_ivicb_add_CheckList | methods/c2d.md |
| h4_init_ivicb_add_events | methods/c2d.md |
| h4_init_ivrcb_add_events | methods/c2e.md |
| h4_ivrcb_MultiWFStart | methods/c2f.md |
| h4_ivrcb_directCreateHistory | methods/c2e.md |
| h4_ivrcb_directCreateHistory_ini | methods/c2e.md |
| h4_ivrcb_directDeleterow | methods/c2e.md |
| h4_ivrcb_directDeleterow_init | methods/c2e.md |
| h4_optimize_tab_form_size | methods/c2h.md |
| h4_propDeltaFilter | methods/d3a.md |
| h4_propIsExpFilter | methods/d3a.md |
| h4_sendMail | methods/c2c.md |
| h4_sendMail_DAT | methods/c2c.md |
| h4_setCheckBoxInit | methods/d3b.md |
| h4_setCheckInit | methods/d3b.md |
| h4_setDefaultCLNItem | methods/b1a.md |
| h4_setDefaultCLNItemForDAT | methods/b1f.md |
| h4_setDefaultChargeList | methods/d3b.md |
| h4_setDefaultChargeListForDAT | methods/d3b.md |
| h4_setDestinaionInit | methods/d3b.md |
| h4_setDestination | methods/d3b.md |
| h4_setDestinations | methods/d3b.md |
| h4_setDevBaseAndDestination | methods/d3b.md |
| h4_setEventInit | methods/d3b.md |
| h4_setEvents | methods/d3b.md |
| h4_setPropToPointOut | methods/d3c.md |
| h4_setPropToReqDoc | methods/d3c.md |
| h4_setPropToRevisionHistory | methods/d3c.md |
| h4_setRelEvents | methods/d3c.md |
| h4_setRevisionData | methods/d3c.md |
| h4_setWfAssignWhenOnActive | methods/d3c.md |
| h4_setWfAssignWhenOnActiveForDAT | methods/d3c.md |
| h4_set_my | methods/d3b.md |
| h4_set_owner_for_ApprovalWFGroup | methods/d3b.md |
| h4_sort_control | methods/d3d.md |
| h4_start_change_yryr | methods/d3d.md |
| h4_svcb_create_MQPage | methods/d3d.md |
| h4_svcb_create_deptMQMaster | methods/d3d.md |
| h4_table_1event_get | methods/d3d.md |
| h4_table_AllEvent_get | methods/d3d.md |
| h4_table_DATMaster_get | methods/d3d.md |
| h4_table_DATMaster_get_v2 | methods/d3d.md |
| h4_table_DeptMQMaster_get | methods/d3d.md |
| h4_treeModGet | methods/d3e.md |

## 未対応(knowledge/methods に記述なし)

(なし)
