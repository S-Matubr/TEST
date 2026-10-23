---
name: explain
description: 「このボタンを押したらどうなるか」「この機能・画面・Method・ライフサイクルの動きを教えて」のように、マルQの現行仕様の説明を求められたときに使う。原典(source/)の AML・コードを開いて、根拠つきで説明する。変更の要望は request スキルへ。
---

# explain: 現行仕様の説明

要望(変更したい・追加したい)ではなく、**今どう動くか**を聞かれたときのスキル。要望なら `request` スキルを使う。

## 1. 対象を特定する
`knowledge/INDEX.md` で引く。入口ごとに使う索引が違う。
| 聞かれたもの | 引く場所 |
|---|---|
| 画面のボタン・メニュー(「MaruQ > Create」など) | INDEX「ボタン・メニュー索引」(ラベルまたはボタン名 → 親メニュー → 画面区分 → クリックMethod) |
| Method 名 | INDEX「Method 索引」 |
| ItemType・業務用語 | INDEX「ItemType 索引」、`knowledge/glossary.md` |
| ライフサイクル / Workflow / 画面コード | INDEX の各索引 |
- 候補が複数ある、または見つからないときは、候補を並べて**1問だけ**確認する。推測で1つに決めない。
- 索引の「画面」欄は、検索画面が `SearchView.CommandBar`、アイテム画面が `ItemView.ItemCommandBar`。質問に画面名(「検索画面」「アイテム画面」)があれば、それで候補を絞ってよい。絞った事実と、除外した候補(例: アイテム画面の同名ボタン)は、回答の冒頭に書く。「(画面に未配置)」のボタンは、どの画面にも出ていない。
- ファイル名と内部名(`<name>`)が違うものがある(例: `CommandBarButton/h4_svcb_create_deptMQMaster.xml` の `<name>` は `h4_uu_svcb_create_deptMQMaster`)。名前で探すときは `<name>` 要素も `grep` する。

## 2. 原典を開いて確認する
`knowledge/` は入口として使い、**説明の根拠は原典で確認した内容**にする。
1. ボタン定義(`source/package/Independent/Import/` の `CommandBarButton/`・`CommandBarMenuButton/`、親メニューは `CommandBarMenu/`、画面区分は `CommandBarSection/`)から、クリック Method(`on_click_handler`)と初期化 Method(`on_init_handler`)を特定する。初期化 Method はボタンの有効・無効の条件を決めていることが多いので、必ず読む。
2. Method 本体(`source/package/Independent/Import/Method/<名前>.xml` の `method_code`)を最後まで読む。
3. その中で呼ばれるもの(`applyMethod` / `newItem("Method", …)`、ダイアログのフォーム、`UserMessage`、`List`)を辿る。階層は、クリック Method を1、そこから呼ぶ Method・フォームを2、その先を3と数え、**3まで**読む。それより先は「未追跡」と書く。`UserMessage` と `List` の値は階層に数えず、回答に出てくるものは読む。
   - フォームのボタンが呼ぶ Method は、Form の XML にあるフィールドイベントから Method 名を拾い、`Method/<名前>.xml` を開く。見つからなければ Form 内の埋め込みコード(`sk_method_code` など)を見る。
   - `UserMessage` の本文は `i18n:text xml:lang="ja"` にあることが多い。`text` や `xml:lang="en"` に日本語が入っているものもあるので、`ja` が無ければ他の要素も見る。
4. 画面コード(Wijmo の表など)は `source/codetree/`、フォームは `source/package/*/Import/Form/`。
5. 標準機能の動きは `docs-official/R30/*.txt` を `grep` し、「文書名 p.N」で示す。
- `knowledge/` と原典が食い違ったら原典を採用し、`knowledge/open-questions.md` の「食い違い記録」に追記する(読み取り専用で頼まれたときは追記せず、回答の「気づいた点」に書き、追記してよいか確認する)。

## 3. 回答の構成
1. 何のボタン/機能か(画面、名前、ラベル)
2. 画面での流れ(ユーザー操作の順)
3. サーバー側の処理(作る・更新するアイテム、呼ぶ Method)
4. エラーと分岐(どの条件でどのメッセージか。メッセージ本文も `UserMessage` で確認する)
5. 気づいた点(メッセージと条件の食い違い、未処理の分岐、失敗時の後始末など。あれば)
6. 根拠(`source/` のパスと、確認した要素・Method 名)
7. 確認できなかったこと(実機の画面・権限・データ、未追跡の呼び出し先)。**回答の結論を変えうるものだけ**書く。網羅的な「やっていないことの一覧」にしない。

## 規則
- 根拠を示せないことは「推測」と書く。コードから読めた範囲を超えて、実機の挙動を断定しない。
- 変更したくなった場合は、回答のあとで `request` スキルに渡す(ここでは変更しない)。
- 質問のやり取りはファイルに残さない。ただし、新しく分かった食い違いや誤りは `open-questions.md` に記録する。
