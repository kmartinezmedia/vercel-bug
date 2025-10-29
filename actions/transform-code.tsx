'use server';

import { $ } from 'bun';

export async function transformCode(cssInput: string) {
  const result = await $`echo ${cssInput} | bunx tailwindcss -i -`.text();
  return result;
}
