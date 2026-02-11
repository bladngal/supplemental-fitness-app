import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createServerSupabase } from '@/lib/supabase/server';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: NextRequest) {
  const { pin, action } = await request.json();

  if (!pin || typeof pin !== 'string' || pin.length < 4) {
    return NextResponse.json({ error: 'PIN must be at least 4 digits' }, { status: 400 });
  }

  const supabase = createServerSupabase();

  if (action === 'setup') {
    // First-time setup: hash the PIN and store it
    const { data: existing } = await supabase
      .from('app_settings')
      .select('id')
      .eq('id', 1)
      .single();

    if (existing?.id) {
      // Check if PIN is already set
      const { data: settings } = await supabase
        .from('app_settings')
        .select('pin_hash')
        .eq('id', 1)
        .single();

      if (settings?.pin_hash) {
        return NextResponse.json({ error: 'PIN already configured' }, { status: 400 });
      }
    }

    const pinHash = await bcrypt.hash(pin, 10);

    const { error } = await supabase
      .from('app_settings')
      .upsert({
        id: 1,
        pin_hash: pinHash,
        main_workout_days: ['monday', 'wednesday', 'friday'],
        main_workout_type: 'strength',
      });

    if (error) {
      return NextResponse.json({ error: 'Failed to save PIN' }, { status: 500 });
    }

    const token = jwt.sign({ authenticated: true }, JWT_SECRET, { expiresIn: '30d' });
    const response = NextResponse.json({ success: true });
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });
    return response;
  }

  // Login: verify PIN
  const { data: settings, error } = await supabase
    .from('app_settings')
    .select('pin_hash')
    .eq('id', 1)
    .single();

  if (error || !settings?.pin_hash) {
    return NextResponse.json({ error: 'PIN not configured. Set up first.' }, { status: 404 });
  }

  const isValid = await bcrypt.compare(pin, settings.pin_hash);

  if (!isValid) {
    return NextResponse.json({ error: 'Incorrect PIN' }, { status: 401 });
  }

  const token = jwt.sign({ authenticated: true }, JWT_SECRET, { expiresIn: '30d' });
  const response = NextResponse.json({ success: true });
  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return response;
}
