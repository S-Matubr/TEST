"""knowledge/INDEX.md と glossary.md を生成する。

初回生成専用。INDEX.md には追加仕様書の登録、glossary.md には「業務での言い方」を手で書き足す運用なので、
既存ファイルがあると上書きを拒否する(再生成するなら --force。手入力は失われる)。
"""
from __future__ import annotations

import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import split_design  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
I18N = "{http://www.aras.com/I18N}"
XML_LANG = "{http://www.w3.org/XML/1998/namespace}lang"


def _knowledge_files(knowledge_dir: Path) -> list[Path]:
    return sorted(
        p for p in knowledge_dir.rglob("*.md")
        if "_legacy" not in p.parts and p.name not in ("INDEX.md", "glossary.md", "open-questions.md")
    )


def _file_row(knowledge_dir: Path, path: Path) -> str:
    lines = split_design.read_lines(path)
    end = next((i for i, l in enumerate(lines) if l == "-->\n"), -1)
    heading = next((l.strip().lstrip("#").strip() for l in lines[end + 1:] if l.lstrip("﻿").startswith("#")), "")
    legacy = next((l.split("L", 1)[1].strip() for l in lines[:end] if l.startswith("legacy:")), "")
    rel = path.relative_to(knowledge_dir).as_posix()
    return f"| {rel} | {heading} | L{legacy} |"


def _locate(name: str, files: list[Path], knowledge_dir: Path) -> tuple[str, str] | None:
    """名前の記述があるファイルを返す。見出しにあるものを優先し、無ければ最初の言及(言及のみ)。"""
    pat = re.compile(r"(?<![\w])" + re.escape(name) + r"(?![\w])")
    first_mention = None
    for p in files:
        for line in p.read_text(encoding="utf-8").splitlines():
            if not pat.search(line):
                continue
            rel = p.relative_to(knowledge_dir).as_posix()
            if line.lstrip("\ufeff").lstrip().startswith("#"):
                return rel, "見出し"
            first_mention = first_mention or (rel, "言及のみ")
    return first_mention


def _table(title: str, names: list[str], files: list[Path], knowledge_dir: Path, header: str) -> tuple[list[str], list[str]]:
    rows = ["", f"## {title}", "", f"| {header} | 該当ファイル | 記述の種類 |", "|---|---|---|"]
    missing = []
    for name in names:
        hit = _locate(name, files, knowledge_dir)
        if hit:
            rows.append(f"| {name} | {hit[0]} | {hit[1]} |")
        else:
            missing.append(name)
    return rows, missing


def _commandbar_rows(source_dir: Path, files: list[Path], knowledge_dir: Path) -> list[str]:
    """ボタン(CommandBarButton / CommandBarMenuButton)から、メニュー・画面区分・クリックMethodをたどる。"""
    cb = source_dir / "package" / "Independent" / "Import"

    def items(kind: str):
        for path in sorted((cb / kind).glob("*.xml")):
            with open(path, encoding="utf-8-sig") as f:
                yield ET.parse(f).getroot().find("Item")

    def label(it) -> str:
        ja = next((e.text for e in it.findall(I18N + "label") if e.get(XML_LANG) == "ja"), None)
        return ja or it.findtext("label") or ""

    screens: dict[str, list[str]] = {}
    for sec in items("CommandBarSection"):
        loc = sec.find("location")
        where = f"{sec.findtext('name')}({loc.get('keyed_name') if loc is not None else ''})"
        for rel in sec.iter("related_id"):
            screens.setdefault(rel.get("keyed_name"), []).append(where)
    menu_labels = {m.findtext("name"): label(m) for m in items("CommandBarMenu")}
    cb_files = [p for p in files if p.name == "e-CommandBar.md"]

    rows = []
    for kind in ("CommandBarButton", "CommandBarMenuButton"):
        for it in items(kind):
            name = it.findtext("name")
            parent = it.find("parent_menu")
            menu = parent.get("keyed_name") if parent is not None else ""
            handler = it.find("on_click_handler")
            where = screens.get(menu if menu else name, [])
            hit = _locate(name, cb_files, knowledge_dir)
            rows.append(
                f"| {name} | {label(it)} | {menu_labels.get(menu, '') if menu else '-'} | "
                f"{'; '.join(where) or '(画面に未配置)'} | "
                f"{handler.get('keyed_name') if handler is not None else ''} | "
                f"{hit[0] if hit else ''} | {hit[1] if hit else ''} |")
    return rows


def build_index(knowledge_dir: Path, source_dir: Path) -> str:
    files = _knowledge_files(knowledge_dir)
    out = ["# 仕様ナレッジ 索引", "",
           "原典は `source/`。ここに載る記述は `機能設計書.md` から無改変で分割した二次情報で、各ファイル冒頭の meta に元の行範囲を持つ。",
           "「記述の種類」が「言及のみ」のものは、見出しとしての記述が無く、他の記述の中で触れられているだけ。",
           "", "## ファイル一覧", "", "| ファイル | 先頭見出し | 元の行 |", "|---|---|---|"]
    out += [_file_row(knowledge_dir, p) for p in files]

    def in_dir(kind: str) -> list[Path]:
        return [p for p in files if p.parent.name == kind]

    pkg = source_dir / "package"
    kinds = [
        ("Method 索引", sorted(p.stem for p in (pkg / "Independent/Import/Method").glob("*.xml")), "methods", "Method"),
        ("ItemType 索引", sorted(p.stem for p in pkg.glob("*/Import/ItemType/*.xml")), "itemtypes", "ItemType"),
        ("ライフサイクル索引", sorted(p.stem for p in (pkg / "Independent/Import/Life Cycle Map").glob("*.xml")), "lifecycles", "ライフサイクル"),
        ("Workflow 索引", sorted(p.stem for p in (pkg / "WFMap/Import/Workflow Map").glob("*.xml")), "workflows", "Workflow"),
        ("画面索引", sorted(d.name for d in (source_dir / "codetree").glob("*/*") if d.is_dir()), "screens", "画面"),
    ]
    method_missing: list[str] = []
    other_missing: list[str] = []
    for title, names, kind, header in kinds:
        rows, missing = _table(title, names, in_dir(kind), knowledge_dir, header)
        out += rows
        (method_missing if kind == "methods" else other_missing).extend(
            f"- {n}({header})" for n in missing)
    out += ["", "## ボタン・メニュー索引(CommandBar)", "",
            "画面でボタンを押したときの動きを調べる入口。ボタン → (メニュー) → 画面区分 → クリックMethod の順にたどれる。"
            "Method の中身は「Method 索引」から引く。", "",
            "| ボタン名 | ラベル | 親メニュー | 画面(区分名(場所)) | クリックMethod | 該当ファイル | 記述の種類 |",
            "|---|---|---|---|---|---|---|"]
    out += _commandbar_rows(source_dir, files, knowledge_dir)
    out += ["", "## 対応なし(Method 以外で knowledge に記述なし)", ""] + (other_missing or ["(なし)"])
    out += ["", "## 未対応(knowledge/methods に記述なし)", ""] + (method_missing or ["(なし)"])
    return "\n".join(out) + "\n"


def build_glossary(source_dir: Path) -> str:
    out = ["# 用語対応表(glossary)", "",
           "ItemType の名称・ラベルは `source/package/*/Import/ItemType/` から機械的に抽出。「業務での言い方」は要件定義で気付いたものを追記する。",
           "", "| ItemType名 | 日本語ラベル | 英語ラベル | 業務での言い方 |", "|---|---|---|---|"]
    for path in sorted((source_dir / "package").glob("*/Import/ItemType/*.xml")):
        with open(path, encoding="utf-8-sig") as f:
            item = ET.parse(f).getroot().find("Item")
        if item is None:
            continue
        name = item.findtext("name", default=path.stem)
        ja = next((e.text for e in item.findall(I18N + "label") if e.get(XML_LANG) == "ja"), "")
        en = next((e.text for e in item.findall("label") if e.get(XML_LANG) == "en"), "")
        out.append(f"| {name} | {ja or ''} | {en or ''} |  |")
    return "\n".join(out) + "\n"


def main(argv: list[str] | None = None, root: Path = ROOT) -> int:
    force = "--force" in (argv or [])
    kdir, sdir = root / "knowledge", root / "source"
    targets = [kdir / "INDEX.md", kdir / "glossary.md"]
    existing = [t.name for t in targets if t.exists()]
    if existing and not force:
        print(f"{', '.join(existing)} は既にある。手入力が消えるので上書きしない(再生成は --force)", file=sys.stderr)
        return 1
    targets[0].write_text(build_index(kdir, sdir), encoding="utf-8")
    targets[1].write_text(build_glossary(sdir), encoding="utf-8")
    print("INDEX.md, glossary.md written")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
