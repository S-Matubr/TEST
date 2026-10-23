<!-- meta
legacy: knowledge/_legacy/機能設計書.md L2568-L2639
source: source/package/
-->
# E. Independent パッケージ (h4.01.Independent) 調査結果 (その1: ①②③)

(その2 = `E_independent_b.md`: ④List ⑤Form / その3 = `E_independent_c.md`: ⑥CommandBar ⑦その他)

調査対象: `C:\Claude\TEST\HND-マルQ Step3パッケージ\Step3パッケージ\Independent\Import` 配下のうち **Methodフォルダを除く** 全サブフォルダのXML全件、および `..\..\imports.mf`。

方針: XMLに書かれている事実のみ記載。Method本体(コード)は調査対象外のため、Methodは「名前」だけを記載し、処理内容は推測しない。権限・ロール等はXMLの値をそのまま転記した。

調査したサブフォルダとファイル数 (Method除く、計 約360ファイル):

| フォルダ | 件数 | フォルダ | 件数 |
|---|---|---|---|
| Action | 2 | Life Cycle Map | 7 |
| CommandBarButton | 32 | List | 19 |
| CommandBarMenu | 18 | Permission | 26 |
| CommandBarMenuButton | 37 | PresentationConfiguration | 24 |
| CommandBarMenuSeparator | 1 | Property | 1 |
| CommandBarSection | 65 | Revision | 1 |
| CommandBarSeparator | 1 | UserMessage | 92 |
| ConversionRule | 1 | Variable | 1 |
| cui_Control | 2 | EMail Message | 7 |
| Field | 1 | Form | 17 |
| Identity | 1 | | |

---

## 1. パッケージ構成 (imports.mf)

`imports.mf` の全文(15パッケージ、記載順 = インポート順):

```xml
<imports>
  <package name="h4.01.Independent" path="Independent\Import" />
  <package name="h4.02.WFMap" path="WFMap\Import" />
  <package name="h4.03.DATFormatLink" path="DATFormatLink\Import" />
  <package name="h4.04.RevisionHistory" path="RevisionHistory\Import" />
  <package name="h4.05.AppWFGroupForDATFormat" path="AppWFGroupForDATFormat\Import" />
  <package name="h4.06.DATFormat" path="DATFormat\Import" />
  <package name="h4.07.DATMaster" path="DATMaster\Import" />
  <package name="h4.08.DptMQMaster" path="DptMQMaster\Import" />
  <package name="h4.09.MQPage" path="MQPage\Import" />
  <package name="h4.10.PointOut" path="PointOut\Import" />
  <package name="h4.11.TestResult" path="TestResult\Import" />
  <package name="h4.12.ReqDoc" path="ReqDoc\Import" />
  <package name="h4.13.AppWFGr" path="AppWFGr\Import" />
  <package name="h4.14.AllEventTable" path="AllEventTable\Import" />
  <package name="h4.15.Last" path="Last\Import" />
</imports>
```

| 順 | パッケージ名 | パス(`Step3パッケージ`直下からの相対) | 備考 |
|---|---|---|---|
| 1 | h4.01.Independent | Independent\Import | **本調査の対象**。Life Cycle Map, Permission, List, Form, CommandBar*, UserMessage, EMail Message 等を保持 |
| 2 | h4.02.WFMap | WFMap\Import | (本調査対象外) |
| 3 | h4.03.DATFormatLink | DATFormatLink\Import | 同上 |
| 4 | h4.04.RevisionHistory | RevisionHistory\Import | 同上 |
| 5 | h4.05.AppWFGroupForDATFormat | AppWFGroupForDATFormat\Import | 同上 |
| 6 | h4.06.DATFormat | DATFormat\Import | 同上 |
| 7 | h4.07.DATMaster | DATMaster\Import | 同上 |
| 8 | h4.08.DptMQMaster | DptMQMaster\Import | 同上。フォルダ名は `DptMQMaster`、Permission/CommandBarSection側は `DeptMQMaster` と表記ゆれあり |
| 9 | h4.09.MQPage | MQPage\Import | 同上 |
| 10 | h4.10.PointOut | PointOut\Import | 同上 |
| 11 | h4.11.TestResult | TestResult\Import | 同上 |
| 12 | h4.12.ReqDoc | ReqDoc\Import | 同上 |
| 13 | h4.13.AppWFGr | AppWFGr\Import | 同上 |
| 14 | h4.14.AllEventTable | AllEventTable\Import | 同上 |
| 15 | h4.15.Last | Last\Import | 同上 |

- Independent は先頭(h4.01)でインポートされる。Independent内のCommandBarSection/PresentationConfiguration/Form/Listの記述は、`h4_MQPage`、`h4_ReqDoc`、`h4_DATFormat`、`h4_Test_Result`、`h4_PointOut`、`h4_ApprovalWFGroup`、`h4_DeptMQMaster` 等、後続パッケージが定義するItemType名を参照している(名称上の参照。ItemTypeの定義自体は本調査範囲外)。

---

