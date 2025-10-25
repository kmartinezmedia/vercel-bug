'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export function useUrlManager() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const addClassName = useCallback(
    (newClassName: string) => {
      const currentClassNames = searchParams.get('className') || '';
      const combinedClassNames = currentClassNames
        ? `${currentClassNames} ${newClassName.trim()}`
        : newClassName.trim();

      // Use router.push for client-side navigation (no reload)
      router.push(`/?className=${encodeURIComponent(combinedClassNames)}`);
    },
    [router, searchParams],
  );

  const clearAll = useCallback(() => {
    router.push('/');
  }, [router]);

  return { addClassName, clearAll };
}
