# Project kit and evidence gate

Run with Bun. These commands do not connect to Framer or modify a canvas.

```bash
bun <skill-folder>/scripts/project-kit.ts init <project-folder>
bun <skill-folder>/scripts/project-kit.ts gate <project-folder> <fresh-canonical-id> <exact-revision>
```

`init` creates AGENTS.md, CLAUDE.md, CONNECTION.md, DESIGN.md, CREATIVE_RESEARCH.md, COMPLIANCE.md, STATUS.md, SKILLS.md, BUYER_GUIDE.md and quality/acceptance.json only when absent. It preserves existing files with exclusive creation. Its template starts blocked and has no passing evidence. Do not run it merely to tidy an existing site; use it when the project genuinely lacks required documentation. Existing gates remain authoritative when stricter.

`gate` validates a release evidence register, not a scoped task-completion record. It checks every fixed category plus additional registered checks. Every check needs status, method, threshold, observation, reviewer, zero warnings/errors and evidence. All fixed categories must retain their own IDs. Record measured thresholds and visual review findings, not empty filenames. A no-form project may classify only the base forms check as not-applicable with reason and reviewed evidence. Other categories have meaningful obligations even for a component, such as documenting host SEO responsibility and observing native runtime diagnostics. If local/Preview-only work is authorized, finish it and report scoped completion separately while this release gate remains blocked. Do not manufacture deployment evidence to make it pass.

Evidence items have this format, with real values rather than placeholders:

```json
{
  "path": "qa/current/responsive-report.json",
  "sha256": "64-lowercase-hex-characters-of-the-actual-file",
  "checkedAt": "2026-10-06T08:00:00Z",
  "projectId": "verified-canonical-id",
  "revision": "exact-tested-artifact-revision",
  "summary": "Describe measured observations and the tested scope"
}
```

Each evidence file must be a bounded JSON report with embedded identity and check binding, not an arbitrary nonempty file or screenshot. A report envelope looks like this:

```json
{
  "schemaVersion": 1,
  "projectId": "verified-canonical-id",
  "revision": "exact-tested-artifact-revision",
  "checkId": "responsive",
  "category": "responsive",
  "status": "passed",
  "checkedAt": "2026-10-06T08:00:00Z",
  "producer": "Actual named collector or reviewer",
  "observation": "Actual tested sizes, observations and retained raw artifact references",
  "errors": [],
  "warnings": []
}
```

Embed raw log/screenshot/profile paths and their checksums as additional report fields, then verify them with the site's collector and stricter checks. The generic gate does not recursively verify arbitrary attachment fields. One combined collector can generate separate envelopes referencing common artifacts; a report for one check cannot qualify a different category. Report limits are 2MiB; retain large traces/media outside the envelope. Diagnostics/status inside the report must also be clean and match the register. The report metadata is still authored, so it cannot prove truthful execution.

The gate rejects missing/changed/empty/unreadable or unbound reports, duplicate/missing checks, unknown statuses, malformed diagnostics, warnings/errors, open defects, project/revision mismatches, absolute/outside-project paths and future timestamps. Artifact evidence expires after 24h; research, rights/privacy and documentation review expires after seven days. These are default release policies, not Framer SLAs. Source/runtime/terms changes invalidate affected evidence immediately even inside that window. Do not weaken a stricter site policy. Populated docs must differ from the scaffold after whitespace/line-ending normalization; CONNECTION.md must retain exact labelled canonical ID/editor URL matching the register, and current STATUS/COMPLIANCE cannot still report the scaffold's unrun/blocked acceptance. Placeholder prefixes are rejected in manifest/report fields. The canonical URL must be a clean project URL without credentials, queries or fragments. ID/URL correspondence is still based on the externally verified connection record, not automatic live verification.

Fixed defects require severity, reproduction, surface, viewport, owner, current regression revision and a structured `defect-regression` report bound to their ID and refreshed within 24h of the release run. Keep failed/superseded history separately in archived reports or optional `history` fields; it is not current passing evidence and is not freshness-qualified by this tool. Known limitations and scope changes stay blocked in this release register. Record their impact and owner decision in the scoped task report. Do not waive a defect into release acceptance.

Get the expected ID and revision from a fresh supported live observation before release, then provide them to the command. An operator-supplied ID/revision, checksum and reviewer name are not cryptographic proof of truthful tests. This tool cannot detect fabricated reports, missing requirements that were never registered, or silent removal of additional project-specific checks. Use the site's own locked requirement catalog/checkers, source revision capture and independent review to cover these limits. Do not replace a mature site gate with this scaffold.

`evidenceIntegrityOk: true` means only that the supplied register passes integrity checks. It does not execute browser tests, native diagnostics, performance profiling, accessibility scans, license interpretation or Framer publishing. A release claim requires those real tests and manual visual review as well. Prepublication readiness and exact postdeployment acceptance are separate records. No deployment authority is supplied by either command.

Keep generated QA artifacts outside Git according to the site's maintenance policy. Store authored register/check source in Git, bind reports to actual artifact identity and refresh affected checks after edits. Never reuse another site's passing reports.
