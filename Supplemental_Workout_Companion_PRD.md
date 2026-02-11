
# Product Requirements Document (PRD)
## Supplemental Workout Companion App

---

## 1. Purpose & Problem Statement

People who already follow a primary fitness routine (lifting, running, classes, etc.) often accumulate **short supplemental workouts**:
- Rehab or injury-recovery routines
- Injury-prevention or durability work
- Core, mobility, or stability sessions
- Short power, plyometric, or bone-density workouts
- “I always feel better when I do this” routines

These workouts are **not full training sessions**, but users struggle with:
- Where they fit in the week
- Whether they should be done before or after other workouts
- Whether short workouts are actually high-fatigue
- Whether stacking certain supplements interferes with recovery or performance

This app exists to support **better decisions about supplemental workouts**, without replacing the user’s main program.

---

## 2. What This App Is (and Is Not)

### This app **is**:
- A personal library for supplemental workouts
- A decision-support tool for workout placement
- A system that explains *why* some workouts interfere and others don’t
- A long-term “body knowledge map” based on the user’s lived experience

### This app **is not**:
- A full workout planner or calendar
- A replacement for a coach or training plan
- A rigid rule-enforcer
- A medical or diagnostic tool

---

## 3. Core Design Principles

### A. Supplemental workouts are *blocks*, not days
Each workout is treated as a **short block** with:
- A purpose
- A fatigue cost
- A relationship to other training

The app reasons about **compatibility**, not full schedules.

### B. Intent matters more than muscle group
Two workouts using the same muscles can behave very differently.

The app prioritizes:
- Why the workout exists
- What kind of fatigue it creates
- How it interacts with other training

### C. Fatigue is not just time-based
The app explicitly recognizes:
- Short workouts can be high-cost
- Fatigue can be **muscular** or **system-wide**
- Users may feel “fried rather than sore”

Allowed terminology:
- Muscle / tissue fatigue
- System fatigue (CNS / neurological fatigue)
- Mixed fatigue

### D. The user’s experience is authoritative
The app starts with general tendencies, but user notes override assumptions.

---

## 4. Supplemental Workout Intake (Add Workout Flow)

When adding a supplemental workout, the app must capture:

### A. Basic Info
- Workout name
- Link(s) or reference material
- Optional notes

### B. Primary Intent
- Rehab / injury recovery
- Injury prevention / durability
- Strength support
- Power / bone density
- Skill / coordination
- Mobility
- Conditioning
- Feel-good / regulation

### C. Perceived Effort
- Very light / restorative
- Light but focused
- Moderate effort
- Sneaky hard
- Very taxing

### D. Stress Characteristics
- Impact
- Tendons / connective tissue
- Localized muscle fatigue
- Breathing / heart-rate stress
- Coordination / balance

### E. Intended Frequency
- Daily / near-daily
- 2–3× per week
- 1× per week
- Occasional

### F. Lived Experience
Free-form observations from the user.

---

## 5. Fatigue Classification Model

- Primarily muscular / tissue fatigue
- Mixed fatigue
- Primarily system fatigue (CNS / neurological)

Classifications are probabilistic and refine over time.

---

## 6. Guidance & Language Rules

The app provides **coach-like, probabilistic guidance**, never rigid rules.

Allowed examples:
- “This tends to be system-fatiguing for many people.”
- “Short duration does not mean low cost.”
- “This may affect tomorrow’s run more than today’s workout.”

---

## 7. Placement & Compatibility Logic

The app helps reason about:
- Before vs after placement
- Pairing with strength or cardio days
- Interference vs complement

---

## 8. Lightweight Scheduling

Users may:
- Assign supplemental workouts to days
- Repeat them weekly
- Check them off when completed

Scheduling is optional and flexible.

---

## 9. Recent History & Body Knowledge Map

The app shows:
- A rolling 1–2 week history of completed supplemental workouts
- Simple pattern insights based on user history

---

## 10. Usage Context & Accessibility

This app is primarily intended to be used on a **phone**, often during or immediately after workouts.

It should:
- Be comfortable on small screens
- Be readable at a glance
- Require minimal typing
- Load reliably in gym or outdoor environments

The app does **not** need to be a native mobile app, but it must be fully usable on mobile devices. The design priority is **mobile-first usage**.

---

## 11. Success Criteria

Success means:
- Users feel confident placing supplemental workouts
- Users understand fatigue and interference
- Maintenance and rehab work is done more consistently

---

## 12. Explicit Scope Boundaries (v1)

Out of scope:
- Full workout tracking
- Nutrition planning
- Performance metrics
- Injury diagnosis

---

**Core question this app answers:**  
*“Where does this fit — and why?”*
