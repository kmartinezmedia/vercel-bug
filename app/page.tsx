import { $ } from 'bun';
import { redirect } from 'next/navigation';

const initialCss = `
  @import "tailwindcss";
  @custom-variant dark (&:where(.dark, .dark *));
`;

async function transformCssWithBun(css: string) {
  try {
    const result = await $`echo ${css} | tailwindcss -i -`.text();
    return result;
  } catch (error) {
    throw new Error(
      `Failed to transform CSS: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: { className?: string; error?: string };
}) {
  const className = searchParams.className;
  const error = searchParams.error;

  // Transform initial CSS using Bun (runs on server)
  const initialOutput = await transformCssWithBun(initialCss);

  // Transform with additional class if provided
  let additionalOutput = '';
  if (className) {
    try {
      const combinedCss = `${initialCss} @source inline("${className}");`;
      additionalOutput = await transformCssWithBun(combinedCss);
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
          const className = formData.get('className') as string;

          if (!className?.trim()) {
            redirect('/?error=Please enter a class name');
          }

          try {
            redirect(`/?className=${encodeURIComponent(className.trim())}`);
          } catch {
            redirect(
              `/?error=${encodeURIComponent('Failed to transform CSS')}`,
            );
          }
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
            CSS Output with "{className}":
          </h2>
          <pre className="bg-gray-300 text-gray-900 p-4 rounded-md overflow-x-auto">
            <code className="text-sm">{additionalOutput}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
