#!/usr/bin/env node
/**
 * Generates the community landing pages from index.html.
 *
 * The pages are the main site with one line changed: the eyebrow above
 * the headline. Everything else — sections, copy, styles, scripts — comes
 * from index.html, so editing the main page is the only thing needed to keep
 * them current. A pre-commit hook runs this, so they cannot drift.
 *
 *   node build-pages.js          regenerate
 *   node build-pages.js --check  fail if any page is stale (used by the hook)
 */
const fs = require('fs');
const path = require('path');

const CAL = 'https://cal.com/leonard-veraops/veraops-discovery';

// Everything that differs between the pages lives here.
const PAGES = [
  { dir: 'the-bureau',      name: 'The Bureau',      eyebrow: null,                               utm: 'the-bureau', badge: 'bureau' },
  { dir: 'agencyhabits',    name: 'Agency Habits',   eyebrow: 'For Agency Habits readers only',   utm: 'agency-habits' },
  { dir: 'agency-outsight', name: 'Agency Outsight', eyebrow: 'For Agency Outsight readers only', utm: 'agency-outsight' },
  { dir: 'surge',           name: 'Surge',           eyebrow: 'For clients of Surge only',        utm: 'surge' },
  { dir: 'team-bubbly',     name: 'Team Bubbly',     eyebrow: 'For friends of Team Bubbly',       utm: 'team-bubbly' },
  { dir: 'mark-depace',     name: 'Mark DePace',     eyebrow: 'For friends of Mark DePace',       utm: 'mark-depace' },
  { dir: 'sharon-toerek',   name: 'Sharon Toerek',   eyebrow: 'For network of Sharon Toerek and Toerek Law only', utm: 'sharon-toerek' },
  { dir: 'drew-mclellan',   name: 'Drew McLellan',   eyebrow: 'For network of Drew McLellan and Agency Management Institute only', utm: 'drew-mclellan' },
];

const MAIN_EYEBROW = 'For founders of creative studios';
const MAIN_TITLE = '<title>VeraOps &middot; Conversations months before the brief</title>';

function generate(src, page) {
  let s = src;

  if (!s.includes(MAIN_TITLE)) {
    throw new Error('index.html: <title> not found — update MAIN_TITLE in build-pages.js');
  }
  s = s.replace(MAIN_TITLE, `<title>VeraOps &middot; ${page.name}</title>`);

  s = s.replace(/<meta name="description" content="[^"]*">/,
    `<meta name="description" content="VeraOps for ${page.name}. We help studio founders turn 10+ years of relationships into conversations that start months before the brief.">`);

  // Shared by link, so keep these out of search results.
  if (!s.includes('name="robots"')) {
    s = s.replace('<link rel="preconnect"',
      '<meta name="robots" content="noindex, nofollow">\n<link rel="preconnect"');
  }

  // The one line of copy that differs. A null eyebrow drops the line entirely,
  // for pages whose badge already names the audience.
  const eyebrow = `<p class="eyebrow">${MAIN_EYEBROW}</p>`;
  if (!s.includes(eyebrow)) {
    throw new Error(`index.html: hero eyebrow not found — update MAIN_EYEBROW in build-pages.js`);
  }
  s = page.eyebrow
    ? s.replace(eyebrow, `<p class="eyebrow">${page.eyebrow}</p>`)
    : s.replace(new RegExp('[ \\t]*' + eyebrow.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\n'), '');

  // Tag bookings so the calendar shows which community they came from.
  const booking = `${CAL}?utm_source=${page.utm}&amp;utm_medium=landing&amp;utm_campaign=${page.utm}`;
  s = s.split(`href="${CAL}"`).join(`href="${booking}"`);

  // The Bureau page carries their badge above the headline.
  if (page.badge === 'bureau') {
    const anchorTag = page.eyebrow
      ? `<p class="eyebrow">${page.eyebrow}</p>`
      : '<h1 class="display">';
    s = s.replace(anchorTag,
      `<div class="hero-badge">
      <img src="/assets/BureauBadges_Horiz-01.webp" alt="Proud Member of the Flock &middot; The Bureau">
    </div>\n    ` + anchorTag);
    s = s.replace('</head>', `<style>
/* The Bureau page only: their badge above the headline. The badge ships on
   cream, so it sits on its own rounded tile against the dark hero. */
.hero-badge { display: inline-block; margin-bottom: 32px; }
.hero-badge img { height: 96px; width: auto; display: block; border-radius: 8px; }
@media (max-width: 600px) { .hero-badge img { height: 68px; } }
</style>
</head>`);
  }

  // These pages live one level down, so same-origin relative paths must be
  // absolute. (The rebuilt pages already use absolute paths; the footer,
  // kept unchanged from the previous site, still uses relative ones.)
  s = s.replace(/src="assets\//g, 'src="/assets/');
  s = s.replace(/href="assets\//g, 'href="/assets/');
  s = s.replace(/src="([a-z0-9-]+\.(?:png|jpe?g))"/g, 'src="/$1"');
  s = s.replace(/href="(privacy-policy|terms-of-service|data-handling-policy)\.html"/g, 'href="/$1.html"');

  return s;
}

const src = fs.readFileSync('index.html', 'utf8');
const check = process.argv.includes('--check');
let stale = [];

for (const page of PAGES) {
  const out = path.join(page.dir, 'index.html');
  const next = generate(src, page);
  const prev = fs.existsSync(out) ? fs.readFileSync(out, 'utf8') : null;

  if (next === prev) {
    if (!check) console.log(`  ${out.padEnd(28)} up to date`);
    continue;
  }
  if (check) { stale.push(out); continue; }

  fs.mkdirSync(page.dir, { recursive: true });
  fs.writeFileSync(out, next);
  console.log(`  ${out.padEnd(28)} regenerated`);
}

if (check && stale.length) {
  console.error('\nThese pages are out of date with index.html:');
  stale.forEach(f => console.error(`  ${f}`));
  console.error('\nRun `node build-pages.js` and stage the result.\n');
  process.exit(1);
}
