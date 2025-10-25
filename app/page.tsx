'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { transformCode } from '@/actions/transform-code';
import ServerComponentTest from './server-component-test';

const initialCss = `
  @import "tailwindcss";
  @custom-variant dark (&:where(.dark, .dark *));
`;

export default function Home() {
  const [tailwindCss, setTailwindCss] = useState(initialCss);
  const [cssOutput, setCssOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const classNameToAdd = inputRef.current?.value?.trim();
      if (!classNameToAdd) {
        setError('Please enter a class name');
        return;
      }

      setError(null);
      setIsLoading(true);

      try {
        const combinedCss = `${tailwindCss} @source inline("${classNameToAdd}");`;
        const result = await transformCode(combinedCss);
        setTailwindCss(combinedCss);
        setCssOutput(result);
        // Clear the input after successful submission
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'An error occurred while transforming the code',
        );
      } finally {
        setIsLoading(false);
      }
    },
    [tailwindCss],
  );

  // Transform initial CSS on component mount
  useEffect(() => {
    const transformInitialCss = async () => {
      if (!isInitialLoad) return;

      setIsLoading(true);
      try {
        const result = await transformCode(initialCss);
        setCssOutput(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'An error occurred while transforming the initial CSS',
        );
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    };

    transformInitialCss();
  }, [isInitialLoad]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Tailwind CSS Transformer</h1>

      <ServerComponentTest />

      <form onSubmit={handleSubmit} className="space-y-4">
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
            disabled={isLoading}
            type="text"
            ref={inputRef}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            aria-describedby={error ? 'error-message' : undefined}
          />
          {error && (
            <p
              id="error-message"
              className="mt-2 text-sm text-red-600"
              role="alert"
            >
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Transforming...' : 'Transform CSS'}
        </button>
      </form>

      {cssOutput && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Generated CSS Output:</h2>
          <pre className="bg-gray-300 text-gray-900 p-4 rounded-md overflow-x-auto">
            <code className="text-sm">{cssOutput}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
