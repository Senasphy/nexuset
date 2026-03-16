# Codex Prompt — NextSpelling Landing Page

---

## Your Task

Build a complete, production-ready landing page for **NextSpelling** — a spelling practice web app for children — as a single Next.js page (`app/landing/page.tsx`) with all components co-located in `app/landing/components/`. The page must be visually extraordinary, child-friendly without being infantile, and built with real Framer Motion animations throughout.

---

## Tech Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** (use the tokens from `UI_REDESIGN.md` in the project root)
- **Framer Motion** (`framer-motion` — already in the project, import from it)
- **Lucide React** for icons
- **next/font/google** for fonts (Fraunces + DM Sans already set up in `layout.tsx`)
- **No additional UI libraries** beyond what's listed

For any external assets (SVG illustrations, etc.) fetch them at build time or use inline SVGs generated in code — do **not** hardcode `<img src="...">` pointing to random URLs that may break. Create all decorative visuals as inline SVG or Tailwind-powered shapes.

---

## Visual Identity

### Aesthetic Direction — "Storybook Precision"

The landing page sits in a sweet spot: **editorial quality with playful energy**. Think a beautifully typeset children's book designed by a modernist. The page should feel like something a parent would trust and a child would be excited by — simultaneously.

- **Not**: loud primary-colored chaos, clip art, cartoon bubbles everywhere
- **Yes**: clean geometric shapes, confident typography, warm colors, moments of whimsy that surprise without overwhelming

### Color Palette (inherit from `UI_REDESIGN.md` tokens, add these landing-specific ones)

```css
/* Landing page extras — add to globals.css or a <style> block in the layout */
--landing-hero-bg: #FFF8ED;          /* warm parchment for hero */
--landing-ink: #1A1917;
--landing-amber: #D97706;
--landing-amber-light: #FEF3C7;
--landing-green: #16A34A;
--landing-red: #DC2626;
--landing-section-alt: #F7F5F0;     /* alternating section bg */

/* Dark mode equivalents */
.dark {
  --landing-hero-bg: #141210;
  --landing-section-alt: #1E1C1A;
}
```

### Typography

- **Fraunces** — all section headings, hero headline, "coming soon" titles
- **DM Sans** — all body text, nav, CTAs
- **DM Mono** — accent uses only: letter-box decorations, stat numbers

---

## Page Structure

Build the page in exactly this order. Each section is a separate component file.

---

### 1. `<Navbar />`

A sticky top navbar, `64px` tall, with a very subtle `backdrop-filter: blur(12px)` background (`--bg-surface` at 80% opacity) that appears only after scrolling past `60px` (use a Framer Motion scroll-based opacity transition for this).

**Left**: Logo — the word **"next"** in DM Mono 500 + **"spelling"** in Fraunces 600 italic, side by side, no space, `--landing-amber` accent on "next". Size `1.25rem`.

**Right**: 
- Nav links: "Features", "Coming Soon", "About" — DM Sans 500, `--text-secondary`, hover → `--text-primary` with a `2px` amber underline that slides in from left on hover (Framer Motion `layoutId` underline trick or a simple CSS `scaleX` transition)
- **Theme toggle button** — this is important, see §Theme Toggle spec below
- CTA: "Try it free →" — amber filled button, `DM Sans 500`, `10px 18px` padding, `8px` radius

**Mobile**: Hamburger that opens a full-screen menu with staggered link entries (Framer Motion `staggerChildren`).

---

### 2. `<Hero />`

This is the centerpiece. Give it everything.

**Layout**: Full viewport height (`100dvh`), background `--landing-hero-bg`. Two columns on desktop: left column is the text content, right column is the interactive illustration.

**Left column — text:**

- Eyebrow label: `"✦ Spelling, reimagined"` — DM Sans 500, `--text-xs`, uppercase, letter-spacing wide, amber color, with a small pulsing dot before it
- Headline: Three lines, Fraunces 300 at `clamp(3rem, 7vw, 5.5rem)`, line-height `1.1`:
  ```
  Learn every
  word like a
  *champion.*
  ```
  The word *"champion."* should be Fraunces 600 italic, and it should have an animated wavy underline drawn in SVG using Framer Motion `pathLength` — the line draws itself on page load over `800ms`.
- Subheading: DM Sans 400, `1.125rem`, `--text-secondary`, max-width `420px`, line-height `1.7`:
  ```
  "NextSpelling gives kids definitions and challenges them to spell the word — 
  one letter at a time. It's spelling practice that actually sticks."
  ```
- CTA row: "Start Spelling →" (primary amber button, large: `14px 32px`) + "See how it works ↓" (ghost, same size). Gap `16px`. Both animate in with a staggered fade-up.

**Right column — illustration:**

Build this entirely with inline SVG + Framer Motion. Create a visual of **4–5 floating letter boxes** (styled exactly like the app's letter boxes from `UI_REDESIGN.md`: `52×60px`, warm border, DM Mono font inside) arranged loosely in a slight arc. Each box contains a letter from a word — use "BRAVE" or "SPARK".

- The boxes float with a gentle `y` oscillation, each with a different phase offset (use `useAnimatePresence` + `motion.div` with `animate={{ y: [0, -8, 0] }}` and different `duration` values between `2.5s–3.5s`)
- One box is highlighted green (correct state from `UI_REDESIGN.md`)
- One box is in the focused state (amber ring)
- Behind the boxes, scatter these decorative elements — all SVG, all animated:
  - 3–4 large soft circles (`opacity: 0.07`, `--landing-amber` fill) of varying sizes, slowly rotating or drifting
  - A few small star/asterisk shapes (`✦`) in amber and green, floating up slowly
  - A subtle grid of dots in the background (`opacity: 0.04`)

The whole right column should feel like a living, breathing preview of the app.

**Bottom of hero**: A subtle scroll indicator — animated bouncing chevron or dot + "Scroll to explore" in `--text-muted`, centered.

**Hero entrance animation sequence** (Framer Motion, staggered):
1. Eyebrow fades up (delay 0)
2. Headline lines fade up one by one (delay 0.1, 0.2, 0.3)
3. SVG underline draws (delay 0.5)
4. Subheading fades up (delay 0.4)
5. CTA row fades up (delay 0.55)
6. Right column illustration fades in + slides from right (delay 0.2)
7. Floating letter boxes begin their oscillation loops

---

### 3. `<HowItWorks />`

Background: `--landing-section-alt`. A simple, elegant 3-step process section.

**Heading**: "How it works" — Fraunces 600, `--text-3xl`, centered, with a small decorative line below it (amber, `40px` wide, `3px` tall, centered, `12px` below heading).

Three steps, displayed as a horizontal row on desktop (stacked on mobile), each with:
- A large step number: Fraunces 300 at `5rem`, `--landing-amber` at `opacity: 0.15` (giant ghost number in background)
- An icon (Lucide) at `40px` with an amber square background (`--landing-amber-light`), `10px` radius
- Step title: Fraunces 600, `--text-xl`
- Description: DM Sans 400, `--text-base`, `--text-secondary`

**Steps:**
1. 📚 **Choose your category** — "Pick from a curated set of word categories — from animals to science. Each session is focused and purposeful."
2. 📖 **Read the definition** — "You'll see a definition. No word shown, no clues — just the meaning. Your job is to figure out the spelling."
3. ✏️ **Spell it out** — "Type each letter into individual boxes. Get instant feedback on every keystroke. Build real muscle memory."

Between steps on desktop, render a dashed arrow SVG that draws in on scroll using Framer Motion `whileInView` + `pathLength`.

Each step card animates in on scroll: `whileInView={{ opacity: 1, y: 0 }}` from `{ opacity: 0, y: 40 }`, staggered `0.15s`.

---

### 4. `<Features />`

Background: `--landing-hero-bg` (alternates back). This is the most content-dense section — give it a bold asymmetric layout.

**Heading**: "Everything you need to actually learn" — Fraunces 300, large, left-aligned, with a Fraunces 600 italic "actually" for emphasis.

**Feature grid**: A bento-box style grid — 2 large cards on the left column, 3 smaller cards on the right column on desktop.

Build each as a `<FeatureCard>` component with:
- Background: `--bg-surface`, border `1px solid var(--border)`, `12px` radius
- Hover: `translateY(-4px)` + stronger border color — Framer Motion `whileHover`
- An icon (Lucide, `28px`) with an amber or green tinted square background
- Title: Fraunces 600, `--text-xl`
- Description: DM Sans 400, `--text-base`, `--text-secondary`

**Features to list:**

| # | Icon | Title | Description |
|---|---|---|---|
| 1 | `BookOpen` | **Definition-first spelling** | Instead of seeing the word and memorizing it, you get the definition and reconstruct it. This is active recall — the most effective memory technique known. |
| 2 | `LayoutGrid` | **Curated word categories** | Sessions are organized by category — Animals, Science, Geography, and more. Stay focused, build vocabulary in context, never get lost in a sea of random words. |
| 3 | `Timer` | **Timed sessions** | Set a time limit and race the clock. The pressure sharpens focus and builds the kind of spelling speed that matters in the real world. |
| 4 | `Keyboard` | **Letter-by-letter input** | Each letter gets its own box. You can't skip ahead or paste. This forces deliberate, character-by-character thinking — and makes the feedback immediate. |
| 5 | `Sun` / `Moon` | **Light & dark mode** | Switch between a warm light theme and a deep dark theme. Both feel premium and are easy on the eyes for long sessions. |
| 6 | `Zap` | **Instant feedback** | Every letter you type is evaluated immediately. Green means correct, red means try again. No waiting, no guessing — just pure, clear signal. |

Large cards (1 and 2) should have a subtle decorative background element — a large ghost letter (e.g. "A", "Z") in Fraunces at `opacity: 0.04`, `font-size: 8rem`, positioned in the bottom-right corner of the card.

Animate cards in on scroll with `whileInView`, staggered.

---

### 5. `<ComingSoon />`

Background: `--landing-section-alt`. Use a dark "spotlight" aesthetic — a dark-ish card container (`--bg-surface`) centered on the alternating bg, with a subtle radial gradient highlight from the top center (amber glow, very subtle).

**Eyebrow**: `"✦ What's next"` — same style as hero eyebrow

**Heading**: "The next chapter" — Fraunces 600, `--text-3xl`, centered

**Subheading**: "We're building features that take NextSpelling from good to essential." — centered, `--text-secondary`

Three feature cards in a row (or stacked on mobile), each with a `--bg-elevated` background, dashed border in `--border-strong`, `12px` radius, `28px` padding. Add a small "Coming Soon" pill badge (amber outline, `--text-xs`) in the top-right corner of each card.

**Items:**

---

**1. Deep Dive Analytics**
*Icon*: `BarChart3` (Lucide)
*Title*: "Deep Dive Analytics"
*Description*: "A full performance dashboard showing your accuracy over time, most-missed words, category strengths and weaknesses, session streaks, and vocabulary growth curves. Know exactly where to focus next."

---

**2. Family Command Center**
*Icon*: `Users` (Lucide)
*Title*: "Family Command Center"
*Description*: "Parents get a dedicated dashboard to track their child's progress, set daily goals, restrict categories by age-appropriateness, and receive weekly summary reports — all without interrupting the learning flow."

---

**3. Expanded Lexicon**
*Icon*: `Library` (Lucide)
*Title*: "Expanded Lexicon"
*Description*: "A massively enlarged word library spanning advanced academic vocabulary, subject-specific terminology, and age-tiered word sets — from early learners to competitive spellers preparing for national events."

---

Cards animate in with `whileInView`, stagger `0.2s`. On hover, the dashed border transitions to a solid amber border over `200ms`.

---

### 6. `<AboutSection />`

Background: `--landing-hero-bg`. A personal, warm section — not corporate.

**Layout**: Two columns. Left: text. Right: a decorative card that looks like a stylized "developer card" — not a photo, but a beautiful typographic card with the name, a title, and some details.

**Left column:**

Eyebrow: `"✦ Why I built this"`

Heading: Fraunces 300, `--text-3xl`, something like:
```
"I wanted my students 
to actually enjoy 
learning to spell."
```
(Fraunces 600 italic on "actually enjoy")

Body: DM Sans 400, `--text-base`, `--text-secondary`, 2 short paragraphs:

> "Most spelling tools are either boring flashcard apps or chaotic games. I wanted something in between — focused, calm, and rewarding. Something that respects both the child's intelligence and their attention span.

> NextSpelling started as a weekend project and grew into something I'm genuinely proud of. It's still growing."

**Right column — "Developer Card":**

A beautifully styled card (`--bg-surface`, border `1px solid var(--border)`, `16px` radius, `32px` padding) with:
- Name in Fraunces 600, `--text-2xl`
- Title/tagline in DM Sans 400, `--text-secondary`: "Full-stack developer & educator"
- A thin amber divider (`2px`, `40px` wide)
- Social links row — see below

**Social Links** (5 total). For each, build a pill button: background `--bg-elevated`, border `1px solid var(--border)`, `999px` radius, `10px 16px` padding, flex row with icon + label. Hover: background `--bg-surface`, border-color `--border-strong`, translateY `-2px`, shadow `0 4px 12px rgba(0,0,0,0.08)`.

Use these Lucide icons and these labels:

| Platform | Icon | Label | Note |
|---|---|---|---|
| Portfolio | `Globe` | "Portfolio" | — |
| Telegram | `Send` | "Telegram" | (closest Lucide icon) |
| LinkedIn | `Linkedin` | "LinkedIn" | — |
| Instagram | `Instagram` | "Instagram" | — |
| GitHub | `Github` | "GitHub" | — |

**Important**: Do not hardcode any URLs. Instead, create a `SOCIAL_LINKS` constant at the top of the component file:
```ts
const SOCIAL_LINKS = {
  portfolio: "https://yourportfolio.com",
  telegram: "https://t.me/yourusername",
  linkedin: "https://linkedin.com/in/yourprofile",
  instagram: "https://instagram.com/yourhandle",
  github: "https://github.com/yourusername",
};
```
The developer will fill these in. Render `href={SOCIAL_LINKS.portfolio}` etc.

Social links row animates in on scroll with stagger.

---

### 7. `<Footer />`

Minimal. `--bg-base` background, `1px solid var(--border)` top border.

- Left: Logo (same as navbar)
- Center: `"© 2025 NextSpelling. Built with care."`  — `--text-muted`, `--text-sm`
- Right: Theme toggle (same component as navbar) + "Back to top ↑" ghost link

---

## Theme Toggle — Detailed Spec

This is called out separately because it needs special treatment.

Create a reusable `<ThemeToggle />` component at `app/landing/components/ThemeToggle.tsx`.

**Visual design:**
- A pill-shaped toggle: `56px × 28px`
- Track background: in light mode `--bg-elevated`, in dark mode `#1E1C1A`
- Track border: `1px solid var(--border)`
- Inside the track, show both a sun icon (`☀️` or Lucide `Sun`, `14px`) on the left and a moon icon (Lucide `Moon`, `14px`) on the right, both in `--text-muted`, with the active one shifting to `--accent` color
- A circular thumb: `22px`, white in light / `#46423D` in dark, with a tiny icon centered inside it that switches between Sun and Moon

**Framer Motion animation:**

```tsx
// The thumb slides with a spring
<motion.div
  layout
  transition={{ type: "spring", stiffness: 500, damping: 30 }}
  // position: left side in light, right side in dark
/>
```

The track background color should also animate with Framer Motion's `animate` prop:
```tsx
<motion.div
  animate={{ backgroundColor: isDark ? "#1E1C1A" : "#EFEDE8" }}
  transition={{ duration: 0.3 }}
/>
```

When toggling, all page colors transition smoothly. Achieve this by toggling the `.dark` class on `<html>` and ensuring `globals.css` has:
```css
*, *::before, *::after {
  transition: background-color 300ms ease, border-color 300ms ease, color 200ms ease;
}
```

The toggle should be wired to `next-themes` (`useTheme` hook) which should already be installed. If not, install it.

---

## Framer Motion — Global Rules

Use these patterns consistently:

```tsx
// Standard scroll-triggered entrance
const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }
};
// Use with: <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>

// Stagger container
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } }
};

// Hover lift
whileHover={{ y: -4, transition: { duration: 0.2 } }}

// Button press
whileTap={{ scale: 0.96 }}
```

Apply `viewport={{ once: true }}` on all `whileInView` animations — they should play once, not replay on scroll-back.

Use `useScroll` + `useTransform` for the navbar background opacity (transparent → blurred surface as user scrolls).

Use `AnimatePresence` for the mobile nav menu open/close.

---

## Code Quality Rules

- All components are TypeScript (`.tsx`)
- No `any` types
- All sections are separate component files imported into `page.tsx`
- `page.tsx` is clean: just imports and a return with the sections in order
- No inline styles except where Framer Motion `animate` requires it
- Tailwind for all static styles; Framer Motion for all dynamic/animated styles
- All text content is in constants at the top of each component (easy to edit)
- The page must be fully responsive: mobile (`< 768px`), tablet (`768–1024px`), desktop (`> 1024px`)
- Use `clamp()` for font sizes where noted
- `alt` text on all images, `aria-label` on all icon buttons
- The `SOCIAL_LINKS` constant must have placeholder comments so the developer knows what to replace

---

## File Structure to Create

```
app/
  landing/
    page.tsx                    ← imports all sections, no logic
    components/
      Navbar.tsx
      Hero.tsx
      HowItWorks.tsx
      Features.tsx
      ComingSoon.tsx
      AboutSection.tsx
      Footer.tsx
      ThemeToggle.tsx
      FeatureCard.tsx           ← shared card used in Features + ComingSoon
```

---

## Final Checklist Before Finishing

- [ ] Hero headline animated SVG underline draws on load
- [ ] Letter boxes in hero float with oscillation loops
- [ ] Navbar bg appears on scroll (Framer Motion scroll-based opacity)
- [ ] All section cards animate in on scroll with `whileInView`
- [ ] Theme toggle uses Framer Motion spring for thumb + color transition
- [ ] `SOCIAL_LINKS` constant present in `AboutSection.tsx` with placeholder URLs
- [ ] Mobile nav menu uses `AnimatePresence`
- [ ] Dashed arrows between HowItWorks steps draw in on scroll
- [ ] Coming Soon cards have dashed-to-solid amber border on hover
- [ ] No purple, no violet, no generic sans-serif as display font
- [ ] Dark mode tested and all tokens resolve correctly
- [ ] Page is responsive at 375px, 768px, and 1280px

---

*This is the complete spec. Build it fully. Do not ask for clarification — make reasonable decisions where anything is ambiguous and note them in a brief comment in the code.*
