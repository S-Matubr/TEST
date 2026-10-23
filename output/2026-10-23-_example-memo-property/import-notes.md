# インポート手順: 2026-10-23-_example-memo-property

## インポート順
1. h4.16.DATFormatMemo(package/imports.mf)

## 前提
- 先にインポート済みであるべきパッケージ: h4.06.DATFormat(ItemType h4_DATFormat を定義)
- Innovator のバージョン: R30

## 手動作業
- なし(画面 ItemView.Form への h4_memo 配置は今回の SR-001 の範囲外。必要なら別 SR で cui_ControlFormField を追加)。

## ロールバック
- Property h4_memo を削除する AML を実行(未検証・別途用意):
  `<Item type="Property" action="delete" where="source_id='A13E2920E0A2442286CFA172EE076880' and name='h4_memo'" />`
- 注意: 削除すると h4_memo に入力済みのデータも失われる。

## 未検証
- Innovator へ実際にインポートできるか、列が H4_DATFORMAT に作られるか、既存データへの影響。
