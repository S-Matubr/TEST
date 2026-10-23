# 公式書類(Aras Innovator R30)

対象バージョンは **R30**。`source/`(原典)と食い違った場合は `source/` を正とする。

## 手元の PDF
- 置き場所: `docs-official/R30/`
- テキスト化: `python tools/pdf_to_text.py`(`pdftotext` を使用)で `<PDF名>.txt` を隣に生成する。ページ区切りは `=== p.N ===` で、根拠には「文書名 p.N」と書く。PDF を追加したら再実行する。
- 各テキストの冒頭に、文書名・版・入手元を書く。版が R30 と確認できない文書は、その旨を冒頭に明記する。

## Web での補完
- 手元に無い内容だけ Aras 公式サイトで調べる。
- R30 のページと確認できたものだけ根拠にする。確認できなければ「版が未確認」と注記し、根拠にしない。
- 参照したページは `web-refs.md` に URL・取得日・版・参照目的・要点を追記する。

## 食い違いの扱い
公式書類の記述と `source/` が食い違ったら、`knowledge/open-questions.md` の「食い違い記録」に追記する。

## 配置済みの文書(R30)
| 文書 | ページ数 | テキスト |
|---|---|---|
| Aras Innovator 30 - Life Cycles | 18 | `docs-official/R30/Aras Innovator 30 - Life Cycles.txt` |
| Aras Innovator 30 - Programmer's Guide | 106 | `docs-official/R30/Aras Innovator 30 - Programmer's Guide.txt` |
| Aras Innovator 30 - Release Notes | 18 | `docs-official/R30/Aras Innovator 30 - Release Notes.txt` |
| Aras Innovator 30 - RESTful API | 44 | `docs-official/R30/Aras Innovator 30 - RESTful API.txt` |
| Aras Innovator 30 - Tree Grid View Administrator Guide | 56 | `docs-official/R30/Aras Innovator 30 - Tree Grid View Administrator Guide.txt` |

探し方: `grep -n -i "<キーワード>" docs-official/R30/*.txt` で該当ページを探し、`=== p.N ===` から文書名とページを特定して根拠に書く。入手元の URL は未記録(ユーザー提供)。

ページ番号つきで検索する例(`Promote` を含む行と、その文書名・ページを出す):
```bash
awk '/^=== p\.[0-9]+ ===/{p=$2} /Promote/ && !/^=== /{print FILENAME": "p": "substr($0,1,90)}' docs-official/R30/*.txt
```
