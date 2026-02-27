import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const featureSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1)
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Number.parseInt(limitParam, 10) : undefined;
    const take = Number.isFinite(limit) && limit && limit > 0 ? limit : undefined;

    const features = await db.feature.findMany({
      orderBy: { createdAt: 'asc' },
      take
    });

    const data = features.map(feature => ({
      id: feature.id,
      title: feature.title,
      description: feature.description,
      icon: feature.icon,
      createdAt: feature.createdAt.toISOString(),
      updatedAt: feature.updatedAt.toISOString()
    }));

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch features' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = featureSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid feature data' }, { status: 400 });
    }

    const feature = await db.feature.create({ data: parsed.data });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: feature.id,
          title: feature.title,
          description: feature.description,
          icon: feature.icon,
          createdAt: feature.createdAt.toISOString(),
          updatedAt: feature.updatedAt.toISOString()
        }
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create feature' }, { status: 500 });
  }
}
