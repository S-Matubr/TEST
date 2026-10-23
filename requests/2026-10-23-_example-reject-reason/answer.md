# 実現可否の回答: _example-reject-reason

モード: クイック可否  回答日: 2026-10-23

## 要望: 承認フローの差戻し(Reject)時に理由を必須にする
- 判定: 条件付きで可能
- 根拠:
  - 差戻しパス名は `Reject`(一部 EXP 版は小文字 `reject`)。`source/package/WFMap/Import/Workflow Map/h4_ApprovalWFMQAndReqDoc.xml`(Path `Reject`)、`h4_ApprovalWFGroupWF.xml`、`h4_Test_ResultWF.xml`、`h4_DATFormatWF.xml`、`h4_DATFormatEXPWF.xml`(`Reject` / `reject`)。
  - MQPage/ReqDoc/TestResult/一括承認 系は、WF の on_close に `h4_GetWFComment` が設定され(例 `h4_ApprovalWFGroupWF.xml` の Method `h4_GetWFComment`)、`source/package/Independent/Import/Method/h4_GetWFComment.xml` の `pathName == "Reject" || "ProvisionalApprove" || YryrReject` でコメントが空なら `h4_S_E_0811`(`source/package/Independent/Import/UserMessage/h4_S_E_0811.xml`「否認、仮承認の場合はコメントを入力してください。」)のエラーで止める。つまりこれらは既に必須。
  - 帳票マスタ・開達書式系(`h4_DATFormatWF.xml` / `h4_DATFormatEXPWF.xml`)は `source/package/Independent/Import/Method/h4_getWFComment_DAT.xml` を使うが、同ファイルに `h4_S_E_0811` のコメント必須チェックは見当たらない(grep で確認)。よってこちらは必須になっていない。
  - 一括承認(h4_AppWFGroupForDATFormat)の否認は h4_getWFComment_DAT 内で指摘(h4_PointOut)を作成する(同ファイル 694 行付近)。
  - `docs-official/R30/` は空のため公式資料の根拠なし(推測の部分は無し、上記はすべて source/ で確認)。
- 影響範囲の概要:
  - ItemType: 対象 ItemType は h4_DATFormat / h4_DATMaster / h4_AppWFGroupForDATFormat(DAT系)。MQPage・ReqDoc・Test_Result・ApprovalWFGroup は対応済み。
  - Method: `h4_getWFComment_DAT`(追加チェック)
  - ライフサイクル: 変更なし(推測)
  - Workflow: 変更不要(on_close に既に h4_getWFComment_DAT が設定済み)
  - 画面: 変更なし(コメント入力は標準の投票ダイアログ)
  - 権限: なし
- 実現方法: DAT系は Method 変更(h4_getWFComment_DAT に h4_GetWFComment と同様のコメント空チェックを追加)。それ以外は対応済みで設定不要。
- 主なリスクと未確認事項: 対象とする承認フロー(どの ItemType か)が依頼文から特定できない。EXP 版は path 名が小文字 `reject` の定義があり大小文字の扱いに注意。実環境(R30)での動作は未検証。
