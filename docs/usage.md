# Using sbarframe

## Installation

Run the Skills CLI from the project that should receive the skill:

```bash
npx skills add M7MMAD-OMAR/sbarframe --skill sbarframe
```

The installer lets you select agents and scope. To install globally for Codex
and Claude Code without the selection prompts:

```bash
npx skills add M7MMAD-OMAR/sbarframe --skill sbarframe --global --agent codex claude-code --yes
```

Review the files before installation. The Skills CLI has its own telemetry and
installation behavior; see its [official documentation](https://skills.sh/docs/cli).
This repository's helper does not contact the network.

For a manual project-local install, clone the repository and copy the complete
`skills/sbarframe` directory, including references, assets and scripts:

```bash
git clone https://github.com/M7MMAD-OMAR/sbarframe.git
mkdir -p YOUR_PROJECT/.agents/skills
cp -R sbarframe/skills/sbarframe YOUR_PROJECT/.agents/skills/sbarframe
```

For Claude Code use `YOUR_PROJECT/.claude/skills` instead. For global installation
use your agent's documented skills directory. Avoid overwriting a customized
installation. Restart or refresh the agent if it does not detect a new skill.

With the Skills CLI, use `npx skills list` to inspect installed skills and
`npx skills update sbarframe` to apply updates to this skill. Manual copies require manually reviewing and copying updates.
Release archives provide versioned downloads on GitHub.

## Prerequisites and connection

- An agent that understands `SKILL.md`, or a workflow that explicitly reads it.
- Web research and browser inspection for current sources and observations.
- Framer access and the current official execution skill for connected edits.
- Bun only when using the optional TypeScript helper or developing this repo.

Follow [Framer's official external-agent setup](https://www.framer.com/agents/external/)
to connect your supported agent. Verify the actual project ID and URL before
editing. Keep credentials in the supported connection mechanism, never in
documentation. No Framer access is needed to read the skill or run helper tests.

## Invocation recipes

### New website or template

```text
Use sbarframe for a new Framer template for an independent architecture studio.
Compare two creative concepts. Define editable shared sections and one signature
interaction. Plan responsive content, forms, motion, SEO and performance.
Implement in the verified project, then document actual editor, Preview and
authorized deployment observations. Fix known issues before acceptance.
```

### Repair

```text
Use sbarframe to fix this Framer contact form and its phone layout.
Reproduce the failures, repair the shared definition, test invalid/corrected/valid
input and retest its consumers. Report scoped completion and any wider site blockers.
```

### Creative component

```text
Use sbarframe to create an editable image-reveal section in Framer.
Research native effects and permitted community components first. Document the
controls, sizing, keyboard/touch behavior, reduced-motion fallback and runtime cost.
Keep essential content visible on first render and verify the actual Framer instance.
```

### Audit

```text
Use sbarframe to audit this Framer site's delivery readiness without changing it.
Inspect the real artifacts, register problems and missing evidence, prioritize
repairs and explain the exact acceptance level. Do not treat screenshots as proof
of forms, routing, motion or performance.
```

In Codex you can invoke `$sbarframe`; in Claude Code use `/sbarframe` when your
installation supports that invocation. Plain-language invocation works when the
agent reads installed skills. The skill description also targets Framer requests
in Arabic. Agent execution and available tools still determine what can be observed.

## Generated project records

```bash
bun skills/sbarframe/scripts/project-kit.ts init ../my-framer-site
```

The folder is created when absent. Existing files are preserved using exclusive
creation. Read existing requirements before using the kit on an established site.

| File | Populate with |
|---|---|
| AGENTS.md, CLAUDE.md | Applicable project instructions, authority and durable requirements |
| CONNECTION.md | Fresh verified canonical ID, editor URL, revision and method |
| DESIGN.md | Shared tokens, components, controls, breakpoints and motion map |
| CREATIVE_RESEARCH.md | Inspected references, concepts, licenses and implementation decisions |
| COMPLIANCE.md | Requirements, methods, thresholds, observations and blockers |
| STATUS.md | Actual changed scope, current evidence and verification limits |
| SKILLS.md | Capabilities used and why |
| BUYER_GUIDE.md | Tested editing locations, content replacement and dependencies |
| quality/acceptance.json | Checks and defects for the full-release profile |

These files belong to your own project. They can contain private operational
details and should not be copied into public skill repositories.

## Evidence register

```bash
bun skills/sbarframe/scripts/project-kit.ts gate ../my-framer-site VERIFIED_PROJECT_ID EXACT_TESTED_REVISION
```

The expected ID and revision must come from a fresh supported observation, not
from copying the manifest's values. Exit code `0` means supplied register integrity
passed; `1` reports problems or command errors. The command does not edit records.

The helper's conservative full-release profile requires 16 categories. Artifact
evidence has a 24-hour window; research, rights and documentation reviews have a
seven-day window. These are project workflow defaults, not Framer requirements.
Changes invalidate affected evidence even within the window. Only the base forms
check may be not-applicable, with a reason and reviewed report. A scoped repair
can finish while the full-release register remains blocked.

See [gate.md](../skills/sbarframe/references/gate.md) for the exact manifest and
report fields, SHA-256 binding, defect regression reports, path restrictions and
limits. See [the verification matrix](../skills/sbarframe/references/verification.md)
for observations to collect. The helper does not collect reports for you or verify
arbitrary attachment fields recursively. Retain raw screenshots, logs and profiles
and verify them with your project's own collectors.

Never fill passing reports from the software-test fixture. Never rewrite failures
as passes to clear the gate. Preserve mature project acceptance commands and
explicitly register additional requirements.

## Native Framer project skills

[project-skills.md](../skills/sbarframe/assets/project-skills.md) contains adaptable
instructions for brand rules, section assembly, CMS/content, motion and launch
review. Add form guidance where relevant. Replace examples with your verified
native component/style/page names and current supported references.

Use the current [native authoring instructions](https://www.framer.com/skills/).
Installing sbarframe into an external agent does not install those drafts into
Framer. Copying instructions into a project does not establish website acceptance.

## Troubleshooting

| Symptom | Action |
|---|---|
| Agent cannot find the skill | Check selected agent and install scope; refresh; explicitly request reading SKILL.md |
| Helper cannot run | Install Bun or use the Markdown workflow without the optional helper |
| Gate rejects the new project | Expected: scaffolds contain no actual passing evidence |
| Identity or revision mismatch | Reverify the intended artifact and recollect affected reports |
| Report hash changed | Investigate the change and regenerate its evidence reference after real retesting |
| Editor works but published site fails | Keep deployment blocked, reproduce on the exact artifact and repair it |
| Missing device or integration access | State the missing evidence; do not substitute emulation or animations for proof |

Submit a minimal sanitized reproduction through GitHub Issues. Include versions,
command, expected result and observed result. Exclude credentials and private client data.
