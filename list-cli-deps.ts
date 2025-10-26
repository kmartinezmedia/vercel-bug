// get-transitive-deps.ts
import fs from 'node:fs';
import path, { dirname } from 'node:path';
import { createRequire } from 'node:module';

const require_ = createRequire(import.meta.url);
const toPosix = (p: string) => p.split(path.sep).join('/');

function safeResolvePackageJson(name: string): string | null {
  try {
    return require_.resolve(`${name}/package.json`);
  } catch {
    return null; // skip optional / platform-specific deps
  }
}

function readDeps(name: string) {
  const pkgPath = safeResolvePackageJson(name);
  if (!pkgPath) return null;

  const dir = dirname(pkgPath);
  const json = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const deps = Object.keys(json.dependencies ?? {});
  const bins: { cmd: string; rel: string }[] = [];

  if (json.bin) {
    if (typeof json.bin === 'string') {
      bins.push({ cmd: json.name ?? name, rel: json.bin });
    } else {
      for (const [cmd, rel] of Object.entries(json.bin)) {
        bins.push({ cmd, rel });
      }
    }
  }

  return {
    name: json.name ?? name,
    version: json.version ?? '',
    dir,
    deps,
    bins,
  };
}

function walk(root: string, seen = new Map<string, any>()) {
  if (seen.has(root)) return seen;
  const node = readDeps(root);
  if (!node) return seen;
  seen.set(node.name, node);
  for (const dep of node.deps) walk(dep, seen);
  return seen;
}

const target = process.argv[2] || '@tailwindcss/cli';
const graph = walk(target)!;

const pwd = process.env.PWD ?? process.cwd();
const includes = new Set<string>();

for (const node of [...graph.values()].sort((a, b) =>
  a.name.localeCompare(b.name),
)) {
  if (fs.existsSync(node.dir)) {
    includes.add(`./${toPosix(path.relative(pwd, node.dir))}/**`);
  }

  for (const { cmd, rel } of node.bins) {
    const binAbs = path.join(node.dir, rel);
    if (fs.existsSync(binAbs)) {
      includes.add(`./${toPosix(path.relative(pwd, binAbs))}`);
    }

    const shim = path.join(pwd, 'node_modules', '.bin', cmd);
    if (fs.existsSync(shim)) {
      includes.add(`./${toPosix(path.relative(pwd, shim))}`);
    }
  }
}

const list = [...includes].sort();
console.log(list.join('\n'));
await Bun.write('tailwind-transitive-deps.json', JSON.stringify(list, null, 2));
