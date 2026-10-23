---
name: implement
description: 実現可否が「可能」「条件付きで可能」で依頼者が了解した要件を、Innovator にインポートできるパッケージ差分(AML/Method/画面コード)として output/ に出す。source/ は変更しない。
---

# implement: パッケージ差分の作成

## 着手の前提(満たさなければ着手しない)
- 要件定義モードである(クイック可否の結果だけでは実装しない)。
- 対象 SR-ID の判定が「可能」または「条件付きで可能」。
- 依頼者が `answer.md` に了解している。

## 手順
1. `output/<YYYY-MM-DD-件名>/package/` を作る。**`source/` は一切変更しない。**
2. 新規パッケージとして出す。パッケージ名は `source/package/imports.mf` の最後の連番(h4.15)の次(`h4.16.<名前>`)から。`package/imports.mf` を作り、各パッケージのパスは `<名前>\Import`(バックスラッシュ)で書く。構成は原典と同じ `<パッケージ>/Import/<種別フォルダ>/<名前>.xml`。
3. 既存パッケージ(h4.01〜h4.15)のファイルは書き換えない。既存定義を変える場合は、新規パッケージ内の AML で `action="merge"`/`edit` などを使って表す。対象の ID は原典の該当 XML から正確に写す。
4. 既存の ID 形式(32桁16進・大文字)、`h4_` 接頭辞、コード規約に合わせる。新規 ID は `uuid.uuid4().hex.upper()` で採番し、`verify` の重複チェックで衝突を確認する。XML は原典と同じく UTF-8(BOM 付き)で書く。`imports.mf` は原典と同じく **BOM なし**。
   パッケージのフォルダ名は `h4.16.<名前>` の `<名前>` 部分にする(例: `h4.16.DATFormatMemo` なら `DATFormatMemo/Import/…`)。
   既存 ItemType に Property を足す書き方: トップレベルに `<Item type="ItemType" id="<既存ID>" action="edit">` を置き、`<Relationships>` 内に `<Item type="Property" action="add">` を入れる。原典には、新規 Property を別パッケージから既存 ItemType に足す先例が無いので、`import-notes.md` と `implementation.md` に「先例なし・インポート未検証」と必ず書く。属性値(長さ・並び順など)を既存プロパティに合わせて決めたものは、根拠を書き、推測なら「推測」と書く。
5. 画面コードを変える場合は、`source/codetree/` の対象ファイルを元にした差分を `package/` の外の `codetree/` に出し、`import-notes.md` に配置手順を書く。
6. `CHANGES.md`(`template-changes.md`)と `import-notes.md`(`template-import-notes.md`)を `output/<件名>/` に書く。
7. `verify` スキルを実行する。
8. `requests/<件名>/implementation.md` に、SR-ID ごとに「実装したファイル / 検証結果 / 未検証」を書く。検証結果の中身は `verify` スキルの報告(実行コマンド・件数・未検証)をそのまま転記する。
9. `knowledge/` は、実装物がまだ Innovator に取り込まれていない間は更新しない(現行仕様の記述が実態とずれるため)。取り込まれた後に仕様書の追加として反映する旨を `implementation.md` に書く。
