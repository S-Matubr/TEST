import shutil
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools"))

import pdf_to_text  # noqa: E402


class FormatTextTest(unittest.TestCase):
    def test_header_has_title_version_and_source(self):
        out = pdf_to_text.format_text("a\fb\f", "Aras Innovator 30 - Life Cycles", "ユーザー提供")
        head = out.split("=== p.1 ===")[0]
        self.assertIn("文書名: Aras Innovator 30 - Life Cycles", head)
        self.assertIn("版: R30", head)
        self.assertIn("入手元: ユーザー提供", head)
        self.assertIn("ページ数: 2", head)

    def test_pages_are_marked_and_trailing_formfeed_adds_no_empty_page(self):
        out = pdf_to_text.format_text("first\fsecond\f", "t", "s")
        self.assertIn("=== p.1 ===\nfirst", out)
        self.assertIn("=== p.2 ===\nsecond", out)
        self.assertNotIn("=== p.3 ===", out)

    def test_version_not_confirmed_when_title_has_no_30(self):
        out = pdf_to_text.format_text("x\f", "Some Guide", "s")
        self.assertIn("版: 未確認(R30 と確認できない)", out)


class ConvertRealPdfTest(unittest.TestCase):
    PDF = ROOT / "docs-official" / "R30" / "Aras Innovator 30 - Life Cycles.pdf"

    @unittest.skipUnless(PDF.exists(), "公式PDFが未配置")
    def test_no_mojibake_in_converted_text(self):
        with tempfile.TemporaryDirectory() as tmp:
            copy = Path(tmp) / self.PDF.name
            shutil.copy(self.PDF, copy)
            text = pdf_to_text.convert(copy).read_text(encoding="utf-8")
        self.assertNotIn("�", text)
        self.assertIn("Copyright © 2023 Aras Corporation", text)


if __name__ == "__main__":
    unittest.main()
