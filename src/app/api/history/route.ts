import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = createServerSupabase();
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get('days') || '14');

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split('T')[0];

  const { data: completions, error } = await supabase
    .from('completion_log')
    .select('*, workout:workouts(*)')
    .gte('completed_date', startDateStr)
    .order('completed_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Generate insights
  const insights = generateInsights(completions || [], days);

  return NextResponse.json({ completions: completions || [], insights });
}

export async function POST(request: NextRequest) {
  const supabase = createServerSupabase();
  const body = await request.json();

  const now = new Date();
  const { data, error } = await supabase
    .from('completion_log')
    .insert({
      workout_id: body.workout_id,
      completed_at: now.toISOString(),
      completed_date: now.toISOString().split('T')[0],
      context: body.context || null,
      felt_note: body.felt_note || null,
    })
    .select('*, workout:workouts(*)')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ completion: data }, { status: 201 });
}

interface CompletionWithWorkout {
  id: string;
  workout_id: string;
  completed_date: string;
  workout?: {
    name: string;
    primary_intent: string;
    perceived_effort: string;
    fatigue_type: string | null;
    intended_frequency: string;
  };
}

function generateInsights(completions: CompletionWithWorkout[], days: number) {
  const insights: { type: string; title: string; message: string }[] = [];

  if (completions.length === 0) {
    insights.push({
      type: 'missed',
      title: 'No recent activity',
      message: 'No supplemental workouts logged recently. Even one light session can help maintain your routine.',
    });
    return insights;
  }

  // Frequency consistency check
  const workoutCounts = new Map<string, { name: string; count: number; intended: string }>();
  for (const c of completions) {
    if (!c.workout) continue;
    const existing = workoutCounts.get(c.workout_id) || { name: c.workout.name, count: 0, intended: c.workout.intended_frequency };
    existing.count++;
    workoutCounts.set(c.workout_id, existing);
  }

  for (const [, info] of workoutCounts) {
    const weekRatio = days / 7;
    let expectedPerWeek = 1;
    if (info.intended === 'daily') expectedPerWeek = 7;
    else if (info.intended === '2_3_per_week') expectedPerWeek = 2.5;
    else if (info.intended === '1_per_week') expectedPerWeek = 1;
    else expectedPerWeek = 0.5;

    const expected = expectedPerWeek * weekRatio;
    const ratio = info.count / expected;

    if (ratio > 1.3) {
      insights.push({
        type: 'consistency',
        title: `${info.name}: above target`,
        message: `You've done this ${info.count} times in ${days} days — more than planned. That's fine if it feels good, but make sure you're recovering.`,
      });
    } else if (ratio < 0.5 && info.count > 0) {
      insights.push({
        type: 'missed',
        title: `${info.name}: below target`,
        message: `You've done this ${info.count} times in ${days} days — less than your intended frequency. Life happens, but check if something's getting in the way.`,
      });
    }
  }

  // Fatigue accumulation check
  const highEffortCount = completions.filter(
    c => c.workout && ['sneaky_hard', 'very_taxing'].includes(c.workout.perceived_effort)
  ).length;

  if (highEffortCount >= 5) {
    insights.push({
      type: 'fatigue',
      title: 'High effort accumulation',
      message: `You've logged ${highEffortCount} demanding supplemental sessions in ${days} days. Make sure this isn't cutting into your main training recovery.`,
    });
  }

  // Streak check
  const uniqueDates = new Set(completions.map(c => c.completed_date));
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    if (uniqueDates.has(dateStr)) {
      streak++;
    } else {
      break;
    }
  }

  if (streak >= 3) {
    insights.push({
      type: 'streak',
      title: `${streak}-day streak`,
      message: `You've done supplemental work ${streak} days in a row. Consistency is building — keep it up!`,
    });
  }

  return insights.slice(0, 4); // Limit to 4 insights
}
