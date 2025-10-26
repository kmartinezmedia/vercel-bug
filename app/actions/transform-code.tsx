'use server';

import postcss from 'postcss';

export async function transformCode(cssInput: string) {
  const tailwind = await import('@tailwindcss/postcss');
  const { css: out } = await postcss([tailwind.default()]).process(cssInput, {
    from: 'virtual.css',
    to: undefined,
  });
  return out;
}
