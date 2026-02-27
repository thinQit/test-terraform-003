import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  priceMonthly: z.coerce.number().nonnegative().optional(),
  priceAnnual: z.coerce.number().nonnegative().optional(),
  features: z.array(z.string().min(1)).optional()
});

const parseFeatures = (value: string): string[] => {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return value ? value.split('|') : [];
  }
};

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const plan = await db.plan.findUnique({ where: { id: params.id } });
    if (!plan) {
      return NextResponse.json({ success: false, error: 'Plan not found' }, { status: 404 });
    }

    return NextResponse.json({
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
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch plan' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid plan data' }, { status: 400 });
    }

    const updateData: {
      name?: string;
      priceMonthly?: number;
      priceAnnual?: number;
      features?: string;
    } = {};

    if (parsed.data.name !== undefined) updateData.name = parsed.data.name;
    if (parsed.data.priceMonthly !== undefined) updateData.priceMonthly = parsed.data.priceMonthly;
    if (parsed.data.priceAnnual !== undefined) updateData.priceAnnual = parsed.data.priceAnnual;
    if (parsed.data.features !== undefined) updateData.features = JSON.stringify(parsed.data.features);

    const plan = await db.plan.update({
      where: { id: params.id },
      data: updateData
    });

    return NextResponse.json({
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
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update plan' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.plan.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { id: params.id } });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to delete plan' }, { status: 500 });
  }
}
