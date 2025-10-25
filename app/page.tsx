'use client';

import { useRef, useState, useTransition } from 'react';
import { transformCode } from '@/actions/transform-code';

const initialCss = `
  @import "tailwindcss";
  @custom-variant dark (&:where(.dark, .dark *));
`;

export default function Home() {
  const [tailwindCss, setTailwindCss] = useState(initialCss);
  const [cssOutput, setCssOutput] = useState('');
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const addClassName = () => {
    const classNameToAdd = inputRef.current?.value;
    if (!classNameToAdd) return;
    startTransition(async () => {
      const combinedCss = `${tailwindCss} @source inline("${classNameToAdd}");`;
      const result = await transformCode(combinedCss);
      setTailwindCss(combinedCss);
      setCssOutput(result);
    });
  };

  return (
    <div>
      <input
        placeholder="Enter className"
        disabled={isPending}
        type="text"
        ref={inputRef}
      />
      <button type="button" onClick={addClassName} disabled={isPending}>
        Add Class
      </button>

      <pre style={{ textWrap: 'pretty' }}>
        <code>{cssOutput}</code>
      </pre>
    </div>
  );
}
