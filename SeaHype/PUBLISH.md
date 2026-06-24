# Publishing — SeaHype Marine Biology Education

The whole app is **one self-contained file** (`index.html`): no build step, no server code, no
external dependencies, React inlined. To put it online you just host that single file.

> **Deploy only `index.html`** — not the full handoff bundle. The bundle (data files, test
> harnesses, build scripts) is your development/archive copy; the public site is the one HTML file.

`index.html` is already provided alongside this guide, ready to upload as-is.

---

## Option 1 — Netlify Drop  (fastest; ~1 minute, no account needed to start)
1. Put `index.html` in an otherwise-empty folder.
2. Go to **app.netlify.com/drop**.
3. Drag the folder onto the page.
4. You get a live HTTPS URL immediately (e.g. `clever-name.netlify.app`). Create a free account to
   keep it, rename the site, or attach a custom domain.

## Option 2 — GitHub Pages  (free, version-controlled, custom domain)
1. Create a new repo (e.g. `seahype`).
2. Upload `index.html` to the repo root (the web "Add file → Upload files" works fine).
3. **Settings → Pages → Source:** "Deploy from a branch" → branch `main`, folder `/ (root)` → Save.
4. Live in ~1 minute at `https://<your-username>.github.io/seahype/`.

## Option 3 — Cloudflare Pages or Vercel  (fast global CDN, free)
- **Cloudflare Pages:** dash.cloudflare.com → *Workers & Pages* → *Create* → *Pages* → upload the
  folder, or connect the GitHub repo.
- **Vercel:** vercel.com → *Add New → Project* → import the repo; or run `npx vercel` from the folder.

## Custom domain (optional)
Every host above lets you attach your own domain from its dashboard (add the CNAME/A record they show
you at your registrar). Free HTTPS is issued automatically.

---

## Notes specific to this app
- **HTTPS enables "Add to Home Screen."** All hosts above give free HTTPS. The app's iOS web-app meta
  tags then let people save it to their home screen with the SeaHype name and navy theme.
- **Works offline once loaded.** Single file, React inlined, no required network calls — after the
  first visit it keeps working with no connection.
- **Species photos are optional.** They load at runtime when present and fall back gracefully when
  not, so you can publish now and bake photos in later (see `PHOTOS_README.md`) with no other changes.
- **Progress is saved per-origin** under the browser key `seahype_marinebio_v1`. Keep the same domain
  so returning visitors retain their XP and completed lessons.
- **Updating later:** re-upload a new `index.html` (or push to the repo). Returning visitors get the
  new version on next load, and their saved progress carries over because the storage key is unchanged.

## Pre-flight (all currently green)
Parser ✓ · build ✓ · data integrity (501 lessons / 1,502 quiz items) ✓ · arcade 22/22 + 24/24 ✓ ·
every screen, both themes, mobile + desktop, 0 console errors ✓ · static integrity (no name leakage,
offline-ready, meta complete) ✓ · spelling & coherence ✓.
