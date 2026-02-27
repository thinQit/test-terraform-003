'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';

export function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-4xl font-bold">Something went wrong</h1>
      <p className="text-secondary">Please try again or return later.</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}

export default Error;
