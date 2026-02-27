'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import EmailForm from '@/components/marketing/EmailForm';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import type { Feature, Plan } from '@/types';

export default function HomePage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const trackEvent = async (eventName: string) => {
    const endpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;
    if (!endpoint) return;
    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: eventName,
          timestamp: new Date().toISOString(),
          url: window.location.href
        })
      });
    } catch {
      // ignore analytics errors
    }
  };

  useEffect(() => {
    trackEvent('page_view');
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [featuresResponse, plansResponse] = await Promise.all([
        api.get<Feature[]>('/api/features'),
        api.get<Plan[]>('/api/pricing')
      ]);

      if (featuresResponse.error || plansResponse.error) {
        setError(featuresResponse.error || plansResponse.error || 'Unable to load content.');
        setLoading(false);
        return;
      }

      setFeatures(featuresResponse.data || []);
      setPlans(plansResponse.data || []);
      setError(null);
      setLoading(false);
    };

    loadData();
  }, []);

  return (
    <div className="flex flex-col">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16 md:flex-row md:items-center">
        <div className="flex-1 space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary">DataPulse</p>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Analytics that move as fast as your business</h1>
          <p className="text-lg text-secondary">
            Unify product, marketing, and revenue metrics in a single SaaS dashboard built for speed.
          </p>
          <p className="text-sm text-secondary">Launch in minutes, then scale with automated reporting and alerts.</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-white hover:bg-primary-hover"
              onClick={() => trackEvent('cta_pricing_click')}
              aria-label="View pricing"
            >
              View pricing
            </Link>
            <Link
              href="/subscribe"
              className="inline-flex items-center justify-center rounded-md border border-border px-5 py-2.5 text-foreground hover:bg-muted"
              onClick={() => trackEvent('cta_subscribe_click')}
              aria-label="Join the waitlist"
            >
              Join the waitlist
            </Link>
          </div>
        </div>
        <div className="flex-1">
          <div className="rounded-xl border border-border bg-muted p-6 text-center text-sm text-secondary">
            Optional illustration or product screenshot
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-12" id="features">
        <div className="mb-8 space-y-2">
          <h2 className="text-3xl font-semibold">Everything you need to track growth</h2>
          <p className="text-secondary">Three core capabilities to keep your team aligned and moving fast.</p>
        </div>
        {loading ? (
          <div className="flex items-center justify-center rounded-lg border border-border bg-white py-12">
            <Spinner className="h-6 w-6 text-primary" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-border bg-white p-6 text-center text-secondary">
            {error}
          </div>
        ) : features.length === 0 ? (
          <div className="rounded-lg border border-border bg-white p-6 text-center text-secondary">
            No features available right now.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {features.slice(0, 3).map(feature => (
              <Card key={feature.id} className="p-6">
                <div className="text-3xl" aria-hidden="true">
                  {feature.icon === 'chart' ? '📈' : feature.icon === 'dashboard' ? '🧭' : '📊'}
                </div>
                <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
                <p className="mt-2 text-secondary">{feature.description}</p>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-12" id="pricing">
        <div className="mb-8 space-y-2">
          <h2 className="text-3xl font-semibold">Transparent pricing</h2>
          <p className="text-secondary">Pick a plan that scales with your analytics needs.</p>
        </div>
        {loading ? (
          <div className="flex items-center justify-center rounded-lg border border-border bg-white py-12">
            <Spinner className="h-6 w-6 text-primary" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-border bg-white p-6 text-center text-secondary">
            {error}
          </div>
        ) : plans.length === 0 ? (
          <div className="rounded-lg border border-border bg-white p-6 text-center text-secondary">
            Pricing plans are coming soon.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan, index) => {
              const recommended = index === 1;
              return (
                <Card
                  key={plan.id}
                  className={recommended ? 'border-primary bg-muted p-6' : 'border-border bg-white p-6'}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                    {recommended && <Badge>Recommended</Badge>}
                  </div>
                  <p className="mt-4 text-3xl font-bold">
                    {plan.priceMonthly === 0 ? 'Contact' : `$${plan.priceMonthly}`}<span className="text-base font-medium text-secondary">/mo</span>
                  </p>
                  <ul className="mt-4 space-y-2 text-secondary">
                    {plan.features.map(feature => (
                      <li key={feature}>• {feature}</li>
                    ))}
                  </ul>
                  <Link
                    href="/subscribe"
                    className={`mt-6 inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-white ${
                      recommended ? 'bg-primary hover:bg-primary-hover' : 'bg-secondary hover:bg-secondary/90'
                    }`}
                    onClick={() => trackEvent('cta_pricing_plan_click')}
                  >
                    {plan.priceMonthly === 0 ? 'Contact sales' : 'Start now'}
                  </Link>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="rounded-xl border border-border bg-white p-8">
          <div className="mb-4 space-y-2">
            <h2 className="text-2xl font-semibold">Get product updates</h2>
            <p className="text-secondary">Join the DataPulse newsletter for launch alerts and insights.</p>
          </div>
          <EmailForm source="footer" />
        </div>
      </section>
    </div>
  );
}
