'use client';

import { useEffect } from 'react';
import EmailForm from '@/components/marketing/EmailForm';

export default function SubscribePage() {
  useEffect(() => {
    const endpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;
    if (!endpoint) return;
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'page_view_subscribe',
        timestamp: new Date().toISOString(),
        url: window.location.href
      })
    }).catch(() => null);
  }, []);

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-16">
      <div className="mb-6 space-y-2">
        <h1 className="text-4xl font-bold">Join the DataPulse waitlist</h1>
        <p className="text-secondary">Be the first to access our analytics dashboard when we launch.</p>
      </div>
      <EmailForm source="hero" />
    </section>
  );
}
