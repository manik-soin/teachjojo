#!/usr/bin/env python3
"""
Append a numbered decision record to the "## Decisions taken" section of
ASSUMPTIONS.md. Standard library only.

    fork.py --title "Where the grading work runs" \
            --constraint "A full pass is six model calls; p99 is tens of seconds." \
            --taken "Queued job with a status row, client polls." \
            --costs "A status model and a pending state in every result screen." \
            --reverses "A pass reliably under two seconds; then inline and delete the status model."

    fork.py --list          # print the existing D-xx titles
    fork.py --check         # exit 1 if any record is missing one of the four parts
"""
import argparse, re, subprocess, sys
from pathlib import Path

PARTS = ["Constraint", "Taken", "Costs", "Reverses if"]
HEAD = "## Decisions taken"


def root():
    try:
        return Path(subprocess.check_output(
            ["git", "rev-parse", "--show-toplevel"], text=True, stderr=subprocess.DEVNULL).strip())
    except Exception:
        return Path.cwd()


def records(text):
    return re.findall(r"^### (D-\d+) · (.+)$", text, re.M)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--file", default=None)
    ap.add_argument("--title")
    ap.add_argument("--constraint")
    ap.add_argument("--taken")
    ap.add_argument("--costs")
    ap.add_argument("--reverses")
    ap.add_argument("--list", action="store_true")
    ap.add_argument("--check", action="store_true")
    a = ap.parse_args()

    f = Path(a.file) if a.file else root() / "ASSUMPTIONS.md"
    if not f.exists():
        sys.exit(f"{f} not found — run trial-kickoff first (bin/init.sh)")
    text = f.read_text()

    if a.list:
        for n, t in records(text):
            print(f"{n}  {t}")
        return 0

    if a.check:
        bad = 0
        blocks = re.split(r"^(?=### D-\d+ · )", text, flags=re.M)
        for b in blocks:
            m = re.match(r"### (D-\d+) · (.+)", b)
            if not m:
                continue
            missing = [p for p in PARTS if f"**{p}**" not in b]
            if missing:
                bad += 1
                print(f"{m.group(1)} missing: {', '.join(missing)}")
        print(f"{len(records(text))} decisions, {bad} incomplete")
        return 1 if bad else 0

    missing = [k for k in ("title", "constraint", "taken", "costs", "reverses") if not getattr(a, k)]
    if missing:
        sys.exit("all four parts are required; missing: " + ", ".join(missing)
                 + "\nIf you cannot name the cost or the reversal condition, you have not finished deciding.")

    n = len(records(text)) + 1
    entry = (f"\n### D-{n:02d} · {a.title}\n"
             f"**Constraint** {a.constraint}\n"
             f"**Taken** {a.taken}\n"
             f"**Costs** {a.costs}\n"
             f"**Reverses if** {a.reverses}\n")

    if HEAD not in text:
        text = text.rstrip("\n") + f"\n\n{HEAD}\n"
    # insert before the next "## " heading after HEAD, or at end
    i = text.index(HEAD) + len(HEAD)
    m = re.search(r"^## ", text[i:], re.M)
    j = i + m.start() if m else len(text)
    text = text[:j].rstrip("\n") + "\n" + entry + ("\n" if m else "") + text[j:]
    f.write_text(text)
    print(f"D-{n:02d} · {a.title}  →  {f}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
