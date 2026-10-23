# 実装記録: h4_DATFormat 備考プロパティ追加

## SR-001 h4_DATFormat に文字列プロパティ h4_memo を追加
- 実装したファイル(output/2026-10-23-_example-memo-property/ 内)
  - package/imports.mf(新規パッケージ h4.16.DATFormatMemo)
  - package/DATFormatMemo/Import/ItemType/h4_DATFormat.xml(ItemType A13E2920E0A2442286CFA172EE076880 を action="edit"、入れ子で Property id=BDF65A686ABD4BB9B32565DC0FD86F3F を action="add"。string, stored_length 256, sort_order 5248, label en Remarks / ja 備考)
  - CHANGES.md, import-notes.md
- 根拠: source/package/DATFormat/Import/ItemType/h4_DATFormat.xml L780 の `<Item type="ItemType" ... action="edit">` + `<Relationships>` 形式、および同ファイル L81(h4_class)の string プロパティ定義。
- 検証結果
  - `python tools/verify_package.py output/2026-10-23-_example-memo-property/package --source source/package` -> ERROR=0 WARN=0(終了コード0)
  - `git status --porcelain source/` -> 出力なし(原典無改変)
  - `python -m unittest discover -s tools/tests` -> 23件 OK
  - 既存パッケージ上書きの有無: package/ 内のパスは DATFormatMemo/... のみで source/package と同一相対パスなし
- 未検証: 実際のインポート成否、DB列の作成、既存データへの影響、画面表示(ItemView.Form への配置は範囲外・未実装)
- 仮定: stored_length=256, column_width=160, sort_order=5248(既存最大5120の次の128刻み)は推測。
