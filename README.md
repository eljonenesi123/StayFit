# StayFit

A fitness app for your phone. It has an interval timer, an exercise library, AI workout and meal plans, photo exercise recognition, and a calorie tracker in one place.

**Live:** https://eljonenesi123.github.io/StayFit/

## What's in it

- **Interval timer:** build your own rounds of work and rest. The screen stays on while it runs, and the timer stays accurate if you lock your phone.
- **Exercise library:** exercises grouped by muscle group, each with a demo and how-to.
- **Workouts:** a suggested workout for today, plus your workout history.
- **AI plans:** enter your goal and schedule and get a workout or meal plan back.
- **Exercise recognition:** take a photo of an exercise and the app tells you what it is and how to do it properly.
- **Calories:** a BMR/TDEE calculator and a daily food log.
- **Progress:** weight log, BMI and an activity streak.

You can sign up with email, Google or Facebook. On first login you set your height, weight, age and goal. The app can also be installed on your home screen.

## Stack

**Front-end (`client/`)**
- React, TypeScript and Vite
- Tailwind CSS
- React Router
- Lottie for the small animations
- Installable as a PWA

**Back-end (`server/`)**
- Node.js with Express
- Claude API for the AI plans and photo recognition
- USDA FoodData Central for food calorie search

**Accounts and data**
- Supabase for login and user profiles

The AI and food search go through the Express server, so the API keys stay on the server and never reach the browser.

## Running it locally

You need Node.js and an [Anthropic API key](https://console.anthropic.com). A [USDA key](https://fdc.nal.usda.gov/api-key-signup) is optional; without it, you enter calories by hand.

**1. Start the server**

```bash
cd server
npm install
cp .env.example .env    # add your API keys here
npm run dev
```

It runs on http://localhost:8787.

**2. Start the app**

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173.

**3. Supabase (only if you use your own project)**

Run `supabase/profiles.sql` in the Supabase SQL Editor to create the profiles table, then put your project URL and key in `client/src/supabaseClient.js`.

## Exercise media

The exercise demos come from ExerciseDB. `scripts/fetchExercises.mjs` downloads them once and saves them in the repo, so the live app never calls ExerciseDB or needs that key. You only need to run it again if you add exercises.

## Deploying

The front-end deploys to GitHub Pages through GitHub Actions on every push to `main`.

The server isn't hosted yet, so the AI plans, recognition and food search only work when you run it locally. Everything else works on the live site.

---

Made by [Eljon Enesi](https://scriptlinestudio.com).
