'use client';

import { useState } from 'react';
import { useUrlManager } from './url-manager';

export function FormClient() {
  const { addClassName, clearAll } = useUrlManager();
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addClassName(inputValue.trim());
      setInputValue(''); // Clear input after submission
    }
  };

  return (
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
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="e.g., bg-blue-500 text-white p-4"
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Transform CSS
        </button>

        <button
          type="button"
          onClick={clearAll}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Clear All
        </button>
      </div>
    </form>
  );
}
