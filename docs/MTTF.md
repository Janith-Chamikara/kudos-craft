# Reliability: Mean Time To Failure (MTTF)

This document defines how we estimate and track Mean Time To Failure (MTTF) for the KudosCraft project.

## Definition
- Failure: any non-success run of the GitHub Actions workflow `Build Check` (backend or frontend job failing, including Docker builds).
- MTTF: average time between observable CI failures.

## Scope
- Workflow: `.github/workflows/build-check.yml`
- Jobs considered: `backend-build`, `frontend-build`
- Branches: `main`, `test`

## How to measure MTTF

### A) Empirical (from CI history)
1. Select an observation window T (e.g., last 14 days).
2. Count failed workflow runs F in that window.
3. Compute MTTF: `MTTF = T / F`.
   - If T is in hours: 72 hours with 6 failures → MTTF = 12 hours.

Record template:
- Observation window start: YYYY-MM-DD HH:MM (UTC)
- Observation window end:   YYYY-MM-DD HH:MM (UTC)
- Total hours (T): X
- Failures (F): Y
- MTTF (hours): T / F

Example: 14 days (336 hours), 7 failures → MTTF = 336 / 7 = 48 hours.

### B) Fault Injection (controlled bug seeding)
Use a temporary branch (e.g., `ci-fault-injection`) to validate detection and estimate failure frequency under assumed bug rates.

Seed one fault at a time and push:
- Backend build failure: break a TypeScript import or `tsconfig` reference so `npm run build` fails.
- Frontend build failure: introduce a syntax error or break `next.config.mjs`.
- Docker build failure: reference a missing file in `Dockerfile` (COPY path that doesn’t exist).

Quick estimation with assumptions:
- Let N = average pushes/day and p = probability a push is faulty.
- Failures/day ≈ N × p → `MTTF ≈ 24 / (N × p)`.
- Example: N = 10, p = 0.2 → failures/day = 2 → MTTF ≈ 12 hours.

### C) Theoretical (quick estimate)
Let:
- N = average pushes/day to branches that run `Build Check`.
- p_b = probability backend build fails (incl. Docker).
- p_f = probability frontend build fails (incl. Docker).
- Assume independence; any job failure fails the workflow.

Failures/day:
```
λ ≈ N × (1 − (1 − p_b) × (1 − p_f)) ≈ N × (p_b + p_f)  (for small p)
MTTF (hours) ≈ 24 / λ
```
Example: N = 8, p_b = 0.10, p_f = 0.05 → λ ≈ 8 × 0.15 = 1.2 → MTTF ≈ 20 hours.

## Data collection
- GitHub UI: Actions → `Build Check` → filter by branch → count failed runs in your window.
- (Optional) GitHub CLI:
```
# Limit to recent runs, filter locally by branch/status
gh run list --workflow "Build Check" --limit 100 --json status,conclusion,createdAt
```

## Assumptions & notes
- MTTF here reflects CI/build reliability, not production runtime reliability.
- Flakiness (e.g., network, registry rate limits) can skew MTTF; prefer re-run checks to confirm failures.
- Client-side validation helps UX; backend must still use parameterized queries, encode output, and handle untrusted input safely.

## Improving MTTF incrementally
- Keep PRs small; merge frequently.
- Add/maintain lint and type checks (fast feedback).
- Add minimal, reliable unit tests.
- Cache dependencies in CI; pin base Docker images.
- Validate Dockerfile COPY paths with a simple script or stage.

## Reporting cadence & targets
- Report MTTF monthly using the empirical method (A).
- Maintain a two-week rolling theoretical estimate (C) as a sanity check.
- Initial target: `MTTF > 48 hours`; medium-term target: `MTTF > 96 hours`.

## Runbook (quick form)
```
Period:  ______  to  ______  (UTC)
Total hours (T): ______
Failures (F):   ______
MTTF (hrs):     T / F = ______
Notes (root causes, flakiness, actions):
- _______________________________________________________
- _______________________________________________________
- _______________________________________________________
```
