// Fails the build if an em dash is found in src or docs.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOTS = ["src", "docs"];
const EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".mdx", ".md", ".css", ".json"]);
const EM_DASH = String.fromCharCode(0x2014);
const hits = [];

function walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const name of entries) {
    if (name === "node_modules" || name.startsWith(".")) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (EXTS.has(extname(name))) {
      readFileSync(full, "utf8").split("\n").forEach((line, i) => {
        if (line.includes(EM_DASH)) hits.push(`${full}:${i + 1}`);
      });
    }
  }
}

ROOTS.forEach(walk);

if (hits.length) {
  console.error("Em dash found. Replace with a comma, colon or full stop:");
  hits.forEach((h) => console.error("  " + h));
  process.exit(1);
}
console.log("check:copy passed");
