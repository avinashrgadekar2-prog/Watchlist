# 🎬 The Watch List

A shared movie & TV recommendation list, built as a single web page you can host for free and share with friends.

## What's inside
- `index.html` — the whole app: structure, styling, and logic in one file
- `README.md` — this file

## How it works right now
Open `index.html` (double-click it, or visit your GitHub Pages URL once it's live) and you'll see **demo mode**: three sample recommendations, editable, but only visible in your own browser tab. Nothing is shared yet.

To make it a real list your friends can all see and add to, connect it to a free Firebase database. Takes about 10 minutes, no credit card required.

## Setup

### 1. Create a Firebase project
Go to [console.firebase.google.com](https://console.firebase.google.com), sign in with a Google account, and click **Add project**. Give it any name (e.g. "watch-list") and finish the wizard — you can skip Google Analytics if it asks.

### 2. Create a Firestore database
In your new project's left sidebar, click **Build → Firestore Database → Create database**. Choose **Start in test mode** and pick any location close to you.

### 3. Set security rules — updated for accounts
Open the **Rules** tab in Firestore and replace the *entire* contents with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /usernames/{username} {
      allow read: if true;
      allow create: if request.auth != null && request.resource.data.uid == request.auth.uid;
      allow update, delete: if false;
    }
    match /recommendations/{recId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /meta/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

Click **Publish**. This is a real step up from before: anyone can still *read* the list without an account, but *writing* anything now requires being signed in. The `usernames` rule is what guarantees two people can't grab the same username — Firestore rejects the second person's claim automatically.

> **This replaces the old wildcard rule entirely** — don't leave both in place, paste over the whole thing.

### 4. Turn on Email/Password sign-in
In the Firebase console, go to **Build → Authentication → Get started**, then **Sign-in method** tab, and enable **Email/Password**. (The app only ever shows your friends a username, but it uses this provider behind the scenes — see "How accounts work" below.)

### 4. Get your web app config
Back on the project's main **Overview** page, click the **`</>`** (web) icon to register a new web app. Give it any nickname, skip Firebase Hosting, and click **Register app**. Firebase will show you a `firebaseConfig` object with values like `apiKey`, `authDomain`, etc.

### 5. Paste your config into the code
Open `index.html` in any text editor and find this block near the bottom:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Replace it with the object Firebase showed you, then save the file. Demo mode turns off automatically as soon as `apiKey` no longer says `"YOUR_API_KEY"`.

### 6. Put it on GitHub
Create a new repository at [github.com/new](https://github.com/new) (public is fine, and free). Upload `index.html` and `README.md` — either drag them into the "uploading an existing file" link on the repo page, or use git if you're comfortable with it.

### 7. Turn on GitHub Pages
In your repo, go to **Settings → Pages**. Under "Build and deployment", set **Source** to **Deploy from a branch**, choose the **main** branch and the **/ (root)** folder, then **Save**.

### 8. Share the link
GitHub will give you a URL shaped like `https://yourusername.github.io/your-repo-name/`. It can take a minute or two to go live. That's the link you send your friends — everyone who opens it sees and adds to the same list in real time.

## What's new
- **Where to watch** — pick a streaming platform when adding a title (Netflix, Disney+ Hotstar, Zee5, YouTube, Voot, Apple TV+, Amazon Prime Video, SonyLIV). Choose "+ Add a platform…" to add your own — it's saved for everyone, so nobody has to add it twice.
- **Poster art & year** — fetched automatically from a free public movie lookup when you add a title. If it can't find a match, it just falls back to the category icon.
- **Search, sort & filters** — search by title/person/note, sort by newest, oldest, A–Z, or most wanted.
- **Want to watch** — anyone can tally their interest on an entry.
- **Ratings** — once something's marked watched, leave a 1–5 star rating; the card shows the group average.
- **Comments** — a small expandable thread under each entry.
- **Surprise me** — picks a random unwatched title and scrolls to it, for indecisive movie nights.

## How accounts work
You sign up with just a username and password — no email or phone. Behind the scenes, Firebase Auth technically needs an email-shaped string, so the app quietly turns your username into `yourname@watchlist.local`. You'll never see or use that; it's invisible.

**Known limitation:** because that email isn't real, Firebase's standard "forgot password" flow can't reach you (there's nowhere to send the reset link). If you forget your password, the practical fix is signing up again under a different username.

## What's new
- **Accounts & profiles** — sign up/sign in, an editable avatar (click it to cycle emoji), bio, favorite genres, and stats (added/rated/your average rating). "Your Name" is gone — everything now uses your logged-in username automatically.
- **Redesigned layout** — a top bar with search, a proper nav (Discover / My List / Group picks / Profile), a "tonight's pick" hero, and compact cards that open a detail view instead of showing everything inline.
- **My List** — a quick filtered view of what you've added or marked interested in.
- **Where to watch** — pick a streaming platform when adding a title, or add your own — it's saved for everyone.
- **Poster art & year** — fetched automatically from a free public movie lookup.
- **Search & sort**, **want-to-watch tallies**, **ratings**, **comments** — all still here, now living in the detail view.
- **Group picks** — a placeholder tab for now; watch-party matching and polls are a later phase.
- **Install as an app** — Chrome will offer to install this as a standalone app (desktop and mobile).

## Customizing it
Everything lives in `index.html`, so it's all in one place to tweak:
- **Colors** — near the top of the `<style>` block, the `:root { ... }` section defines the palette (`--gold`, `--red`, `--bg`, etc.). Change the hex values to restyle the whole app.
- **Categories** — the `<select id="type">` in the HTML and the `typeEmoji()` function in the script both list the categories (Movie, TV Series, etc.). Add or rename entries in both places to keep them in sync.
- **Fields** — to add something like a "rating," add an input in the form, include it in the `.add()` call in the submit handler, and show it in the `renderList()` template.

## If something's not working
- Blank list, no errors: check that your Firestore rules were published (step 3).
- "Couldn't reach the list" banner: double check every value in `firebaseConfig` was copied exactly, with no extra quotes or spaces.
- Still stuck: open your browser's dev tools (F12) and check the Console tab for a red error message — it usually names the exact problem.
