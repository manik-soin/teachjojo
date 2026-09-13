#!/usr/bin/env python3
"""
Lint a hand-labelled gold set before anyone trusts a number from it.

    gold-lint.py evals/gold.jsonl
    gold-lint.py evals/gold.jsonl --min-per-label 2 --require-tags boundary,adversarial,degenerate

Checks: valid JSONL, required fields, unique ids, input_ref files exist, every
label has a one-line reason, every label value appears at least N times, the
required tags are represented, and the set is not accidentally random (fewer
than a third of rows tagged 'typical' is fine; more than two thirds is a warning).

Exit 1 on any error. Warnings do not fail.
"""
import argparse, json, sys
from collections import Counter
from pathlib import Path

REQUIRED = ["id", "input_ref", "label", "reason", "tags", "labeller", "labelled_at"]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("gold")
    ap.add_argument("--min-per-label", type=int, default=2)
    ap.add_argument("--require-tags", default="boundary,adversarial,degenerate")
    ap.add_argument("--min-rows", type=int, default=10)
    a = ap.parse_args()

    errs, warns, rows = [], [], []
    base = Path(a.gold).resolve().parent
    seen = set()
    with open(a.gold) as fh:
        for n, line in enumerate(fh, 1):
            line = line.strip()
            if not line or line.startswith("//"):
                continue
            try:
                o = json.loads(line)
            except json.JSONDecodeError as e:
                errs.append(f"line {n}: bad JSON ({e})"); continue
            for k in REQUIRED:
                if k not in o:
                    errs.append(f"line {n}: missing '{k}'")
            i = o.get("id")
            if i in seen:
                errs.append(f"line {n}: duplicate id {i}")
            seen.add(i)
            if isinstance(o.get("reason"), str) and len(o["reason"].strip()) < 8:
                errs.append(f"{i}: reason is empty or too short to argue with")
            if not isinstance(o.get("tags"), list) or not o.get("tags"):
                errs.append(f"{i}: tags must be a non-empty list")
            ref = o.get("input_ref")
            if isinstance(ref, str):
                for cand in (Path(ref), base / ref, base.parent / ref):
                    if cand.exists():
                        break
                else:
                    errs.append(f"{i}: input_ref not found: {ref}")
            rows.append(o)

    if len(rows) < a.min_rows:
        errs.append(f"only {len(rows)} rows; below --min-rows {a.min_rows}")

    labels = Counter(r.get("label") for r in rows)
    for lab, c in sorted(labels.items(), key=lambda x: str(x[0])):
        if c < a.min_per_label:
            errs.append(f"label {lab!r} has {c} example(s); need {a.min_per_label} — boundaries cannot be measured with one point")

    tags = Counter(t for r in rows for t in (r.get("tags") or []))
    for t in filter(None, a.require_tags.split(",")):
        if tags.get(t, 0) == 0:
            errs.append(f"no row tagged '{t}' — the set has no {t} case, so it cannot see that failure")
    if rows and tags.get("typical", 0) / len(rows) > 2 / 3:
        warns.append("more than two thirds tagged 'typical' — this looks like a random sample, not a stratified one")

    labellers = Counter(r.get("labeller") for r in rows)
    if len(labellers) == 1:
        warns.append(f"single labeller ({next(iter(labellers))}); the human ceiling is unknown. Get five rows double-labelled if you can")

    print(f"\n  {len(rows)} rows, {len(labels)} distinct labels, {len(labellers)} labeller(s)\n")
    print("  by label")
    for lab, c in sorted(labels.items(), key=lambda x: str(x[0])):
        print(f"    {str(lab):<10} {c:>3}")
    print("  by tag")
    for t, c in tags.most_common():
        print(f"    {t:<14} {c:>3}")
    for w in warns:
        print(f"\n  WARN  {w}")
    for e in errs:
        print(f"\n  ERROR {e}")
    print("\n  " + ("FAIL" if errs else "ok") + "\n")
    return 1 if errs else 0


if __name__ == "__main__":
    sys.exit(main())
