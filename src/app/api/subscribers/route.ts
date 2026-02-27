import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const subscriberSchema = z.object({
  email: z.string().email(),
  source: z.string().optional().default('unknown')
});

export async function GET(_request: NextRequest) {
  try {
    const subscribers = await db.subscriber.findMany({ orderBy: { createdAt: 'desc' } });
    const data = subscribers.map(subscriber => ({
      id: subscriber.id,
      email: subscriber.email,
      source: subscriber.source,
      createdAt: subscriber.createdAt.toISOString()
    }));

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = subscriberSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid subscriber data' }, { status: 400 });
    }

    const subscriber = await db.subscriber.create({ data: parsed.data });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: subscriber.id,
          email: subscriber.email,
          source: subscriber.source,
          createdAt: subscriber.createdAt.toISOString()
        }
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create subscriber' }, { status: 500 });
  }
}
