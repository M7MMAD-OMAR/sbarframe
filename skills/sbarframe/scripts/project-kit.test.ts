import { afterEach, describe, expect, test } from "bun:test"
import { createHash } from "node:crypto"
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, unlinkSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { categories, initProject, seedManifest, validateEvidence } from "./project-kit"

// Every passing fixture in this suite is synthetic software-test data.
// None is evidence of a Framer website, editor, Preview or deployment test.
const fixtureId = "synthetic-test-project"
const fixtureRevision = "synthetic-test-revision"
const fixtureNow = Date.parse("2026-10-06T08:00:00Z")
const temporaryRoots: string[] = []
type SyntheticEvidence = {
    path: string; sha256: string; checkedAt: string; projectId: string
    revision: string; summary: string
}

function temporaryRoot() {
    const root = mkdtempSync(join(tmpdir(), "framer-project-kit-test-"))
    temporaryRoots.push(root)
    return root
}

function saveManifest(root: string, manifest: unknown) {
    writeFileSync(join(root, "quality", "acceptance.json"), JSON.stringify(manifest))
}

function fixture() {
    const root = temporaryRoot()
    initProject(root)
    for (const name of readdirSync(root).filter(name => name.endsWith(".md"))) {
        writeFileSync(join(root, name), `# Synthetic ${name} record\n\nThis populated document exercises integrity checks only. No Framer website, editor, Preview or deployment was inspected. The software fixture has no release authority.\n`)
    }
    writeFileSync(join(root, "CONNECTION.md"), `# Synthetic canonical record\nCanonical Framer project ID: ${fixtureId}\nCanonical editor URL: https://framer.com/projects/synthetic-test-project\nVerification is simulated software-test metadata, never live Framer evidence.\n`)
    const evidence = {
        path: "quality/identity-report.json",
        sha256: "",
        checkedAt: new Date(fixtureNow).toISOString(),
        projectId: fixtureId,
        revision: fixtureRevision,
        summary: "Synthetic data for validator unit tests, not website acceptance",
    }
    const manifest = seedManifest()
    manifest.project = {
        canonicalId: fixtureId,
        editorUrl: "https://framer.com/projects/synthetic-test-project",
        revision: fixtureRevision,
    }
    for (const check of manifest.checks) {
        Object.assign(check, {
            status: "passed",
            method: "Synthetic validator unit test",
            threshold: "Synthetic fixture satisfies integrity constraints",
            observation: "No real website test performed",
            reviewer: "Software-test fixture",
            evidence: [{ ...evidence, path: `quality/${check.category}-report.json` }],
        })
        writeReport(root, check.evidence[0], check.id, check.category, check.status)
    }
    saveManifest(root, manifest)
    return { root, manifest, evidence: { ...manifest.checks[0].evidence[0] } }
}

function writeReport(root: string, item: SyntheticEvidence, checkId: string, category: string, status: string) {
    const report = {
        schemaVersion: 1, projectId: item.projectId, revision: item.revision,
        checkId, category, status, checkedAt: item.checkedAt,
        producer: "Synthetic software-test collector",
        observation: "Synthetic integrity observation only. No website was tested.",
        errors: [], warnings: [],
    }
    const bytes = JSON.stringify(report)
    writeFileSync(join(root, item.path), bytes)
    item.sha256 = createHash("sha256").update(bytes).digest("hex")
}

function overwriteEvidence(root: string, item: SyntheticEvidence, bytes: string) {
    writeFileSync(join(root, item.path), bytes)
    item.sha256 = createHash("sha256").update(bytes).digest("hex")
}

function updateReport(root: string, item: SyntheticEvidence, patch: Record<string, unknown>) {
    const report = JSON.parse(readFileSync(join(root, item.path), "utf8"))
    const bytes = JSON.stringify({ ...report, ...patch })
    writeFileSync(join(root, item.path), bytes)
    item.sha256 = createHash("sha256").update(bytes).digest("hex")
}

function syntheticDefect(root: string, evidence: SyntheticEvidence, status = "fixed") {
    const item = { ...evidence, path: "quality/defect-1-report.json" }
    writeReport(root, item, "defect-1", "defect-regression", "passed")
    return {
        id: "defect-1", status, severity: "Synthetic medium severity",
        reproduction: "Synthetic regression exercise without website execution",
        surface: "Synthetic test surface", viewport: "Synthetic desktop fixture",
        owner: "Synthetic software-test owner", revision: fixtureRevision, evidence: [item],
    }
}

function problems(root: string, now = fixtureNow) {
    return validateEvidence(root, fixtureId, fixtureRevision, now)
}

function rejects(root: string, pattern?: RegExp) {
    const result = problems(root)
    expect(result.length).toBeGreaterThan(0)
    if (pattern) expect(result.some(message => pattern.test(message))).toBe(true)
}

afterEach(() => {
    for (const root of temporaryRoots.splice(0)) rmSync(root, { recursive: true, force: true })
})

describe("synthetic gate integrity", () => {
    test("accepts a fully synthetic well-formed fixture without claiming website evidence", () => {
        expect(problems(fixture().root)).toEqual([])
    })

    test("freshly seeded scaffold stays blocked", () => {
        const root = temporaryRoot()
        initProject(root)
        rejects(root)
    })

    test.each([null, {}, 42, [], "invalid"].map(value => ({ value })))("rejects malformed root manifest %j", ({ value }) => {
        const { root } = fixture()
        saveManifest(root, value)
        rejects(root)
    })

    test("rejects malformed JSON and a missing manifest", () => {
        const { root } = fixture()
        writeFileSync(join(root, "quality", "acceptance.json"), "{")
        rejects(root, /malformed/)
        unlinkSync(join(root, "quality", "acceptance.json"))
        rejects(root, /missing/)
    })

    test.each([null, {}, "wrong"])("rejects malformed checks collection %j", value => {
        const { root, manifest } = fixture()
        ;(manifest as any).checks = value
        saveManifest(root, manifest)
        rejects(root, /arrays/)
    })

    test.each([null, {}, "wrong"])("rejects malformed defects collection %j", value => {
        const { root, manifest } = fixture()
        ;(manifest as any).defects = value
        saveManifest(root, manifest)
        rejects(root, /arrays/)
    })

    test.each([null, {}, 42, "wrong"])("rejects malformed check %j", value => {
        const { root, manifest } = fixture()
        ;(manifest.checks as any[])[0] = value
        saveManifest(root, manifest)
        rejects(root, /Malformed check/)
    })

    test.each([null, {}, "wrong", [], [null], [42]].map(value => ({ value })))("rejects malformed evidence %j", ({ value }) => {
        const { root, manifest } = fixture()
        ;(manifest.checks[0] as any).evidence = value
        saveManifest(root, manifest)
        rejects(root, /evidence/)
    })

    test("rejects a missing fixed category and renamed fixed check ID", () => {
        const { root, manifest } = fixture()
        manifest.checks = manifest.checks.filter(check => check.category !== "responsive")
        saveManifest(root, manifest)
        rejects(root, /Required check missing: responsive/)
        const renamed = fixture()
        renamed.manifest.checks[0].id = "identity-extra"
        saveManifest(renamed.root, renamed.manifest)
        rejects(renamed.root, /Required check missing: identity/)
    })

    test("rejects duplicate checks and unknown categories", () => {
        const { root, manifest } = fixture()
        manifest.checks.push({ ...manifest.checks[0] })
        saveManifest(root, manifest)
        rejects(root, /duplicate check ID/)
        manifest.checks.pop()
        manifest.checks[0].category = "unregistered-category"
        saveManifest(root, manifest)
        rejects(root, /unknown category/)
    })

    test.each(["blocked", "failed", "unrun", "waived", ""])("rejects check status %s", status => {
        const { root, manifest } = fixture()
        manifest.checks[0].status = status
        saveManifest(root, manifest)
        rejects(root, /status/)
    })

    test.each(["method", "threshold", "observation", "reviewer"] as const)("rejects missing %s", field => {
        const { root, manifest } = fixture()
        manifest.checks[0][field] = "TODO"
        saveManifest(root, manifest)
        rejects(root, new RegExp(`${field} missing`))
    })

    test("rejects wrong manifest identity/revision and missing expected values", () => {
        const { root, manifest } = fixture()
        manifest.project.canonicalId = "another-project"
        manifest.project.revision = "another-revision"
        saveManifest(root, manifest)
        rejects(root, /identity or revision mismatch/)
        expect(validateEvidence(root, "", "", fixtureNow).length).toBeGreaterThan(0)
    })

    test.each(["http://framer.com/projects/test", "https://framer.com.evil.test/projects/test", "invalid"])("rejects editor URL %s", editorUrl => {
        const { root, manifest } = fixture()
        manifest.project.editorUrl = editorUrl
        saveManifest(root, manifest)
        rejects(root, /editor URL/)
    })

    test("rejects evidence bound to another project or revision", () => {
        const { root, manifest } = fixture()
        manifest.checks[0].evidence[0].projectId = "another-project"
        manifest.checks[0].evidence[0].revision = "another-revision"
        saveManifest(root, manifest)
        rejects(root, /evidence identity\/revision mismatch/)
    })

    test.each(["2026-10-05T07:59:59Z", "2026-10-06T08:00:01Z", "invalid", "2026-10-06T08:00:00"])("rejects stale/future/invalid timestamp %s", checkedAt => {
        const { root, manifest } = fixture()
        manifest.checks[0].evidence[0].checkedAt = checkedAt
        saveManifest(root, manifest)
        rejects(root, /stale, future-dated or invalid/)
    })

    test("rejects changed or missing evidence bytes", () => {
        const { root, manifest } = fixture()
        const path = join(root, manifest.checks[0].evidence[0].path)
        writeFileSync(path, "changed bytes")
        rejects(root, /file changed/)
        unlinkSync(path)
        rejects(root, /missing or unreadable/)
    })

    test("rejects invalid hash and missing summary", () => {
        const { root, manifest } = fixture()
        manifest.checks[0].evidence[0].sha256 = "not-a-hash"
        manifest.checks[0].evidence[0].summary = ""
        saveManifest(root, manifest)
        rejects(root, /SHA-256/)
        expect(problems(root).some(message => /summary missing/.test(message))).toBe(true)
    })

    test.each(["errors", "warnings"] as const)("rejects retained %s and malformed diagnostic arrays", field => {
        const { root, manifest } = fixture()
        manifest.checks[0][field] = ["retained diagnostic"]
        saveManifest(root, manifest)
        rejects(root, /errors\/warnings/)
        ;(manifest.checks[0] as any)[field] = null
        saveManifest(root, manifest)
        rejects(root, /errors\/warnings/)
    })

    test("rejects open defects and duplicate defect IDs", () => {
        const { root, manifest, evidence } = fixture()
        manifest.defects = [syntheticDefect(root, evidence, "open")]
        saveManifest(root, manifest)
        rejects(root, /known open defect/)
        manifest.defects[0].status = "fixed"
        manifest.defects.push({ ...manifest.defects[0] })
        saveManifest(root, manifest)
        rejects(root, /duplicate defect/)
    })

    test("fixed defects require regression evidence", () => {
        const { root, manifest, evidence } = fixture()
        manifest.defects = [{ ...syntheticDefect(root, evidence), evidence: [] }]
        saveManifest(root, manifest)
        rejects(root, /defect-1: no evidence/)
    })

    test("allows only documented forms N/A with reviewed evidence", () => {
        const { root, manifest } = fixture()
        const forms = manifest.checks.find(check => check.category === "forms")!
        forms.status = "not-applicable"
        forms.reason = "Synthetic no-form fixture scope"
        updateReport(root, forms.evidence[0], { status: "not-applicable" })
        saveManifest(root, manifest)
        expect(problems(root)).toEqual([])
        forms.reason = ""
        saveManifest(root, manifest)
        rejects(root, /applicability exclusion/)
        manifest.checks[0].status = "not-applicable"
        manifest.checks[0].reason = "Synthetic scope excuse"
        saveManifest(root, manifest)
        rejects(root, /applicability exclusion/)
    })

    test("rejects absolute evidence paths and relative escape", () => {
        const { root, manifest } = fixture()
        const outside = temporaryRoot()
        const path = join(outside, "outside.txt")
        writeFileSync(path, "outside")
        manifest.checks[0].evidence[0].path = path
        saveManifest(root, manifest)
        rejects(root, /path must be relative/)
        manifest.checks[0].evidence[0].path = `../${outside.split("/").at(-1)}/outside.txt`
        saveManifest(root, manifest)
        rejects(root, /escapes project folder/)
    })

    test("rejects a symlink evidence escape", () => {
        const { root, manifest } = fixture()
        const outside = temporaryRoot()
        writeFileSync(join(outside, "outside.txt"), "outside")
        symlinkSync(join(outside, "outside.txt"), join(root, "quality", "linked.txt"))
        manifest.checks[0].evidence[0].path = "quality/linked.txt"
        saveManifest(root, manifest)
        rejects(root, /escapes project folder/)
    })

    test("rejects missing required documentation", () => {
        const { root } = fixture()
        unlinkSync(join(root, "DESIGN.md"))
        rejects(root, /Required documentation missing: DESIGN.md/)
    })

    test("documentation paths must be readable files, not directories", () => {
        const { root } = fixture()
        unlinkSync(join(root, "DESIGN.md"))
        mkdirSync(join(root, "DESIGN.md"))
        rejects(root, /documentation/i)
    })

    test("evidence must contain bytes rather than an empty hashed file", () => {
        const { root, manifest } = fixture()
        const item = manifest.checks[0].evidence[0]
        writeFileSync(join(root, item.path), "")
        const emptyHash = createHash("sha256").update("").digest("hex")
        for (const check of manifest.checks) check.evidence[0].sha256 = emptyHash
        saveManifest(root, manifest)
        rejects(root, /evidence/i)
    })
})

describe("structured release-register regression coverage", () => {
    test("rejects an unchanged document even when the rest of the register passes", () => {
        const { root } = fixture()
        const scaffold = temporaryRoot()
        initProject(scaffold)
        writeFileSync(join(root, "DESIGN.md"), readFileSync(join(scaffold, "DESIGN.md")))
        rejects(root, /unchanged scaffold: DESIGN.md/)
    })

    test("CRLF and whitespace edits cannot disguise an untouched scaffold", () => {
        const { root } = fixture()
        const scaffold = temporaryRoot()
        initProject(scaffold)
        const unchanged = readFileSync(join(scaffold, "DESIGN.md"), "utf8").replaceAll("\n", "\r\n")
        writeFileSync(join(root, "DESIGN.md"), `  ${unchanged} \r\n`)
        rejects(root, /unchanged scaffold: DESIGN.md/)
    })

    test.each([
        { field: "projectId", value: "another-project" },
        { field: "revision", value: "another-revision" },
        { field: "checkId", value: "another-check" },
        { field: "category", value: "motion" },
        { field: "status", value: "failed" },
        { field: "checkedAt", value: "2026-10-06T07:00:00Z" },
        { field: "producer", value: "TODO: name a reviewer" },
        { field: "observation", value: "passed" },
    ])("rejects mismatched or placeholder embedded report %j", ({ field, value }) => {
        const { root, manifest } = fixture()
        updateReport(root, manifest.checks[0].evidence[0], { [field]: value })
        saveManifest(root, manifest)
        rejects(root, /structured report binding or observation invalid/)
    })

    test.each([null, [], {}, 42].map(value => ({ value })))("rejects malformed report envelope %j", ({ value }) => {
        const { root, manifest } = fixture()
        overwriteEvidence(root, manifest.checks[0].evidence[0], JSON.stringify(value))
        saveManifest(root, manifest)
        rejects(root, /structured report binding or observation invalid/)
    })

    test("rejects plain text evidence despite a correct hash and manifest metadata", () => {
        const { root, manifest } = fixture()
        overwriteEvidence(root, manifest.checks[0].evidence[0], "Nonempty arbitrary data is not a structured observation report")
        saveManifest(root, manifest)
        rejects(root, /structured JSON report/)
    })

    test("a single category report cannot qualify every category", () => {
        const { root, manifest } = fixture()
        for (const check of manifest.checks) check.evidence = [{ ...manifest.checks[0].evidence[0] }]
        saveManifest(root, manifest)
        rejects(root, /structured report binding or observation invalid/)
    })

    test("documentation and the manifest cannot serve as reports", () => {
        const { root, manifest } = fixture()
        const item = manifest.checks[0].evidence[0]
        const reportBytes = readFileSync(join(root, item.path), "utf8")
        item.path = "DESIGN.md"
        overwriteEvidence(root, item, reportBytes)
        saveManifest(root, manifest)
        rejects(root, /cannot be documentation or the manifest/)
    })

    test.each(["TODO: complete observations", "unresolved project data", "pending detailed review"])("rejects descriptive placeholder prefix %s", method => {
        const { root, manifest } = fixture()
        manifest.checks[0].method = method
        saveManifest(root, manifest)
        rejects(root, /method missing/)
    })

    test.each(["errors", "warnings"] as const)("rejects embedded report %s", field => {
        const { root, manifest } = fixture()
        updateReport(root, manifest.checks[0].evidence[0], { [field]: ["retained report diagnostic"] })
        saveManifest(root, manifest)
        rejects(root, /report errors\/warnings/)
    })

    test("rejects malformed embedded diagnostics", () => {
        const { root, manifest } = fixture()
        updateReport(root, manifest.checks[0].evidence[0], { errors: null, warnings: {} })
        saveManifest(root, manifest)
        rejects(root, /report errors\/warnings/)
    })

    test("missing project folder returns a blocking diagnostic", () => {
        const root = temporaryRoot()
        expect(validateEvidence(join(root, "does-not-exist"), fixtureId, fixtureRevision, fixtureNow))
            .toEqual(["Project folder missing or unreadable"])
    })

    test("rejects unresolved expected identity", () => {
        const { root } = fixture()
        expect(validateEvidence(root, "unresolved project", fixtureRevision, fixtureNow))
            .toContain("Fresh expected project ID and exact revision are required")
    })

    test.each([
        "https://user:password@framer.com/projects/synthetic-test-project",
        "https://framer.com/projects/synthetic-test-project?secret=example",
        "https://framer.com/projects/synthetic-test-project#fragment",
        "https://framer.com/help/",
    ])("rejects unsafe or nonproject canonical URL %s", editorUrl => {
        const { root, manifest } = fixture()
        manifest.project.editorUrl = editorUrl
        saveManifest(root, manifest)
        rejects(root, /clean Framer HTTPS project URL/)
    })

    test("rejects changed connection URL while manifest identity remains valid", () => {
        const { root } = fixture()
        const content = readFileSync(join(root, "CONNECTION.md"), "utf8")
        writeFileSync(join(root, "CONNECTION.md"), content.replace("/projects/synthetic-test-project", "/projects/another-project"))
        rejects(root, /connection record does not match/)
    })

    test("rejects a report directory without attempting to read it as a file", () => {
        const { root, manifest } = fixture()
        const item = manifest.checks[0].evidence[0]
        unlinkSync(join(root, item.path))
        mkdirSync(join(root, item.path))
        rejects(root, /report must be a regular file/)
    })

    test("rejects required documentation symlink escaping the project", () => {
        const { root } = fixture()
        const outside = temporaryRoot()
        writeFileSync(join(outside, "external-design.md"), "Synthetic external document, no website evidence")
        unlinkSync(join(root, "DESIGN.md"))
        symlinkSync(join(outside, "external-design.md"), join(root, "DESIGN.md"))
        rejects(root, /documentation missing or unreadable: DESIGN.md/)
    })

    test("rejects oversized structured reports with otherwise matching metadata", () => {
        const { root, manifest } = fixture()
        updateReport(root, manifest.checks[0].evidence[0], { observation: "x".repeat(2 * 1024 * 1024) })
        saveManifest(root, manifest)
        rejects(root, /exceeds 2MiB/)
    })

    test("does not impose a personal punctuation policy on project records", () => {
        const { root, manifest } = fixture()
        manifest.checks[0].observation += " Unicode text: café, مرحبا"
        saveManifest(root, manifest)
        updateReport(root, manifest.checks[0].evidence[0], { observation: "Synthetic multilingual observation: café, مرحبا" })
        saveManifest(root, manifest)
        writeFileSync(join(root, "DESIGN.md"), "Synthetic documented multilingual record: café, مرحبا")
        expect(problems(root)).toEqual([])
    })

    test("clearance narrative does not produce a false blocked-status failure", () => {
        const { root } = fixture()
        writeFileSync(join(root, "STATUS.md"), "# Synthetic status\nBlocked items cleared in this software fixture. No website release is claimed.\n")
        expect(problems(root)).toEqual([])
    })

    test("source/doc evidence has a seven-day window while artifact evidence remains 24h", () => {
        const { root, manifest } = fixture()
        for (const category of ["research", "rights-privacy", "documentation"]) {
            const check = manifest.checks.find(item => item.category === category)!
            check.evidence[0].checkedAt = new Date(fixtureNow - 72 * 60 * 60 * 1000).toISOString()
            updateReport(root, check.evidence[0], { checkedAt: check.evidence[0].checkedAt })
        }
        saveManifest(root, manifest)
        expect(problems(root)).toEqual([])
        const research = manifest.checks.find(item => item.category === "research")!
        research.evidence[0].checkedAt = new Date(fixtureNow - 169 * 60 * 60 * 1000).toISOString()
        updateReport(root, research.evidence[0], { checkedAt: research.evidence[0].checkedAt })
        saveManifest(root, manifest)
        rejects(root, /research: evidence stale/)
    })

    test("fixed defects need populated detail and correctly bound regression reports", () => {
        const { root, manifest, evidence } = fixture()
        const defect = syntheticDefect(root, evidence)
        manifest.defects = [defect]
        saveManifest(root, manifest)
        expect(problems(root)).toEqual([])
        defect.reproduction = ""
        saveManifest(root, manifest)
        rejects(root, /defect-1: reproduction missing/)
        defect.reproduction = "Synthetic reproduction without website execution"
        updateReport(root, defect.evidence[0], { category: "identity" })
        saveManifest(root, manifest)
        rejects(root, /defect-1: structured report binding/)
    })

    test("CLI labels integrity explicitly without the old acceptance key", () => {
        const { root, manifest } = fixture()
        for (const check of manifest.checks) {
            check.evidence[0].checkedAt = new Date().toISOString()
            updateReport(root, check.evidence[0], { checkedAt: check.evidence[0].checkedAt })
        }
        saveManifest(root, manifest)
        const result = Bun.spawnSync([process.execPath, join(import.meta.dir, "project-kit.ts"), "gate", root, fixtureId, fixtureRevision])
        expect(result.exitCode).toBe(0)
        const output = JSON.parse(result.stdout.toString())
        expect(output.evidenceIntegrityOk).toBe(true)
        expect(output).not.toHaveProperty("acceptedEvidence")
        expect(output.limit).toContain("Release-register integrity only")
    })
})

describe("non-overwriting local scaffold", () => {
    test("creates the full blocked kit and preserves all existing docs/register bytes", () => {
        const root = temporaryRoot()
        const first = initProject(root)
        expect(first.filter(action => action.startsWith("created ")).length).toBe(10)
        expect(seedManifest().checks.map(check => check.category)).toEqual([...categories])
        const targets = readdirSync(root).filter(name => name.endsWith(".md")).concat("quality/acceptance.json")
        for (const [index, path] of targets.entries()) writeFileSync(join(root, path), `Existing owner content ${index}\n`)
        const before = targets.map(path => readFileSync(join(root, path), "utf8"))
        const second = initProject(root)
        expect(second.every(action => action.startsWith("kept "))).toBe(true)
        expect(targets.map(path => readFileSync(join(root, path), "utf8"))).toEqual(before)
    })

    test("does not write the register outside the requested root through a quality symlink", () => {
        const root = temporaryRoot()
        const outside = temporaryRoot()
        symlinkSync(outside, join(root, "quality"), "dir")
        try { initProject(root) } catch { /* Refusing the unsafe scaffold is valid. */ }
        expect(existsSync(join(outside, "acceptance.json"))).toBe(false)
    })
})
