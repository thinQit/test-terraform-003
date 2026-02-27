import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  icon: z.string().min(1).optional()
});

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const feature = await db.feature.findUnique({ where: { id: params.id } });
    if (!feature) {
      return NextResponse.json({ success: false, error: 'Feature not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: feature.id,
        title: feature.title,
        description: feature.description,
        icon: feature.icon,
        createdAt: feature.createdAt.toISOString(),
        updatedAt: feature.updatedAt.toISOString()
      }
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch feature' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid feature data' }, { status: 400 });
    }

    const feature = await db.feature.update({
      where: { id: params.id },
      data: parsed.data
    });

    return NextResponse.json({
      success: true,
      data: {
        id: feature.id,
        title: feature.title,
        description: feature.description,
        icon: feature.icon,
        createdAt: feature.createdAt.toISOString(),
        updatedAt: feature.updatedAt.toISOString()
      }
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update feature' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.feature.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { id: params.id } });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to delete feature' }, { status: 500 });
  }
}
