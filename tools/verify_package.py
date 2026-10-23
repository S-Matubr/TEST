"""output/ のパッケージ差分を検証する(構文・必須属性・ID重複と衝突・参照・imports.mf)。"""
from __future__ import annotations

import argparse
import re
import sys
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from pathlib import Path

HEX32 = re.compile(r"^[0-9A-Fa-f]{32}$")
ACTIONS = {"add", "merge", "update", "edit", "delete", "get", "create", "purge",
           "version", "skip", "lock", "unlock", "promote"}
ID_REQUIRED_ACTIONS = {"add", "merge", "update"}  # トップレベルのとき id 必須
ID_OR_WHERE_ACTIONS = {"edit", "delete"}  # トップレベルのとき id か where が必須


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


def _packages(mf: Path) -> list[tuple[str, str]]:
    return [(p.get("name", ""), p.get("path", "").replace("\\", "/")) for p in _parse(mf).iter("package")]


def _check_imports_mf(pkg_root: Path, source_root: Path, same_root: bool) -> list[Finding]:
    mf = pkg_root / "imports.mf"
    if not mf.exists():
        return [Finding("ERROR", "imports.mf", "imports.mf がない")]
    try:
        packages = _packages(mf)
    except ET.ParseError as e:
        return [Finding("ERROR", "imports.mf", f"imports.mf が壊れている: {e}")]
    source_names: set[str] = set()
    if not same_root and (source_root / "imports.mf").exists():
        source_names = {n for n, _ in _packages(source_root / "imports.mf")}
    out, seen = [], set()
    for name, path in packages:
        if name in seen:
            out.append(Finding("ERROR", "imports.mf", f"パッケージ名が重複: {name}"))
        if name in source_names:
            out.append(Finding("ERROR", "imports.mf", f"パッケージ名が原典の imports.mf と衝突: {name}"))
        seen.add(name)
        if not (pkg_root / path).is_dir():
            out.append(Finding("ERROR", "imports.mf", f"パッケージのパスが存在しない: {name} -> {path}"))
    listed = {path for _, path in packages}
    for d in sorted(p for p in pkg_root.iterdir() if (p / "Import").is_dir()):
        if f"{d.name}/Import" not in listed:
            out.append(Finding("WARN", d.name, "imports.mf に載っていないパッケージフォルダ(インポートされない)"))
    return out


def verify_package(pkg_root: Path, source_root: Path) -> list[Finding]:
    same_root = pkg_root.resolve() == source_root.resolve()
    findings = _check_imports_mf(pkg_root, source_root, same_root)
    source_ids = set() if same_root else _collect_ids(source_root)
    known = source_ids | _collect_ids(pkg_root) | (_collect_ids(source_root) if same_root else set())
    seen_adds: dict[str, str] = {}
    for path in sorted(pkg_root.rglob("*.xml")):
        rel = path.relative_to(pkg_root).as_posix()
        try:
            root = _parse(path)
        except ET.ParseError as e:
            findings.append(Finding("ERROR", rel, f"XMLが壊れている: {e}"))
            continue
        top_level = {id(it) for it in root.findall("Item")}
        for it in root.iter("Item"):
            action, iid = it.get("action"), (it.get("id") or "").upper()
            if not it.get("type"):
                findings.append(Finding("ERROR", rel, "Item に type がない"))
            if not action:
                findings.append(Finding("ERROR", rel, "Item に action がない"))
            elif action not in ACTIONS:
                findings.append(Finding("ERROR", rel, f"Item の action が不正: {action}"))
            is_top = id(it) in top_level
            # get/edit/delete は where/select で対象を指す(id 無しが正当)。
            if is_top and action in ID_REQUIRED_ACTIONS and not iid:
                findings.append(Finding("ERROR", rel, f"Item に id がない(action={action})"))
            if is_top and action in ID_OR_WHERE_ACTIONS and not iid and not it.get("where"):
                findings.append(Finding("ERROR", rel, f"Item に id か where がない(action={action})"))
            if iid and not HEX32.match(iid):
                findings.append(Finding("ERROR", rel, f"id が32桁16進でない: {iid}"))
            # 入れ子の Item の再掲や add→edit で同じ id を触るのは正当。誤りは add の二重定義と、
            # 原典に既にある id を add で再定義すること。
            if iid and action == "add":
                if iid in seen_adds:
                    findings.append(Finding("ERROR", rel, f"id が重複(add が2回): {iid} (先: {seen_adds[iid]})"))
                seen_adds.setdefault(iid, rel)
                if iid in source_ids:
                    findings.append(Finding("ERROR", rel, f"add の id が原典に既にある: {iid}"))
        for el in root.iter():
            text = (el.text or "").strip()
            if el.tag != "Item" and el.get("type") and HEX32.match(text) and text.upper() not in known:
                findings.append(Finding(
                    "WARN", rel,
                    f"参照先が出力にも原典にもない(Aras標準アイテムの可能性): <{el.tag}> {text}"))
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
