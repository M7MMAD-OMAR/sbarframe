# Contributing

Keep the skill portable, concrete and focused on Framer deliverables. Changes
should explain a reproducible failure or a useful implementation decision.

Before submitting:

- Run `bun test` and `bun run check`.
- Add meaningful regression coverage when changing validator behavior.
- Verify affected official APIs and link primary sources for platform claims.
- Keep scoped repairs distinct from whole-release acceptance.
- Include sanitized reproductions only. Exclude credentials, private project
  identifiers, account exports, customer records and restricted assets.
- Explain what your evidence proves and what remains unobserved.

The helper has a conservative full-release profile. Changes to categories,
freshness or applicability must document the policy and preserve existing
projects' stricter requirements. Do not turn an integrity pass into certification.

For issues, include Bun/agent versions, a minimal example, exact command,
expected behavior and observed behavior. Screenshots alone may not reproduce
interaction or runtime problems.

Documentation can remain concise. Avoid personal workstation rules, fixed tool
paths, promotional claims and unnecessary dependencies. Public examples must
be synthetic or explicitly cleared for publication.
