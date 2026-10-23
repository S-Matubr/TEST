"""docs-official/R30/ の PDF を、ページ番号つきのテキスト(<PDF名>.txt)に変換する。

使い方: python tools/pdf_to_text.py [PDFのあるフォルダ]  (既定: docs-official/R30)
pdftotext(poppler)が必要。既存の .txt は上書きする(PDF から機械生成するため手入力は無い)。
"""
from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DIR = ROOT / "docs-official" / "R30"


def format_text(raw: str, title: str, source_note: str) -> str:
    pages = raw.split("\f")
    if pages and not pages[-1].strip():
        pages.pop()
    version = "R30" if re.search(r"\b30\b", title) else "未確認(R30 と確認できない)"
    out = [
        f"文書名: {title}",
        f"版: {version}",
        f"入手元: {source_note}",
        f"ページ数: {len(pages)}",
        "変換: pdftotext -layout(ページ区切りは '=== p.N ===')",
        "",
    ]
    for n, page in enumerate(pages, 1):
        out += [f"=== p.{n} ===", page.rstrip(), ""]
    return "\n".join(out)


def convert(pdf: Path, source_note: str = "ユーザー提供(入手元URLは未記録)") -> Path:
    raw = subprocess.run(
        ["pdftotext", "-layout", "-enc", "UTF-8", str(pdf), "-"],
        capture_output=True, check=True, encoding="utf-8", errors="replace",
    ).stdout
    dest = pdf.with_suffix(".txt")
    dest.write_text(format_text(raw, pdf.stem, source_note), encoding="utf-8")
    return dest


def main(argv: list[str] | None = None) -> int:
    folder = Path(argv[0]) if argv else DEFAULT_DIR
    for pdf in sorted(folder.glob("*.pdf")):
        dest = convert(pdf)
        print(f"{dest.name}: {dest.stat().st_size} bytes")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
