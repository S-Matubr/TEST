import contextlib
import io
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools"))

import verify_package as vp  # noqa: E402

ID_A = "A" * 32
ID_B = "B" * 32
ID_STD = "2618D6F5A90949BAA7E920D1B04C7EE1"
MF = '<imports>\n  <package name="x.01" path="X\Import" />\n</imports>\n'


def make_pkg(root: Path, files: dict[str, str], mf: str = MF) -> Path:
    root.mkdir(parents=True, exist_ok=True)
    (root / "imports.mf").write_text(mf, encoding="utf-8")
    for rel, body in files.items():
        p = root / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_bytes(b"\xef\xbb\xbf" + body.encode("utf-8"))  # 原典と同じ BOM 付き
    return root


def aml(*items: str) -> str:
    return "<AML>" + "".join(items) + "</AML>"


def item(id_: str = ID_A, action: str = "add", extra: str = "") -> str:
    attr = f' action="{action}"' if action else ""
    return f'<Item type="Method" id="{id_}"{attr}>{extra}</Item>'


class VerifyPackageTest(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.tmp = Path(self._tmp.name)
        self.src = make_pkg(self.tmp / "src", {"X/Import/Method/s.xml": aml(item(ID_B))})
        self.out = self.tmp / "out"

    def tearDown(self):
        self._tmp.cleanup()

    def run_verify(self, files, mf=MF):
        make_pkg(self.out, files, mf)
        return vp.verify_package(self.out, self.src)

    def test_valid_package_has_no_findings(self):
        self.assertEqual(self.run_verify({"X/Import/Method/a.xml": aml(item())}), [])

    def test_malformed_xml_is_error(self):
        f = self.run_verify({"X/Import/Method/bad.xml": "<AML><Item>"})
        self.assertTrue(any(x.level == "ERROR" and "bad.xml" in x.path for x in f))

    def test_missing_action_is_error(self):
        f = self.run_verify({"X/Import/Method/a.xml": aml(item(action=""))})
        self.assertTrue(any(x.level == "ERROR" and "action" in x.message for x in f))

    def test_duplicate_id_is_error(self):
        f = self.run_verify({"X/Import/Method/a.xml": aml(item()), "X/Import/Method/b.xml": aml(item())})
        self.assertTrue(any(x.level == "ERROR" and "重複" in x.message for x in f))

    def test_unknown_reference_is_warn_not_error(self):
        ref = f'<execution_allowed_to keyed_name="Administrators" type="Identity">{ID_STD}</execution_allowed_to>'
        f = self.run_verify({"X/Import/Method/a.xml": aml(item(extra=ref))})
        self.assertEqual([x.level for x in f], ["WARN"])

    def test_reference_resolved_from_source_is_clean(self):
        ref = f'<owned_by_id keyed_name="s" type="Method">{ID_B}</owned_by_id>'
        self.assertEqual(self.run_verify({"X/Import/Method/a.xml": aml(item(extra=ref))}), [])

    def test_imports_mf_missing_path_is_error(self):
        mf = '<imports><package name="y.01" path="Y\Import" /></imports>'
        f = self.run_verify({"X/Import/Method/a.xml": aml(item())}, mf)
        self.assertTrue(any(x.level == "ERROR" and "imports.mf" in x.path for x in f))

    def test_backslash_path_is_normalized(self):
        self.assertEqual(self.run_verify({"X/Import/Method/a.xml": aml(item())}), [])

    def test_get_and_delete_items_without_id_are_clean(self):
        sel = '<Item type="Identity" action="get" select="id"/>'
        dele = "<Item type=\"Form\" action=\"delete\" where=\"name='x'\"/>"
        f = self.run_verify({"X/Import/Method/a.xml": aml(item(extra=f"<related_id>{sel}</related_id>"), dele)})
        self.assertEqual(f, [])

    def test_top_level_add_without_id_is_error(self):
        f = self.run_verify({"X/Import/Method/a.xml": aml('<Item type="Method" action="add"/>')})
        self.assertTrue(any(x.level == "ERROR" and "id がない" in x.message for x in f))

    def test_cli_exit_code_is_1_on_error(self):
        make_pkg(self.out, {"X/Import/Method/bad.xml": "<AML>"})
        with contextlib.redirect_stdout(io.StringIO()):
            code = vp.main([str(self.out), "--source", str(self.src)])
        self.assertEqual(code, 1)

    def test_runs_on_real_source(self):
        real = ROOT / "source" / "package"
        errors = [x for x in vp.verify_package(real, real) if x.level == "ERROR"]
        self.assertEqual(errors, [], errors[:5])


if __name__ == "__main__":
    unittest.main()
