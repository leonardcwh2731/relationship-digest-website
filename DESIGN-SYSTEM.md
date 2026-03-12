# Design System — VeraOps Landing Pages

## Font

- **Primary:** `Inter` (Google Fonts) — weights: 400, 500, 600, 700
- **Serif/Display:** `Georgia, 'Times New Roman', serif`
- **System fallback:** `system-ui, sans-serif`
- **Import:** `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap`

## Base Typography

| Element | Font | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| Body | Inter | 17px | 400 | 1.65 | — |
| Hero headline | Georgia | clamp(38px, 5vw, 60px) | 700 | 1.15 | -0.02em |
| Section headline | Inter | clamp(26px, 3.5vw, 34px) | 700 | 1.2 | -0.02em |
| CTA headline | Georgia | clamp(30px, 4vw, 46px) | 700 | 1.2 | -0.02em |
| Section label | Inter | 11px | 700 | — | 0.12em, uppercase |
| Card title | Inter | 17–20px | 700 | 1.2–1.3 | — |
| Card body | Inter | 14–15px | 400 | 1.55–1.7 | — |
| Nav wordmark | Inter | 28px | 700 | — | — |
| Price amount | Georgia | clamp(34px, 4vw, 46px) | 700 | 1 | -0.02em |

## Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--black` | `#000000` | Primary text, dark backgrounds |
| `--white` | `#FFFFFF` | Page background, card backgrounds |
| `--sage` | `#F3F8EA` | Light green tint — section backgrounds, accents |
| `--muted` | `#666666` | Secondary text, labels |
| `--olive-deep` | `#3D4F1E` | Primary brand — buttons, CTA, accent elements |
| `--digest-bg` | `#1E2B14` | Dark green — dark card backgrounds |
| Hover dark | `#2E3B17` | Button hover state (olive-deep darker) |
| Sage mid | `#D6E8B8` | Hover accent, shimmer gradient |
| Sage gradient | `#E8F0DA` | Hero/section gradient midpoint |
| Sage gradient light | `#F0F5E6` | Hero gradient 75% stop |
| Scan line | `#B8CC88` | Scan-line animation accent |
| Card border | `#EBEBEB` | Light card borders |
| Card border green | `#DDE8C8` | Pricing card border (onetime) |
| Text dark | `#333` | Dark body text in cards |
| Text mid | `#444` | Card description text |
| Text soft | `#555` | Subtitle text |
| Footer border | `#1A1A1A` | Footer top border |
| Footer text | `#333` | Copyright text |

## Spacing & Layout

| Token | Value |
|---|---|
| `--max-w` | 1100px |
| `--pad-v` | 90px (60px @ 768px, 40px @ 480px) |
| `--pad-h` | 40px (24px @ 768px, 18px @ 480px) |
| `--radius` | 6px |

## Container

```css
.container {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 40px;
}
```

## Buttons

### Primary (`.btn-sage`)
- Background: `#3D4F1E` → hover `#2E3B17`
- Color: white
- Padding: `10px 22px` (nav) / `13px 26px` (hero) / `16px 36px` (CTA)
- Border-radius: 6px
- Font: 14–16px, weight 700
- Transition: `background 150ms ease`
- Includes ripple effect on click (white 30% opacity expanding circle)

### Ghost (`.btn-ghost`)
- Background: transparent
- Border: 1.5px solid `rgba(0,0,0,0.25)` → hover solid black
- Color: black

### Price CTA (dark card)
- Background: `#F3F8EA` → hover `#D6E8B8`
- Color: black
- Same padding/radius as primary

## Cards

### Standard card pattern
- Border: `1.5px solid #EBEBEB`
- Border-radius: 6px
- Padding: `36px 32px` (desktop) / `24px 20px` (mobile)
- Hover: `box-shadow: 0 8px 32px rgba(0,0,0,0.08–0.12)`, `translateY(-2px)`
- Transition: `box-shadow 200ms ease, transform 200ms ease`

### Dark card (digest/quarterly)
- Background: `#1E2B14` or `#3D4F1E`
- Text: white/sage
- No border

## Section Background Pattern

Sections alternate between:
1. `var(--white)` — plain white
2. `var(--sage)` — plain sage `#F3F8EA`
3. Animated gradient — `linear-gradient(135deg, ...)` with `background-size: 300% 300%` and `gradientShift 20s ease infinite`

### Gradient transition bleeds between sections
```css
&::before {
  height: 40px;
  top: -40px;
  background: linear-gradient(to bottom, var(--sage), var(--white));
}
```

## Grid Patterns

| Layout | Columns | Gap |
|---|---|---|
| Hero | `1fr 1fr` | 64px |
| Deliverables | `1fr 1fr` | 24px |
| Pricing | `1fr 1fr` | 24px |
| Signals/Who | `1fr 1fr` | 20px |
| Why cards | `repeat(3, 1fr)` | 24px |
| Compare | `1fr auto 1fr` | 0 |

## Animations

### Fade in (scroll-triggered)
```css
opacity: 0; transform: translateY(20px);
→ opacity: 1; transform: translateY(0);
transition: 300ms ease;
```

### Stagger in (cards)
```css
opacity: 0; transform: translateY(30px);
→ visible: opacity: 1; transform: translateY(0);
transition: 500ms ease;
/* Each card gets stagger delay: index * 80ms */
```

### Text reveal (word-by-word)
```css
display: inline-block; opacity: 0; transform: translateY(100%);
→ visible: opacity: 1; translateY(0);
transition: 400ms ease; /* stagger: index * 50ms */
```

### Button ripple
White 30% opacity circle, `scale(0)` → `scale(4)` + fade, 600ms

### Scan line
2px horizontal gradient line sweeps top→bottom over card, 800ms

### Animated gradient backgrounds
`background-size: 400% 400%`, shifts position over 15–20s

### Scroll progress bar
Fixed top, 3px height, `var(--olive-deep)`, width tracks scroll %

### Section nav dots
Fixed right side, 8px circles, active = `scale(1.5)` + pulse shadow animation

### Border shimmer (featured card)
2px top gradient line, `background-size: 200% 100%`, slides 3s infinite

### 3D tilt on cards
`perspective: 800px`, `transform-style: preserve-3d`, mousemove-driven `rotateX/rotateY` (max ~4deg), 0.05 lerp smoothing

## Responsive Breakpoints

| Breakpoint | Changes |
|---|---|
| `900px` | Compare → single column, Why → 2 columns, section dots hidden |
| `768px` | All grids → single column, hero visual hidden, hero headline scales up to `clamp(56px, 14vw, 96px)`, sticky CTA hidden, reduced padding |
| `480px` | Minimum padding, smaller font sizes, footer stacks vertically |

## Accessibility

```css
@media (prefers-reduced-motion: reduce) {
  /* All animations: duration 0.01ms, iteration 1 */
  /* Particle canvas hidden */
  /* All reveal elements: opacity 1, transform none */
}
```

## Interactive Elements (JS-driven)

- **Intersection Observer** for fade-in, stagger, text-reveal, scan-line triggers
- **Scroll listener** for nav shadow, progress bar, sticky CTA bar, section dot tracking
- **Mousemove** on cards for 3D tilt effect
- **Counter animation** in hero (counts up to target number)
- **Compare card animation** dims digest card, highlights audit card on scroll
- **Checkmark SVG draw** via `stroke-dashoffset` transition on scroll visibility

## Nav

- Fixed top, `z-index: 100`
- Background: sage
- Shadow on scroll: `0 1px 12px rgba(0,0,0,0.08)`
- Inner: flex, space-between, `padding: 20px 0`

## Footer

- Background: black
- Padding: `32px`
- Flex, space-between
- Brand: 13px, weight 700, `letter-spacing: 0.08em`, uppercase, `rgba(243,248,234,0.4)`
- Copyright: 12px, `#333`
