import { existsSync, readdirSync, readFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"

const root = resolve(import.meta.dir, "..")
const failures: string[] = []
const skill = readFileSync(join(root, "skills/sbarframe/SKILL.md"), "utf8")
if (!/^---\nname: sbarframe\ndescription: >\n[\s\S]+?\n---\n/.test(skill)) {
    failures.push("Skill metadata is missing or malformed")
}
for (const path of ["LICENSE", "README.md", "README.ar.md", "docs/usage.md"]) {
    if (!existsSync(join(root, path))) failures.push(`Missing distribution file: ${path}`)
}

function visit(folder: string) {
    for (const entry of readdirSync(folder, { withFileTypes: true })) {
        if ([".git", "node_modules", "dist", ".agents", ".claude", ".codex"].includes(entry.name)) continue
        const path = join(folder, entry.name)
        if (entry.isDirectory()) { visit(path); continue }
        if (!entry.name.endsWith(".md")) continue
        const content = readFileSync(path, "utf8")
        for (const match of content.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
            const target = match[1].split("#")[0]
            if (!target || /^[a-z][a-z\d+.-]*:/i.test(target)) continue
            if (!existsSync(resolve(dirname(path), target))) failures.push(`Broken relative link in ${path.slice(root.length + 1)}: ${target}`)
        }
    }
}
visit(root)
if (failures.length) {
    console.error(failures.join("\n"))
    process.exitCode = 1
} else {
    console.log("Skill metadata, distribution files and relative Markdown links passed")
}
