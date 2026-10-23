import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools"))

import split_design  # noqa: E402

LEGACY = ROOT / "knowledge" / "_legacy" / "機能設計書.md"


class SplitDesignTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.lines = split_design.read_lines(LEGACY)
        cls.sections = split_design.plan_sections(cls.lines)

    def test_sections_are_contiguous_and_cover_all_lines(self):
        self.assertEqual(self.sections[0].start, 1)
        self.assertEqual(self.sections[-1].end, len(self.lines))
        for prev, cur in zip(self.sections, self.sections[1:]):
            self.assertEqual(prev.end + 1, cur.start)

    def test_reassembly_is_lossless(self):
        with tempfile.TemporaryDirectory() as tmp:
            out = Path(tmp)
            split_design.write_sections(self.lines, self.sections, out, "機能設計書.md")
            self.assertEqual(split_design.reassemble(out, self.sections), self.lines)

    def test_bom_and_mixed_newlines_survive(self):
        lines = ["﻿# HND-マルQ\r\n", "x\n", "# A. コードツリー\n", "y"]
        sections = split_design.plan_sections(lines)
        with tempfile.TemporaryDirectory() as tmp:
            out = Path(tmp)
            split_design.write_sections(lines, sections, out, "t.md")
            self.assertEqual(split_design.reassemble(out, sections), lines)

    def test_key_targets_exist(self):
        targets = {s.target for s in self.sections}
        for t in ("itemtypes/f-1-DATFormat.md", "itemtypes/g-MQPage.md",
                  "workflows/g-WFMap.md", "lifecycles/e-LifeCycleMap.md",
                  "methods/b1a.md", "methods/d3e.md", "screens/a-codetree.md"):
            self.assertIn(t, targets)

    def test_meta_block_records_line_range(self):
        with tempfile.TemporaryDirectory() as tmp:
            out = Path(tmp)
            split_design.write_sections(self.lines, self.sections, out, "機能設計書.md")
            meta = (out / "methods" / "b1a.md").read_text(encoding="utf-8").split("-->")[0]
            self.assertIn("L4786-L4898", meta)


if __name__ == "__main__":
    unittest.main()
