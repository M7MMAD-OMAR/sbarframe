import { createHash } from "node:crypto"
import { mkdirSync, readFileSync, realpathSync, statSync, writeFileSync } from "node:fs"
import { isAbsolute, relative, resolve, sep } from "node:path"

// These categories are a conservative full-release profile, not a Framer certification.
export const categories = [
    "identity", "research", "design-system", "customization", "responsive",
    "forms", "content-localization", "accessibility", "motion",
    "performance-images", "seo-routes", "code-diagnostics", "rights-privacy",
    "editor-preview", "deployment", "documentation",
] as const

type Evidence = {
    path: string; sha256: string; checkedAt: string; projectId: string
    revision: string; summary: string
}
type Check = {
    id: string; category: string; status: string; method: string; threshold: string
    observation: string; reviewer: string; reason: string
    errors: unknown[]; warnings: unknown[]; evidence: Evidence[]
}
type Manifest = {
    schemaVersion: number; project: { canonicalId: string; editorUrl: string; revision: string }
    checks: Check[]; defects: {
        id: string; status: string; severity: string; reproduction: string; surface: string
        viewport: string; owner: string; revision: string; evidence: Evidence[]; history?: unknown[]
    }[]
}

const meaningful = (value: unknown): value is string => typeof value === "string"
    && value.trim().length > 0
    && !/^(todo|tbd|unknown|unresolved|placeholder|pending|unrun|n\/a)(?:$|[\s:])/i.test(value.trim())
    && !/^(ok|none|passed|[-.\s]+)$/i.test(value.trim())

const descriptive = (value: unknown) => meaningful(value) && value.trim().length >= 12
const normalizeWhitespace = (value: string) => value.replace(/\s+/g, " ").trim()

export function seedManifest(): Manifest {
    return {
        schemaVersion: 1,
        project: { canonicalId: "", editorUrl: "", revision: "" },
        checks: categories.map(category => ({
            id: category, category, status: "unrun", method: "", threshold: "",
            observation: "", reviewer: "", reason: "", errors: [], warnings: [], evidence: [],
        })),
        defects: [],
    }
}

const docs: Record<string, string> = {
    "AGENTS.md": `# Project instructions

Read applicable project/workspace instructions, this project's STATUS.md, DESIGN.md, COMPLIANCE.md and verified CONNECTION.md before connected work. Follow documented project authority and requirements.

Use sbarframe alongside the official framer skill. Verify the intended Framer project before editing. Use native history and local experiments for recovery and exploration. Create a new project only within the requested scope. No connection or publication authority is established by this scaffold. Record actual owner authority and identity before canvas changes. Use Bun for local JavaScript. Missing evidence blocks acceptance.

## Durable owner requirements

Record confirmed site-specific visual, interaction, locale and buyer behavior here and in DESIGN.md.
`,
    "CLAUDE.md": `# Shared project instructions

Read local AGENTS.md and applicable parent instructions when present. AGENTS.md is the shared instruction source. Use the verified canonical project only, official Framer skill and Bun. Do not inherit another project's acceptance evidence or session identities.
`,
    "CONNECTION.md": `# Canonical connection

Canonical Framer project ID: unresolved
Canonical editor URL: unresolved
Verification date and method: unrun
Current source/deployment revision: unresolved
Owner-authorized scope and publication authority: record before connected work

Never store credentials, tokens or runtime session numbers here. A historical URL is not a fresh identity check.
`,
    "DESIGN.md": `# Design and editable system

Audience, purpose, distribution and selected original concept:
Typography/color/spacing/layout/motion tokens and native style names:
Named section, navigation, footer, image/background and interaction definitions:
Repeated pattern ownership, variants and consumers:
Buyer controls/defaults and contract links:
Responsive/content/locale rules:
Durable owner feedback:
Motion map, property owners, static/reduced-motion decisions:
Measured media/runtime budgets and host SEO responsibilities:
Verified technique lessons and current limits:
`,
    "CREATIVE_RESEARCH.md": `# Creative research

Record dated official sources, terms and licenses. For major work inspect three relevant references including native Framer and local authored inventory where applicable. Compare two original directions. Record observed mechanics, audience fit, buyer value, native/code path, costs, rights and verification gaps. Mark thumbnail-only motion unverified.
`,
    "COMPLIANCE.md": `# Compliance and acceptance

Current acceptance: blocked, scaffold has no passing evidence.

Read existing project requirements and acceptance commands when present. Record actual project identity, distribution, artifact revision and source/terms/dependency review dates. Cover every category in quality/acceptance.json and expand project-specific tests without removing the base requirements.

Evidence command: bun <installed-sbarframe>/scripts/project-kit.ts gate <project-folder> <fresh-canonical-id> <exact-revision>

This command validates collected evidence integrity. Run actual editor, Preview, runtime and measured tests separately. Preserve existing stricter acceptance commands. Unknown/unrun checks, warnings, known defects and stale/mismatched evidence block acceptance. No publication authority follows from this file.

Requirements, methods, thresholds, applicability, reviewer observations, rights and evidence:
Blockers and scoped delivery limits:
`,
    "STATUS.md": `# Current status

Scaffold created locally. No Framer connection, canvas edit, Preview test or deployment verification has been performed. All acceptance checks are unrun. Record actual changed scope, exact artifact revision, evidence location and open blockers after work.
`,
    "SKILLS.md": `# Skill selection

Use sbarframe for quality coordination and the official framer skill for connected work. Select relevant design, code-component, accessibility, metadata, motion-performance, image and visual verification skills according to actual scope. Record which were read, why, and resulting decisions. Prepare native Framer project skill instructions separately; local files do not install them into the editor.
`,
    "BUYER_GUIDE.md": `# Buyer editing guide

Record exact component/control names and native edit locations. Cover copy/images/links, styles/variants, CMS/locales, form destination/validation, motion disable/reduced-motion, supported responsive content, licenses/attribution and dependencies. Include replacement-content walkthroughs, limitations, support and handoff. Never advertise a customization path that has not been tested on an actual Framer instance.
`,
}

export function initProject(folder: string): string[] {
    const root = resolve(folder)
    mkdirSync(resolve(root, "quality"), { recursive: true })
    const actualRoot = realpathSync(root)
    const actualQuality = realpathSync(resolve(root, "quality"))
    const qualityRelative = relative(actualRoot, actualQuality)
    if (qualityRelative === ".." || qualityRelative.startsWith(".." + sep) || isAbsolute(qualityRelative)) {
        throw new Error("quality folder must remain inside the requested project")
    }
    const actions: string[] = []
    const files = { ...docs, "quality/acceptance.json": JSON.stringify(seedManifest(), null, 2) + "\n" }
    for (const [name, content] of Object.entries(files)) {
        const target = resolve(root, name)
        try {
            // Exclusive creation also prevents a race from overwriting existing work.
            writeFileSync(target, content, { flag: "wx" })
            actions.push(`created ${name}`)
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code === "EEXIST") actions.push(`kept ${name}`)
            else throw error
        }
    }
    return actions
}

export function validateEvidence(folder: string, expectedId: string, expectedRevision: string, now = Date.now()): string[] {
    const problems: string[] = []
    let root: string
    try { root = realpathSync(resolve(folder)) }
    catch { return ["Project folder missing or unreadable"] }
    const fail = (message: string) => problems.push(message)
    if (!meaningful(expectedId) || !meaningful(expectedRevision)) fail("Fresh expected project ID and exact revision are required")
    let manifest: Manifest
    try { manifest = JSON.parse(readFileSync(resolve(root, "quality/acceptance.json"), "utf8")) }
    catch { return [...problems, "Manifest missing or malformed JSON"] }
    if (!manifest || manifest.schemaVersion !== 1) fail("Unsupported manifest schema")
    if (manifest?.project?.canonicalId !== expectedId || manifest?.project?.revision !== expectedRevision) fail("Project identity or revision mismatch")
    try {
        const url = new URL(manifest.project.editorUrl)
        if (url.protocol !== "https:" || !["framer.com", "www.framer.com"].includes(url.hostname)
            || !url.pathname.startsWith("/projects/") || url.username || url.password || url.search || url.hash) {
            fail("Canonical editor URL must be a clean Framer HTTPS project URL without credentials, query or fragment")
        }
    } catch { fail("Canonical editor URL missing or malformed") }
    if (!Array.isArray(manifest?.checks) || !Array.isArray(manifest?.defects)) return [...problems, "Checks and defects must be arrays"]

    const checkEvidence = (items: Evidence[], owner: string, category: string, expectedStatus: string) => {
        if (!Array.isArray(items) || items.length === 0) { fail(`${owner}: no evidence`); return }
        for (const item of items) {
            if (!item || !meaningful(item.path) || isAbsolute(item.path)) { fail(`${owner}: evidence path must be relative`); continue }
            if (item.projectId !== expectedId || item.revision !== expectedRevision) fail(`${owner}: evidence identity/revision mismatch`)
            if (!descriptive(item.summary)) fail(`${owner}: evidence summary missing`)
            const timestamp = typeof item.checkedAt === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(item.checkedAt)
                ? Date.parse(item.checkedAt) : NaN
            // Artifact tests: 24h. Reviewed sources/docs: at most 7 days. Default release profile.
            const maxAgeHours = ["research", "rights-privacy", "documentation"].includes(category) ? 168 : 24
            if (!Number.isFinite(timestamp) || now - timestamp > maxAgeHours * 60 * 60 * 1000 || timestamp > now) fail(`${owner}: evidence stale, future-dated or invalid`)
            if (typeof item.sha256 !== "string" || !/^[a-f0-9]{64}$/.test(item.sha256)) fail(`${owner}: invalid SHA-256`)
            try {
                const path = realpathSync(resolve(root, item.path))
                const inside = relative(root, path)
                if (inside === ".." || inside.startsWith(".." + sep) || isAbsolute(inside)) { fail(`${owner}: evidence escapes project folder`); continue }
                if (Object.keys(docs).includes(inside) || inside === "quality/acceptance.json") fail(`${owner}: evidence cannot be documentation or the manifest`)
                const file = statSync(path)
                if (!file.isFile()) { fail(`${owner}: report must be a regular file`); continue }
                if (file.size > 2 * 1024 * 1024) { fail(`${owner}: report exceeds 2MiB; use a bounded JSON report and retained artifact references`); continue }
                const bytes = readFileSync(path)
                if (bytes.length === 0) fail(`${owner}: evidence file empty`)
                const hash = createHash("sha256").update(bytes).digest("hex")
                if (hash !== item.sha256) fail(`${owner}: evidence file changed`)
                try {
                    const report = JSON.parse(bytes.toString("utf8"))
                    if (!report || report.schemaVersion !== 1 || report.projectId !== expectedId
                        || report.revision !== expectedRevision || report.checkId !== owner
                        || report.category !== category || report.status !== expectedStatus
                        || report.checkedAt !== item.checkedAt || !meaningful(report.producer)
                        || !descriptive(report.observation)) fail(`${owner}: structured report binding or observation invalid`)
                    if (!Array.isArray(report?.errors) || !Array.isArray(report?.warnings)
                        || report.errors.length || report.warnings.length) fail(`${owner}: report errors/warnings present or malformed`)
                } catch { fail(`${owner}: evidence must be a structured JSON report`) }
            } catch { fail(`${owner}: evidence file missing or unreadable`) }
        }
    }
    const ids = new Set<string>()
    for (const check of manifest.checks) {
        if (!check || !meaningful(check.id)) { fail("Malformed check"); continue }
        if (ids.has(check.id)) fail(`${check.id}: duplicate check ID`)
        ids.add(check.id)
        if (!categories.includes(check.category as typeof categories[number])) fail(`${check.id}: unknown category`)
        if (!["passed", "not-applicable"].includes(check.status)) fail(`${check.id}: status ${check.status || "missing"}`)
        if (!Array.isArray(check.errors) || !Array.isArray(check.warnings) || check.errors.length || check.warnings.length) fail(`${check.id}: errors/warnings present or malformed`)
        for (const field of ["method", "threshold", "observation", "reviewer"] as const) {
            if (!(field === "reviewer" ? meaningful(check[field]) : descriptive(check[field]))) fail(`${check.id}: ${field} missing`)
        }
        if (check.status === "not-applicable") {
            if (check.category !== "forms" || check.id !== "forms" || !meaningful(check.reason)) fail(`${check.id}: unsupported or undocumented applicability exclusion`)
        }
        checkEvidence(check.evidence, check.id, check.category, check.status)
    }
    for (const category of categories) {
        if (!manifest.checks.some(check => check?.id === category && check.category === category)) fail(`Required check missing: ${category}`)
    }
    const defectIds = new Set<string>()
    for (const defect of manifest.defects) {
        if (!defect || !meaningful(defect.id) || defectIds.has(defect.id)) { fail("Malformed or duplicate defect"); continue }
        defectIds.add(defect.id)
        if (defect.status !== "fixed") fail(`${defect.id}: known open defect`)
        for (const field of ["severity", "reproduction", "surface", "viewport", "owner", "revision"] as const) {
            if (!meaningful(defect[field])) fail(`${defect.id}: ${field} missing`)
        }
        if (defect.revision !== expectedRevision) fail(`${defect.id}: current regression revision mismatch`)
        checkEvidence(defect.evidence, defect.id, "defect-regression", "passed")
    }
    for (const name of Object.keys(docs)) {
        try {
            const path = realpathSync(resolve(root, name))
            const inside = relative(root, path)
            if (inside === ".." || inside.startsWith(".." + sep) || isAbsolute(inside)
                || !statSync(path).isFile()) {
                fail(`Required documentation missing or unreadable: ${name}`)
                continue
            }
            const bytes = readFileSync(path)
            if (bytes.length === 0) fail(`Required documentation empty: ${name}`)
            const content = bytes.toString("utf8")
            if (normalizeWhitespace(content) === normalizeWhitespace(docs[name])) fail(`Required documentation remains an unchanged scaffold: ${name}`)
            if (name === "CONNECTION.md") {
                const recordedId = content.match(/^Canonical Framer project ID:\s*(.+)$/m)?.[1]?.trim()
                const recordedUrl = content.match(/^Canonical editor URL:\s*(.+)$/m)?.[1]?.trim()
                if (recordedId !== expectedId || recordedUrl !== manifest.project.editorUrl) fail("Canonical connection record does not match manifest identity/URL")
            }
            if ((name === "STATUS.md" || name === "COMPLIANCE.md")
                && /(?:^current acceptance:\s*blocked\s*(?:[,.:]|$)|all (?:acceptance )?checks (?:are )?unrun)/im.test(content)) fail(`Required documentation still records unaccepted scope: ${name}`)
        } catch { fail(`Required documentation missing: ${name}`) }
    }
    return problems
}

if (import.meta.main) {
    const [action, folder, expectedId, expectedRevision, ...extra] = process.argv.slice(2)
    try {
        if (!folder || extra.length || !["init", "gate"].includes(action)) throw new Error("Usage: bun project-kit.ts init <folder> | gate <folder> <fresh-project-id> <exact-revision>")
        if (action === "init") {
            if (expectedId || expectedRevision) throw new Error("init accepts one folder argument")
            console.log(initProject(folder).join("\n"))
        } else {
            const problems = validateEvidence(folder, expectedId ?? "", expectedRevision ?? "")
            console.log(JSON.stringify({ evidenceIntegrityOk: problems.length === 0, problems, limit: "Release-register integrity only; actual tests, visual review and current identity checks remain external requirements" }, null, 2))
            process.exitCode = problems.length ? 1 : 0
        }
    } catch (error) {
        console.error((error as Error).message)
        process.exitCode = 1
    }
}
