'use server';

import { transformCode } from './actions/transform-code';

export default async function Home() {
  const result = await transformCode();

  return <div>{result}</div>;
}
