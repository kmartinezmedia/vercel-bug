'use server';

// This is a Server Action - Bun imports may not work in deployment
import { $ } from 'bun';

export async function serverActionTest() {
  try {
    // This runs as a separate API endpoint
    // In Vercel, this runs in Node.js runtime, not Bun
    const result = await $`echo "Hello from Bun shell"`.text();
    return { success: true, result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
