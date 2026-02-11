import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = createServerSupabase();
  const { searchParams } = new URL(request.url);
  const day = searchParams.get('day');

  let query = supabase
    .from('schedule_assignments')
    .select('*, workout:workouts(*)')
    .eq('is_active', true)
    .order('day_of_week')
    .order('slot_order');

  if (day !== null) {
    query = query.eq('day_of_week', parseInt(day));
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ assignments: data });
}

export async function POST(request: NextRequest) {
  const supabase = createServerSupabase();
  const body = await request.json();

  // Get current max slot_order for this day
  const { data: existing } = await supabase
    .from('schedule_assignments')
    .select('slot_order')
    .eq('day_of_week', body.day_of_week)
    .order('slot_order', { ascending: false })
    .limit(1);

  const nextOrder = existing && existing.length > 0 ? existing[0].slot_order + 1 : 0;

  const { data, error } = await supabase
    .from('schedule_assignments')
    .insert({
      workout_id: body.workout_id,
      day_of_week: body.day_of_week,
      slot_order: body.slot_order ?? nextOrder,
      is_active: true,
    })
    .select('*, workout:workouts(*)')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ assignment: data }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const supabase = createServerSupabase();
  const body = await request.json();

  if (!body.id) {
    return NextResponse.json({ error: 'Assignment ID required' }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (body.day_of_week !== undefined) updates.day_of_week = body.day_of_week;
  if (body.slot_order !== undefined) updates.slot_order = body.slot_order;
  if (body.is_active !== undefined) updates.is_active = body.is_active;

  const { data, error } = await supabase
    .from('schedule_assignments')
    .update(updates)
    .eq('id', body.id)
    .select('*, workout:workouts(*)')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ assignment: data });
}

export async function DELETE(request: NextRequest) {
  const supabase = createServerSupabase();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Assignment ID required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('schedule_assignments')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
