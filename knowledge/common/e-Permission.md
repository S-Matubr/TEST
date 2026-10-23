<!-- meta
legacy: knowledge/_legacy/機能設計書.md L3345-L3397
source: source/package/
-->
## 3. Permission (アクセス権) 一覧 (26件)

各Permissionは `Access` 子アイテム(Identity毎の権限)で構成される。`is_private` は全件 0。

凡例(セルの文字): **D**=can_discover(検索可) / **G**=can_get(参照可) / **U**=can_update(更新可) / **X**=can_delete(削除可) / **C**=can_change_access(アクセス権変更可)。`拒否(全て0)`=Accessは存在するが全権限0。`(設定なし)`=当該IdentityのAccessが定義されていない。

列のIdentityは Administrators / Creator / Manager / Owner / World / Aras PLM(これら以外のIdentityは全26件に存在しない)。

「参照元」は、第2章のLife Cycle Mapのステートが `state_permission_id` で参照しているもの(`LC名:ステート名`)。Independent内のLCから参照されていないものは、他パッケージのItemType等から参照される可能性があるが、本調査範囲では参照元不明。


| # | Permission名 | is_private | Administrators | Creator | Manager | Owner | World | Aras PLM | 参照元(LC:ステート) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | h4_AfterProgress_AppWFGroupDAT | 0 | DGUXC | DG | DG | (設定なし) | 拒否(全て0) | (設定なし) | `h4_AppWFGroupForDATFormatLC:ReleaseApproved`<br>`h4_AppWFGroupForDATFormatLC:ReqApproval_InspEXP`<br>`h4_AppWFGroupForDATFormatLC:ReqApproval_Q1Appr`<br>`h4_AppWFGroupForDATFormatLC:ReqApproval_Q1Stf`<br>`h4_AppWFGroupForDATFormatLC:RequestApproval` |
| 2 | h4_AfterProgress_DAT | 0 | DGUXC | DG | DG | DG | (設定なし) | (設定なし) | `h4_DATFormatLC:ReleaseApproved`<br>`h4_DATFormatLC:ReqApproval_InspEXP`<br>`h4_DATFormatLC:ReqApproval_Q1Appr`<br>`h4_DATFormatLC:ReqApproval_Q1Stf`<br>`h4_DATFormatLC:RequestApproval` |
| 3 | h4_AfterProgress_DATMas | 0 | DGUXC | DG | DG | (設定なし) | (設定なし) | (設定なし) | `h4_DATMasterLC:ReleaseApproved`<br>`h4_DATMasterLC:RequestApproval` |
| 4 | h4_Approved | 0 | DGUXC | DG | DG | DG | (設定なし) | (設定なし) | `h4_MQPage ReqDocsNLC:Approved`<br>`h4_MQPage ReqDocsNLC:Unapproved`<br>`h4_MQPageLC:Approved` |
| 5 | h4_Approved_AppWFGr | 0 | DGUXC | DG | DG | DG | (設定なし) | (設定なし) | `h4_ApprovalWFGroupLC:Approved` |
| 6 | h4_Approved_Test_Result | 0 | DGUXC | DG | DG | DG | (設定なし) | (設定なし) | `h4_Test_ResultLC:Approved` |
| 7 | h4_AppWFGroupForDATFormat | 0 | DGUXC | (設定なし) | (設定なし) | (設定なし) | (設定なし) | (設定なし) | Independent内のLCでは未参照 |
| 8 | h4_DeptMQMaster | 0 | DGUXC | DGUX | DGUX | DG | (設定なし) | (設定なし) | Independent内のLCでは未参照 |
| 9 | h4_Everyone_Full_Control | 0 | (設定なし) | (設定なし) | (設定なし) | (設定なし) | DGUXC | (設定なし) | Independent内のLCでは未参照 |
| 10 | h4_InProgress | 0 | DGUXC | DGUX | DGUX | DG | (設定なし) | (設定なし) | `h4_MQPage ReqDocsNLC:InProgress`<br>`h4_MQPageLC:InProgress` |
| 11 | h4_InProgress_AppWFGr | 0 | DGUXC | DGUX | DGUX | DG | (設定なし) | (設定なし) | `h4_ApprovalWFGroupLC:InProgress` |
| 12 | h4_InProgress_AppWFGroupDAT | 0 | DGUXC | DGUX | DGUX | (設定なし) | 拒否(全て0) | (設定なし) | `h4_AppWFGroupForDATFormatLC:InProgress` |
| 13 | h4_InProgress_DAT | 0 | DGUXC | DGUX | DGUX | DG | (設定なし) | (設定なし) | `h4_DATFormatLC:InProgress` |
| 14 | h4_InProgress_DATMas | 0 | DGUXC | DGUX | DGUX | (設定なし) | (設定なし) | (設定なし) | `h4_DATMasterLC:InProgress` |
| 15 | h4_InProgress_Test_Result | 0 | DGUXC | DGUX | DGUX | D | (設定なし) | (設定なし) | `h4_Test_ResultLC:InProgress` |
| 16 | h4_InRevision_DAT | 0 | DGUXC | DGU | DGU | DG | (設定なし) | DGUX | `h4_DATFormatLC:InRevision` |
| 17 | h4_InRevision_DATMas | 0 | DGUXC | DGU | DGU | (設定なし) | (設定なし) | (設定なし) | `h4_DATMasterLC:InRevision` |
| 18 | h4_PendingApproval | 0 | DGUXC | DG | DG | DG | (設定なし) | (設定なし) | `h4_MQPage ReqDocsNLC:InReview`<br>`h4_MQPage ReqDocsNLC:ProvisionalApproved`<br>`h4_MQPage ReqDocsNLC:RequestApproval`<br>`h4_MQPageLC:InReview`<br>`h4_MQPageLC:ProvisionalApproved`<br>`h4_MQPageLC:RequestApproval` |
| 19 | h4_PendingApproval_AppWFGr | 0 | DGUXC | DG | DG | DG | (設定なし) | (設定なし) | `h4_ApprovalWFGroupLC:InReview`<br>`h4_ApprovalWFGroupLC:ProvisionalApproved`<br>`h4_ApprovalWFGroupLC:RequestApproval` |
| 20 | h4_PendingApproval_Test_Result | 0 | DGUXC | DG | DG | D | (設定なし) | (設定なし) | `h4_Test_ResultLC:InReview`<br>`h4_Test_ResultLC:RequestApproval` |
| 21 | h4_PointOut | 0 | DGUXC | DGUX | DGUX | (設定なし) | (設定なし) | (設定なし) | Independent内のLCでは未参照 |
| 22 | h4_rd_worldtest | 0 | (設定なし) | (設定なし) | (設定なし) | (設定なし) | DGUX | (設定なし) | Independent内のLCでは未参照 |
| 23 | h4_Release_AppWFGroupDAT | 0 | DGUXC | DG | DG | (設定なし) | DG | (設定なし) | `h4_AppWFGroupForDATFormatLC:Release` |
| 24 | h4_Release_DAT | 0 | DGUXC | DG | DG | DG | DG | (設定なし) | `h4_DATFormatLC:Release` |
| 25 | h4_Release_DATMas | 0 | DGUXC | DG | DG | (設定なし) | DG | (設定なし) | `h4_DATMasterLC:Release` |
| 26 | h4_RevisionHistory | 0 | DGUXC | DGUX | DGUX | (設定なし) | D | DGUX | Independent内のLCでは未参照 |


### 3.1 Permission一覧から読み取れる傾向 (XMLの事実)

- 26件中24件で Administrators は `DGUXC`(フルコントロール)。残り2件 `h4_Everyone_Full_Control`(World=DGUXC)と `h4_rd_worldtest`(World=DGUX)はWorldのみのAccessで、Administrators設定なし。
- 「作業中」系(`h4_InProgress*`)は Creator・Manager に `DGUX`(更新・削除可)、Ownerは `DG`(参照のみ)・`D` のみ、または設定なし。
- 「承認依頼/確認中/仮承認」系(`h4_PendingApproval*`, `h4_AfterProgress*`)と「承認」系(`h4_Approved*`)は Creator・Manager・Owner が `DG`(参照のみ)で、更新不可(`h4_PendingApproval_Test_Result` / `h4_AfterProgress_AppWFGroupDAT` 等は Owner が `D` のみ・設定なし)。
- 公開系(`h4_Release_*`)は World に `DG`(全員が参照可)。
- 改訂中系(`h4_InRevision_DAT` / `h4_InRevision_DATMas`)は Creator・Manager に `DGU`(削除不可)。`h4_InRevision_DAT` のみ Aras PLM に `DGUX`。
- `h4_AfterProgress_AppWFGroupDAT` / `h4_InProgress_AppWFGroupDAT` は World に全権限0のAccessを持つ(明示的な拒否)。`h4_RevisionHistory` は World が `D` のみ。
- `h4_InProgress_Test_Result` / `h4_PendingApproval_Test_Result` は Owner が `D` のみ(検索のみで参照不可: can_get=0)。
- `show_permissions_warning=1` の Permission: `h4_Approved`, `h4_Approved_AppWFGr`, `h4_Approved_Test_Result`, `h4_InProgress`, `h4_InProgress_AppWFGr`, `h4_InProgress_Test_Result`, `h4_PendingApproval`, `h4_PendingApproval_AppWFGr`, `h4_PendingApproval_Test_Result`(この9件のAccess全行で1。他は0)。


