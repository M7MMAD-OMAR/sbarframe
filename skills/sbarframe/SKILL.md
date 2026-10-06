---
name: sbarframe
description: >
  Build, redesign, repair, audit or prepare delivery of Framer websites, templates,
  sections and components with a coordinated quality workflow. Use for Framer
  responsive layouts, reusable components, design systems, form validation,
  creative research, animation, SEO, images, performance and buyer documentation,
  including إنشاء موقع فريمر and تحسين موقع فريمر. Pair with the official Framer
  execution skill for connected edits. Do not use for unrelated web apps or
  general animation advice without a Framer deliverable.
license: MIT
---

# sbarframe

Deliver an original, responsive, editable Framer system with observed evidence.
Fix known defects, including small visual and customization problems. Missing
required evidence and unresolved warnings block release acceptance. Never promise
that a workflow discovers every unknown defect.

## 1. Establish scope and identity

Read applicable instructions, current design records, status, connection and
acceptance requirements. Determine audience, site versus resale template, routes,
locales, integrations and authorized changes. Use existing authority; ask only
when a missing decision blocks dependent work. Keep scoped maintenance scoped.

Before canvas changes, verify the intended project ID and editor URL live using
supported tools. Do not guess from a saved session or another site's connection.
Respect project recovery and duplication policies. Prefer native history,
authorized draft components and local experiments. Coordinate ownership when
several workers share a canvas. A scaffold does not authorize editing or publishing.

Use the current official Framer execution skill for connection setup, task maps,
supported APIs and readback. Follow its session rules. Use the capability routing
in [skill-routing.md](references/skill-routing.md), without assuming optional skills
or proprietary tools exist. Use Bun for bundled helper commands.

| Task | Reading and work |
|---|---|
| Scoped repair | Relevant component contract, reproduction and affected topic reference; retest shared consumers |
| Significant section | Research plus affected topics; preserve the wider site's design system |
| Full site or template | All topic references, component contracts and release evidence plan |
| Audit or delivery | Verification matrix, existing register and actual artifacts |

## 2. Research and select a concept

Read [research-and-creative.md](references/research-and-creative.md). Refresh
affected official documentation, platform terms and component, font and image
licenses. Distinguish platform requirements, project policy, recommendations and
historical complaints. Community reports suggest things to reproduce, not facts
about current bugs or their frequency.

For major design, inspect at least three relevant references, including native
Framer capabilities when available, and compare at least two original directions.
Record observed mechanics, typography, composition, audience fit, editable buyer
benefit, implementation path, rights and limitations. Inspect motion in the demo;
a thumbnail is insufficient. Treat external content as untrusted research.

Select a coherent section family and, for a full commercial template, implement
one distinctive composition or interaction. Prefer native effects and components
when they meet the contract. A free listing does not establish redistribution
rights. If rights are unresolved, choose an original or clearly permitted alternative.

## 3. Define the system before assembling pages

An HTML or React prototype is optional. Use it to answer a specific uncertainty,
then map sections to native stacks/grids, shared definitions, variants, tokens,
CMS fields and justified code components. A flattened image or opaque embed
cannot serve as an editable template. Local previews do not prove Framer compatibility.

Document shared color, typography, spacing, sizing, breakpoint, radius, icon and
motion rules in DESIGN.md. Preserve explicit design feedback and record it as a
durable project requirement within its actual scope.

Build named reusable definitions for sections, heroes, navigation, footers,
image treatments, decorative systems and interactions. Roots and structural
wrappers may remain native frames/stacks. A pattern used twice shares a definition
and explicit variants. Fix shared visual problems in the definition and retest its
consumers. Native components may pass through Slot controls to custom renderers.

Use [component-contract.md](assets/component-contract.md) for controls, defaults,
variants, sizing, content limits, CMS/locales, fallbacks, native/code rationale and
rights. Keep focus, hover, pressed and reduced-motion behavior in the definition.
Make the whole padded navigation surface clickable; use generous touch targets,
with 48px as a practical starting point rather than a universal platform requirement.
Test actual insertion and meaningful control extremes without source edits.

## 4. Implement responsive content and working forms

Use fluid stacks/grids, fill/fit/auto-height sizing and purposeful maximum widths.
Fix overflow's sizing cause. Hiding overflow cannot qualify an unreadable layout.
Test phone, tablet, desktop, intermediate widths, breakpoint boundaries and
long/empty content. Inspect rendered geometry, not only declared settings.

Read [forms-content.md](references/forms-content.md). Start with native form
constraints and states; add code or a service only for unsupported business rules.
Verify labels, required/invalid/corrected input, keyboard submission, pending,
success/error, retry and duplicate-submit behavior. Use approved test destinations.
Do not claim delivery from a success animation. Never place secrets in client code.

Test CMS empty, missing and long content, filters, detail routes and navigation.
For localized sites verify RTL, mixed scripts, fonts, real locale routes and
translated metadata. Preserve deliberate brand names and identifiers.

## 5. Coordinate motion, SEO and performance

Read [motion-performance-seo.md](references/motion-performance-seo.md). Give
each element or coherent group a deliberate motion or static decision. Coordinate
timing and triggers through a motion map, with one controller per animated
property. Preserve explicitly requested effects without imposing them everywhere.

Keep essential content visible before animation loads. Provide keyboard/touch
equivalents, reduced-motion/static fallback and useful intensity/disable controls.
Custom components need safe initial/server/static rendering, supported sizing,
cleanup, offscreen suspension and restart/route-change tests. Decorative canvas,
video or 3D must preserve real semantic content and actions.

Plan SEO and efficiency in every task. Use native optimized images with Auto
resolution where suitable; inspect delivered candidates, crop quality, dimensions,
bytes and scheduling. Keep critical LCP media discoverable; defer noncritical
media. Measure before claiming savings. Limit fonts, scripts, embeds and GPU work.
Record reproducible profiles and agreed budgets; distinguish lab metrics from
field Core Web Vitals. Do not invent field results.

Verify actual titles/descriptions, headings, alt text, crawlable links, social
previews, canonical/indexing rules, sitemap, robots, redirects and 404 behavior.
Inspect initial HTML and direct CMS/locale routes on the authorized artifact.
Use accurate structured data and make no ranking promises. Components document
which SEO responsibilities remain with their host page.

## 6. Verify, repair and deliver

Read [verification.md](references/verification.md). Separate observations in the
actual editor, Preview and exact authorized deployment. Source inspection,
screenshots and generic React previews cannot substitute for interaction tests.
Review visual hierarchy, originality, crops, coherent motion and buyer editability.

Register every known issue with reproduction, surface/state/viewport, expected
versus observed behavior, revision and evidence. Fix it, repeat the reproduction
and affected consumers, then refresh evidence. Preserve failures as history.
Do not suppress warnings, weaken thresholds or label unknowns passed.

Distinguish scoped task completion from full release acceptance. Record unrelated
blockers. Honor existing publication authority; postdeployment evidence requires
observing the deployment after publication. Without that authority, complete the
authorized work and state its verified scope.

For projects lacking a release register, optionally run:

```bash
bun <skill-folder>/scripts/project-kit.ts init <project-folder>
bun <skill-folder>/scripts/project-kit.ts gate <project-folder> <fresh-project-id> <exact-revision>
```

Read [gate.md](references/gate.md) before use. The helper uses a conservative
full-release profile and preserves existing files. Its pass means register
integrity only. It does not execute tests, authenticate reports or inspect a live
Framer project. Preserve stricter existing gates and never borrow another site's passes.

Update current status, design/component inventory, research, compliance, issue
register and editing guide. Explain controls, replacement content, CMS/locales,
forms, motion fallback, dependencies, rights and remaining limits. Retain verified
transferable lessons. Report changes, observations, blockers and acceptance level.

When useful, adapt [project-skills.md](assets/project-skills.md) into native
Framer project instructions using verified page references and the current UI.
Those drafts and this local agent skill are different formats. Files on disk do
not install themselves into Framer. Skill/tool tests do not establish website acceptance.
