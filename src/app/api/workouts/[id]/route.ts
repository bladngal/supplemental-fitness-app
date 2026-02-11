import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { classifyFatigue } from '@/lib/engines/fatigue-classifier';
import { recommendPlacement } from '@/lib/engines/placement-engine';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServerSupabase();

  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
  }

  return NextResponse.json({ workout: data });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServerSupabase();
  const body = await request.json();

  // Re-classify if relevant fields changed
  const classification = classifyFatigue({
    primary_intent: body.primary_intent,
    perceived_effort: body.perceived_effort,
    stress_impact: body.stress_impact || false,
    stress_tendons: body.stress_tendons || false,
    stress_localized_muscle: body.stress_localized_muscle || false,
    stress_breathing_hr: body.stress_breathing_hr || false,
    stress_coordination: body.stress_coordination || false,
  });

  const placement = recommendPlacement({
    primary_intent: body.primary_intent,
    perceived_effort: body.perceived_effort,
    fatigue_type: classification.fatigue_type,
    stress_impact: body.stress_impact || false,
    stress_breathing_hr: body.stress_breathing_hr || false,
  });

  const { data, error } = await supabase
    .from('workouts')
    .update({
      name: body.name,
      links: body.links || [],
      notes: body.notes || null,
      primary_intent: body.primary_intent,
      perceived_effort: body.perceived_effort,
      stress_impact: body.stress_impact || false,
      stress_tendons: body.stress_tendons || false,
      stress_localized_muscle: body.stress_localized_muscle || false,
      stress_breathing_hr: body.stress_breathing_hr || false,
      stress_coordination: body.stress_coordination || false,
      intended_frequency: body.intended_frequency,
      lived_experience: body.lived_experience || null,
      fatigue_type: classification.fatigue_type,
      placement_preference: placement,
      is_archived: body.is_archived ?? false,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ workout: data });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServerSupabase();

  const { error } = await supabase
    .from('workouts')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
