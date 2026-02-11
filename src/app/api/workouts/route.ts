import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { classifyFatigue } from '@/lib/engines/fatigue-classifier';
import { recommendPlacement } from '@/lib/engines/placement-engine';

export async function GET(request: NextRequest) {
  const supabase = createServerSupabase();
  const { searchParams } = new URL(request.url);
  const intent = searchParams.get('intent');
  const archived = searchParams.get('archived') === 'true';

  let query = supabase
    .from('workouts')
    .select('*')
    .eq('is_archived', archived)
    .order('created_at', { ascending: false });

  if (intent) {
    query = query.eq('primary_intent', intent);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ workouts: data });
}

export async function POST(request: NextRequest) {
  const supabase = createServerSupabase();
  const body = await request.json();

  // Classify fatigue and placement
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
    .insert({
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
      is_archived: false,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ workout: data }, { status: 201 });
}
