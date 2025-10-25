import { $ } from 'bun';
import { FormClient } from './form-client';

const initialCss = `
  @import "tailwindcss";
  @custom-variant dark (&:where(.dark, .dark *));
`;

async function transformCss(css: string) {
  const result = await $`echo ${css} | tailwindcss -i -`.text();
  return result;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ className?: string; error?: string }>;
}) {
  const params = await searchParams;
  const className = params.className;

  // Transform with accumulated classes if provided
  let output = await transformCss(initialCss);
  if (className) {
    try {
      // Split classnames and create individual @source inline directives
      const classNames = className.split(' ').filter(Boolean);
      const sourceDirectives = classNames
        .map((cls) => `@source inline("${cls}");`)
        .join('\n');
      const combinedCss = `${initialCss}\n${sourceDirectives}`;
      output = await transformCss(combinedCss);
    } catch {
      // Error will be handled by the form action
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Tailwind CSS Transformer (Server Component)
      </h1>

      <FormClient />

      {className && output && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">
            CSS Output with accumulated classes:
          </h2>
          <div className="mb-3">
            <p className="text-sm text-gray-600">
              <strong>Classes:</strong>{' '}
              {className.split(' ').map((cls, i) => (
                <span
                  key={i}
                  className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-1"
                >
                  {cls}
                </span>
              ))}
            </p>
          </div>
          <pre className="bg-gray-300 text-gray-900 p-4 rounded-md overflow-x-auto">
            <code className="text-sm">{output}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
