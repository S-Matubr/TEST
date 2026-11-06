# 実現可否の回答: マルQページ削除

モード: クイック可否  回答日: 2026-10-23

## 要望: マルQページ(h4_MQPage)を画面から削除できるようにする
- 判定: **条件付きで可能**
- 根拠(確認日 2026-10-23):
  - 画面に削除ボタンが無い: `source/package/Independent/Import/CommandBarSection/h4_MQPage_IVICB.xml`(Save/Done/Create/Copy/EventUp/DirectApp 等のみ)、`h4_MQPage_SVCB.xml`(Create/EventUp/Copy/WF 系のみ)に delete/purge 系の項目なし。
  - 権限の側は削除を許している状態がある: `Independent/Import/Permission/h4_InProgress.xml` は Creator・Manager・Administrators が `can_delete=1`(Owner は 0)。`h4_PendingApproval.xml` と `h4_Approved.xml` は Administrators のみ `can_delete=1`。ライフサイクル `Independent/Import/Life Cycle Map/h4_MQPageLC.xml` は InProgress/PendingApproval/Approved の各ステートにこれらを割り当てている。
  - ItemType に削除用のサーバーイベント(onBeforeDelete 等)は無い: `source/package/MQPage/Import/ItemType/h4_MQPage.xml`(knowledge/itemtypes/g-MQPage.md 参照)。
  - 関連(必要資料・指摘・CLN・サインオフ)は `is_dependent=0`、`behavior=float`: `Last/Import/RelationshipType/h4_MQPage ReqDoc.xml` ほか。
  - 標準の Delete/Purge の挙動そのものは未確認(`docs-official/R30/` は今回引いていない)。
- 影響範囲(概要):
  - ItemType: h4_MQPage(削除対象)。関連先 h4_ReqDoc / h4_PointOut / h4_Test_Result / h4_ApprovalWFGroup(承認対象)への影響あり。
  - Method: 削除前チェック用(承認WF中・関連データありの拒否など)の onBeforeDelete 追加を推奨。既存 Method の変更は不要の見込み(推測)。
  - ライフサイクル / 権限: h4_MQPageLC と上記 Permission。InProgress 以外で削除させたい場合は Permission の `can_delete` 変更が要る。
  - Workflow: 実行中の h4_ApprovalWFMQAndReqDoc / 一括承認(h4_ApprovalTarget)に載った MQPage の扱いを決める必要あり。
  - 画面: h4_MQPage_IVICB と h4_MQPage_SVCB に削除ボタンを追加。
- 実現方法: 設定(CommandBar へのボタン追加、Permission の確認)が中心。関連データの扱いを制御するなら Method(onBeforeDelete)の追加が必要。
- リスクと未確認事項:
  - 関連の ReqDoc・指摘・検証結果が MQPage 削除後に孤立する可能性(float 関連のため。推測)。関連ごと消すのか、関連があれば削除不可にするのかの仕様決めが要る。
  - 版管理(is_versionable=1)の履歴の扱い: 削除(全版)か、論理削除か。
  - 一括承認の承認対象、イベント関連(h4_pre_event 等で他ページから参照)のページを消した場合の整合。
  - 承認済み(Approved)の削除を許すか(現状は Administrators のみ権限あり)。
  - R30 標準の Delete / Purge の挙動は未検証。

## 依頼者了解(implement の着手条件)
- 依頼者了解: 未

## 確認したい点(実装に進む場合)
1. 削除を許すステート(InProgress のみ / 全ステート)と、実行できる人(作成者・管理者など)
2. 関連データ(必要資料・指摘・検証結果)を一緒に消すか、あれば削除不可にするか
3. 完全削除(Purge)か、履歴を残す削除か
