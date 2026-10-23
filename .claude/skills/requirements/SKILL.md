---
name: requirements
description: 要件定義モードで、要望から業務要件(BR-)とシステム要件(SR-)を整理し requirements.md を作る。依頼者の確認を得るまで feasibility や implement へ進まない。
---

# requirements: 業務要件・システム要件の定義

入力は `requests/<件名>/request.md`。出力は `requests/<件名>/requirements.md`(`template-requirements.md` の見出しに従う)。

## 手順
1. `request.md` の原文を読む。曖昧な語は `knowledge/glossary.md` と `knowledge/INDEX.md` で、業務側の言葉と Innovator 側(ItemType 名・Method 名・画面)を対応付ける。
2. **業務要件**を整理する。ID は `BR-001` から連番。背景と課題、目的と期待効果、対象業務と利用者(役割)、現行業務フロー(As-Is)、あるべき姿(To-Be)、業務ルール、対象外。As-Is は `knowledge/` の該当ファイルを開いて現行仕様に基づいて書き、引用元ファイルを併記する。
3. **システム要件**に落とす。ID は `SR-001` から連番。機能(画面・操作・処理・承認フロー・通知)、データ(ItemType・プロパティ・関係)、権限、画面・帳票、移行・既存データへの影響、非機能(性能・監査・操作ログ)。各 SR は対応する BR の ID を持ち、末尾のトレーサビリティ表に載せる。
4. 不明点は**依頼者へ1問ずつ**質問して埋める。質問は、要件の方向を最も左右する1問を先に聞き、残りは「未確定事項」に書いて順に聞く。推測で埋めない。`knowledge/` に現行の記述が無い As-Is は「knowledge に記述なし(未確認)」と書き、未確定事項にも載せる。
   画面・帳票への配置(項目を画面に出すか)は、データ要件とは別の SR として含めるかを必ず確認する(プロパティを足しても画面には出ない)。
5. 完成したら依頼者に提示し、**確認(了解)を得るまで** `feasibility` にも `implement` にも進まない。確認結果は `requirements.md` 末尾に日付つきで書く。
6. 確認後、`feasibility` スキルを使う(SR-ID ごとの判定)。

## やらないこと
- 実現方法(どの Method をどう直すか)の決め打ちはしない。それは feasibility と implement の仕事。
- `source/` を変更しない。
