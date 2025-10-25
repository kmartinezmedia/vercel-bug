'use server';

import { $ } from 'bun';

const cssInput = `
  @import "tailwindcss";
  @custom-variant dark (&:where(.dark, .dark *));
`;

export async function transformCode() {
  const result = await $`echo ${cssInput} | tailwindcss -i -`.text();
  return result;
}
