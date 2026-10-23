---
name: feasibility
description: 要望またはシステム要件(SR-ID)に対して、マルQ(Aras Innovator R30)で実現できるかを、原典(source/)の根拠と影響範囲つきで回答し answer.md に出す。
---

# feasibility: 実現可否の回答

## 入力と出力
- 要件定義モード: `requirements.md`(依頼者確認済み)の **SR-ID ごと**に判定。
- クイック可否モード: `request.md` の原文に対して簡易回答。
- 出力は `requests/<件名>/answer.md`(`template-answer.md` に従う)。

## 判定値(この4つだけ)
可能 / 条件付きで可能 / 標準機能の範囲外 / 現時点で判断不能

## 調べ方
1. `knowledge/INDEX.md` と `knowledge/glossary.md` で、関係する ItemType・Method・ライフサイクル・Workflow・画面を特定する。
2. 特定したものの **原典ファイルを実際に開いて確認**する(`source/package/<パッケージ>/Import/…`、画面は `source/codetree/…`)。確認できた箇所は確認日を付け、`knowledge/open-questions.md` に該当の「推測」行があれば状態と結果を更新する。
3. 標準機能の可否・仕様は `docs-official/R30/` を引く。無ければ公式サイトを調べ、R30 のページと確認できたものだけ根拠にして `docs-official/web-refs.md` に追記する。版が確認できなければ「版が未確認」と書き、根拠にしない。
4. 公式書類と `source/` が食い違えば `source/` を正とし、`open-questions.md` の「食い違い記録」に追記する。

## 書き方の規則
- 根拠は `source/` の実在するファイルパス(と要素名)で示し、確認した日付を併記する。示せない記述には「推測」と書き、断定しない。
- 対象の ItemType・フローが要望から特定できず、判定が変わりうる場合は、依頼者に1問確認する。判定が変わらないなら、置いた前提を `answer.md` に明記して進める。
- 一部は実現済み・一部は未対応のときは「条件付きで可能」とし、内訳(どこが済みでどこに変更が要るか)を書く。
- 影響範囲には ItemType・Method・ライフサイクル・Workflow・画面・権限を挙げる(該当なしは「なし」と書く)。
- 実現方法は「設定だけで足りる」か「Method/画面コードの変更が要る」かまで書く。実装そのものはしない。
- クイック可否モードは、判定・根拠・影響範囲の概要・主なリスクだけを書く。
- 回答後、依頼者が了解したら `answer.md` の「依頼者了解」欄に日付と対象 SR-ID を書く(implement の着手条件)。
