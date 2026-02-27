import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const parseFeatures = (value: string): string[] => {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return value ? value.split('|') : [];
  }
};

export async function GET(_request: NextRequest) {
  try {
    const plans = await db.plan.findMany({ orderBy: { createdAt: 'asc' } });
    const data = plans.map(plan => ({
      id: plan.id,
      name: plan.name,
      priceMonthly: plan.priceMonthly,
      priceAnnual: plan.priceAnnual,
      features: parseFeatures(plan.features)
    }));

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch pricing' }, { status: 500 });
  }
}
