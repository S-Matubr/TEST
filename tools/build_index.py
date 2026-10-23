"""knowledge/INDEX.md と glossary.md を生成する。"""
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


def build_index(knowledge_dir: Path, source_dir: Path) -> str:
    files = _knowledge_files(knowledge_dir)
    out = ["# 仕様ナレッジ 索引", "",
           "原典は `source/`。ここに載る記述は `機能設計書.md` から無改変で分割した二次情報で、各ファイル冒頭の meta に元の行範囲を持つ。",
           "", "## ファイル一覧", "", "| ファイル | 先頭見出し | 元の行 |", "|---|---|---|"]
    out += [_file_row(knowledge_dir, p) for p in files]
    method_texts = {p: p.read_text(encoding="utf-8") for p in files if p.parent.name == "methods"}
    names = sorted(p.stem for p in (source_dir / "package" / "Independent" / "Import" / "Method").glob("*.xml"))
    out += ["", "## Method 索引", "", "| Method | 該当ファイル |", "|---|---|"]
    unmapped = []
    for name in names:
        pat = re.compile(r"(?<![\w])" + re.escape(name) + r"(?![\w])")
        hit = next((p for p, t in method_texts.items() if pat.search(t)), None)
        if hit:
            out.append(f"| {name} | {hit.relative_to(knowledge_dir).as_posix()} |")
        else:
            unmapped.append(name)
    out += ["", "## 未対応(knowledge/methods に記述なし)", ""]
    out += [f"- {n}" for n in unmapped] or ["(なし)"]
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


def main() -> None:
    kdir, sdir = ROOT / "knowledge", ROOT / "source"
    (kdir / "INDEX.md").write_text(build_index(kdir, sdir), encoding="utf-8")
    (kdir / "glossary.md").write_text(build_glossary(sdir), encoding="utf-8")
    print("INDEX.md, glossary.md written")


if __name__ == "__main__":
    main()
