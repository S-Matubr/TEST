import re
import sys
import tempfile
import unittest
import xml.etree.ElementTree as ET
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

    def row(self, name):
        return [l for l in self.index.splitlines() if l.startswith(f"| {name} |")]

    def test_index_prefers_heading_over_mention(self):
        self.assertIn("methods/d3b.md", self.row("h4_sendMail_DAT")[0])
        self.assertIn("methods/c2g.md", self.row("h4_MultiDirectApprove")[0])
        self.assertIn("methods/d3a.md", self.row("h4_PullBack")[0])

    def test_index_lists_itemtype_lifecycle_workflow_and_screen(self):
        self.assertIn("itemtypes/f-7-AppWFGr.md", self.row("h4_ApprovalTarget")[0])
        self.assertIn("lifecycles/e-LifeCycleMap.md", self.row("h4_DATFormatLC")[0])
        self.assertIn("workflows/g-WFMap.md", self.row("h4_DATFormatWF")[0])
        self.assertIn("screens/a-codetree.md", self.row("h4_EventSumTable")[0])

    def test_regeneration_refuses_to_overwrite_hand_edits(self):
        with tempfile.TemporaryDirectory() as tmp:
            (Path(tmp) / "knowledge").mkdir()
            idx = Path(tmp) / "knowledge" / "INDEX.md"
            idx.write_text("手入力", encoding="utf-8")
            self.assertEqual(build_index.main([], root=Path(tmp)), 1)
            self.assertEqual(idx.read_text(encoding="utf-8"), "手入力")

    def cb_rows(self, name):
        section = self.index.split("## ボタン・メニュー索引(CommandBar)")[1].split("\n## ")[0]
        return [l for l in section.splitlines() if l.startswith(f"| {name} |")]

    def test_commandbar_index_traces_menu_button_to_screen_and_method(self):
        row = self.cb_rows("h4_svcb_MQPage_Create")[0]
        for expected in ("Create", "MaruQ", "h4_MQPage_SVCB", "SearchView.CommandBar", "h4_svcb_create_MQPage"):
            self.assertIn(expected, row)

    def test_commandbar_index_traces_direct_button(self):
        row = self.cb_rows("h4_CreateRelationRevisionHistory")[0]
        self.assertIn("h4_RevisionHistory_ivicb_copy", row)
        self.assertNotIn("| |", row.replace("|  |", "| |"), "画面の欄が空")

    def test_commandbar_index_has_every_button_once(self):
        pkg = SOURCE / "package" / "Independent" / "Import"
        names = []
        for d in ("CommandBarButton", "CommandBarMenuButton"):
            for p in (pkg / d).glob("*.xml"):
                with open(p, encoding="utf-8-sig") as f:
                    names.append(ET.parse(f).getroot().find("Item").findtext("name"))  # ファイル名と内部名が違うものがある
        self.assertEqual(len(names), 69)
        for n in names:
            self.assertEqual(len(self.cb_rows(n)), 1, n)

    def test_glossary_has_datformat(self):
        rows = [l for l in self.glossary.splitlines() if "h4_DATFormat " in l or "| h4_DATFormat |" in l]
        self.assertTrue(any("開達書式" in l and "TE Format" in l for l in rows))


if __name__ == "__main__":
    unittest.main()
