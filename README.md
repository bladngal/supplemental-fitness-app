# Supplemental Fitness App

A personal library and decision-support tool for managing supplemental workout blocks — rehab, mobility, injury prevention, conditioning, and more. It answers the question: **"Where does this fit — and why?"**

Built for people who follow a primary fitness routine and accumulate short supplemental workouts but struggle with where they fit, how fatiguing they really are, and whether stacking them interferes with recovery.

## Features

- **Workout Library** — Catalog supplemental blocks with a guided 6-step intake form covering intent, perceived effort, stress characteristics, frequency, and your lived experience
- **Fatigue Classification Engine** — Rule-based weighted scoring across muscular and system/CNS axes to classify each workout's fatigue footprint
- **Placement Guidance** — Recommendations for when to do each block (before main workout, after, standalone, or flexible) with coach-like rationale
- **Compatibility Analysis** — Pairwise interference detection when stacking multiple blocks on the same day
- **7-Day Scheduling** — Assign workouts to days of the week with a visual grid overview
- **Completion Tracking** — Quick-complete from the dashboard with rolling history
- **Insights** — Frequency consistency, fatigue accumulation, streaks, and missed target detection over 7/14/30-day windows
- **Coach-Like Language** — All guidance uses probabilistic, advisory language — never rigid rules

## Tech Stack

- **Framework**: Next.js (App Router) + TypeScript + Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: PIN-based gate (bcrypt-hashed PIN → JWT cookie)
- **Fatigue Model**: Rule-based weighted scoring with a swappable `FatigueClassifier` interface
- **PWA**: Installable via `@ducanh2912/next-pwa`

## Getting Started

### 1. Set up Supabase

Create a [Supabase](https://supabase.com) project and run `supabase-schema.sql` in the SQL Editor to create all tables.

### 2. Configure environment

Copy `.env.local.example` or create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=a_random_secret_string
```

Generate a JWT secret with: `openssl rand -base64 32`

### 3. Install and run

```bash
npm install
npm run dev
```

Visit `localhost:3000`, set your PIN, and start adding workouts.

## Project Structure

```
src/
  app/                    # Next.js App Router pages and API routes
  components/
    ui/                   # Button, Card, Badge, BottomNav, etc.
    workout/              # WorkoutCard, WorkoutForm (6 steps), WorkoutDetail
    schedule/             # WeekView, ScheduleSlot, CompletionCheckbox
    history/              # HistoryTimeline, InsightCard
    guidance/             # PlacementAdvice, CompatibilityMatrix, CoachNote
  lib/
    engines/              # Fatigue classifier, placement, compatibility, guidance
    constants/            # Intents, efforts, stress types, frequencies
    supabase/             # Client and server helpers
  hooks/                  # useWorkouts, useSchedule, useHistory, useGuidance, useAuth
  types/                  # TypeScript type definitions
```

## Fatigue Classification

The engine scores each workout across two axes:

1. **Intent base scores** — Each intent has base muscular/system weights
2. **Effort multiplier** — Scales both axes, with system scaling faster at higher efforts (notably "sneaky hard")
3. **Stress adjustments** — Each stress characteristic adds to the relevant axis
4. **Classification** — Muscular ratio >65% → muscular/tissue, <35% → system/CNS, else → mixed

The engine implements a `FatigueClassifier` interface, making it swappable for an AI-based classifier in the future without changing any other code.
