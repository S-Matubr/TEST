"""機能設計書の「推測」記述を knowledge/open-questions.md に一覧化する。"""
from __future__ import annotations

import sys
from dataclasses import dataclass
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import split_design  # noqa: E402
from split_design import Section  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]


@dataclass
class Entry:
    legacy_line: int
    target: str
    text: str


def extract(lines: list[str], sections: list[Section]) -> list[Entry]:
    entries = []
    for sec in sections:
        for no in range(sec.start, sec.end + 1):
            line = lines[no - 1]
            if "推測" in line:
                entries.append(Entry(no, sec.target, line.lstrip("﻿").strip()))
    return entries


def render(entries: list[Entry]) -> str:
    out = [
        "# 要確認事項(open-questions)",
        "",
        "`機能設計書.md` で「推測」と明記された記述の一覧。原典で確認できたら状態・確認日・結果を更新する。",
        "",
        "## 食い違い記録",
        "",
        "公式書類・追加仕様書と原典(`source/`)の食い違いをここに追記する。原典を正とする。",
        "",
        "| 日付 | 対象 | 食い違いの内容 | 採用 |",
        "|---|---|---|---|",
        "",
        "## 「推測」記述の確認状況",
        "",
        "| # | 該当ファイル | 元の行 | 記述 | 状態 | 確認日 | 結果 |",
        "|---|---|---|---|---|---|---|",
    ]
    for i, e in enumerate(entries, 1):
        text = e.text.replace("|", r"\|")
        out.append(f"| {i} | knowledge/{e.target} | L{e.legacy_line} | {text} | 未確認 |  |  |")
    return "\n".join(out) + "\n"


def main() -> None:
    lines = split_design.read_lines(ROOT / "knowledge" / "_legacy" / split_design.LEGACY_NAME)
    entries = extract(lines, split_design.plan_sections(lines))
    (ROOT / "knowledge" / "open-questions.md").write_text(render(entries), encoding="utf-8")
    print(f"{len(entries)} entries")


if __name__ == "__main__":
    main()
