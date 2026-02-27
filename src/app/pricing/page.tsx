'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import type { Plan } from '@/types';

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlans = async () => {
      setLoading(true);
      const response = await api.get<Plan[]>('/api/pricing');
      if (response.error) {
        setError(response.error);
        setLoading(false);
        return;
      }
      setPlans(response.data || []);
      setError(null);
      setLoading(false);
    };

    loadPlans();
  }, []);

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-bold">Pricing</h1>
        <p className="text-secondary">Flexible plans for every stage of growth.</p>
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
          Pricing plans are not available yet.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan, index) => {
            const recommended = index === 1;
            return (
              <Card key={plan.id} className={recommended ? 'border-primary bg-muted p-6' : 'border-border bg-white p-6'}>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">{plan.name}</h2>
                  {recommended && <Badge>Recommended</Badge>}
                </div>
                <p className="mt-2 text-3xl font-bold">
                  {plan.priceMonthly === 0 ? 'Custom' : `$${plan.priceMonthly}`}
                  <span className="text-base font-medium text-secondary">/mo</span>
                </p>
                <ul className="mt-4 space-y-2 text-secondary">
                  {plan.features.map(feature => (
                    <li key={feature}>• {feature}</li>
                  ))}
                </ul>
                <Link
                  href="/subscribe"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-hover"
                >
                  {plan.priceMonthly === 0 ? 'Contact sales' : 'Subscribe'}
                </Link>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
