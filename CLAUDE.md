# マルQ(Aras Innovator R30)仕様把握・可否回答・実装プロジェクト

HND-マルQ Step3(Aras Innovator R30 をカスタマイズした社内システム)について、仕様の把握、要望への実現可否の回答、インポート可能なパッケージ差分の作成を行う。
要望を受けたら `/request` から始める(`.claude/skills/` の `request` スキル)。「このボタンを押したらどうなる」「この機能の動きを教えて」のような現行仕様の質問は `explain` スキル。モードは2つ:
- **要件定義モード**: requirements → feasibility(SR-ID ごと) → implement → verify
- **クイック可否モード**: feasibility(簡易回答)のみ

## フォルダ
| 場所 | 内容 |
|---|---|
| `source/package/` | 原典の AML 820件と `imports.mf`(h4.01〜h4.15)。読み取り専用 |
| `source/codetree/` | 原典の画面コード(html/js/css)24件。読み取り専用 |
| `source/overview/` | マルQ機能概要・画面遷移図(PDF/HTML) |
| `knowledge/` | 整理済み仕様。入口は `INDEX.md`、用語は `glossary.md`、要確認は `open-questions.md`。`_legacy/機能設計書.md` は分割元の原本(編集しない) |
| `docs-official/` | Aras R30 公式資料(`R30/` に手元 PDF、`web-refs.md` に Web 参照) |
| `requests/` | 要望ごとの記録(`request.md` / `requirements.md` / `answer.md` / `implementation.md`) |
| `output/` | 生成したパッケージ差分(`package/`、`CHANGES.md`、`import-notes.md`) |
| `docs/open-items.md` | 構築時点の要確認事項の一覧(解消したら状態を更新する) |
| `tools/` | 分割・索引・検証の Python ツール(標準ライブラリのみ)。`python -m unittest discover -s tools/tests -v`。`build_index.py` と `extract_open_questions.py` は初回生成専用で、既存の `INDEX.md` `glossary.md` `open-questions.md` があると上書きを拒否する(`--force` で再生成すると手入力が消える) |

## 情報の優先順位(矛盾したときの正)
1. `source/`(原典の AML・コード) 2. `docs-official/`(手元の公式資料、R30) 3. Web の公式サイト(R30 のページと確認できたものだけ) 4. `knowledge/`(原典から導いた二次情報。根拠ファイルへのリンクを持つ)

## 必須ルール
1. `source/` は読み取り専用。変更は必ず `output/` に出す。
2. 回答や実装の根拠は、`source/` のファイルパスか `docs-official/` の該当箇所で示す。示せないことは「推測」と書き、断定しない。
3. 実現可否の回答には、影響範囲(ItemType・Method・ライフサイクル・Workflow・画面・権限)を必ず含める(クイック可否モードでは概要で可)。
4. 要望を受けたら、まず要件定義モードかクイック可否モードかを確認する(指示があればそれに従う)。
5. 要件定義モードでは、`requirements.md` を依頼者が確認する前に可否回答や実装へ進まない。クイック可否の結果だけで実装には進まない。
6. 実装は、依頼者が実現可否の回答に了解してから着手する。
7. 検証できなかった項目は「未検証」と明記し、通ったことにしない。
8. 新しい知見や食い違いは `knowledge/` と `open-questions.md` に反映する。

## 仕様書の追加
`knowledge/` に置く → `INDEX.md` に登録 → 文書冒頭に出典(作成者・日付)・対象バージョン・信頼度を書く → 原典と食い違えば原典を正とし `open-questions.md` の「食い違い記録」に追記。

## ID
業務要件は `BR-001`、システム要件は `SR-001` 形式。
