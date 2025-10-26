'use server';

import { spawn } from 'node:child_process';
import { once } from 'node:events';
import path from 'node:path';

export async function transformCode(cssInput: string) {
  const tailwindCli = path.resolve('./node_modules/.bin/tailwindcss');

  const tailwind = spawn(tailwindCli, ['-i', '-'], {
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  let stdout = '';
  let stderr = '';

  tailwind.stdout.on('data', (d) => {
    stdout += d;
  });
  tailwind.stderr.on('data', (d) => {
    stderr += d;
  });

  tailwind.stdin.end(cssInput);

  const [code] = await once(tailwind, 'close');

  if (code === 0) return stdout;
  throw new Error(`Tailwind CSS exited with code ${code}: ${stderr}`);
}
