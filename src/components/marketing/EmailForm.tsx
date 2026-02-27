'use client';

import { useState } from 'react';
import { z } from 'zod';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { api } from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';

const schema = z.string().email();

export function EmailForm({ source }: { source: 'hero' | 'footer' | 'pricing' }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const { notify } = useToast();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = schema.safeParse(email);
    if (!result.success) {
      setError('Please enter a valid email.');
      return;
    }
    setError(undefined);
    setLoading(true);
    const response = await api.post<{ id: string; email: string }>("/api/subscribe", { email, source });
    setLoading(false);
    if (response.error) {
      setError(response.error);
      return;
    }
    notify('Thanks for subscribing!', 'success');
    setEmail('');
  };

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-3 sm:flex-row" aria-label="Email subscription form">
      <div className="flex-1">
        <Input
          type="email"
          name="email"
          placeholder="you@example.com"
          value={email}
          onChange={event => setEmail(event.target.value)}
          error={error}
          aria-label="Email address"
          required
        />
      </div>
      <Button type="submit" loading={loading} className="sm:w-auto" fullWidth>
        Subscribe
      </Button>
    </form>
  );
}

export default EmailForm;
