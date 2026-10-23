<!-- meta
legacy: knowledge/_legacy/機能設計書.md L449-L459
source: source/package/RevisionHistory/Import/
-->
## 5. RevisionHistory（Form/cuiのみ。ItemType定義は DATMaster パッケージ側 §3.5）

ファイル: cui_Control/ItemView.Form.xml, cui_WindowSection/h4_RevisionHistory.xml, Form/h4_RevisionHistory.xml
- Form `h4_RevisionHistory`（Responsive, 699x234）: Bodyのみ、Field/イベントなし。FormComposite→cui_WindowSection h4_RevisionHistory。
- cui_Control ItemView.Form（id 87CD661E…）: 16フィールド（全 readonly=1）:
  h4_revision_number(text), h4_revision_sub_number(integer), managed_by_id(item), h4_newest_revision_history(item), h4_rel_dat_master(item), h4_rel_dat_format(item), h4_revised_by(item), h4_due_date(date), h4_confirmation_status(filterList), h4_applover_1(item), h4_applover_2(item), h4_revision_summary(textarea), h4_revision_reason(textarea), h4_response_note(textarea), h4_revision_date(date), created_on(date)。
- レイアウト order: Column Set 4（Set5: 確認No./枝番/管理者/最新、Set8: 対象帳票マスタ/対象開達書式/記載日）→ Column Set 1（Set2: 改訂者/対応期日/確認済み/承認者、Set11: 承認者2/改訂日）→ Column Set 10（改訂内容/改訂理由）→ Column Set 0（回答事項）。
- CommandBar/PresentationConfiguration/qry/rb: このフォルダには無し（`h4_RevisionHistory_CS` は DATMaster パッケージ側）。

---

