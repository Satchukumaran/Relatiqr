# RelatiQR — Firebase Setup Guide

Follow these steps once to connect the app to your own Firebase project.
Estimated time: ~15 minutes.

---

## Step 1 — Create a Firebase project

1. Go to **https://console.firebase.google.com**
2. Click **Add project** → give it a name (e.g. `relatiqr`)
3. Disable Google Analytics if you don't need it, then click **Create project**

---

## Step 2 — Enable Authentication

1. In the Firebase console, open your project → **Authentication** → **Get started**
2. Under the **Sign-in method** tab, enable:
   - **Email/Password** — toggle on
   - **Google** — toggle on, pick your support email, save

---

## Step 3 — Create a Firestore database

1. Go to **Firestore Database** → **Create database**
2. Choose **Start in production mode** (we supply rules below)
3. Pick a Cloud Firestore location closest to your users → **Enable**

---

## Step 4 — Deploy Firestore security rules

1. In the console → **Firestore Database** → **Rules** tab
2. Replace the default rules with the contents of `firestore.rules` (in this zip)
3. Click **Publish**

---

## Step 5 — Register a web app and copy config

1. In the console, click the **gear icon** → **Project settings**
2. Scroll to **Your apps** → click **</>** (Web)
3. Give it a nickname (e.g. `relatiqr-web`) → **Register app**
4. Firebase shows you a `firebaseConfig` object like this:

```js
const firebaseConfig = {
  apiKey:            "AIza…",
  authDomain:        "relatiqr-abc.firebaseapp.com",
  projectId:         "relatiqr-abc",
  storageBucket:     "relatiqr-abc.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abc123"
};
```

5. Open **`js/firebase-config.js`** in this zip and paste your values in — replacing each `"YOUR_…"` placeholder.

---

## Step 6 — Enable Google sign-in domain (if using a custom domain)

1. Console → **Authentication** → **Settings** → **Authorized domains**
2. Add your Vercel deployment domain (e.g. `relatiqr.vercel.app`)

---

## Step 7 — Deploy to Vercel

1. Push the unzipped folder to a GitHub repository
2. Go to **https://vercel.com/new** → import that repo
3. No build step needed — it's plain HTML/JS → **Deploy**
4. Vercel will give you a URL like `relatiqr.vercel.app`

> **Tip:** Add `vercel.json` at the root so every route resolves to its folder:
> ```json
> { "rewrites": [{ "source": "/(.*)", "destination": "/$1/index.html" }] }
> ```

---

## How it works end-to-end

```
Host creates account (sign up not in the UI yet — use Firebase console
or add a /signup page) → signs in at /login → creates an event in the
dashboard → copies the invite link (e.g. yourdomain.com/register?event=ABC123)
→ puts it on every wedding invitation card as a QR code

Guest scans QR → /register?event=ABC123 → fills in name + relationship
→ data saved to Firestore → redirected to /pass with their QR pass

Host at the door scans guest's pass or opens /dashboard → sees real-time
guest network grouped by relationship type
```

---

## Firestore data structure

```
events/{eventId}
  hostUid:      string   (Firebase Auth UID)
  hostName:     string
  name:         string   (event name)
  description:  string   (optional)
  createdAt:    timestamp

events/{eventId}/guests/{guestId}
  name:         string
  email:        string   (optional)
  phone:        string   (optional)
  relationType: string   (from dropdown)
  branch:       string   (e.g. "Through bride's mother Meera")
  family:       [{name, rel}]
  registeredAt: timestamp

contacts/{docId}
  name, phone, email, event, message, submittedAt
```

---

## Adding sign-up for new hosts

The current login page only supports **existing** accounts.  
To let hosts self-register, add a sign-up form and call:

```js
import { createUserWithEmailAndPassword, updateProfile } from '...firebase-auth.js';
const cred = await createUserWithEmailAndPassword(auth, email, password);
await updateProfile(cred.user, { displayName: name });
```

Then redirect them to `/dashboard` as normal.

---

## Questions?

Open an issue in your GitHub repo or message the RelatiQR team.
