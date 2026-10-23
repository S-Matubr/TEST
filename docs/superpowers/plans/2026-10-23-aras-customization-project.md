# Aras Innovator 社内カスタマイズ 仕様把握・可否回答・実装プロジェクト Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** マルQ(Aras Innovator R30 ベース)の仕様ナレッジ、要望の入口スキル群、パッケージ差分の検証ツールを備えた Claude Code 作業プロジェクトを `C:\Claude\TEST` に構築する。

**Architecture:** 原典(`source/`)を読み取り専用の正とし、既存の `機能設計書.md` を無改変で `knowledge/` に分割する(分割は損失なしであることをテストで保証)。要望は `request` スキルがモードを決め、`requirements` → `feasibility` → `implement` → `verify` に流す。ツールは Python 3 標準ライブラリのみで書く。

**Tech Stack:** Python 3(標準ライブラリ、`unittest`)、Markdown、Claude Code スキル(`.claude/skills/<name>/SKILL.md`)、git。

**Spec:** `docs/superpowers/specs/2026-10-23-aras-customization-project-design.md`

## Global Constraints

- 作業ディレクトリは `C:\Claude\TEST`(git リポジトリ。既にコミット済み: 設計書のみ)。コマンドはこのディレクトリで実行する。
- 対象バージョンは Aras Innovator **R30**。
- `source/` は読み取り専用。`source/` 配下の内容は一切編集しない。変更は `output/` に出す。
- 情報の優先順位: `source/` > `docs-official/` > Web の公式サイト(R30 確認分のみ) > `knowledge/`。
- 根拠を示せないことは「推測」と明記する。検証できなかった項目は「未検証」と明記する。
- 分割時に `機能設計書.md` の内容は要約も改変もしない。
- 既存パッケージ h4.01〜h4.15 は書き換えない(変更は新規パッケージ、または AML の `action` 属性による上書き)。
- 業務要件 ID は `BR-001`、システム要件 ID は `SR-001` 形式。
- 要件定義モードは `requirements.md` の依頼者確認前に可否回答・実装へ進まない。クイック可否モードの結果だけでは実装に進まない。
- Python ツールは標準ライブラリのみ。テストは `python -m unittest discover -s tools/tests -v`。日本語・空白を含むパスを扱える(`pathlib`、UTF-8、BOM 付き XML を許容)。

## Review Focus

- `機能設計書.md` が UTF-8 BOM・CRLF/LF 混在でも、分割→再結合で1バイトも変わらない(Task 3 でテスト)。
- 日本語・空白を含むパス(`Step3パッケージ`、`imports.mf` の `Independent\Import` のバックスラッシュ)で検証ツールが動く(Task 1, 9 でテスト)。
- BOM 付き AML(原典は全て `﻿<AML>` で始まる)を壊れた XML と誤判定しない(Task 9 でテスト)。
- 出力差分が Aras 標準アイテム(Identity 等、パッケージ外の ID)を参照しても ERROR にしない(WARN にとどめる。Task 9 でテスト)。
- モード指定が無い、または両方書かれた曖昧な要望では、`request` スキルが推測せず1問だけ確認する(Task 7 のシナリオ検証)。

---

## ファイル構成(最終形)

```
.gitattributes                      source/** と knowledge/** を -text(改行を変えない)
CLAUDE.md
source/package/                     imports.mf + 各パッケージ/Import/…(原典 AML 820件)
source/codetree/                    原典の画面コード 24件
source/overview/                    マルQ_機能概要.pdf、マルQ_機能一覧_画面遷移図.pdf、_pdf/、func.html
knowledge/_legacy/機能設計書.md      原本(分割元。編集しない)
knowledge/{common,itemtypes,lifecycles,workflows,screens,methods}/  分割結果
knowledge/{INDEX.md,glossary.md,open-questions.md}
docs-official/{README.md,web-refs.md,R30/}
requests/ output/                   (空。.gitkeep のみ)
tools/{split_design.py,extract_open_questions.py,build_index.py,verify_package.py}
tools/tests/test_*.py
.claude/skills/{request,requirements,feasibility,implement,verify}/SKILL.md
```

---

### Task 1: 原典を `source/` へ移し、フォルダ骨格を作る

**Files:**
- Create: `.gitattributes`, `requests/.gitkeep`, `output/.gitkeep`, `docs-official/R30/.gitkeep`
- Move: 原典・PDF・設計書(下記)

- [ ] **Step 1: 移動前の件数を記録する**
  Run(PowerShell、`C:\Claude\TEST` から。シェルの現在位置が原典フォルダ内なら先に `Set-Location C:\Claude\TEST`):
  `(Get-ChildItem "HND-マルQ Step3パッケージ" -Recurse -File).Count` → 821、`(Get-ChildItem "HND-マルQ Step3コードツリー" -Recurse -File).Count` → 24。

- [ ] **Step 2: `.gitattributes` を作る**
  内容は2行: `source/** -text` と `knowledge/** -text`(コミット時に改行変換されないようにする)。

- [ ] **Step 3: 移動する**
  - `HND-マルQ Step3パッケージ\Step3パッケージ` の中身 → `source\package\`(`source\package\imports.mf` が存在する形)。
  - `HND-マルQ Step3コードツリー\コードツリー` の中身 → `source\codetree\`。
  - `マルQ_機能概要.pdf`、`マルQ_機能一覧_画面遷移図.pdf`、`_pdf\`、`func.html` → `source\overview\`。
  - `機能設計書.md` → `knowledge\_legacy\機能設計書.md`。
  - 空になった旧フォルダは、空であることを確認してから削除する。

- [ ] **Step 4: 件数を検証する**
  Run: `(Get-ChildItem source\package -Recurse -File).Count` → 821(xml 820 + imports.mf 1)、`(Get-ChildItem source\codetree -Recurse -File).Count` → 24、`Test-Path source\package\imports.mf` → True、`Test-Path knowledge\_legacy\機能設計書.md` → True。1つでも違えば中止して原因を調べる。

- [ ] **Step 5: Commit**
  `git add -A` のあと `git status --short` でルート直下に旧フォルダが残っていないことを確認し、`git commit -m "chore: move originals into source/ and knowledge/_legacy"`。

---

### Task 2: CLAUDE.md

**Files:**
- Create: `CLAUDE.md`

- [ ] **Step 1: `CLAUDE.md` を書く**(日本語、60行以内)。次を含める:
  - 概要: 本プロジェクトの目的と対象(マルQ、R30)、2モード(要件定義/クイック可否)の入口は `/request`(skills は `.claude/skills/`)。
  - フォルダ早見表(上記ファイル構成)。
  - 情報の優先順位(Global Constraints と同文)。
  - 必須ルール8項目(設計書 5章と同じ番号・同じ文言)。
  - 仕様書の追加手順(`knowledge/` に置く → `INDEX.md` に登録 → 冒頭に出典・日付・対象バージョン・信頼度 → 原典と食い違えば `open-questions.md` に記録)。

- [ ] **Step 2: 検証**
  Run: `Select-String -Path CLAUDE.md -Pattern 'source/','R30','BR-001','SR-001','/request'` → 5パターンすべてがヒットする。

- [ ] **Step 3: Commit** `git add CLAUDE.md && git commit -m "docs: add CLAUDE.md working rules"`

---

### Task 3: 設計書の損失なし分割ツール

**Files:**
- Create: `tools/split_design.py`, `tools/tests/test_split_design.py`
- Generate: `knowledge/{common,itemtypes,lifecycles,workflows,screens,methods}/*.md`

**Interfaces:**
- Produces:
  - `@dataclass Section: start: int; end: int; target: str`(1始まり・両端含む行番号、`target` は `knowledge/` からの相対パス)
  - `plan_sections(lines: list[str]) -> list[Section]`
  - `write_sections(lines: list[str], sections: list[Section], knowledge_dir: Path, legacy_name: str) -> None`
  - `reassemble(knowledge_dir: Path, sections: list[Section]) -> list[str]`
  - CLI: `python tools/split_design.py` が `knowledge/_legacy/機能設計書.md` を読み、`knowledge/` に書く。
  - 各出力ファイルは先頭に `<!-- meta` 〜 `-->` の1ブロック(根拠 `source/` の対象パッケージ、元ファイル名と元の行範囲 `L<start>-L<end>`)を持ち、その後ろは元の行そのまま。

分割ルール(`plan_sections` が実装する。行は `機能設計書.md` の現行行番号):
| 範囲 | target |
|---|---|
| 1〜56(表紙・全体構成・目次) | `common/00-overview.md` |
| F: `## 0.` 共通事項 / `## 9.` 横断メモ | `common/f-0-共通事項.md` / `common/f-9-横断メモ.md` |
| F: `## 1.`〜`## 8.`(各パッケージ) | `itemtypes/f-<番号>-<パッケージ名>.md`(例 `f-1-DATFormat.md`) |
| G: `# G.` 導入見出しは直後の `# n. パッケージ` に含める。`# 1.`〜`# 5.`(MQPage, PointOut, ReqDoc, TestResult, Last) | `itemtypes/g-<パッケージ名>.md` |
| G: `# 6. パッケージ WFMap` | `workflows/g-WFMap.md` |
| E: `## 1. パッケージ構成`、`## 3. Permission`、`## 4. List`、`## 5. Form`、`## 6. メニュー/ボタン`、`## 7. その他` | `common/e-<名前>.md` |
| E: `## 2. Life Cycle Map` | `lifecycles/e-LifeCycleMap.md` |
| `# B_method1a`〜`1f`、`# Method AML 調査 C_method2a`〜`2i`、`# D_method3a`〜`3e` | `methods/<b1a…d3e>.md`(元のチャンクごと) |
| `# A. コードツリー` 〜 末尾 | `screens/a-codetree.md` |
(E の `# E.` チャンク見出しは直後の `##` セクションに含める。上表に無い行が残る場合は、直前のセクションに含めて連続性を保つ。)

- [ ] **Step 1: 失敗するテストを書く**(`test_split_design.py`、`unittest`)
  - `test_sections_are_contiguous_and_cover_all_lines`: 実ファイル `knowledge/_legacy/機能設計書.md` を `newline=''` のバイト保持で読み、`plan_sections` の結果が 1 から `len(lines)` まで隙間・重複なし。
  - `test_reassembly_is_lossless`: `write_sections` を一時ディレクトリへ出力 → `reassemble` した結果が元の行リストと完全一致(BOM と CRLF/LF 混在を含む)。
  - `test_key_targets_exist`: ターゲットに `itemtypes/f-1-DATFormat.md`、`itemtypes/g-MQPage.md`、`workflows/g-WFMap.md`、`lifecycles/e-LifeCycleMap.md`、`methods/b1a.md`、`methods/d3e.md`、`screens/a-codetree.md` が含まれる。
  - `test_meta_block_records_line_range`: `methods/b1a.md` の meta に `L4786-L4898` が含まれる(次のチャンク `# B_method1b` が 4899 行から)。

- [ ] **Step 2: テストを実行して失敗を確認する**
  Run: `python -m unittest discover -s tools/tests -v` → `ModuleNotFoundError: split_design` で FAIL。

- [ ] **Step 3: `tools/split_design.py` を実装する**(シグネチャは上記)。見出しの正規表現でセクションを検出する。読み書きは `open(..., newline='', encoding='utf-8')` で行い、BOM と改行コードを保持する。`reassemble` は meta ブロックを除いて連結する。

- [ ] **Step 4: テストを実行して通ることを確認する**
  Run: `python -m unittest discover -s tools/tests -v` → 全 PASS。

- [ ] **Step 5: 実データに適用する**
  Run: `python tools/split_design.py`。続けて `(Get-ChildItem knowledge -Recurse -File -Filter *.md | Where-Object { $_.FullName -notmatch '_legacy' }).Count` で生成数を確認(ファイル数 ≒ 40前後を想定。想定外に少なければ見出し検出を見直す)。

- [ ] **Step 6: Commit**
  `git add tools knowledge && git commit -m "feat: add lossless design-doc splitter and generate knowledge/"`

---

### Task 4: open-questions の抽出

**Files:**
- Create: `tools/extract_open_questions.py`, `tools/tests/test_extract_open_questions.py`
- Generate: `knowledge/open-questions.md`

**Interfaces:**
- Consumes: Task 3 の `plan_sections`(元の行番号 → 分割後ファイルの対応付けに使う)。
- Produces:
  - `@dataclass Entry: legacy_line: int; target: str; text: str`
  - `extract(lines: list[str], sections: list[Section]) -> list[Entry]`(「推測」を含む行を全て、重複なしで)
  - `render(entries: list[Entry]) -> str`(表: `# | 該当ファイル | 元の行 | 記述 | 状態(未確認) | 確認日 | 結果`)

- [ ] **Step 1: 失敗するテストを書く**
  - `test_extracts_every_line_containing_suiso`: 実ファイルに対し `len(extract(...))` が「推測」を含む行数と一致し、かつ 147 に等しい(設計書 §4.1 の値)。
  - `test_entry_points_to_split_file`: 全 Entry の `target` が `plan_sections` のターゲット集合に含まれる。
  - `test_render_marks_all_unconfirmed`: `render` の出力で状態列が全行「未確認」。

- [ ] **Step 2: 失敗を確認する** Run: `python -m unittest discover -s tools/tests -v` → FAIL(モジュール無し)。

- [ ] **Step 3: 実装する**(上記シグネチャ)。CLI は `knowledge/open-questions.md` に出力する。冒頭に「食い違い記録」セクション(公式書類・追加仕様書と原典の食い違いを手で追記する場所)を空で置く。

- [ ] **Step 4: 通ることを確認し、実データに適用する**
  Run: `python -m unittest discover -s tools/tests -v` → 全 PASS、続けて `python tools/extract_open_questions.py`。

- [ ] **Step 5: Commit** `git add tools knowledge/open-questions.md && git commit -m "feat: extract inference markers into open-questions.md"`

---

### Task 5: INDEX.md と glossary.md

**Files:**
- Create: `tools/build_index.py`, `tools/tests/test_build_index.py`
- Generate: `knowledge/INDEX.md`, `knowledge/glossary.md`

**Interfaces:**
- Produces:
  - `build_index(knowledge_dir: Path, source_dir: Path) -> str`: `knowledge/` 配下の各ファイル(パス・先頭見出し・meta の元行範囲)の一覧 + Method 名 → 該当ファイルの対応表。Method 名は `source_dir/package/Independent/Import/Method/*.xml` のファイル名(拡張子除く)を正とし、その名前を `knowledge/methods/*.md` から検索して対応付ける。見つからない名前は「未対応(knowledge/methods に記述なし)」節に列挙する(黙って落とさない)。
  - `build_glossary(source_dir: Path) -> str`: 全 `ItemType/*.xml` から `name`、日本語ラベル(`i18n:label xml:lang="ja"`)、英語ラベル(`label xml:lang="en"`)を拾い、`ItemType名 | 日本語 | 英語 | 業務での言い方(空欄)` の表にする。
  - CLI は両ファイルを `knowledge/` に書く。

- [ ] **Step 1: 失敗するテストを書く**
  - `test_index_maps_known_method`: `build_index` の出力に `h4_addDatFormatCheck` と `methods/b1a.md` が同じ行にある。
  - `test_index_reports_unmapped_instead_of_dropping`: 出力に「未対応」節の見出しがあり、(対応付けた名前の数 + 未対応の数) が `source/package/Independent/Import/Method/` の XML 件数(273)に等しい。
  - `test_glossary_has_datformat`: 出力に `h4_DATFormat` と `開達書式` と `TE Format` が同じ行にある。

- [ ] **Step 2: 失敗を確認する** → FAIL。

- [ ] **Step 3: 実装する**。XML は BOM 付きでも読めるよう `ElementTree.parse` に `utf-8-sig` で開いたストリームを渡す。名前空間 `i18n` は `http://www.aras.com/I18N`。

- [ ] **Step 4: 通ることを確認し、実データに適用する**
  Run: `python -m unittest discover -s tools/tests -v` → 全 PASS、`python tools/build_index.py`。`knowledge/INDEX.md` の「未対応」節の件数を確認し、多い場合(目安: 30件超)は Method 名の検索条件(グループ見出し `h4_Call_Promote_*` 等)を見直す。

- [ ] **Step 5: Commit** `git add tools knowledge && git commit -m "feat: generate knowledge index and glossary"`

---

### Task 6: 公式書類の受け口(docs-official)

**Files:**
- Create: `docs-official/README.md`, `docs-official/web-refs.md`

- [ ] **Step 1: `README.md` を書く**
  - 手元 PDF の置き場所は `docs-official/R30/`。テキスト化は `anthropic-skills:pdf` スキルで行い、`<元ファイル名>.txt` を隣に置く。各テキストの冒頭に文書名・版・入手元を書く。
  - Web 補完のルール: R30 のページと確認できたものだけ根拠にする。確認できなければ「版が未確認」と注記して根拠にしない。
  - 食い違い時は `source/` を正とし、`knowledge/open-questions.md` の「食い違い記録」に追記する。

- [ ] **Step 2: `web-refs.md` を書く**(表の見出しのみ: `日付 | URL | 版(R30確認済/未確認) | 参照目的 | 要点`)。

- [ ] **Step 3: 手元の公式 PDF を入手元から `docs-official/R30/` に置くよう、ユーザーに依頼する**(この時点で PDF が無くても以降のタスクは進められる。無い間は feasibility が Web 補完を使い、その旨を回答に明記する)。

- [ ] **Step 4: Commit** `git add docs-official && git commit -m "docs: add official-docs intake rules"`

---

### Task 7: `request` と `requirements` スキル

**Files:**
- Create: `.claude/skills/request/SKILL.md`, `.claude/skills/requirements/SKILL.md`, `.claude/skills/requirements/template-requirements.md`

**Interfaces:**
- Produces:
  - `request`: 入力は要望本文。モード決定 → `requests/<YYYY-MM-DD-件名>/request.md`(原文とモード)を作成 → 要件定義モードなら `requirements`、クイック可否モードなら `feasibility` を呼ぶ。
  - `requirements`: 出力は `requests/<…>/requirements.md`。ID は `BR-001`/`SR-001`、トレーサビリティ表(`SR-ID | 対応BR-ID`)を含む。

- [ ] **Step 1: ベースラインを取る(スキル無しの挙動)**
  スキルを置く前に、新しい `claude` エージェントに次の3つの依頼文だけを渡し、`CLAUDE.md` のみ読ませて何をするか記録する(手戻り確認用): ①「DATFormat に備考欄を追加したい。要件定義から」 ②「承認フローに差戻し理由を必須にできるか、可否だけ知りたい」 ③「MQPage に期限を持たせたい」(モード指定なし)。③で確認せず進めたらベースライン失敗として記録する。

- [ ] **Step 2: `request/SKILL.md` を書く**
  - frontmatter: `name: request`、`description` に「マルQへの要望を受けたときの入口。要件定義モード/クイック可否モードを選ぶ」。
  - 手順: 依頼文のモード語(「要件定義から」→要件定義、「可否だけ」「ざっくり」→クイック)を判定。無い・両方・矛盾は**推測せず1問だけ**聞く。件名と日付からフォルダ名を決め `request.md` に原文とモードを書く。
  - クイック後に実装へ進みたい場合は要件定義モードへ切り替え、`requirements` は直前の `answer.md` を踏まえる。

- [ ] **Step 3: `requirements/SKILL.md` とテンプレートを書く**
  - 手順は設計書 3.1 の 1〜6 をそのまま手順化する(要望原文 → 業務要件 → システム要件 → 1問ずつ質問 → 依頼者確認 → feasibility へ)。
  - テンプレートの見出し: 業務要件(背景と課題/目的と期待効果/対象業務と利用者/As-Is/To-Be/業務ルール/対象外)、システム要件(機能/データ/権限/画面・帳票/移行・既存データへの影響/非機能)、トレーサビリティ表、未確定事項。As-Is と用語は `knowledge/INDEX.md`・`knowledge/glossary.md` から引き、引用元ファイルを書く。

- [ ] **Step 4: シナリオ検証**
  Step 1 の3依頼を、スキルを置いた状態で再実行する。期待: ①は `requirements.md` に `BR-`/`SR-` と対応表ができ、依頼者確認で止まる。②は feasibility へ直行し要件定義をしない。③はモードを1問だけ聞いて止まる。外れたら SKILL.md を直して再実行する。

- [ ] **Step 5: Commit** `git add .claude/skills && git commit -m "feat: add request and requirements skills"`

---

### Task 8: `feasibility` スキル

**Files:**
- Create: `.claude/skills/feasibility/SKILL.md`, `.claude/skills/feasibility/template-answer.md`

**Interfaces:**
- Consumes: 要件定義モードでは `requirements.md` のシステム要件 ID、クイックでは `request.md` の原文。
- Produces: `requests/<…>/answer.md`。判定値は `可能 / 条件付きで可能 / 標準機能の範囲外 / 現時点で判断不能` の4つのみ。

- [ ] **Step 1: `SKILL.md` とテンプレートを書く**
  - 調査手順: `knowledge/INDEX.md` で該当 ItemType/Method/LC/WF/画面を特定 → 対応する `source/` の原典ファイルを実際に開いて確認(確認できた箇所に確認日を付け、`open-questions.md` の該当行の状態を更新) → `docs-official/R30/`、無ければ Web(R30 確認分のみ。`web-refs.md` に追記)。
  - 要件定義モードの `answer.md`: SR-ID ごとに 判定/根拠/影響範囲(ItemType・Method・ライフサイクル・Workflow・画面・権限)/実現方法(設定のみか、Method・画面コード変更か)/リスクと未確認事項。クイックは 判定・根拠・影響範囲の概要・主なリスクのみ。
  - 根拠は `source/` のパスと行/要素名で示す。示せない記述には「推測」と書く。公式資料とソースの食い違いは `open-questions.md` の「食い違い記録」に追記。

- [ ] **Step 2: シナリオ検証**
  Task 7 の依頼②(承認フローに差戻し理由を必須にできるか)を、クイックモードで新しいエージェントに実行させる。期待: 判定が4値のいずれか、根拠に `source/package/...` の実在パスが1つ以上あり、そのパスが `Test-Path` で存在する。根拠のパスが実在しなければ SKILL.md を直す。

- [ ] **Step 3: Commit** `git add .claude/skills/feasibility && git commit -m "feat: add feasibility skill"`

---

### Task 9: パッケージ差分の検証ツールと `verify` スキル

**Files:**
- Create: `tools/verify_package.py`, `tools/tests/test_verify_package.py`, `.claude/skills/verify/SKILL.md`

**Interfaces:**
- Produces:
  - `@dataclass Finding: level: str; path: str; message: str`(`level` は `"ERROR"` か `"WARN"`)
  - `verify_package(pkg_root: Path, source_root: Path) -> list[Finding]`
    - `pkg_root` は `imports.mf` と各 `<パッケージ>/Import/…` を持つ出力フォルダ、`source_root` は `source/package`。
  - CLI: `python tools/verify_package.py <pkg_root> --source source/package` が Finding を1行ずつ出力し、ERROR があれば終了コード 1。

検査(いずれも `verify_package` が行う):
1. 全 XML が整形式(UTF-8 BOM 許容)。壊れていれば ERROR。
2. 全 `Item` に `type`、`id`(32桁16進)、`action` がある。欠けは ERROR。
3. 出力内で `Item` の `id` が重複しない。重複は ERROR。
4. 要素の `keyed_name` と `type` 属性を持つ参照の値(32桁16進 ID)が、出力または `source_root` の `Item` id に存在するか。存在しなければ **WARN**(Aras 標準アイテムの可能性があるため ERROR にしない)。
5. `imports.mf` の各 `<package path>` が実在し(`\` を区切りとして正規化)、`name` が重複しない。違反は ERROR。

- [ ] **Step 1: 失敗するテストを書く**(一時ディレクトリに最小のフィクスチャを組む)
  - `test_valid_package_has_no_findings`: BOM 付き `<AML><Item type="Method" id="<32桁>" action="add"/></AML>` と、`<package name="x.01" path="X\Import" />` を持つ `imports.mf` → `[]`。
  - `test_malformed_xml_is_error`: 閉じタグ欠落 → ERROR を1件以上、`path` にそのファイル名。
  - `test_missing_action_is_error`、`test_duplicate_id_is_error`。
  - `test_unknown_reference_is_warn_not_error`: `<execution_allowed_to keyed_name="Administrators" type="Identity">2618D6F5A90949BAA7E920D1B04C7EE1</execution_allowed_to>`(`source_root` に無い ID)→ `level == "WARN"`。
  - `test_reference_resolved_from_source_is_clean`: `source_root` 側に同 ID の `Item` を置く → その参照に Finding なし。
  - `test_imports_mf_missing_path_is_error`、`test_backslash_path_is_normalized`(`path="X\Import"` が `X/Import` として解決される)。
  - `test_runs_on_real_source`: `source/package` を `pkg_root` と `source_root` の両方に渡して `ERROR` が 0 件(原典自身で偽陽性が出ないことの確認)。

- [ ] **Step 2: 失敗を確認する** → FAIL(モジュール無し)。

- [ ] **Step 3: `tools/verify_package.py` を実装する**(上記シグネチャ)。`ElementTree` は `utf-8-sig` で読む。`source_root` の id 集合は一度だけ作って使い回す。

- [ ] **Step 4: 通ることを確認する**
  Run: `python -m unittest discover -s tools/tests -v` → 全 PASS。`test_runs_on_real_source` が ERROR を出す場合は、ツールではなく原典側に実在する正当なパターン(例: id を持たない `Item`)を調べ、検査を誤検知しないよう直す(原典は編集しない)。

- [ ] **Step 5: `verify/SKILL.md` を書く**
  - 手順: ① `python tools/verify_package.py output/<件名>/package --source source/package` を実行し、ERROR 0 を確認。WARN は一覧を `implementation.md` に転記し、標準アイテム参照かを人が判断すると明記。② `git status --porcelain source/` が空であること(原典無改変)。③ 既存パッケージ h4.01〜h4.15 と同名のファイルを上書きしていないこと(上書きは `action` による意図的な変更のみ)。④ 検証できなかった項目(Innovator 上でのインポート、画面の実機確認)を「未検証」として列挙する。成功の主張は①②の出力を見てから行う。

- [ ] **Step 6: Commit** `git add tools .claude/skills/verify && git commit -m "feat: add package verifier and verify skill"`

---

### Task 10: `implement` スキルと出力テンプレート

**Files:**
- Create: `.claude/skills/implement/SKILL.md`, `.claude/skills/implement/template-changes.md`, `.claude/skills/implement/template-import-notes.md`

**Interfaces:**
- Consumes: `answer.md`(判定が「可能」「条件付きで可能」の SR-ID と、依頼者の了解)、`verify` スキル。
- Produces: `output/<YYYY-MM-DD-件名>/{package/,CHANGES.md,import-notes.md}` と `requests/<…>/implementation.md`。

- [ ] **Step 1: `SKILL.md` を書く**
  - 前提確認: 要件定義モードであること、対象 SR-ID の判定が可/条件付き、依頼者が `answer.md` に了解済み。満たさなければ着手しない。
  - 手順: 新規パッケージとして `output/<件名>/package/<パッケージ名>/Import/…` を作り、`imports.mf` を作る(パッケージ名は `h4.16.<名>` のように既存の連番規則に続ける。実際の次番号は `source/package/imports.mf` から決める)。既存定義の変更は AML の `action`(`merge` 等)で表し、既存 ID・`h4_` 命名・コード規約に合わせる。作成後 `verify` スキルを実行する。
  - `implementation.md` は SR-ID ごとに「実装ファイル/検証結果/未検証」を書く。

- [ ] **Step 2: テンプレートを書く**
  - `template-changes.md`: `ファイル | 追加/変更/削除 | 元ファイル(source/…) | 対応 SR-ID`。
  - `template-import-notes.md`: インポート順、前提パッケージ、手動作業、ロールバック(出力パッケージの `action="delete"` 版を別途用意する旨)。

- [ ] **Step 3: シナリオ検証**
  サンプル要望「h4_DATFormat に `h4_memo`(文字列)プロパティを追加する」を要件定義モードで通し、`output/` 配下に差分を作らせ、`python tools/verify_package.py output/<件名>/package --source source/package` が ERROR 0 で終わること、`git status --porcelain source/` が空であることを確認する。確認後、サンプルは `requests/_example-memo-property/` と `output/_example-memo-property/` に例として残す(`_example-` 接頭辞で実案件と区別)。

- [ ] **Step 4: Commit** `git add .claude/skills/implement requests output && git commit -m "feat: add implement skill with worked example"`

---

### Task 11: 全体の通し確認

**Files:** なし(確認のみ。問題があれば該当タスクのファイルを直す)

- [ ] **Step 1: 全テスト** Run: `python -m unittest discover -s tools/tests -v` → 全 PASS。
- [ ] **Step 2: 原典の無改変** Run: `git log --oneline -- source` が Task 1 のコミットのみであることを確認する(以降のコミットが `source/` を触っていない)。
- [ ] **Step 3: 設計書との突き合わせ** 設計書 1〜8章の各要件について、対応するファイルが存在することを一覧で確認する(フォルダ構成、スキル5つ、CLAUDE.md のルール8項目、`glossary.md`、`open-questions.md`、`docs-official/`)。欠けがあれば追加のコミットで補う。
- [ ] **Step 4: 報告** 未完・未検証の項目(公式 PDF 未配置、Innovator 実機でのインポート未実施 等)をユーザーに明示して終える。
