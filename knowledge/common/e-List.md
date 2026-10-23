<!-- meta
legacy: knowledge/_legacy/機能設計書.md L3398-L3852
source: source/package/
-->
# E. Independent パッケージ (h4.01.Independent) 調査結果 (その2: ④⑤)

(その1 = `E_independent_a.md`: ①パッケージ構成 ②Life Cycle Map ③Permission / その3 = `E_independent_c.md`: ⑥CommandBar ⑦その他)

---

## 4. List (値リスト) 19件

- `Value` 型の子を持つ通常リスト(value と label)と、`Filter Value` 型の子を持つフィルタ付きリスト(value, label, `filter`)がある。
- フィルタ付き: `h4_Events`(filter=⊿バージョン), `h4_ModelName`(filter=⊿バージョン), `h4_States`(filter=ItemType名)。`h4_Events` と `h4_ModelName` の filter には ⊿バージョン値(13, 14, 15, 15-B, 14-1 等。`h4_DeltaVersion` の value は 13/14/15/15-B)が入っている。
- `label(ja)` は xml:lang="ja" のラベル、`label(en)` は xml:lang="en" のラベル(空欄=該当ラベルの記載なし)。`inactive=1` は無効化された値。
- 表の並びは sort_order 昇順。

### 4.0 リスト一覧(サマリ)

| # | List名 | 説明(description) | 種別 | 値数 | 用途の読み取り(XML内の根拠) |
|---|---|---|---|---|---|
| 1 | h4_ApprovalWFGroupLCS | 一括承認のLCのステートのリスト表示用(一括承認ではダイレクト承認はないが、表示形式を他と合わせるため) | Value | 5 | `h4_ApprovalWFGroupLC` と同じ5ステート名 |
| 2 | h4_category | 開達書式:資料分類リスト | Value | 4 | format/guideline/EXPTest/deptDoc |
| 3 | h4_checkedList | 確認済み のチェックボックスの代わりに追加 | Value | 1 | value=1 のみ |
| 4 | h4_class | マルQマスタ・マルQページの区分リスト | Value | 3 | Dept/Gr/Sec |
| 5 | h4_confirmation_status | 対応状況 | Value | 2 | not_confirmed/confirmed |
| 6 | h4_DAT_Workflow_Role | SH:帳票マスタ・開達書式の担当者一覧の役割 | Value | 3 | Creater/Approver/ReleaseApprover |
| 7 | h4_DATEXP_Workflow_Role | SH:開達書式(EXP検定)の担当者一覧の役割 | Value | 5 | ラベルが UserMessage h4_S_E_0007 本文の役割名5件(EXP検定担当者/EXP検定承認者/品質一課担当者/品質一課承認者/公開承認者)と同名 |
| 8 | h4_DeltaVersion | SH: ⊿バージョンリスト | Value | 4 | ⊿バージョン値 13 / 14 / 15 / 15-B |
| 9 | h4_destination | SH: 仕向け | Value | 27 | Form `h4_Input_CheckBoxes_Value` のコードが読み込む(仕向設定) |
| 10 | h4_DevelopmentBase | 開発拠点 | Value | 13 | Form `h4_Input_CheckBoxes_Value` のコードが読み込む(開発拠点) |
| 11 | h4_Events | SH: Δバージョン別イベントリスト | Filter Value | 84 | filter=⊿バージョン |
| 12 | h4_ModelName | SH: Δバージョン別機種呼称リスト | Filter Value | 17 | filter=⊿バージョン。Form `h4_MQPageEventUpInputInitVal` のコードが参照 |
| 13 | h4_ModelYear | SH: モデルイヤー | Value | 35 | |
| 14 | h4_MQLCS | テスト用 マルQのLCのステートのリスト ダイレクト承認用 | Value | 5 | `h4_MQPageLC` と同じ5ステート名 |
| 15 | h4_MQLDOCNULLLCS | テスト用 必要資料のLCのステートのリスト ダイレクト承認用 | Value | 7 | `h4_MQPage ReqDocsNLC` と同じ7ステート名 |
| 16 | h4_States | アイテムタイプ毎のライフサイクルフィルタリスト | Filter Value | 16 | filter=ItemType名(h4_MQPage / h4_ReqDoc / h4_Test_Result) |
| 17 | h4_TestResultLCS | テスト結果のLC | Value | 4 | `h4_Test_ResultLC` と同じ4ステート名 |
| 18 | h4_Workflow_Role | h4でのワークフローのロール | Value | 3 | Creater/Reviewer/Approver |
| 19 | h4_yryr | SH: やるやらリスト | Value | 2 | value 0=「×」、1=「○」 |

(値数は詳細表の行数。詳細表は 4.1〜4.19 でアルファベット順(フォルダのファイル名順)。)

### 4.x 各リストの値・ラベル

### 4.1 h4_ApprovalWFGroupLCS

- ファイル: `List\h4_ApprovalWFGroupLCS.xml`
- 説明: 一括承認のLCのステートのリスト表示用<br>（一括承認ではダイレクト承認はないが、表示形式を他と合わせるため）
- 種別: 通常リスト(Value) / 値数: 5

| # | value | label(ja) | label(en) | sort_order | inactive |
|---|---|---|---|---|---|
| 1 | InProgress | 作業中 |  | 0 | 0 |
| 2 | InReview | 確認中 |  | 1 | 0 |
| 3 | RequestApproval | 承認依頼 |  | 2 | 0 |
| 4 | ProvisionalApproved | 仮承認 |  | 3 | 0 |
| 5 | Approved | 承認 |  | 4 | 0 |

### 4.2 h4_category

- ファイル: `List\h4_category.xml`
- 説明: 開達書式：資料分類リスト
- 種別: 通常リスト(Value) / 値数: 4

| # | value | label(ja) | label(en) | sort_order | inactive |
|---|---|---|---|---|---|
| 1 | format | 書式 |  | 128 | 0 |
| 2 | guideline | 実施要領 |  | 256 | 0 |
| 3 | EXPTest | EXP検定 |  | 384 | 0 |
| 4 | deptDoc | 室課帳票 |  | 512 | 0 |

### 4.3 h4_checkedList

- ファイル: `List\h4_checkedList.xml`
- 説明: 確認済み のチェックボックスの代わりに追加<br>
- 種別: 通常リスト(Value) / 値数: 1

| # | value | label(ja) | label(en) | sort_order | inactive |
|---|---|---|---|---|---|
| 1 | 1 | 完了 |  | 1 | 0 |

### 4.4 h4_class

- ファイル: `List\h4_class.xml`
- 説明: マルQマスタ・マルQページの区分リスト
- 種別: 通常リスト(Value) / 値数: 3

| # | value | label(ja) | label(en) | sort_order | inactive |
|---|---|---|---|---|---|
| 1 | Dept | 室課 |  | 10 | 0 |
| 2 | Gr | Gr |  | 20 | 0 |
| 3 | Sec | Sec |  | 30 | 0 |

### 4.5 h4_confirmation_status

- ファイル: `List\h4_confirmation_status.xml`
- 説明: 対応状況
- 種別: 通常リスト(Value) / 値数: 2

| # | value | label(ja) | label(en) | sort_order | inactive |
|---|---|---|---|---|---|
| 1 | not_confirmed | 未対応 | not_confirmed | 1 | 0 |
| 2 | confirmed | 確認済み | confirmed | 2 | 0 |

### 4.6 h4_DAT_Workflow_Role

- ファイル: `List\h4_DAT_Workflow_Role.xml`
- 説明: SH:帳票マスタ・開達書式の担当者一覧の役割
- 種別: 通常リスト(Value) / 値数: 3

| # | value | label(ja) | label(en) | sort_order | inactive |
|---|---|---|---|---|---|
| 1 | Creater | 担当者 |  | 1 | 0 |
| 2 | Approver | 承認者 |  | 2 | 0 |
| 3 | ReleaseApprover | 公開承認者 |  | 3 | 0 |

### 4.7 h4_DATEXP_Workflow_Role

- ファイル: `List\h4_DATEXP_Workflow_Role.xml`
- 説明: SH:開達書式（EXP検定）の担当者一覧の役割
- 種別: 通常リスト(Value) / 値数: 5

| # | value | label(ja) | label(en) | sort_order | inactive |
|---|---|---|---|---|---|
| 1 | InspEXPStaff | EXP検定担当者 |  | 1 | 0 |
| 2 | InspEXPApprover | EXP検定承認者 |  | 2 | 0 |
| 3 | Q1Staff | 品質一課担当者 |  | 3 | 0 |
| 4 | Q1Approver | 品質一課承認者 |  | 4 | 0 |
| 5 | ReleaseApprover | 公開承認者 |  | 5 | 0 |

### 4.8 h4_DeltaVersion

- ファイル: `List\h4_DeltaVersion.xml`
- 説明: SH: ⊿バージョンリスト
- 種別: 通常リスト(Value) / 値数: 4

| # | value | label(ja) | label(en) | sort_order | inactive |
|---|---|---|---|---|---|
| 1 | 13 | ⊿13 | ⊿13 | 100 | 0 |
| 2 | 14 | ⊿14 | ⊿14 | 110 | 0 |
| 3 | 15 | ⊿15 FPS-MMC | ⊿15 FPS-MMC | 120 | 0 |
| 4 | 15-B | ⊿15 FPS-B | ⊿15 FPS-B | 130 | 0 |

### 4.9 h4_destination

- ファイル: `List\h4_destination.xml`
- 説明: SH: 仕向け
- 種別: 通常リスト(Value) / 値数: 27

| # | value | label(ja) | label(en) | sort_order | inactive |
|---|---|---|---|---|---|
| 1 | KR | KR | KR | 128 | 0 |
| 2 | KA | KA | KA | 256 | 0 |
| 3 | KL | KL | KL | 384 | 0 |
| 4 | KC | KC | KC | 512 | 0 |
| 5 | KK | KK | KK | 640 | 0 |
| 6 | KX | KX | KX | 768 | 0 |
| 7 | KD | KD | KD | 896 | 0 |
| 8 | FO | FO | FO | 1024 | 0 |
| 9 | KZ | KZ | KZ | 1152 | 0 |
| 10 | KM | KM | KM | 1280 | 0 |
| 11 | IN | IN | IN | 1408 | 0 |
| 12 | PH | PH | PH | 1536 | 0 |
| 13 | KQ | KQ | KQ | 1664 | 0 |
| 14 | KS | KS | KS | 1792 | 0 |
| 15 | VT | VT | VT | 1920 | 0 |
| 16 | KP | KP | KP | 2048 | 0 |
| 17 | KY | KY | KY | 2176 | 0 |
| 18 | MA | MA | MA | 2304 | 0 |
| 19 | PA | PA | PA | 2432 | 0 |
| 20 | KJ | KJ | KJ | 2560 | 0 |
| 21 | KH | KH | KH | 2688 | 0 |
| 22 | KN | KN | KN | 2816 | 0 |
| 23 | KU | KU | KU | 2944 | 0 |
| 24 | KE | KE | KE | 3072 | 0 |
| 25 | KG | KG | KG | 3200 | 0 |
| 26 | TR | TR | TR | 3328 | 0 |
| 27 | KW | KW | KW | 3456 | 0 |

### 4.10 h4_DevelopmentBase

- ファイル: `List\h4_DevelopmentBase.xml`
- 説明: 開発拠点
- 種別: 通常リスト(Value) / 値数: 13

| # | value | label(ja) | label(en) | sort_order | inactive |
|---|---|---|---|---|---|
| 1 | HGT | 4MOC | 4MOC | 128 | 0 |
| 2 | HGT-S | ADS-S | ADS-S | 256 | 0 |
| 3 | HRA-O | HDMA | HDMA | 384 | 0 |
| 4 | ADC | ADC | ADC | 512 | 0 |
| 5 | HGCH | HMCT | HMCT | 640 | 0 |
| 6 | GHRD | GHRD | GHRD | 768 | 0 |
| 7 | WDHAC | WDHAC | WDHAC | 896 | 0 |
| 8 | HRAP | HRAP | HRAP | 1024 | 0 |
| 9 | HRAP-MA | HRAP-MA | HRAP-MA | 1152 | 0 |
| 10 | HRIN | HRIN | HRIN | 1280 | 0 |
| 11 | HGID | HGID | HGID | 1408 | 0 |
| 12 | HRB | HRB | HRB | 1536 | 0 |
| 13 | OTHER | OTHER | OTHER | 1664 | 0 |

### 4.11 h4_Events

- ファイル: `List\h4_Events.xml`
- 説明: SH: Δバージョン別イベントリスト
- 種別: フィルタ付きリスト(Filter Value) / 値数: 84

| # | value | label(ja) | label(en) | filter | sort_order | inactive |
|---|---|---|---|---|---|---|
| 1 | - | - |  |  | 100 | 0 |
| 2 | DS0-1 | DS0/1 | DS0/1 | 15-B | 100 | 0 |
| 3 | Planning Instruction_Series Development-A | 企画立案指示書(一括開発)-A | Planning Instruction_Series Development-A | 13 | 100 | 0 |
| 4 | F1 | F1 | F1 | 14-1 | 100 | 0 |
| 5 | Planning Instruction_Series Development-C | 企画立案指示書(一括開発)-C | Planning Instruction_Series Development-C | 14 | 100 | 1 |
| 6 | Pre-DS2 | Pre DS2 | Pre DS2 | 15-B | 110 | 0 |
| 7 | Planning Instruction_Individual Model Development-C | 企画立案指示書(上屋開発)-C | Planning Instruction_Individual Model Development-C | 14 | 110 | 1 |
| 8 | Planning Instruction_Individual Model Development-A | 企画立案指示書(上屋開発)-A | Planning Instruction_Individual Model Development-A | 13 | 110 | 0 |
| 9 | F2 | F2 | F2 | 14-1 | 110 | 0 |
| 10 | V1 | V1 | V1 | 14-1 | 120 | 0 |
| 11 | DG1-A | DG1-A | DG1-A | 13 | 120 | 1 |
| 12 | DS2 | DS2 | DS2 | 15-B | 120 | 0 |
| 13 | DG1-C | DG1-C | DG1-C | 14 | 120 | 1 |
| 14 | DS0-A | DS0-A | DS0-A | 13 | 130 | 1 |
| 15 | V2-1 | V2-1 | V2-1 | 14 | 130 | 1 |
| 16 | A00-1 | A00-1 | A00-1 | 15-B | 130 | 0 |
| 17 | DS0-C | DS0-C | DS0-C | 14 | 130 | 1 |
| 18 | A00-2 | A00-2 | A00-2 | 15-B | 140 | 1 |
| 19 | DG2-C | DG2-C | DG2-C | 14 | 140 | 1 |
| 20 | DG2-A | DG2-A | DG2-A | 13 | 140 | 1 |
| 21 | V2-2 | V2-2 | V2-2 | 14 | 140 | 1 |
| 22 | V2 | V2 | V2 | 14-1 | 150 | 0 |
| 23 | DGa-A | DGa-A | DGa-A | 13 | 150 | 0 |
| 24 | DGa-C | DGa-C | DGa-C | 14 | 150 | 1 |
| 25 | 設型GO | 設型GO | 設型GO | 15-B | 150 | 0 |
| 26 | DS1-A | DS1-A | DS1-A | 13 | 160 | 0 |
| 27 | DS1-C | DS1-C | DS1-C | 14 | 160 | 1 |
| 28 | V3 | V3 | V3 | 14 | 160 | 0 |
| 29 | E1 | E1 | E1 | 15-B | 160 | 0 |
| 30 | T-Step-Mid | T確中間 | T-Step Mid | 14-1 | 170 | 0 |
| 31 | DG3-C | DG3-C | DG3-C | 14 | 170 | 1 |
| 32 | E2中間 | E2中間 | E2中間 | 15-B | 170 | 0 |
| 33 | DG3-A | DG3-A | DG3-A | 13 | 170 | 0 |
| 34 | E2 | E2 | E2 | 15-B | 180 | 0 |
| 35 | A00-1-C | A00-1-C | A00-1-C | 14 | 180 | 1 |
| 36 | T-Step | T確 | T-Step | 14-1 | 180 | 0 |
| 37 | A00-1-A | A00-1-A | A00-1-A | 13 | 180 | 0 |
| 38 | 決裁会 | 決裁会 | 決裁会 | 15-B | 190 | 0 |
| 39 | Authorization | 決裁会 | Authorization | 14-1 | 190 | 0 |
| 40 | DGb-C | DGb-C | DGb-C | 14 | 190 | 1 |
| 41 | DGb-A | DGb-A | DGb-A | 13 | 190 | 0 |
| 42 | DGc-A | DGc-A | DGc-A | 13 | 200 | 0 |
| 43 | DGc-C | DGc-C | DGc-C | 14 | 200 | 1 |
| 44 | Special | 個別イベント | Individual Event | 14-1 | 200 | 0 |
| 45 | Special | 個別イベント | Individual Event | 15-B | 200 | 0 |
| 46 | Styling Evaluation-A | デザイン評価-A | Styling Evaluation-A | 13 | 210 | 0 |
| 47 | Styling Evaluation-C | デザイン評価-C | Styling Evaluation-C | 14 | 210 | 1 |
| 48 | DS2-C | DS2-C | DS2-C | 14 | 220 | 1 |
| 49 | DS2-A | DS2-A | DS2-A | 13 | 220 | 0 |
| 50 | DG4-C | DG4-C | DG4-C | 14 | 230 | 1 |
| 51 | DG4-A | DG4-A | DG4-A | 13 | 230 | 0 |
| 52 | A00-2-A | A00-2-A | A00-2-A | 13 | 240 | 1 |
| 53 | A00-2-C | A00-2-C | A00-2-C | 14 | 240 | 1 |
| 54 | DGd-A | DGd-A | DGd-A | 13 | 250 | 1 |
| 55 | DGd-C | DGd-C | DGd-C | 14 | 250 | 1 |
| 56 | Design Die Go-A | 設型GO-A | Design Die Go-A | 13 | 260 | 0 |
| 57 | Design Die Go-C | 設型GO-C | Design Die Go-C | 14 | 260 | 1 |
| 58 | DGe-A | DGe-A | DGe-A | 13 | 270 | 0 |
| 59 | DGe-C | DGe-C | DGe-C | 14 | 270 | 1 |
| 60 | E1-C | E1-C | E1-C | 14 | 280 | 1 |
| 61 | E1-A | E1-A | E1-A | 13 | 280 | 0 |
| 62 | E2-C | E2-C | E2-C | 14 | 290 | 1 |
| 63 | E2-A | E2-A | E2-A | 13 | 290 | 0 |
| 64 | E3-C | E3-C | E3-C | 14 | 300 | 1 |
| 65 | E3-A | E3-A | E3-A | 13 | 300 | 0 |
| 66 | F1-A | F1-A |  | 15 | 310 | 1 |
| 67 | F1-C | F1-C |  | 15 | 310 | 1 |
| 68 | F2-A | F2-A |  | 15 | 320 | 1 |
| 69 | F2-C | F2-C |  | 15 | 320 | 1 |
| 70 | F3-C | F3-C |  | 15 | 330 | 1 |
| 71 | F3-A | F3-A |  | 15 | 330 | 1 |
| 72 | F4-C | F4-C |  | 15 | 340 | 1 |
| 73 | F4-A | F4-A |  | 15 | 340 | 1 |
| 74 | F5-A | F5-A |  | 15 | 350 | 1 |
| 75 | DS0 | DS0 | DS0 | 15 | 360 | 0 |
| 76 | A00-1（DS1） | A00-1（DS1） | A00-1（DS1） | 15 | 370 | 0 |
| 77 | A00-2（DS2） | A00-2（DS2） | A00-2（DS2） | 15 | 380 | 0 |
| 78 | 設型GO | 設型GO | 設型GO | 15 | 390 | 0 |
| 79 | E1 | E1 | E1 | 15 | 400 | 0 |
| 80 | E2中間 | E2中間 | E2中間 | 15 | 410 | 0 |
| 81 | E2 | E2 | E2 | 15 | 420 | 0 |
| 82 | 決裁会 | 決裁会 | 決裁会 | 15 | 430 | 0 |
| 83 | Special | 個別イベント | Individual Event | 15 | 440 | 0 |
| 84 | Special | 個別イベント |  | 13 | 450 | 0 |

### 4.12 h4_ModelName

- ファイル: `List\h4_ModelName.xml`
- 説明: SH: Δバージョン別機種呼称リスト
- 種別: フィルタ付きリスト(Filter Value) / 値数: 17

| # | value | label(ja) | label(en) | filter | sort_order | inactive |
|---|---|---|---|---|---|---|
| 1 | 13X | 13X |  | 13 | 128 | 0 |
| 2 | 14Y | 14Y |  | 14 | 256 | 0 |
| 3 | 15Z | 15Z |  | 15 | 384 | 0 |
| 4 | 13A | 13A |  | 13 | 512 | 0 |
| 5 | 14B | 14B |  | 14 | 640 | 0 |
| 6 | 15C | 15C |  | 15 | 768 | 0 |
| 7 | 9XX | 9XX |  | 15 | 896 | 0 |
| 8 | 9XX | 9XX |  | 13 | 1024 | 0 |
| 9 | IO9 | IO9 | IO9 | 13 | 1152 | 0 |
| 10 | IO9 | IO9 | IO9 | 15 | 1280 | 0 |
| 11 | PF1 | PF1 | PF1 | 14 | 1408 | 0 |
| 12 | PF1 | PF1 | PF1 | 15 | 1536 | 0 |
| 13 | PF1 | PF1 | PF1 | 13 | 1664 | 0 |
| 14 | XD7H | XD7H |  | 13 | 1792 | 0 |
| 15 | IO9 | IO9 |  | 14 | 1920 | 0 |
| 16 | XD7H | XD7H |  | 14 | 2048 | 0 |
| 17 | XD7H | XD7H |  | 15 | 2176 | 0 |

### 4.13 h4_ModelYear

- ファイル: `List\h4_ModelYear.xml`
- 説明: SH: モデルイヤー
- 種別: 通常リスト(Value) / 値数: 35

| # | value | label(ja) | label(en) | sort_order | inactive |
|---|---|---|---|---|---|
| 1 | 24 MY | 24 MY |  | 100 | 0 |
| 2 | 24.5 MY | 24.5 MY |  | 110 | 0 |
| 3 | 25 MY | 25 MY |  | 120 | 0 |
| 4 | 25.5 MY | 25.5 MY |  | 130 | 0 |
| 5 | 26 MY | 26 MY |  | 140 | 0 |
| 6 | 26.5 MY | 26.5 MY |  | 150 | 0 |
| 7 | 16.5 | 16.5M | 16.5M | 160 | 0 |
| 8 | 17.0 | 17.0M | 17.0M | 170 | 0 |
| 9 | 17.5 | 17.5M | 17.5M | 180 | 0 |
| 10 | 18.0 | 18.0M | 18.0M | 190 | 0 |
| 11 | 18.5 | 18.5M | 18.5M | 200 | 0 |
| 12 | 19.0 | 19.0M | 19.0M | 210 | 0 |
| 13 | 19.5 | 19.5M | 19.5M | 220 | 0 |
| 14 | 20.0 | 20.0M | 20.0M | 230 | 0 |
| 15 | 20.5 | 20.5M | 20.5M | 240 | 0 |
| 16 | 21.0 | 21.0M | 21.0M | 250 | 0 |
| 17 | 21.5 | 21.5M | 21.5M | 260 | 0 |
| 18 | 22.0 | 22.0M | 22.0M | 270 | 0 |
| 19 | 22.5 | 22.5M | 22.5M | 280 | 0 |
| 20 | 23.0 | 23.0M | 23.0M | 290 | 0 |
| 21 | 23.5 | 23.5M | 23.5M | 300 | 0 |
| 22 | 24.0 | 24.0M | 24.0M | 310 | 0 |
| 23 | 24.5 | 24.5M | 24.5M | 320 | 0 |
| 24 | 25.0 | 25.0M | 25.0M | 330 | 0 |
| 25 | 25.5 | 25.5M | 25.5M | 340 | 0 |
| 26 | 26.0 | 26.0M | 26.0M | 350 | 0 |
| 27 | 26.5 | 26.5M | 26.5M | 360 | 0 |
| 28 | 27.0 | 27.0M | 27.0M | 370 | 0 |
| 29 | 27.5 | 27.5M | 27.5M | 380 | 0 |
| 30 | 28.0 | 28.0M | 28.0M | 390 | 0 |
| 31 | 28.5 | 28.5M | 28.5M | 400 | 0 |
| 32 | 29.0 | 29.0M | 29.0M | 410 | 0 |
| 33 | 29.5 | 29.5M | 29.5M | 420 | 0 |
| 34 | 30.0 | 30.0M | 30.0M | 430 | 0 |
| 35 | 30.5 | 30.5M | 30.5M | 440 | 0 |

### 4.14 h4_MQLCS

- ファイル: `List\h4_MQLCS.xml`
- 説明: テスト用 マルQのLCのステートのリスト  ダイレクト承認用
- 種別: 通常リスト(Value) / 値数: 5

| # | value | label(ja) | label(en) | sort_order | inactive |
|---|---|---|---|---|---|
| 1 | InProgress | 作業中 |  | 0 | 0 |
| 2 | InReview | 確認中 |  | 1 | 0 |
| 3 | RequestApproval | 承認依頼 |  | 2 | 0 |
| 4 | ProvisionalApproved | 仮承認 |  | 3 | 0 |
| 5 | Approved | 承認 |  | 4 | 0 |

### 4.15 h4_MQLDOCNULLLCS

- ファイル: `List\h4_MQLDOCNULLLCS.xml`
- 説明: テスト用 必要資料のLCのステートのリスト  ダイレクト承認用
- 種別: 通常リスト(Value) / 値数: 7

| # | value | label(ja) | label(en) | sort_order | inactive |
|---|---|---|---|---|---|
| 1 | InProgress | 作業中 |  | 0 | 0 |
| 2 | InReview | 確認中 |  | 1 | 0 |
| 3 | RequestApproval | 承認依頼 |  | 2 | 0 |
| 4 | ProvisionalApproved | 仮承認 |  | 3 | 0 |
| 5 | Approved | 承認 |  | 4 | 0 |
| 6 | Unapproved | 承認却下 |  | 5 | 0 |
| 7 | YryrRequestApproval | やるやら承認依頼 |  | 6 | 0 |

### 4.16 h4_States

- ファイル: `List\h4_States.xml`
- 説明: アイテムタイプ毎のライフサイクルフィルタリスト
- 種別: フィルタ付きリスト(Filter Value) / 値数: 16

| # | value | label(ja) | label(en) | filter | sort_order | inactive |
|---|---|---|---|---|---|---|
| 1 | InProgress | 作業中 | InProgress | h4_MQPage | 0 | 0 |
| 2 | InReview | 確認中 | InReview | h4_MQPage | 1 | 0 |
| 3 | RequestApproval | 承認依頼 | RequestApproval | h4_MQPage | 2 | 0 |
| 4 | ProvisionalApproved | 仮承認 | ProvisionalApproved | h4_MQPage | 3 | 0 |
| 5 | Approved | 承認 | Approved | h4_MQPage | 4 | 0 |
| 6 | InProgress | 作業中 | InProgress | h4_ReqDoc | 10 | 0 |
| 7 | YryrRequestApproval | やるやら承認依頼 | YryrRequestApproval | h4_ReqDoc | 11 | 0 |
| 8 | InReview | 確認中 | InReview | h4_ReqDoc | 12 | 0 |
| 9 | RequestApproval | 承認依頼 | RequestApproval | h4_ReqDoc | 13 | 0 |
| 10 | ProvisionalApproved | 仮承認 | ProvisionalApproved | h4_ReqDoc | 14 | 0 |
| 11 | Approved | 承認 | Approved | h4_ReqDoc | 15 | 0 |
| 12 | Unapproved | 承認却下 | Unapproved | h4_ReqDoc | 16 | 0 |
| 13 | InProgress | 作業中 | InProgress | h4_Test_Result | 20 | 0 |
| 14 | InReview | 確認中 | InReview | h4_Test_Result | 21 | 0 |
| 15 | RequestApproval | 承認依頼 | RequestApproval | h4_Test_Result | 22 | 0 |
| 16 | Approved | 承認 | Approved | h4_Test_Result | 23 | 0 |

### 4.17 h4_TestResultLCS

- ファイル: `List\h4_TestResultLCS.xml`
- 説明: テスト結果のLC
- 種別: 通常リスト(Value) / 値数: 4

| # | value | label(ja) | label(en) | sort_order | inactive |
|---|---|---|---|---|---|
| 1 | InProgress | 作業中 |  | 0 | 0 |
| 2 | InReview | 確認中 |  | 1 | 0 |
| 3 | RequestApproval | 承認依頼 |  | 2 | 0 |
| 4 | Approved | 承認 |  | 3 | 0 |

### 4.18 h4_Workflow_Role

- ファイル: `List\h4_Workflow_Role.xml`
- 説明: h4でのワークフローのロール
- 種別: 通常リスト(Value) / 値数: 3

| # | value | label(ja) | label(en) | sort_order | inactive |
|---|---|---|---|---|---|
| 1 | Creater | 担当者 |  | 0 | 0 |
| 2 | Reviewer | 確認者 |  | 1 | 0 |
| 3 | Approver | 承認者 |  | 2 | 0 |

### 4.19 h4_yryr

- ファイル: `List\h4_yryr.xml`
- 説明: SH: やるやらリスト
- 種別: 通常リスト(Value) / 値数: 2

| # | value | label(ja) | label(en) | sort_order | inactive |
|---|---|---|---|---|---|
| 1 | 0 | × |  | 128 | 0 |
| 2 | 1 | ○ |  | 256 | 0 |


---

