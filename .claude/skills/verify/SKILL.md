---
name: verify
description: output/ に出したパッケージ差分を検証する(XML構文・必須属性・ID重複・参照・imports.mf・原典無改変)。成功を主張する前に必ず使う。検証できなかった項目は「未検証」と明記する。
---

# verify: パッケージ差分の検証

対象は `output/<件名>/package/`。次を**実際に実行し、出力を読んでから**結果を書く。

## 1. 自動検証
```bash
python tools/verify_package.py output/<件名>/package --source source/package
```
- ERROR が 0 であること(終了コード 0)。ERROR があれば直して再実行する。
- WARN は「参照先が出力にも原典にもない」もの。Aras 標準アイテム(Identity、List 等)の可能性が高い。一覧を `implementation.md` に転記し、**この変更が新しく導入した参照だけ**を人が見て、標準アイテムか判断する(原典自身にも標準アイテム参照の WARN が多数あるのは正常)。
- ツール自体のテスト: `python -m unittest discover -s tools/tests`。

## 2. 原典が無改変か
```bash
git status --porcelain source/
```
出力が空であること。

## 3. 既存パッケージを書き換えていないか
出力の `package/` 内に、`source/package/` と同じ相対パスのファイルがあれば、それは既存定義の上書き。AML の `action`(`merge` 等)で意図したものだけが許される。一覧を `CHANGES.md` と突き合わせる。

## 4. 未検証の列挙
次のように Innovator 上でしか確認できない項目は、通ったことにせず「未検証」と書く。
- 実際のインポート成否、Method の実行結果、画面表示・操作、権限の効き方、既存データへの影響。

## 報告
`implementation.md` に、実行したコマンド・結果(ERROR/WARN 件数)・未検証の一覧を書く。1・2 の出力を見ていないうちは「検証済み」と言わない。
