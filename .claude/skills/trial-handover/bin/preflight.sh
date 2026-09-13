#!/usr/bin/env bash
# Mechanical handover checks. Cheap, and their absence is loud.
#   preflight.sh [test command]     e.g. preflight.sh "npm test"
# Prints PASS/WARN/FAIL per check; exits 1 on any FAIL.
set -uo pipefail
root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"; cd "$root"
fail=0
ok()   { printf "  PASS  %s\n" "$1"; }
warn() { printf "  WARN  %s\n" "$1"; }
bad()  { printf "  FAIL  %s\n" "$1"; fail=1; }
echo

# 1. working tree
if git rev-parse --git-dir >/dev/null 2>&1; then
  [ -z "$(git status --porcelain)" ] && ok "working tree clean" || bad "uncommitted changes ($(git status --porcelain | wc -l | tr -d ' ') files)"
else warn "not a git repo"; fi

# 2. required files
for f in ASSUMPTIONS.md HANDOVER.md; do [ -f "$f" ] && ok "$f present" || bad "$f missing"; done
[ -f README.md ] && ok "README.md present" || warn "no README.md"

# 3. leftover debug output (tracked source files only)
src=$(git ls-files 2>/dev/null | grep -Ev '(^|/)(node_modules|dist|build|\.next|coverage|vendor)/' | grep -E '\.(ts|tsx|js|jsx|py|go|rb|rs)$' || true)
if [ -n "$src" ]; then
  hits=$(echo "$src" | xargs grep -HnE 'console\.log\(|debugger;|\bpdb\.set_trace|\bbreakpoint\(\)|print\(.*DEBUG' 2>/dev/null | grep -v -E '(test|spec|fixture|eval)' || true)
  [ -z "$hits" ] && ok "no stray debug statements" || { warn "debug statements:"; echo "$hits" | head -8 | sed 's/^/          /'; }
fi

# 4. secrets
sec=$(git ls-files 2>/dev/null | grep -Ev '(^|/)(node_modules|dist)/' | xargs grep -HnE '(sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN (RSA |EC )?PRIVATE KEY|ghp_[A-Za-z0-9]{30,}|eyJ[A-Za-z0-9_-]{30,}\.[A-Za-z0-9_-]{30,})' 2>/dev/null || true)
[ -z "$sec" ] && ok "no obvious secrets in tracked files" || { bad "possible secrets:"; echo "$sec" | head -5 | cut -c1-120 | sed 's/^/          /'; }
git ls-files 2>/dev/null | grep -qE '(^|/)\.env(\.local)?$' && bad ".env file is tracked" || ok ".env not tracked"

# 5. FAKE / TODO markers that should be deliberate
fakes=$(git ls-files 2>/dev/null | xargs grep -HnE '// ?FAKE|# ?FAKE|TODO|FIXME|XXX' 2>/dev/null | grep -v -E 'node_modules|HANDOVER|ASSUMPTIONS' || true)
n=$(echo "$fakes" | grep -c . || true)
[ "$n" = "0" ] && ok "no TODO/FAKE markers" || warn "$n TODO/FAKE markers — each should be named in HANDOVER.md 'Deliberately not built' or be a live fixture"

# 6. decisions complete
if [ -f ASSUMPTIONS.md ]; then
  d=$(grep -cE '^### D-[0-9]+' ASSUMPTIONS.md || true)
  [ "$d" -gt 0 ] && ok "$d decision record(s)" || warn "no D-xx decision records in ASSUMPTIONS.md"
  grep -q '^| A-01 | | | |' ASSUMPTIONS.md && warn "assumptions table still has the empty template row"
fi

# 7. HANDOVER sections
if [ -f HANDOVER.md ]; then
  for s in "Run it" "What works" "The number" "Assumptions" "Decisions" "Deliberately not built" "What I would do next"; do
    grep -qi "^## $s" HANDOVER.md && ok "HANDOVER: $s" || bad "HANDOVER missing section: $s"
  done
fi

# 8. tests
if [ -n "${1:-}" ]; then
  if bash -c "$1" >/tmp/preflight-test.log 2>&1; then ok "tests pass ($1)"; else bad "tests fail ($1) — see /tmp/preflight-test.log"; fi
else warn "no test command given; pass one, e.g. preflight.sh \"npm test\""; fi

echo
[ $fail = 0 ] && echo "  preflight ok" || echo "  preflight FAILED"
echo
exit $fail
