# Cybernetic Labs Learning OS

Advanced static learning platform for student roadmaps, cybersecurity learning, GATE CSE preparation, coding practice, quizzes, habit tracking, and Firebase-backed progress.

## Tech Stack

- Static HTML/CSS/JavaScript single-page app
- Firebase Web SDK v10 modular CDN imports
- Firebase Authentication with Google and email/password
- Cloud Firestore as the source of truth for user progress
- Realtime Database locked by default

## Features

- Google sign-in with popup and redirect recovery for blocked popup/mobile flows
- Per-user Firestore profile at `users/{uid}`
- Firebase-backed roadmap progress, node progress, habit logs, quiz attempts, mock attempts, and stats
- Roadmaps for cybersecurity, programming, GATE CSE, DSA, DevOps, cloud, Linux, networking, and languages
- Resource catalog metadata with external links only
- Habit tracker, focus timer, quizzes, mock-test log, notes, and progress dashboard
- Public developer profile with circular photo fallback
- Secure Firestore rules and locked RTDB rules

## Firebase Setup

1. Create a Firebase project.
2. Firebase Console -> Authentication -> Sign-in method -> enable Google.
3. Optional: enable Email/Password if you want the email form to work.
4. Firebase Console -> Authentication -> Settings -> Authorized domains:
   - `localhost`
   - `127.0.0.1`
   - your Vercel/Netlify/Firebase Hosting domain
   - your custom domain
5. Create a Cloud Firestore database.
6. Deploy `firestore.rules`.
7. Deploy `firestore.indexes.json`.
8. Keep Realtime Database locked with `database.rules.json` unless you intentionally add presence.

## Environment / Config Values

This static app currently reads Firebase config from `index.html`. For Vite or another bundler, move those values into environment variables:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_DATABASE_URL` only if RTDB presence is added

Firebase web config is not an admin secret, but Firestore and RTDB rules are mandatory security controls.

## Firestore Data Model

Private user data:

- `users/{uid}`
- `users/{uid}/roadmapProgress/main`
- `users/{uid}/nodeProgress/{nodeId}`
- `users/{uid}/habits/{habitId}`
- `users/{uid}/habitLogs/{yyyy-mm-dd}`
- `users/{uid}/problemProgress/{problemId}`
- `users/{uid}/quizAttempts/{attemptId}`

Public/admin-managed catalog data:

- `developer/profile`
- `roadmaps/{roadmapId}`
- `roadmaps/{roadmapId}/nodes/{nodeId}`
- `resources/{resourceId}`
- `problems/{problemId}`
- `quizzes/{quizId}`
- `admins/{uid}`

## Deploy Rules

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
firebase deploy --only database
```

Only create `admins/{uid}` documents from a trusted admin environment. Client users cannot grant themselves admin access.

## Local Development

Use a local server so Firebase Auth redirect/popup flows have a real origin:

```bash
python -m http.server 5173
```

Open `http://localhost:5173`.

Validation:

```bash
npm run build
npm run lint
npm run typecheck
```

## Deployment

- Deploy as a static site to Firebase Hosting, Vercel, Netlify, or any static host.
- Add the deployed domain to Firebase Auth authorized domains.
- Configure the same Firebase web config in the deployed app.
- Deploy Firestore rules and indexes before testing writes.

## Troubleshooting

- `auth/unauthorized-domain`: add the current domain in Firebase Authentication settings.
- `auth/popup-blocked`: the app attempts redirect sign-in; allow popups or continue with redirect.
- `auth/popup-closed-by-user`: retry Google login and complete the popup.
- `auth/network-request-failed`: check internet, blockers, and Firebase availability.
- `permission-denied`: deploy `firestore.rules` and verify the user owns the path being written.
- Missing env/config values: verify API key, auth domain, project ID, sender ID, app ID, and storage bucket.
- Firestore index required: copy the Firebase console index link into `firestore.indexes.json`, then deploy indexes.
- Firebase rules not deployed: local code can be correct but writes will still fail until rules are deployed.
- Vercel/Netlify config missing: add Firebase config values to the deployed environment/build output.

## Seed Data

Seed metadata lives in:

- `src/data/seedRoadmaps.js`
- `src/data/resourcesCatalog.js`

These files contain roadmap/resource metadata and external links only. They do not copy course content.
