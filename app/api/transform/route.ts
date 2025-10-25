import { $ } from 'bun';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { css } = await request.json();

    if (!css) {
      return NextResponse.json({ error: 'CSS is required' }, { status: 400 });
    }

    // This runs in the API route context where Bun is available
    const result = await $`echo ${css} | tailwindcss -i -`.text();

    return new NextResponse(result, {
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
