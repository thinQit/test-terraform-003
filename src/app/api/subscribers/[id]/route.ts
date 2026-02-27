import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const updateSchema = z.object({
  email: z.string().email().optional(),
  source: z.string().optional()
});

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const subscriber = await db.subscriber.findUnique({ where: { id: params.id } });
    if (!subscriber) {
      return NextResponse.json({ success: false, error: 'Subscriber not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: subscriber.id,
        email: subscriber.email,
        source: subscriber.source,
        createdAt: subscriber.createdAt.toISOString()
      }
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch subscriber' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid subscriber data' }, { status: 400 });
    }

    const subscriber = await db.subscriber.update({
      where: { id: params.id },
      data: parsed.data
    });

    return NextResponse.json({
      success: true,
      data: {
        id: subscriber.id,
        email: subscriber.email,
        source: subscriber.source,
        createdAt: subscriber.createdAt.toISOString()
      }
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update subscriber' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.subscriber.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { id: params.id } });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to delete subscriber' }, { status: 500 });
  }
}
