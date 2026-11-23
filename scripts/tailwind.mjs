// Compile utilities with Tailwind's Node API; no CDN or runtime CSS dependency.
import { compile } from "@tailwindcss/node";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const candidates = new Set();
async function scan(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await scan(file);
    else if (/\.(tsx|ts)$/.test(entry.name)) {
      const source = await readFile(file, "utf8");
      for (const token of source.match(/[\w!:/.[\]%-]+/g) ?? []) candidates.add(token);
    }
  }
}
await scan(path.join(root, "src"));
const compiler = await compile('@import "tailwindcss";', { base: root, onDependency() {} });
await writeFile(path.join(root, "src/app/tailwind.generated.css"), compiler.build([...candidates]));
