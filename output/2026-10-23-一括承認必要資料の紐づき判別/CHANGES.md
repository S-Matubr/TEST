# 変更一覧: 一括承認必要資料の紐づき判別

| ファイル(output/ 内) | 追加/変更/削除 | 元ファイル(source/…。新規は「なし」) | 対応 SR-ID |
|---|---|---|---|
| package/imports.mf | 追加(新規パッケージ h4.16.ReqDocApprovalLink のみ) | なし(原典の `source/package/imports.mf` は h4.15 まで。変更しない) | SR-006 |
| package/ReqDocApprovalLink/Import/ItemType/h4_ReqDoc.xml | 追加(既存 h4_ReqDoc の Property `h4_approval_group_item` を `is_hidden2` 0 に edit) | なし(対象は `source/package/AppWFGr/Import/Property/h4_approval_group_item.xml`。原典ファイルは書き換えない) | SR-006 |

## 変更しないもの(SR ごと)
- SR-001(検索画面の列): 依頼者確認により表示済み。変更なし。
- SR-002(値の表示): 既存プロパティを読み取りで使う。変更なし。
- SR-003(権限): 実装なし。実装後の検証項目(依頼者了承)。
- SR-004(既存データ): 実装なし。確認手順を `import-notes.md` に書いた。
- SR-005(判定との整合): 実装なし。検証項目として `import-notes.md` に書いた。
