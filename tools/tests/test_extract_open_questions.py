import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools"))

import extract_open_questions as eoq  # noqa: E402
import split_design  # noqa: E402

LEGACY = ROOT / "knowledge" / "_legacy" / "機能設計書.md"


class ExtractOpenQuestionsTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.lines = split_design.read_lines(LEGACY)
        cls.sections = split_design.plan_sections(cls.lines)
        cls.entries = eoq.extract(cls.lines, cls.sections)

    def test_extracts_every_line_containing_suiso(self):
        expected = sum(1 for l in self.lines if "推測" in l)
        self.assertEqual(len(self.entries), expected)
        self.assertEqual(len(self.entries), 147)

    def test_entry_points_to_split_file(self):
        targets = {s.target for s in self.sections}
        for e in self.entries:
            self.assertIn(e.target, targets)
            self.assertIn("推測", self.lines[e.legacy_line - 1])

    def test_regeneration_refuses_to_overwrite_hand_edits(self):
        with tempfile.TemporaryDirectory() as tmp:
            (Path(tmp) / "knowledge").mkdir()
            oq = Path(tmp) / "knowledge" / "open-questions.md"
            oq.write_text("手入力", encoding="utf-8")
            self.assertEqual(eoq.main([], root=Path(tmp)), 1)
            self.assertEqual(oq.read_text(encoding="utf-8"), "手入力")

    def test_render_marks_all_unconfirmed(self):
        text = eoq.render(self.entries)
        rows = [l for l in text.splitlines() if l.startswith("| ") and "推測" in l]
        self.assertEqual(len(rows), 147)
        self.assertTrue(all("未確認" in r for r in rows))
        self.assertIn("食い違い記録", text)


if __name__ == "__main__":
    unittest.main()
