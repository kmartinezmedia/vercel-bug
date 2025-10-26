'use client';

import { useEffect, useRef, useState } from 'react';
import { transformCode } from '@/app/actions/transform-code';

const initialCss = `
  @import "tailwindcss";
  @custom-variant dark (&:where(.dark, .dark *));
`;

export default function Home() {
  const classNamesToAddRef = useRef<string[]>([]);
  const [result, setResult] = useState('');
  useEffect(() => {
    transformCode(initialCss).then(setResult);
  }, []);

  return (
    <div>
      <form
        action={async (formData) => {
          const classNameToAdd = formData.get('className') as string;
          classNamesToAddRef.current.push(classNameToAdd);
          const cssInput = `${initialCss}\n@source inline("${classNamesToAddRef.current.join(' ')}");`;
          transformCode(cssInput).then(setResult);
        }}
      >
        <input type="text" name="className" placeholder="Enter a class name" />
      </form>
      <div>
        <pre style={{ whiteSpace: 'pre-wrap' }}>
          <code>{result}</code>
        </pre>
      </div>
    </div>
  );
}
