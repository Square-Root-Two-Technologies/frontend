# squareroottwo.in — Testing Strategy

**Branch:** `new_form`  
**Stack:** React 18 · Node.js/Express · MongoDB Atlas · Cloudinary · JWT Auth · Playwright

---

## How to Use This Document

Run the automated suite first. Then go through the manual checklist page by page. Check off every item before merging `new_form` → `master`.

```bash
# Run automated smoke tests (starts dev server automatically)
cd /Users/tanvirraihan.islam/Documents/frontend-3
npx playwright test

# Run only one section
npx playwright test --grep "Landing page"

# Open the HTML report after a run
npx playwright show-report
```

Test accounts:
- **Regular user:** `test@squareroottwo.in` / `testpass123`
- **Admin/SuperAdmin:** use your real admin credentials (never commit these to git)

---

## 1. Automated Tests (Playwright)

File: `tests/smoke.spec.ts`

These run on every `npx playwright test` call against `http://localhost:3000`.

| # | Test | What it checks |
|---|------|----------------|
| 1 | Landing page loads | `h1` and `nav` visible |
| 2 | Theme toggle | `html` class changes on button click |
| 3 | "Read all posts" CTA | navigates to `/home` |
| 4 | "All photos" link | navigates to `/photos` (skipped if not visible) |
| 5 | Navbar → Read | `/home` |
| 6 | Navbar → Photos | `/photos` |
| 7 | Search → `/search?q=` | submit from navbar |
| 8 | Logo → `/` | home link |
| 9 | `/home` post grid | at least one `article` card renders |
| 10 | `/blogspace` post grid | same |
| 11 | Click post card | opens `/blog/:id`, `h1` visible |
| 12 | Single post back link | "All posts" or "Back" link present |
| 13 | Search results | heading contains "search" or "result" |
| 14 | Empty search | stays on `/search` without crashing |
| 15 | Login page fields | email + password inputs render |
| 16 | Signup page fields | name + email + password render |
| 17 | `/my-notes` unauthenticated | redirects to `/login` |
| 18 | `/add-note` unauthenticated | redirects to `/login` |
| 19 | Wrong credentials | error message visible |
| 20 | `/photos` loads | `h1` visible |
| 21 | Photos grid/empty state | has images or "no photos" text |
| 22 | 404 page | unknown route shows "404" |
| 23 | Mobile hamburger | menu opens, auth links visible (mobile project) |

**Passing = green light to do manual checks.**

---

## 2. Manual Test Checklist

Do these checks on both **desktop (1280px)** and **mobile (375px)**.

Mark each: ✅ pass · ❌ fail (note what broke) · ⏭ skip (feature not yet shipped)

---

### 2.1 Landing Page `/`

- [ ] Page loads, hero headline visible
- [ ] "Writer · Builder · Photographer" tag renders
- [ ] "Read all posts →" CTA scrolls/navigates to `/home`
- [ ] Writing section shows 4 recent posts (or "No posts yet." if DB empty)
- [ ] Each post row links to the correct `/blog/:id`
- [ ] Photography section shows 6 recent photos (or 6 grey placeholders if none uploaded)
- [ ] "All photos →" link goes to `/photos`
- [ ] Now section shows 4 rows (Building, Reading, Listening, Location)
- [ ] Footer: Writing, Photos, Sign in links all work
- [ ] Dark/light toggle button (moon/sun icon) switches theme
- [ ] Theme persists after page reload (localStorage)
- [ ] No layout breaks at 375px, 768px, 1280px

---

### 2.2 Navbar

- [ ] Logo "Tanvir Raihan" (landing) / "√2" (other pages) navigates to `/`
- [ ] Read → `/home`
- [ ] Photos → `/photos`
- [ ] Write → `/my-notes` (redirects to login if logged out)
- [ ] Search input: type + Enter navigates to `/search?q=<term>`
- [ ] Search input: empty submit does nothing (no navigation)
- [ ] Dark/light toggle works from navbar on all pages
- [ ] **Mobile:** hamburger opens overlay menu
- [ ] **Mobile:** all links in menu work, menu closes on link click
- [ ] **Logged in:** user avatar/initials + name visible in desktop navbar
- [ ] **Logged in:** user menu shows Profile, My Notes, Settings, Logout
- [ ] **Logged out:** Login and Sign up links visible

---

### 2.3 Blog — Public Reading `/home`

- [ ] Post grid loads (wait up to 15s)
- [ ] Cards show title, tag/type, date
- [ ] Clicking a card opens the single post
- [ ] Infinite scroll: scrolling to bottom loads more posts (if > 9 posts exist)
- [ ] Filtering by type (if type filter UI present): shows only matching posts
- [ ] No broken images or layout shifts

---

### 2.4 Single Blog Post `/blog/:id`

- [ ] Title (`h1`) visible
- [ ] Author name + avatar/initials visible
- [ ] Publication date visible
- [ ] Body content rendered as HTML (bold, links, images if any)
- [ ] "← All posts" or "Back" link returns to `/home`
- [ ] "Like" button increments count (requires login — verify redirect if logged out)
- [ ] No XSS: injected `<script>` tags from DB are not executed (DOMPurify active)
- [ ] Non-existent ID shows 404 page

---

### 2.5 Search `/search?q=`

- [ ] Results show for a common word (e.g., "the")
- [ ] Each result links to the correct post
- [ ] No results: "No results" or equivalent empty state shown
- [ ] Empty `?q=` does not crash, shows placeholder or empty state
- [ ] Search term highlighted or echoed in heading

---

### 2.6 Authentication

#### Sign Up `/signup`
- [ ] Name, email, password, confirm-password fields render
- [ ] Mismatched passwords shows inline error
- [ ] Duplicate email shows error from API
- [ ] Successful signup redirects to `/home` or `/my-notes`
- [ ] After signup, navbar shows logged-in state

#### Log In `/login`
- [ ] Email + password fields render
- [ ] Wrong credentials: error message appears (no redirect)
- [ ] Correct credentials: redirects to `/home` or `/my-notes`
- [ ] Navbar shows logged-in state immediately
- [ ] **Google OAuth button:** clicking initiates Google popup (manual — can't automate)
- [ ] Google OAuth: successful login lands on `/home` with user context populated

#### Session & Logout
- [ ] Refreshing page keeps session (JWT in localStorage)
- [ ] JWT expiry (1hr): after token expires, protected route redirects to `/login`
- [ ] Logout clears session and redirects to `/login`
- [ ] After logout, `/my-notes` and `/add-note` redirect to `/login`

---

### 2.7 My Notes (Authenticated) `/my-notes`

- [ ] Page redirects to `/login` when logged out
- [ ] Own posts listed (title, date, type)
- [ ] "Add Note" button navigates to `/add-note`
- [ ] Edit pencil/icon navigates to `/edit-note/:id` for own post
- [ ] Delete button: confirmation → post removed → list refreshed
- [ ] Only user's own posts visible (not other users')

---

### 2.8 Add Note `/add-note`

- [ ] Page redirects to login when logged out
- [ ] Title input accepts text
- [ ] Tag input accepts text
- [ ] Category dropdown loads categories from API (not hardcoded)
- [ ] Tiptap editor renders toolbar (Bold, Italic, Link, Image buttons)
- [ ] Can type body content
- [ ] Bold, Italic formatting applies visually
- [ ] Link insertion: click toolbar button, enter URL, link appears in editor
- [ ] Submit creates post: redirects to `/my-notes` and new post appears
- [ ] Empty title shows validation error (does not submit)

---

### 2.9 Edit Note `/edit-note/:id`

- [ ] Redirects to login when logged out
- [ ] Page 404s if ID does not exist
- [ ] Existing title pre-filled in input
- [ ] Existing body pre-loaded in Tiptap editor
- [ ] Existing category pre-selected in dropdown
- [ ] Edits save: changes visible on post page and in My Notes list
- [ ] Can only edit own posts (other user's ID → redirect or error)

---

### 2.10 Photography `/photos`

- [ ] Page loads, `h1` visible
- [ ] Photo grid renders (or "No photos yet." if empty)
- [ ] Infinite scroll loads more photos (if > 12 exist)
- [ ] Clicking a photo opens lightbox (full-screen overlay)
- [ ] Lightbox: left/right arrows navigate between photos
- [ ] Lightbox: title and location text visible (if set)
- [ ] Lightbox: Download button downloads original resolution image
- [ ] Lightbox: close button (×) or Escape key closes lightbox
- [ ] **Mobile:** single-column layout, tap to open lightbox
- [ ] Hover overlay shows title + location (desktop only)

---

### 2.11 Profile `/profile`

- [ ] Redirects to login when logged out
- [ ] Name, email visible
- [ ] Profile picture shown (or initial avatar if no picture)
- [ ] Country/city shown (if set)
- [ ] About/bio shown (if set)
- [ ] User's published posts listed

---

### 2.12 Edit Profile `/edit-profile`

- [ ] Redirects to login when logged out
- [ ] Name, country, city, about fields pre-filled
- [ ] Saving changes updates profile immediately
- [ ] Profile picture upload: choose file → preview shown → save → picture appears in navbar and profile
- [ ] Profile picture is served from Cloudinary URL (not local)
- [ ] Unsupported file type shows error (manual)

---

### 2.13 Dark / Light Mode

Test on: `/`, `/home`, `/blog/:id`, `/photos`, `/my-notes`

- [ ] Toggle switches between dark (`#1A1714` background) and light (`#F7F4EF` background)
- [ ] All text remains readable in both modes (no white-on-white or black-on-black)
- [ ] Cards, borders, inputs adapt correctly
- [ ] Tiptap editor content readable in both modes
- [ ] Preference persists after hard refresh (localStorage `theme` key)

---

### 2.14 404 Page

- [ ] `/this-does-not-exist` shows 404 message
- [ ] `/blog/000000000000000000000000` (valid ObjectId format, no matching doc) shows 404
- [ ] 404 page has a link back to `/home` or `/`

---

### 2.15 Responsive Layout

Test viewports: **375px** (iPhone SE), **768px** (iPad), **1280px** (desktop)

- [ ] Landing page hero grid: stacks on mobile, side-by-side on desktop
- [ ] Navbar: desktop links hidden on mobile, hamburger visible
- [ ] Post grid: 1 column → 2 columns → 3 columns as viewport grows
- [ ] Photo grid: 1 column → 2 → 3 columns
- [ ] Single post body: readable line length on all widths
- [ ] No horizontal scroll at any viewport
- [ ] Tiptap editor usable on mobile (toolbar doesn't overflow)

---

## 3. Features Requiring Special Manual Attention

These **cannot** be covered by Playwright and must be tested manually every release:

### 3.1 Google OAuth Flow
1. Click "Continue with Google" on `/login`
2. Google popup appears with correct app name ("√2" or "squareroottwo.in")
3. Select account → popup closes → redirected to `/home`
4. Navbar shows correct name and Google profile picture
5. Logout → log in again via Google → same account recognized

### 3.2 Cloudinary Uploads
1. Go to `/edit-profile`, upload a photo (JPEG, < 5MB)
2. Preview shows before save
3. After save: navbar avatar updates, profile page shows new photo
4. Photo URL is `res.cloudinary.com/dp5bafsoz/...`
5. Upload a large file (> 10MB) → expect an error, not a crash

### 3.3 Admin Photo Upload (backend ready, frontend UI pending)
> Skip until admin upload UI is built. When built, test:
> - POST `/api/photos` with valid image → photo appears in `/photos`
> - Non-admin user cannot reach upload route (403)
> - Delete photo removes from both Cloudinary and DB

### 3.4 Email / Contact Form
1. Submit the contact form with name, email, message
2. Check Mailjet dashboard: email queued and delivered
3. Check your inbox: confirmation email received
4. Submit with invalid email format → inline validation error
5. Submit empty form → validation blocks submission

### 3.5 Post Likes
1. Log in, open any post, click Like
2. Count increments by 1
3. Refresh → count persists
4. Log out, open same post → Like is disabled or shows login prompt
5. Like same post twice → count doesn't double (if idempotency enforced)

---

## 4. API / Backend Spot-Checks

Run these with `curl` or Postman against `http://localhost:5000` (dev) or production URL.

```bash
# Public routes — should return 200
curl http://localhost:5000/api/notes               # paginated posts
curl http://localhost:5000/api/notes/recent        # recent posts
curl http://localhost:5000/api/categories          # category list
curl http://localhost:5000/api/photos              # photo list
curl http://localhost:5000/api/photos/recent?limit=6

# Auth required — should return 401 without token
curl http://localhost:5000/api/notes -X POST
curl http://localhost:5000/api/photos -X POST

# Bad token — should return 401
curl http://localhost:5000/api/notes -X POST -H "auth-token: badtoken"

# Non-existent resource — should return 404
curl http://localhost:5000/api/notes/000000000000000000000000
```

---

## 5. Pre-Deploy Checklist (Before `new_form` → `master`)

Complete every item before merging:

```
[ ] npx playwright test — all 23 tests green
[ ] Manual checklist — all sections checked on desktop + mobile
[ ] Google OAuth tested with real Google account
[ ] Cloudinary upload tested (profile picture + confirm photo URL)
[ ] Dark/light mode persists on reload (both modes)
[ ] No console errors on landing, /home, /blog/:id, /photos, /my-notes
[ ] API spot-checks pass (401 on unauth, 404 on missing)
[ ] Environment variables set correctly in production (REACT_APP_BACKEND, CLOUDINARY_*, JWT_SECRET, etc.)
[ ] .env files not committed to git
[ ] npm run build completes without errors
[ ] Production build served and tested at production URL
```

---

## 6. What to Do When a Test Fails

| Failure type | First steps |
|---|---|
| Playwright test fails | `npx playwright show-report` → screenshot tab → identify which element was missing |
| Auth redirect broken | Check `UserContext` — `currentUser` null when it shouldn't be? Check JWT expiry. |
| Post grid empty | Check backend console for DB connection errors. `curl /api/notes` to isolate frontend vs backend. |
| Photo not loading | Check Cloudinary URL is valid. Check `isPublic: true` in DB. |
| Theme not persisting | Check `localStorage.getItem("theme")` in browser console. |
| Google OAuth popup blocked | Browser pop-up blocker. Also check Google Console — authorized origins must include current URL. |
| Email not delivered | Check Mailjet dashboard for bounce/spam. Check `MAILJET_*` env vars in backend. |
| Build fails | `npm run build 2>&1 | head -50` — usually an unused import or missing env var. |

---

## 7. Running Tests in CI (Future)

When you add GitHub Actions, the Playwright config is already prepared:

```yaml
# .github/workflows/test.yml
- name: Install deps
  run: npm ci
- name: Install Playwright browsers
  run: npx playwright install --with-deps chromium
- name: Run tests
  run: npx playwright test
  env:
    BASE_URL: http://localhost:3000
    TEST_EMAIL: ${{ secrets.TEST_EMAIL }}
    TEST_PASS: ${{ secrets.TEST_PASS }}
```

The `forbidOnly` and `retries: 2` settings in `playwright.config.ts` are already set for CI.
