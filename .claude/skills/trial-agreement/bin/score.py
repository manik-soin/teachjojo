#!/usr/bin/env python3
"""
Score model predictions against a hand-labelled gold set.

Standard library only. No install step, no dependencies, runs anywhere.

    score.py --gold evals/gold.jsonl --pred evals/pred.jsonl
    score.py --gold g.jsonl --pred p.jsonl --baseline prev.jsonl --min-exact 0.6

Both files are JSONL keyed by "id". Gold rows carry "label", prediction rows
carry "pred". Labels may be ordinal integers (bands, scores) or strings
(categories); ordinal metrics are reported only when they are numeric.

A prediction of null means the model abstained (failed closed). Abstentions are
excluded from agreement and reported separately as coverage, so a model cannot
buy accuracy by refusing to answer without that showing up.

    score.py --gold g.jsonl --pred p.jsonl --ceiling second-labeller.jsonl

--ceiling takes a second human's labels (same shape as gold) and reports how
often the two humans agree on the rows they share. That is the number the model
is actually being measured against.

Exits non-zero when a --min-* threshold is missed, so it can be wired into CI
as a gate. That is the point: an eval you do not gate on is a dashboard.
"""

import argparse, json, random, sys
from collections import Counter


def load(path, field):
    rows = {}
    with open(path) as fh:
        for n, line in enumerate(fh, 1):
            line = line.strip()
            if not line or line.startswith("//"):
                continue
            try:
                o = json.loads(line)
            except json.JSONDecodeError as e:
                sys.exit(f"{path}:{n}: bad JSON: {e}")
            if "id" not in o:
                sys.exit(f"{path}:{n}: row has no 'id'")
            if field not in o:
                sys.exit(f"{path}:{n}: row {o['id']} has no '{field}'")
            if o["id"] in rows:
                sys.exit(f"{path}:{n}: duplicate id {o['id']}")
            rows[o["id"]] = o
    if not rows:
        sys.exit(f"{path}: no rows")
    return rows


def numeric(vals):
    return all(isinstance(v, (int, float)) and not isinstance(v, bool) for v in vals)


def pairs_of(gold, pred, gf="label", pf="pred"):
    """Aligned (id, gold, pred), the ids that abstained (pred is null), and the
    ids each side is missing."""
    both = sorted(i for i in gold if i in pred)
    answered = [(i, gold[i][gf], pred[i][pf]) for i in both if pred[i][pf] is not None]
    abstained = [i for i in both if pred[i][pf] is None]
    return (
        answered,
        abstained,
        sorted(set(gold) - set(pred)),
        sorted(set(pred) - set(gold)),
    )


def exact(ps):
    return sum(1 for _, g, p in ps if g == p) / len(ps)


def within(ps, k=1):
    return sum(1 for _, g, p in ps if abs(g - p) <= k) / len(ps)


def within_k(k):
    return lambda ps: within(ps, k)


def qwk(ps):
    """Quadratic weighted kappa: agreement corrected for chance, penalising
    big ordinal misses more than small ones. 0 is chance, 1 is perfect,
    negative is worse than chance."""
    gs = [g for _, g, _ in ps]
    pr = [p for _, _, p in ps]
    lo, hi = min(gs + pr), max(gs + pr)
    if lo == hi:
        return None
    n = hi - lo
    cg, cp = Counter(gs), Counter(pr)
    num = den = 0.0
    obs = Counter((g, p) for _, g, p in ps)
    N = len(ps)
    for i in range(lo, hi + 1):
        for j in range(lo, hi + 1):
            w = ((i - j) / n) ** 2
            num += w * obs.get((i, j), 0)
            den += w * cg.get(i, 0) * cp.get(j, 0) / N
    return None if den == 0 else 1 - num / den


def boot(ps, fn, iters=2000, seed=0, alpha=0.05):
    """Percentile bootstrap interval. Resample the examples, not the items
    within them, because the example is the unit you sampled."""
    rng = random.Random(seed)
    n = len(ps)
    vals = []
    for _ in range(iters):
        s = [ps[rng.randrange(n)] for _ in range(n)]
        try:
            v = fn(s)
        except Exception:
            v = None
        if v is not None:
            vals.append(v)
    if not vals:
        return None, None
    vals.sort()
    return vals[int(alpha / 2 * len(vals))], vals[min(len(vals) - 1, int((1 - alpha / 2) * len(vals)))]


def by_slice(ps, gold, key):
    """Aggregate accuracy per slice. The average is where failures hide:
    a headline number can rise while an entire slice collapses."""
    buckets = {}
    for i, g, p in ps:
        for v in (gold[i].get(key) if isinstance(gold[i].get(key), list) else [gold[i].get(key)]):
            if v is None:
                continue
            buckets.setdefault(str(v), []).append(g == p)
    return {k: (sum(v) / len(v), len(v)) for k, v in sorted(buckets.items())}


def pct(x):
    return "  n/a " if x is None else f"{100*x:5.1f}%"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--gold", required=True)
    ap.add_argument("--pred", required=True)
    ap.add_argument("--baseline", help="previous prediction file, for the regression list")
    ap.add_argument("--ceiling", help="a second labeller's file (gold shape); reports human-human agreement")
    ap.add_argument("--within", type=int, default=1, metavar="K", help="tolerance for within-K agreement (default 1)")
    ap.add_argument("--min-coverage", type=float, help="fail if the model abstains on more than 1-this fraction")
    ap.add_argument("--label-field", default="label")
    ap.add_argument("--pred-field", default="pred")
    ap.add_argument("--min-exact", type=float, help="fail below this exact agreement")
    ap.add_argument("--min-within", type=float, help="fail below this within-one agreement")
    ap.add_argument("--max-regressions", type=int, help="fail above this many newly-wrong items")
    ap.add_argument("--slice-by", default="tags", help="gold field to break results down by")
    ap.add_argument("--iters", type=int, default=2000)
    ap.add_argument("--json", action="store_true", help="machine-readable output")
    a = ap.parse_args()

    gf, pf = a.label_field, a.pred_field
    gold = load(a.gold, gf)
    pred = load(a.pred, pf)
    ps, abstained, missing, extra = pairs_of(gold, pred, gf, pf)
    if not ps and not abstained:
        sys.exit("no ids in common between gold and predictions")
    if not ps:
        sys.exit("the model abstained on every example; nothing to score")

    ordinal = numeric([g for _, g, _ in ps] + [p for _, _, p in ps])
    out = {"n": len(ps), "abstained": abstained, "missing": missing, "extra": extra,
           "ordinal": ordinal, "k": a.within}
    out["coverage"] = len(ps) / (len(ps) + len(abstained))

    out["exact"] = exact(ps)
    out["exact_ci"] = boot(ps, exact, a.iters)
    if ordinal:
        wk = within_k(a.within)
        out["within1"] = wk(ps)
        out["within1_ci"] = boot(ps, wk, a.iters)
        out["qwk"] = qwk(ps)
        out["bias"] = sum(p - g for _, g, p in ps) / len(ps)

    if a.ceiling:
        second = load(a.ceiling, gf)
        hs = [(i, gold[i][gf], second[i][gf]) for i in sorted(set(gold) & set(second))]
        out["ceiling"] = None
        if hs:
            c = {"n": len(hs), "exact": exact(hs)}
            if numeric([g for _, g, _ in hs] + [p for _, _, p in hs]):
                c["within1"] = within(hs, a.within)
                c["qwk"] = qwk(hs)
            out["ceiling"] = c

    out["slices"] = by_slice(ps, gold, a.slice_by)
    out["wrong"] = [
        {"id": i, "gold": g, "pred": p, "reason": gold[i].get("reason", "")}
        for i, g, p in ps if g != p
    ]

    if a.baseline:
        base = load(a.baseline, pf)
        out["regressions"] = [
            {"id": i, "gold": g, "was": base[i][pf], "now": p}
            for i, g, p in ps
            if i in base and base[i][pf] == g and p != g
        ]
        out["fixes"] = [
            {"id": i, "gold": g, "was": base[i][pf], "now": p}
            for i, g, p in ps
            if i in base and base[i][pf] != g and p == g
        ]
        # newly abstaining on something the baseline got right is also a regression
        out["regressions"] += [
            {"id": i, "gold": gold[i][gf], "was": base[i][pf], "now": None}
            for i in abstained if i in base and base[i][pf] == gold[i][gf]
        ]

    if a.json:
        print(json.dumps(out, indent=2, default=list))
    else:
        report(out, a)

    failed = []
    if a.min_exact is not None and out["exact"] < a.min_exact:
        failed.append(f"exact {out['exact']:.3f} < {a.min_exact}")
    if a.min_within is not None and ordinal and out["within1"] < a.min_within:
        failed.append(f"within-one {out['within1']:.3f} < {a.min_within}")
    if a.max_regressions is not None and len(out.get("regressions", [])) > a.max_regressions:
        failed.append(f"{len(out['regressions'])} regressions > {a.max_regressions}")
    if a.min_coverage is not None and out["coverage"] < a.min_coverage:
        failed.append(f"coverage {out['coverage']:.3f} < {a.min_coverage}")
    if failed:
        print("\nFAIL: " + "; ".join(failed), file=sys.stderr)
        return 1
    return 0


def report(o, a):
    w = print
    w(f"\n  n = {o['n']} scored" + (f"  ({len(o['missing'])} unpredicted)" if o["missing"] else ""))
    if o["abstained"]:
        w(f"  coverage             {pct(o['coverage'])}   ({len(o['abstained'])} abstained: {', '.join(o['abstained'][:6])}{'…' if len(o['abstained'])>6 else ''})")
    if o["extra"]:
        w(f"  note: {len(o['extra'])} predictions have no gold label, ignored")
    w("")
    lo, hi = o["exact_ci"]
    w(f"  exact agreement      {pct(o['exact'])}   95% CI [{pct(lo).strip()}, {pct(hi).strip()}]")
    if o["ordinal"]:
        lo, hi = o["within1_ci"]
        w(f"  within {o['k']} band{'s' if o['k']!=1 else ' '}       {pct(o['within1'])}   95% CI [{pct(lo).strip()}, {pct(hi).strip()}]")
        k = o["qwk"]
        w(f"  quadratic kappa      {'  n/a ' if k is None else f'{k:6.3f}'}")
        w(f"  mean signed error    {o['bias']:+6.2f}   (positive = model marks high)")
    c = o.get("ceiling")
    if "ceiling" in o:
        if c is None:
            w("\n  human ceiling        no shared ids between gold and --ceiling file")
        else:
            line = f"\n  human ceiling        {pct(c['exact'])} exact"
            if "within1" in c:
                line += f", {pct(c['within1']).strip()} within {o['k']}"
                if c.get("qwk") is not None:
                    line += f", κ {c['qwk']:.3f}"
            line += f"   on {c['n']} double-labelled"
            w(line)
            gap = o["exact"] - c["exact"]
            w(f"  model vs ceiling     {gap:+.1%} exact   " +
              ("(model is at or above human agreement — check the labels, not the model)" if gap >= 0 else ""))
    if o["slices"]:
        w("\n  by slice")
        for k, (acc, n) in o["slices"].items():
            w(f"    {k:<24} {pct(acc)}  n={n}")
    if o["wrong"]:
        w(f"\n  wrong ({len(o['wrong'])})")
        for r in o["wrong"][:15]:
            w(f"    {r['id']:<8} gold {r['gold']}  pred {r['pred']}   {r['reason'][:58]}")
        if len(o["wrong"]) > 15:
            w(f"    … and {len(o['wrong'])-15} more")
    if "regressions" in o:
        w(f"\n  vs baseline: {len(o['fixes'])} fixed, {len(o['regressions'])} regressed")
        for r in o["regressions"]:
            w(f"    REGRESSED  {r['id']:<8} gold {r['gold']}  was {r['was']}  now {r['now']}")
    w("")


if __name__ == "__main__":
    sys.exit(main())
