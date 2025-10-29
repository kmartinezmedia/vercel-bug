'use server';

import { $ } from 'bun';

export async function transformCode(cssInput: string) {
  try {
    const result = await $`echo ${cssInput} | tailwindcss -i -`.text();
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
