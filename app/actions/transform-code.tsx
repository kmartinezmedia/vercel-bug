'use server';

import tailwind from '@tailwindcss/postcss';
import postcss from 'postcss';
import path from 'node:path';
import fs from 'node:fs';

function findProjectRoot(start = process.cwd()) {
  let dir = start;
  const { root } = path.parse(dir);

  while (true) {
    // prefer the dir that actually has tailwindcss installed
    if (fs.existsSync(path.join(dir, 'node_modules', 'tailwindcss')))
      return dir;
    // reasonable fallback: first package.json we find
    if (fs.existsSync(path.join(dir, 'package.json'))) return dir;

    const parent = path.dirname(dir);
    if (parent === dir || parent === root) break;
    dir = parent;
  }
  return start; // last resort
}

export async function transformCode(cssInput: string) {
  const cwd = findProjectRoot();

  const result = await postcss([tailwind({ base: cwd })]).process(cssInput, {
    // anchor resolution at the *root* that has node_modules
    from: path.join(cwd, 'virtual.css'),
    to: undefined,
  });

  return result.css;
}
