import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(5),
  planId: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid contact request' }, { status: 400 });
    }

    await db.contactMessage.create({ data: parsed.data });

    return NextResponse.json({ success: true, data: { status: 'received' } });
  } catch {
    return NextResponse.json({ success: false, error: 'Unable to submit contact request' }, { status: 500 });
  }
}
