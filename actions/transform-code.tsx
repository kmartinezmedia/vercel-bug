'use server';

import { $ } from 'bun';

export async function transformCode(tailwindCss: string) {
  const result = await $`echo ${tailwindCss} | tailwindcss -i -`.text();
  return result;
}
