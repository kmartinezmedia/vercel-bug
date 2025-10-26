// get-transitive-deps.ts
import { readFileSync } from 'node:fs';
import path, { dirname, join } from 'node:path';
import { createRequire } from 'node:module';
import { $ } from 'bun';
import fs from 'node:fs';

const require_ = createRequire(import.meta.url);

function pkgJsonPath(name: string) {
  return require_.resolve(`${name}/package.json`);
}

function readDeps(name: string) {
  const p = pkgJsonPath(name);
  const json = JSON.parse(readFileSync(p, 'utf8'));
  return {
    dir: dirname(p),
    name: json.name ?? name,
    version: json.version ?? '',
    deps: Object.keys(json.dependencies ?? {}),
  };
}

function walk(root: string, seen = new Map<string, string>()) {
  if (seen.has(root)) return;
  const { name, version, deps } = readDeps(root);
  seen.set(name, version);
  for (const d of deps) walk(d, seen);
  return seen;
}

const target = process.argv[2] || '@tailwindcss/cli';
const result = walk(target)!;

const transitiveDeps = [];
const pwd = process.env.PWD ?? '';

// Print as NAME@VERSION, sorted
for (const [name, ver] of [...result.entries()].sort()) {
  const pathForPackage = path.resolve(pwd, 'node_modules', name);
  const exists = fs.existsSync(pathForPackage);

  if (exists) {
    const relativePath = pathForPackage.replace(pwd, '');
    transitiveDeps.push(`.${relativePath}/**`);
  }
}

console.log(transitiveDeps.join('\n'));
Bun.write(
  'tailwind-transitive-deps.json',
  JSON.stringify(transitiveDeps, null, 2),
);
