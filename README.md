# nexuset

nexuset is a focused spelling practice app for students. It is built to feel calm and structured while still making progress visible. The flow starts with a meaning, then asks the learner to build the word one letter at a time. That small shift makes spelling feel like a game of recall instead of a chore.

## v0.1.1 What's New

- Dynamic questions per session with cleaner pacing controls
- Stats monitoring page with visual breakdowns across time, sessions, categories, and difficulty
- TanStack Query based caching for faster repeat data access
- Pronunciation support so learners can spell what they hear
- Faster loading via batch loading and a larger question dataset
- UI refinements across the landing page, categories, quiz flow, and mobile layouts

## What It Does

- Definition first spelling to build recall
- Support for multiple categories to help with diverse subjects and interests
- Timed sessions for focus and pacing
- Adjustable session size (10, 20, 30)
- Auto-pronounce option for new questions
- Light and dark themes for different study settings
- User session tracking stored in Firestore (accuracy, duration, categories, and history)

## Visual Notes

Support for multiple categories to help with diverse subjects and interests

![Categories](public/categories.png)

Questions with timers and guided pacing

![Timed Questions](public/questions.png)

Light and dark mode experiences

![Light Mode](public/light.png)

![Dark Mode](public/dark.png)


## How It Is Used

1. Choose a category like English, Science, or Geography.
2. Set difficulty, session length, timer preferences, and pronunciation behavior.
3. Read a definition and build the word one letter at a time.
4. Review progress in the stats page for trends over sessions and categories.

## Project Structure

- `src/app` App Router pages and UI
- `src/context` Providers
- `src/lib` Data and service helpers
- `src/stores` Zustand stores
