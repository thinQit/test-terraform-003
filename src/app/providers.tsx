'use client';

import type { ReactNode } from 'react';
import { ToastProvider } from '@/components/toast-provider';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return <ToastProvider>{children}</ToastProvider>;
}
