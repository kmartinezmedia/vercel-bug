// This is a Server Component - Bun imports work here
import { $ } from 'bun';

export default async function ServerComponentTest() {
  // This runs during the build/render phase on your server
  // where Bun is available
  const bunVersion = await $`bun --version`.text();

  return (
    <div>
      <h2>Server Component Test</h2>
      <p>Bun version: {bunVersion}</p>
      <p>This component can import Bun modules directly</p>
    </div>
  );
}
