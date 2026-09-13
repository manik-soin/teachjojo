#!/usr/bin/env bash
# Create ASSUMPTIONS.md in the repo root with the deliverable sentence and a
# timestamp. Idempotent: refuses to overwrite an existing file.
#
#   init.sh "<one-sentence deliverable>" <hours>
set -euo pipefail
sentence="${1:?usage: init.sh \"<deliverable sentence>\" <hours>}"
hours="${2:?usage: init.sh \"<deliverable sentence>\" <hours>}"
root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
f="$root/ASSUMPTIONS.md"
if [ -e "$f" ]; then echo "exists: $f (not overwriting)"; exit 1; fi
now="$(date '+%Y-%m-%d %H:%M')"
end="$(date -v+"${hours}"H '+%H:%M' 2>/dev/null || date -d "+${hours} hours" '+%H:%M')"
stop="$(date -v+"$((hours*60-60))"M '+%H:%M' 2>/dev/null || date -d "+$((hours*60-60)) minutes" '+%H:%M')"
cat > "$f" <<MD
# Assumptions and decisions

**Deliverable:** $sentence
**Time box:** ${hours}h  **Started:** $now  **Stop building:** $stop  **Hands off:** $end
**Seam:** <file:line — filled in after trial-seam-map>

## Assumptions
| # | I assumed | Because | I would check by |
|---|---|---|---|
| A-01 | | | |

## Decisions taken
<!-- appended by trial-fork-log (bin/fork.py) -->

## Deliberately not built
| Thing | Why not |
|---|---|
MD
echo "wrote $f"
echo "stop building at $stop, hand off at $end"
