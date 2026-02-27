import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const planSchema = z.object({
  name: z.string().min(1),
  priceMonthly: z.coerce.number().nonnegative(),
  priceAnnual: z.coerce.number().nonnegative(),
  features: z.array(z.string().min(1))
});

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
      features: parseFeatures(plan.features),
      createdAt: plan.createdAt.toISOString(),
      updatedAt: plan.updatedAt.toISOString()
    }));

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch plans' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = planSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid plan data' }, { status: 400 });
    }

    const plan = await db.plan.create({
      data: {
        name: parsed.data.name,
        priceMonthly: parsed.data.priceMonthly,
        priceAnnual: parsed.data.priceAnnual,
        features: JSON.stringify(parsed.data.features)
      }
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: plan.id,
          name: plan.name,
          priceMonthly: plan.priceMonthly,
          priceAnnual: plan.priceAnnual,
          features: parseFeatures(plan.features),
          createdAt: plan.createdAt.toISOString(),
          updatedAt: plan.updatedAt.toISOString()
        }
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create plan' }, { status: 500 });
  }
}
