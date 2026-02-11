-- Supplemental Workout Companion — Supabase Schema
-- Run this in the Supabase SQL Editor to create all tables

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Core workout library
CREATE TABLE IF NOT EXISTS workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  links TEXT[] DEFAULT '{}',
  notes TEXT,
  primary_intent TEXT NOT NULL,
  perceived_effort TEXT NOT NULL,
  stress_impact BOOLEAN DEFAULT false,
  stress_tendons BOOLEAN DEFAULT false,
  stress_localized_muscle BOOLEAN DEFAULT false,
  stress_breathing_hr BOOLEAN DEFAULT false,
  stress_coordination BOOLEAN DEFAULT false,
  intended_frequency TEXT NOT NULL,
  lived_experience TEXT,
  fatigue_type TEXT,
  placement_preference TEXT,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Schedule assignments (workout → day of week)
CREATE TABLE IF NOT EXISTS schedule_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  day_of_week SMALLINT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  slot_order SMALLINT DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Completion log
CREATE TABLE IF NOT EXISTS completion_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT now(),
  completed_date DATE DEFAULT CURRENT_DATE,
  context TEXT,
  felt_note TEXT
);

-- App settings (single row)
CREATE TABLE IF NOT EXISTS app_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  pin_hash TEXT,
  main_workout_days TEXT[] DEFAULT '{monday,wednesday,friday}',
  main_workout_type TEXT DEFAULT 'strength'
);

-- Insert default settings row
INSERT INTO app_settings (id, main_workout_days, main_workout_type)
VALUES (1, '{monday,wednesday,friday}', 'strength')
ON CONFLICT (id) DO NOTHING;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_workouts_intent ON workouts(primary_intent);
CREATE INDEX IF NOT EXISTS idx_workouts_archived ON workouts(is_archived);
CREATE INDEX IF NOT EXISTS idx_schedule_day ON schedule_assignments(day_of_week);
CREATE INDEX IF NOT EXISTS idx_schedule_workout ON schedule_assignments(workout_id);
CREATE INDEX IF NOT EXISTS idx_completion_date ON completion_log(completed_date);
CREATE INDEX IF NOT EXISTS idx_completion_workout ON completion_log(workout_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_workouts_updated_at
  BEFORE UPDATE ON workouts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Disable RLS for single-user app (PIN auth handles access control)
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE completion_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Allow all operations for anon key (single-user app, auth is PIN-based)
CREATE POLICY "Allow all for anon" ON workouts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON schedule_assignments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON completion_log FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON app_settings FOR ALL USING (true) WITH CHECK (true);
