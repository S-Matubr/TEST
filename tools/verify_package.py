"""output/ のパッケージ差分を検証する(構文・必須属性・ID重複・参照・imports.mf)。"""
from __future__ import annotations

import argparse
import re
import sys
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from pathlib import Path

HEX32 = re.compile(r"^[0-9A-Fa-f]{32}$")
ID_REQUIRED_ACTIONS = {"add", "merge", "update"}


@dataclass
class Finding:
    level: str  # "ERROR" | "WARN"
    path: str
    message: str


def _parse(path: Path) -> ET.Element:
    with open(path, encoding="utf-8-sig") as f:
        return ET.parse(f).getroot()


def _collect_ids(root: Path) -> set[str]:
    ids: set[str] = set()
    for p in root.rglob("*.xml"):
        try:
            ids.update(i.get("id", "").upper() for i in _parse(p).iter("Item") if i.get("id"))
        except ET.ParseError:
            pass
    return ids


def _check_imports_mf(pkg_root: Path) -> list[Finding]:
    mf = pkg_root / "imports.mf"
    if not mf.exists():
        return [Finding("ERROR", "imports.mf", "imports.mf がない")]
    try:
        packages = _parse(mf).iter("package")
    except ET.ParseError as e:
        return [Finding("ERROR", "imports.mf", f"imports.mf が壊れている: {e}")]
    out, seen = [], set()
    for pkg in packages:
        name, path = pkg.get("name", ""), pkg.get("path", "").replace("\\", "/")
        if name in seen:
            out.append(Finding("ERROR", "imports.mf", f"パッケージ名が重複: {name}"))
        seen.add(name)
        if not (pkg_root / path).is_dir():
            out.append(Finding("ERROR", "imports.mf", f"パッケージのパスが存在しない: {name} -> {path}"))
    return out


def verify_package(pkg_root: Path, source_root: Path) -> list[Finding]:
    findings = _check_imports_mf(pkg_root)
    known = _collect_ids(source_root) | _collect_ids(pkg_root)
    seen_ids: dict[str, str] = {}
    for path in sorted(pkg_root.rglob("*.xml")):
        rel = path.relative_to(pkg_root).as_posix()
        try:
            root = _parse(path)
        except ET.ParseError as e:
            findings.append(Finding("ERROR", rel, f"XMLが壊れている: {e}"))
            continue
        top_level = {id(it) for it in root.findall("Item")}
        for it in root.iter("Item"):
            for attr in ("type", "action"):
                if not it.get(attr):
                    findings.append(Finding("ERROR", rel, f"Item に {attr} がない"))
            # get/edit/delete は where/select で対象を指す(id 無しが正当)。
            # id を必須にするのはトップレベルの add/merge/update だけ。
            if id(it) in top_level and it.get("action") in ID_REQUIRED_ACTIONS and not it.get("id"):
                findings.append(Finding("ERROR", rel, f"Item に id がない(action={it.get('action')})"))
            iid = (it.get("id") or "").upper()
            if iid and not HEX32.match(iid):
                findings.append(Finding("ERROR", rel, f"id が32桁16進でない: {iid}"))
            # 入れ子の Item は同じ id を再掲でき、トップレベルでも add のあとに edit/merge で
            # 同じ id を触るのは正当。誤りなのは同じ id を add で2回定義した場合だけ。
            if iid and id(it) in top_level and it.get("action") == "add":
                if iid in seen_ids:
                    findings.append(Finding("ERROR", rel, f"id が重複: {iid} (先: {seen_ids[iid]})"))
                seen_ids.setdefault(iid, rel)
        for el in root.iter():
            if el.get("keyed_name") is not None and el.get("type") and el.text and HEX32.match(el.text.strip()):
                if el.text.strip().upper() not in known:
                    findings.append(Finding(
                        "WARN", rel,
                        f"参照先が出力にも原典にもない(Aras標準アイテムの可能性): <{el.tag}> {el.text.strip()}"))
    return findings


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("pkg_root", type=Path)
    ap.add_argument("--source", type=Path, default=Path("source/package"))
    args = ap.parse_args(argv)
    findings = verify_package(args.pkg_root, args.source)
    for f in findings:
        print(f"{f.level}\t{f.path}\t{f.message}")
    errors = sum(f.level == "ERROR" for f in findings)
    print(f"ERROR={errors} WARN={len(findings) - errors}")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
