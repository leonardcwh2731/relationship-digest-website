# VeraOps — Brand & Design Guide

**Source of truth:** `digest.veraops.com` (`index.html`). Everything below is
transcribed from the live page, not aspirational.

**Design language name:** *paper-and-ink* — an editorial, printed-newsletter feel.
Warm off-white paper, true black ink, a single amber accent used sparingly.
Serif for anything that speaks; sans for anything that labels.

---

## 1. Color

### Core palette

| Role | Name | Hex | Where it's used |
|---|---|---|---|
| Background | Paper | `#F3F8EA` | The default page background. Warm, slightly green off-white. **Not white.** |
| Background alt | Paper 2 | `#EAF0DC` | Sunken stripes, pills, badges, alternating bands |
| Surface | Surface | `#FFFFFF` | Cards sitting on top of paper |
| Surface tint | Surface Ink | `#F8FBF1` | Subtle raised panels |
| Text | Ink | `#000000` | Headlines, body, primary buttons |
| Text | Ink 2 | `#2B2B2B` | Secondary body copy |
| Text | Ink 3 | `#6B6B6B` | Captions, eyebrows, muted labels |
| Text | Ink 4 | `#A8A8A8` | Disabled, large decorative numerals |
| Line | Hairline | `#DCE3CD` | Card borders, dividers |
| Line | Hairline 2 | `#C5CFB1` | Emphasized borders |

### Accent — use sparingly

| Name | Hex | Notes |
|---|---|---|
| Spark | `#E5A83D` | The **only** accent. Amber/gold. |
| Spark Deep | `#B7811F` | Text-on-light version of spark |
| Spark Soft | `#F4D89A` | Highlight fills |
| Spark Paper | `#FBF1D8` | Tinted callout backgrounds |

> **Discipline rule:** spark appears ~14 times across a very long page. It marks
> the single most important thing in a view — never a decoration, never a second
> accent. If a slide has two amber elements, one of them is wrong.

### Dark sections

Dark bands use **true ink `#1A1A1A`**, not a dark green. Text on dark is paper `#F3F8EA`.

### What this palette is *not*

Earlier versions used an olive-green brand (`#3D4F1E`). **That is retired.** Primary
buttons are now black, not olive. If you see olive in an old asset, it's stale.

---

## 2. Typography

### Families

| Role | Font | Fallbacks |
|---|---|---|
| Display / headlines | **Newsreader** | Source Serif 4, Georgia, serif |
| Body / UI | **Geist** | ui-sans-serif, system-ui, -apple-system, Segoe UI |
| Mono / data | **Geist Mono** | ui-monospace, SF Mono, Menlo |

All three are free. Newsreader and Geist are on Google Fonts.
For a deck: if Geist isn't available in your tool, **Inter** is the closest
substitute. For Newsreader, substitute **Source Serif 4**, then Georgia.

### The core rule

> **Serif (Newsreader) for statements. Sans (Geist) for labels.**

Headlines, pull-quotes, prices, big numbers, card titles → Newsreader.
Eyebrows, nav, body paragraphs, buttons, captions → Geist.

### Scale (as used on the live page)

| Level | Font | Size | Weight |
|---|---|---|---|
| Hero headline | Newsreader | 56 → 96px | 500 |
| Section headline | Newsreader | 40 → 72px | 500 |
| Sub-headline | Newsreader | 32 → 48px | 500 |
| Large stat / price | Newsreader | 44px | 500 |
| Card title (large) | Newsreader | 24 → 30px | 600 |
| Card title | Newsreader | 20–22px | 500–700 |
| Body | Geist | 16px / 1.6 | 400 |
| Small body | Geist | 14px | 400 |
| Eyebrow / label | Geist | 12px, `0.16em` tracking, UPPERCASE | 500 |

Headline weight is **500, not 700.** Newsreader at 500 large is the signature
look — bold serif headlines read as a different, heavier brand.

Body copy is 16px at 1.6 line-height. Headlines run tight: ~1.05–1.15.

---

## 3. Layout & spacing

| Token | Value |
|---|---|
| Max content width | 1200px |
| Section vertical padding | 120px |
| Horizontal padding | 32px |
| Corner radius | 10px |

Generous vertical rhythm is part of the identity — sections breathe. When in
doubt, add space rather than tighten.

---

## 4. Components

### Nav — floating pill
Fixed, centered, `border-radius: 999px`, translucent paper background
(`rgba(243,248,234,0.55)`) with a 20px backdrop blur and a soft shadow.
Wordmark is Newsreader 20px/500.

### Buttons
Primary = **black fill, white text**, 10px radius. Not olive, not amber.
Ghost = transparent with a hairline border.

### Cards
White surface on paper background, 1px hairline border (`#DCE3CD`), 10px radius.
Lift on hover: small shadow + 2px rise.

### Pull-quote
Oversized Newsreader on a Paper-2 band. This is the page's rhetorical device —
used to break up long stretches and land one idea.

---

## 5. Motion

Restrained and editorial, never bouncy.

- Fade + 20px rise on scroll-in, ~300–500ms ease
- Staggered card reveals, ~80ms apart
- Hover transitions 150–200ms
- Full `prefers-reduced-motion` support

For a deck: simple fades and rises. No slides, spins, or zooms.

---

## 6. Voice of the design, in one paragraph

It should feel like a well-set print newsletter that happens to be on a screen:
warm paper, black ink, big confident serif headlines at medium weight, plenty of
white space, hairline rules instead of heavy boxes, and exactly one amber accent
that shows up only when something genuinely matters.

---

## 7. Assets

Logo mark: `assets/logo-mark.png`
Badge: `assets/bureau-badge.png`

---

## Appendix — copy-paste tokens

```css
--paper:       #F3F8EA;
--paper-2:     #EAF0DC;
--surface:     #FFFFFF;
--surface-ink: #F8FBF1;
--ink:         #000000;
--ink-2:       #2B2B2B;
--ink-3:       #6B6B6B;
--ink-4:       #A8A8A8;
--hairline:    #DCE3CD;
--hairline-2:  #C5CFB1;
--spark:       #E5A83D;
--spark-deep:  #B7811F;
--spark-soft:  #F4D89A;
--spark-paper: #FBF1D8;

--font-display: 'Newsreader', 'Source Serif 4', Georgia, serif;
--font-sans:    'Geist', ui-sans-serif, system-ui, sans-serif;
--font-mono:    'Geist Mono', ui-monospace, Menlo, monospace;

--max-w: 1200px;
--pad-v: 120px;
--pad-h: 32px;
--radius: 10px;
```
