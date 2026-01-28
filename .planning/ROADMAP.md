# Roadmap: KI & ich

## Overview

This roadmap transforms "KI & ich" from concept to deployable web-app through 9 phases. We start with technical foundation and core systems (Phases 1-5), then layer in educational content (Phases 6-7), build the interactive Mini-App capstone (Phase 8), and polish for classroom use (Phase 9). Each phase delivers observable capabilities that bring children closer to understanding AI as a tool they control.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation & Setup** - Project scaffolding, design system, routing, deployment
- [x] **Phase 2: Kiki Maskottchen System** - Interactive avatar with emotions and speech bubbles
- [x] **Phase 3: Lesson Framework** - Content rendering engine with age-appropriate display
- [x] **Phase 4: Quiz System** - Interactive quizzes with immediate feedback
- [ ] **Phase 5: Progress & Rewards** - Tracking, animations, and motivational feedback
- [ ] **Phase 6: Core Lessons 1-4** - Foundation AI knowledge content
- [ ] **Phase 7: Advanced Lessons 5-6** - Prompting techniques and practice exercises
- [ ] **Phase 8: Mini-Apps & Lesson 7** - Interactive capstone with 4 AI simulators
- [ ] **Phase 9: Polish & Teacher Mode** - Final enhancements for classroom deployment

## Phase Details

### Phase 1: Foundation & Setup
**Goal**: Technical infrastructure is production-ready and supports all future features
**Depends on**: Nothing (first phase)
**Requirements**: TECH-01, TECH-02, TECH-03, TECH-04, NAV-01, NAV-02, NAV-03, NAV-04, NAV-05
**Success Criteria** (what must be TRUE):
  1. User can navigate between pages using clear forward/back buttons
  2. User sees progress indicator on every page showing position in learning path
  3. App loads and functions correctly on tablets (mobile-responsive)
  4. User sees home overview with all 7 lessons visible at once
  5. All interactive elements are at least 48x48px (touch-friendly)
  6. App is deployed to GitHub Pages and accessible via public URL
  7. App stores no personal data (DSGVO-compliant for schools)
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md — Project scaffolding, Router, and StateManager
- [x] 01-02-PLAN.md — Navigation components and Home/Lesson/Quiz views
- [x] 01-03-PLAN.md — GitHub Pages deployment and verification

### Phase 2: Kiki Maskottchen System
**Goal**: Kiki becomes an engaging, emotionally responsive guide throughout the learning journey
**Depends on**: Phase 1
**Requirements**: KIKI-01, KIKI-02, KIKI-03, KIKI-04, KIKI-05
**Success Criteria** (what must be TRUE):
  1. User sees Kiki as SVG avatar on every page
  2. Kiki displays different emotions (happy, thoughtful, proud, sad, surprised, curious) contextually
  3. Kiki shows explanations in speech bubble format
  4. Kiki reacts with animations when user answers quiz questions (celebrates correct, encourages on wrong)
  5. User is greeted by Kiki on the home page with welcoming message
**Plans**: 3 plans

Plans:
- [x] 02-01-PLAN.md — Core Kiki SVG component and emotion system
- [x] 02-02-PLAN.md — Speech bubbles and home page greeting
- [x] 02-03-PLAN.md — Quiz reactions, particles, and view integration

### Phase 3: Lesson Framework
**Goal**: Content rendering system displays lessons appropriately for 7-year-olds
**Depends on**: Phase 2
**Requirements**: LEKT-08, LEKT-09
**Success Criteria** (what must be TRUE):
  1. Each lesson displays maximum 5-7 screens (takes 10-15 minutes to complete)
  2. All lesson text uses language understandable by 7-year-olds (short sentences, simple words)
  3. User can navigate through lesson screens smoothly with Kiki's guidance
  4. Lessons render consistently across different screen sizes
**Plans**: 3 plans

Plans:
- [x] 03-01-PLAN.md — Lesson data structure and content loader
- [x] 03-02-PLAN.md — LessonRenderer component with screen navigation
- [x] 03-03-PLAN.md — Child-friendly typography CSS and Kiki integration

### Phase 4: Quiz System
**Goal**: Interactive quizzes provide immediate, encouraging feedback after each lesson
**Depends on**: Phase 3
**Requirements**: QUIZ-01, QUIZ-02, QUIZ-03, QUIZ-04
**Success Criteria** (what must be TRUE):
  1. User completes 5 multiple-choice questions after each lesson
  2. User sees immediate visual feedback (animation) for correct/incorrect answers
  3. User sees final quiz score displayed as "X of 5 correct"
  4. Kiki reacts to quiz results (celebrates success, encourages after mistakes)
  5. No time pressure during quiz (child-friendly pacing)
**Plans**: 3 plans

Plans:
- [x] 04-01-PLAN.md — Quiz data structure and loader
- [x] 04-02-PLAN.md — QuizRenderer component with question display
- [x] 04-03-PLAN.md — Feedback animations, results screen, view integration

### Phase 5: Progress & Rewards
**Goal**: Progress tracking and celebrations motivate continued learning
**Depends on**: Phase 4
**Requirements**: PROG-01, PROG-02, PROG-03, PROG-04
**Success Criteria** (what must be TRUE):
  1. User's progress persists across browser sessions (LocalStorage)
  2. Completed lessons show visual markers on home screen
  3. User sees confetti animation when passing quizzes
  4. User hears encouraging sound effects during interactions (with mute toggle available)
  5. User can see which lessons are complete vs. incomplete at a glance
**Plans**: 3 plans

Plans:
- [ ] 05-01-PLAN.md — SoundManager component with Web Audio API
- [ ] 05-02-PLAN.md — Confetti integration and enhanced completion badges
- [ ] 05-03-PLAN.md — Settings UI with mute toggle and integration

### Phase 6: Core Lessons 1-4
**Goal**: Children understand what AI is and recognize it in daily life
**Depends on**: Phase 5
**Requirements**: LEKT-01, LEKT-02, LEKT-03, LEKT-04
**Success Criteria** (what must be TRUE):
  1. User can complete Lesson 1 "Was ist KI?" with text and illustrations
  2. User can complete Lesson 2 "KI-Arten" learning about LLM, LAM etc. in child-friendly terms
  3. User can complete Lesson 3 "Was kann KI heute?" understanding current AI capabilities
  4. User can complete Lesson 4 "KI im Alltag" recognizing practical AI applications
  5. Each lesson has accompanying quiz that reinforces learning
**Plans**: TBD

Plans:
- [ ] 06-01: TBD

### Phase 7: Advanced Lessons 5-6
**Goal**: Children learn to communicate effectively with AI using prompting techniques
**Depends on**: Phase 6
**Requirements**: LEKT-05, LEKT-06
**Success Criteria** (what must be TRUE):
  1. User can complete Lesson 5 "Mit KI sprechen" understanding prompt techniques (0-shot, few-shot)
  2. User can complete Lesson 6 practice exercises for research and prompting
  3. User understands difference between clear and vague prompts through interactive examples
  4. User can apply prompting techniques in guided practice scenarios
**Plans**: TBD

Plans:
- [ ] 07-01: TBD

### Phase 8: Mini-Apps & Lesson 7
**Goal**: Children experience creating with AI through 4 interactive mini-apps
**Depends on**: Phase 7
**Requirements**: LEKT-07, MINI-01, MINI-02, MINI-03, MINI-04
**Success Criteria** (what must be TRUE):
  1. User can complete Lesson 7 "Erste App bauen" leading to mini-apps
  2. User can use Story Generator: enter character + location, receive simulated story
  3. User can play Animal Quiz: AI asks questions and guesses animal user is thinking of
  4. User can use Joke Machine: click button to see child-friendly jokes
  5. User can use Name Meaning: enter name, receive simulated meaning explanation
  6. All mini-apps feel like "AI magic" through simulated responses (no real API)
**Plans**: TBD

Plans:
- [ ] 08-01: TBD

### Phase 9: Polish & Teacher Mode
**Goal**: App is classroom-ready with teacher-friendly features and polished experience
**Depends on**: Phase 8
**Requirements**: LEHR-01, LEHR-02
**Success Criteria** (what must be TRUE):
  1. Teacher can access Teacher Mode showing overview of all lessons for presentation
  2. Teacher can navigate freely between lessons without progress restrictions
  3. All animations, sounds, and interactions feel polished and bug-free
  4. App has been tested on tablets (primary school device)
  5. Documentation exists for teachers explaining how to use the app in classroom
**Plans**: TBD

Plans:
- [ ] 09-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Setup | 3/3 | Complete | 2026-01-28 |
| 2. Kiki Maskottchen System | 3/3 | Complete | 2026-01-28 |
| 3. Lesson Framework | 3/3 | Complete | 2026-01-28 |
| 4. Quiz System | 3/3 | Complete | 2026-01-28 |
| 5. Progress & Rewards | 0/3 | Not started | - |
| 6. Core Lessons 1-4 | 0/TBD | Not started | - |
| 7. Advanced Lessons 5-6 | 0/TBD | Not started | - |
| 8. Mini-Apps & Lesson 7 | 0/TBD | Not started | - |
| 9. Polish & Teacher Mode | 0/TBD | Not started | - |

---
*Roadmap created: 2026-01-28*
*Last updated: 2026-01-28*
