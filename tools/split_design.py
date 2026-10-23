"""機能設計書.md を knowledge/ 配下へ損失なしで分割する。"""
from __future__ import annotations

import re
import sys
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LEGACY_NAME = "機能設計書.md"

E_TARGETS = {
    "1": "common/e-パッケージ構成.md",
    "2": "lifecycles/e-LifeCycleMap.md",
    "3": "common/e-Permission.md",
    "4": "common/e-List.md",
    "5": "common/e-Form.md",
    "6": "common/e-CommandBar.md",
    "7": "common/e-その他.md",
}


@dataclass
class Section:
    start: int  # 1始まり、両端含む
    end: int
    target: str  # knowledge/ からの相対パス


def read_lines(path: Path) -> list[str]:
    """改行コードとBOMを保ったまま、\n 区切りで行に分ける。"""
    with open(path, encoding="utf-8", newline="") as f:
        text = f.read()
    parts = text.split("\n")
    return [p + "\n" for p in parts[:-1]] + ([parts[-1]] if parts[-1] else [])


def _strip(line: str) -> str:
    return line.lstrip("﻿").rstrip("\r\n")


def plan_sections(lines: list[str]) -> list[Section]:
    starts: list[tuple[int, str]] = [(1, "common/00-overview.md")]
    zone = ""
    pending: int | None = None  # 直後のセクションに含める章見出しの行番号
    for no, raw in enumerate(lines, 1):
        s = _strip(raw)
        m = re.match(r"# ([A-G])\. ", s)
        if m and not s.startswith("# B_"):
            zone = m.group(1)
            if zone == "A":
                starts.append((no, "screens/a-codetree.md"))
                pending = None
            elif pending is None:
                pending = no
            continue
        m = re.match(r"# (B|D)_method(\d)([a-i])|# Method AML 調査 (C)_method(\d)([a-i])", s)
        if m:
            g = [x for x in m.groups() if x]
            starts.append((no, f"methods/{g[0].lower()}{g[1]}{g[2]}.md"))
            zone, pending = "B", None
            continue
        if zone == "F":
            m = re.match(r"## (\d)\. (\w+)", s)
            if m:
                n, name = m.groups()
                if n == "0":
                    target = "common/f-0-共通事項.md"
                elif n == "9":
                    target = "common/f-9-横断メモ.md"
                else:
                    target = f"itemtypes/f-{n}-{name}.md"
                starts.append((pending or no, target))
                pending = None
        elif zone == "G":
            m = re.match(r"# (\d)\. パッケージ (\w+)", s)
            if m:
                name = m.group(2)
                target = f"workflows/g-{name}.md" if name == "WFMap" else f"itemtypes/g-{name}.md"
                starts.append((pending or no, target))
                pending = None
        elif zone == "E":
            m = re.match(r"## (\d)\. ", s)
            if m and m.group(1) in E_TARGETS:
                starts.append((pending or no, E_TARGETS[m.group(1)]))
                pending = None
    starts.sort()
    sections = []
    for i, (start, target) in enumerate(starts):
        end = starts[i + 1][0] - 1 if i + 1 < len(starts) else len(lines)
        if end >= start:
            sections.append(Section(start, end, target))
    return sections


def _source_hint(target: str) -> str:
    kind, _, rest = target.partition("/")
    name = rest.rsplit(".", 1)[0]
    if kind == "itemtypes":
        return f"source/package/{name.split('-')[-1]}/Import/"
    if kind == "methods":
        return "source/package/Independent/Import/Method/"
    if kind == "screens":
        return "source/codetree/"
    if kind in ("lifecycles", "workflows"):
        return "source/package/ (Life Cycle Map / Workflow Map)"
    return "source/package/"


def write_sections(lines: list[str], sections: list[Section], knowledge_dir: Path, legacy_name: str) -> None:
    for sec in sections:
        path = knowledge_dir / sec.target
        path.parent.mkdir(parents=True, exist_ok=True)
        meta = (
            "<!-- meta\n"
            f"legacy: knowledge/_legacy/{legacy_name} L{sec.start}-L{sec.end}\n"
            f"source: {_source_hint(sec.target)}\n"
            "-->\n"
        )
        with open(path, "w", encoding="utf-8", newline="") as f:
            f.write(meta)
            f.writelines(lines[sec.start - 1:sec.end])


def reassemble(knowledge_dir: Path, sections: list[Section]) -> list[str]:
    out: list[str] = []
    for sec in sections:
        text = read_lines(knowledge_dir / sec.target)
        idx = next(i for i, l in enumerate(text) if l == "-->\n")
        out.extend(text[idx + 1:])
    return out


def main() -> None:
    kdir = ROOT / "knowledge"
    lines = read_lines(kdir / "_legacy" / LEGACY_NAME)
    sections = plan_sections(lines)
    write_sections(lines, sections, kdir, LEGACY_NAME)
    assert reassemble(kdir, sections) == lines, "再結合が元と一致しない"
    print(f"{len(sections)} sections written")


if __name__ == "__main__":
    sys.exit(main())
