import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools"))

import build_index  # noqa: E402

KNOWLEDGE = ROOT / "knowledge"
SOURCE = ROOT / "source"
METHOD_DIR = SOURCE / "package" / "Independent" / "Import" / "Method"


class BuildIndexTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.index = build_index.build_index(KNOWLEDGE, SOURCE)
        cls.glossary = build_index.build_glossary(SOURCE)

    def test_index_maps_known_method(self):
        rows = [l for l in self.index.splitlines() if "h4_addDatFormatCheck" in l]
        self.assertTrue(any("methods/b1a.md" in l for l in rows))

    def test_index_reports_unmapped_instead_of_dropping(self):
        total = len(list(METHOD_DIR.glob("*.xml")))
        self.assertEqual(total, 273)
        head, _, tail = self.index.partition("## 未対応")
        self.assertTrue(tail, "未対応の節が無い")
        mapped = len(re.findall(r"^\| (?!methods/)[^|]+\| methods/", head, re.M))
        unmapped = len(re.findall(r"^- \S", tail, re.M))
        self.assertEqual(mapped + unmapped, total)

    def test_glossary_has_datformat(self):
        rows = [l for l in self.glossary.splitlines() if "h4_DATFormat " in l or "| h4_DATFormat |" in l]
        self.assertTrue(any("開達書式" in l and "TE Format" in l for l in rows))


if __name__ == "__main__":
    unittest.main()
