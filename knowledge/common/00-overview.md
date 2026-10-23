<!-- meta
legacy: knowledge/_legacy/機能設計書.md L1-L56
source: source/package/
-->
﻿# HND-マルQ Step3 機能設計書

| 項目 | 内容 |
|---|---|
| 対象 | Aras Innovator 開発機能「マルQ Step3」(パッケージ h4.01〜h4.15 + コードツリー) |
| 入力資料 | `HND-マルQ Step3パッケージ`(AML/XML 820件、imports.mf)、`HND-マルQ Step3コードツリー`(html/js/css 等 24件) |
| 作成方法 | 全ファイルを読み取り、章ごとに整理して統合(自動生成) |
| 注意 | Method本体・画面コードに記載のない事項は書かず、呼出契機など読み取れない点は「推測」と明記している。各章は読取担当ごとに作成したため見出し番号は章内で完結している |

## 0. 全体構成

### 0.1 インポートパッケージ(imports.mf の順)
| # | パッケージ | 内容 | 主な記載章 |
|---|---|---|---|
| 01 | h4.01.Independent | Method 273件、LifeCycle 7、List 19、Form 17、Permission 26、CommandBar、UserMessage 92 等 | 第3章・第4章 |
| 02 | h4.02.WFMap | Workflow Map 5、qry_QueryDefinition 5、TreeGridView 7 | 第2章(G-c) |
| 03 | h4.03.DATFormatLink | DATFormatLink の Form/cui | 第1章(F) |
| 04 | h4.04.RevisionHistory | 改訂履歴の Form/cui | 第1章(F) |
| 05 | h4.05.AppWFGroupForDATFormat | h4_AppWFGroupForDATFormat | 第1章(F) |
| 06 | h4.06.DATFormat | h4_DATFormat | 第1章(F) |
| 07 | h4.07.DATMaster | h4_DATMaster, h4_RevisionHistory | 第1章(F) |
| 08 | h4.08.DptMQMaster | h4_DeptMQMaster | 第1章(F) |
| 09 | h4.09.MQPage | h4_MQPage, h4_destination History | 第2章(G-a) |
| 10 | h4.10.PointOut | h4_PointOut | 第2章(G-a) |
| 11 | h4.11.TestResult | h4_Test_Result | 第2章(G-b) |
| 12 | h4.12.ReqDoc | h4_ReqDoc | 第2章(G-b) |
| 13 | h4.13.AppWFGr | h4_ApprovalWFGroup, h4_ApprovalTarget, h4_ApprovalWFGroupSignOff | 第1章(F) |
| 14 | h4.14.AllEventTable | h4_AllEventTable | 第1章(F) |
| 15 | h4.15.Last | h4_MQPage_Tree と各種RelationshipType | 第2章(G-b) |

### 0.2 主要ItemType
h4_DATFormat(開達書式) / h4_DATMaster(帳票マスタ) / h4_RevisionHistory(改訂履歴) / h4_DeptMQMaster(マルQマスタ) / h4_AppWFGroupForDATFormat(開達実施要領一括承認) / h4_ApprovalWFGroup(一括承認) / h4_ApprovalTarget(承認対象) / h4_ApprovalWFGroupSignOff / h4_AllEventTable / h4_MQPage(マルQページ) / h4_destination History / h4_PointOut(指摘) / h4_ReqDoc(必要資料) / h4_Test_Result(検証結果・根拠) / h4_MQPage_Tree(マルQページ一覧)

### 0.3 主要ライフサイクル
h4_DATFormatLC / h4_MQPageLC / h4_MQPage ReqDocsNLC / h4_DATMasterLC / h4_ApprovalWFGroupLC / h4_AppWFGroupForDATFormatLC / h4_Test_ResultLC(詳細は第3章)

### 0.4 Workflow Map
h4_ApprovalWFGroupWF / h4_ApprovalWFMQAndReqDoc / h4_DATFormatEXPWF / h4_DATFormatWF / h4_Test_ResultWF(詳細は第2章 G-c)

### 0.5 クライアント画面(コードツリー)
h4_AllEventTable / h4_DATMasterTable / h4_DeptMQMasterTable / h4_EventSumTable(Wijmo FlexGrid等の表)、h4_Tree/ModTop(機種別マルQページツリー)。サーバMethod `h4_table_AllEvent_get` `h4_table_DATMaster_get` `h4_table_DeptMQMaster_get` `h4_table_1event_get` `h4_treeModGet` から取得(第6章)。

## 目次
1. 第1章 データ系パッケージ(DATFormat/DATMaster/DeptMQMaster/一括承認/AllEventTable)
2. 第2章 MQ・指摘・必要資料・検証結果・ワークフロー
3. 第3章 ライフサイクル・権限・値リスト・Form
4. 第4章 コマンドバー・メッセージ・その他
5. 第5章 Method(No.1〜273)
6. 第6章 コードツリー(クライアント側)
7. 付録 既知の注意点・バグ疑い(第5章・第6章内「注意点」参照)


---

<!-- ===== 第1章 ===== -->

