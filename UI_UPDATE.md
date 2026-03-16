# Codex Update Prompt — NextSpelling Landing Page Revisions

Apply all of the following changes to the existing landing page components. Do not touch anything not mentioned here.

---

## 1. Replace `<HowItWorks />` with `<Testimonials />`

Delete `app/landing/components/HowItWorks.tsx` entirely and remove its import from `page.tsx`.

Create `app/landing/components/Testimonials.tsx` and import it in `page.tsx` in the same position.

### Content

Four testimonials. Two from parents, two from children. The tone must feel **genuinely human** — not marketing copy. No perfect grammar required. No one talks like a brochure. Parents sound like tired, caring people who noticed something real. Kids sound like kids.

Use these exact names and profiles:

| # | Name | Role | Age note |
|---|---|---|---|
| 1 | **Selam Tadesse** | Parent | Mother of a 9-year-old |
| 2 | **Biruk Alemu** | Child | 11 years old |
| 3 | **Tigist Haile** | Parent | Father of two, ages 8 and 12 |
| 4 | **Naol Bekele** | Child | 10 years old |

Write the quotes yourself — make them feel earned and specific, not generic praise. Examples of the tone to hit:

- Selam (parent): Something about noticing her kid sitting with it voluntarily, not being asked to. Surprised that it worked differently from other apps she'd tried.
- Biruk (child): Talks about a specific word that was hard. Maybe a little competitive about his score. Sounds like a real kid, slightly boastful.
- Tigist (parent): Mentions both kids using it differently. Appreciates that it's calm, not a game that screams at you.
- Naol (child): Short. Honest. Maybe says something slightly backhanded that's actually a compliment ("it's not that fun but I keep coming back").

No em dashes anywhere in the quotes or anywhere else in this file.

### Layout and Design

Four cards in a 2x2 grid on desktop, 1 column on mobile.

Each card:
- Background: `--bg-surface`
- Border: `1px solid var(--border)`
- Border radius: `16px`
- Padding: `28px`
- A large opening quotation mark `"` in Fraunces 600, `5rem`, `--landing-amber` at `opacity: 0.2`, positioned top-left, overlapping the card edge slightly (negative margin or absolute position)
- Quote text: DM Sans 400, `--text-base`, `--text-primary`, line-height `1.75`, sitting below the ghost quote mark
- Bottom row: avatar circle (initials, generated from name, with a warm background color unique per card — use amber, green, a warm blue, a warm rose — no purple) + name in DM Sans 500 + role label in DM Sans 400 `--text-secondary` `--text-sm`
- Star rating: 5 filled amber stars (`★★★★★`) above the quote, `--text-xs`

Card hover: `translateY(-4px)` + border color to `--border-strong`, Framer Motion `whileHover`.

Section heading: "What families are saying" in Fraunces 600 `--text-3xl`, centered, with the amber decorative line below it (same style as other section headings).

Animate cards in with `whileInView`, staggered `0.12s`, `once: true`.

---

## 2. Features Section — Remove Two Items

Open `app/landing/components/Features.tsx`.

Remove these two feature cards entirely:
- **"Letter-by-letter input"** (the one about individual boxes and pasting)
- **"Instant feedback"** (the one about green/red per keystroke)

The remaining four features stay exactly as they are. Reflow the grid to fit four cards cleanly. A 2x2 grid works well on desktop. Do not add any new features or change the copy on the remaining ones.

---

## 3. Coming Soon Section — Layout Overhaul

Open `app/landing/components/ComingSoon.tsx`.

### Outer container
Reduce the padding between the outer spotlight card and the inner feature cards significantly. Cut it to `16px` on all sides (down from whatever it currently is). The section should feel tight and intentional, not spacious. Modern, not airy.

### Inner feature cards layout
Make the three cards sit in a single horizontal row that spans the full width of the outer container on desktop. Each card should be `flex: 1` so they share the space equally and stretch to fill. No wrapping on desktop. On tablet (below `1024px`) and mobile, stack them vertically.

Use a flex row: `display: flex`, `flex-direction: row`, `gap: 12px`. Each card `flex: 1`, `min-width: 0`.

The cards themselves can reduce their internal padding to `20px` since the outer container is already tight. The "Coming Soon" badge stays top-right on each card.

### On mobile
Below `768px`: switch to `flex-direction: column`. Cards return to full width.

---

## 4. Remove All Em Dashes Sitewide

Search every component file in `app/landing/components/` for em dashes (`—`) and replace them as follows:

- If the em dash connects two clauses (acts like a parenthetical): replace with a comma, or rewrite the sentence slightly to not need the pause
- If it introduces a list or elaboration: use a colon instead
- If it's decorative or a separator between unrelated items: just remove it and tighten the surrounding text

Go through every file: `Navbar.tsx`, `Hero.tsx`, `HowItWorks.tsx` (being deleted anyway), `Features.tsx`, `ComingSoon.tsx`, `AboutSection.tsx`, `Footer.tsx`. No em dash should remain anywhere in the codebase after this.

---

## 5. Navbar Redesign

The current navbar is a standard full-width bar. Replace it with something more considered. Here is the direction:

### New design: Floating Island Navbar

Instead of a full-width sticky bar, the navbar becomes a **floating pill/island** centered at the top of the page. It does not span edge to edge.

Specs:
- Width: `fit-content`, max-width `780px`, centered horizontally
- Top margin: `20px` from the top of the viewport
- Position: `fixed`, `z-index: 50`
- Background: `--bg-surface` at `90%` opacity with `backdrop-filter: blur(16px)`
- Border: `1px solid var(--border)`
- Border radius: `999px` (full pill)
- Padding: `10px 20px`
- Height: approximately `60px`
- Box shadow: `0 4px 24px rgba(0,0,0,0.08)` in light, `0 4px 24px rgba(0,0,0,0.3)` in dark

**On scroll**: the pill shadow deepens slightly and the background opacity goes to `98%`. Use Framer Motion `useScroll` + `useTransform` for this, same as before but now applied to `boxShadow` and `backgroundColor` opacity.

**Entry animation**: the pill drops in from `y: -80` to `y: 0` with a spring on page load. `type: "spring", stiffness: 300, damping: 28, delay: 0.6` (after hero text has entered).

**Layout inside the pill** (left to right):
- Logo (same as before, no change)
- Nav links in the center: "Features", "Coming Soon", "About" with hover underlines
- Right side: Theme toggle + CTA button

On mobile (`< 768px`): the pill shrinks to just the logo + hamburger icon. The full-screen mobile menu behavior stays the same (AnimatePresence).

The rest of the page content should have `padding-top: 100px` to account for the floating nav.

Make sure the pill feels refined, not cramped. The internal spacing between elements should still breathe.

---

## Summary of Files to Touch

| File | Action |
|---|---|
| `HowItWorks.tsx` | Delete |
| `Testimonials.tsx` | Create (new) |
| `page.tsx` | Swap HowItWorks import for Testimonials |
| `Features.tsx` | Remove 2 cards, reflow grid |
| `ComingSoon.tsx` | Tight outer padding, full-width flex row for cards |
| `Navbar.tsx` | Rebuild as floating pill |
| All component files | Strip all em dashes |

Do not touch `Hero.tsx`, `AboutSection.tsx`, `Footer.tsx`, or `ThemeToggle.tsx` beyond removing em dashes.
