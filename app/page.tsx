import { $ } from 'bun';
import { redirect } from 'next/navigation';

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
  const error = params.error;

  // Transform initial CSS (works in both Bun and Node.js)
  const initialOutput = await transformCss(initialCss);

  // Transform with accumulated classes if provided
  let additionalOutput = '';
  if (className) {
    try {
      // Split classnames and create individual @source inline directives
      const classNames = className.split(' ').filter(Boolean);
      const sourceDirectives = classNames
        .map((cls) => `@source inline("${cls}");`)
        .join('\n');
      const combinedCss = `${initialCss}\n${sourceDirectives}`;
      additionalOutput = await transformCss(combinedCss);
    } catch {
      // Error will be handled by the form action
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Tailwind CSS Transformer (Server Component)
      </h1>

      <form
        action={async (formData: FormData) => {
          'use server';
          const newClassName = formData.get('className') as string;

          if (!newClassName?.trim()) {
            redirect('/?error=Please enter a class name');
          }

          // Accumulate classnames: combine existing with new
          const existingClassNames = params.className || '';
          const combinedClassNames = existingClassNames
            ? `${existingClassNames} ${newClassName.trim()}`
            : newClassName.trim();

          // Redirect with accumulated classnames
          redirect(`/?className=${encodeURIComponent(combinedClassNames)}`);
        }}
        className="space-y-4"
      >
        <div>
          <label
            htmlFor="className"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Enter Tailwind Class Name
          </label>
          <input
            id="className"
            name="className"
            placeholder="e.g., bg-blue-500 text-white p-4"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            defaultValue={className || ''}
          />
          {error && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Transform CSS
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Initial CSS Output:</h2>
        <pre className="bg-gray-300 text-gray-900 p-4 rounded-md overflow-x-auto">
          <code className="text-sm">{initialOutput}</code>
        </pre>
      </div>

      {className && additionalOutput && (
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
            <code className="text-sm">{additionalOutput}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
