import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const subscribeSchema = z.object({
  email: z.string().email(),
  source: z.string().optional().default('unknown')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid email' }, { status: 400 });
    }

    const { email, source } = parsed.data;
    const existing = await db.subscriber.findUnique({ where: { email } });

    if (existing) {
      return NextResponse.json({
        success: true,
        data: {
          id: existing.id,
          email: existing.email,
          createdAt: existing.createdAt.toISOString()
        }
      });
    }

    const subscriber = await db.subscriber.create({
      data: {
        email,
        source
      }
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: subscriber.id,
          email: subscriber.email,
          createdAt: subscriber.createdAt.toISOString()
        }
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ success: false, error: 'Unable to subscribe' }, { status: 500 });
  }
}
