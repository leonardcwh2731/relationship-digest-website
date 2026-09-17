#!/usr/bin/env node
/**
 * Generates the community landing pages from index.html.
 *
 * The three pages are the main site with one line changed: the eyebrow above
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
  { dir: 'the-bureau',      name: 'The Bureau',      eyebrow: 'For members of The Bureau',        utm: 'the-bureau' },
  { dir: 'agencyhabits',    name: 'Agency Habits',   eyebrow: 'For Agency Habits readers only',   utm: 'agency-habits' },
  { dir: 'agency-outsight', name: 'Agency Outsight', eyebrow: 'For Agency Outsight readers only', utm: 'agency-outsight' },
  { dir: 'surge',           name: 'Surge',           eyebrow: 'For clients of Surge only',        utm: 'surge' },
];

const MAIN_EYEBROW = 'For digital, creative, design and marketing agencies';

function generate(src, page) {
  let s = src;

  s = s.replace(
    '<title>VeraOps &middot; Win new work from relationships already in your inbox</title>',
    `<title>VeraOps &middot; ${page.name}</title>`);

  s = s.replace(/<meta name="description" content="[^"]*">/,
    `<meta name="description" content="VeraOps for ${page.name}. Every weekday we send three past relationships worth reconnecting with, plus the context and an email ready to send.">`);

  // Shared by link, so keep these out of search results.
  if (!s.includes('name="robots"')) {
    s = s.replace('<link rel="preconnect"',
      '<meta name="robots" content="noindex, nofollow">\n<link rel="preconnect"');
  }

  // The one line of copy that differs.
  const eyebrow = `<p class="hero-eyebrow hero-anim">${MAIN_EYEBROW}</p>`;
  if (!s.includes(eyebrow)) {
    throw new Error(`index.html: hero eyebrow not found — update MAIN_EYEBROW in build-pages.js`);
  }
  s = s.replace(eyebrow, `<p class="hero-eyebrow hero-anim">${page.eyebrow}</p>`);

  // Tag bookings so the calendar shows which community they came from.
  const booking = `${CAL}?utm_source=${page.utm}&amp;utm_medium=landing&amp;utm_campaign=${page.utm}`;
  s = s.split(`href="${CAL}"`).join(`href="${booking}"`);

  // These pages live one level down, so same-origin paths must be absolute.
  s = s.replace(/src="assets\//g, 'src="/assets/');
  s = s.replace(/src="([a-z0-9-]+\.(?:png|jpe?g))"/g, 'src="/$1"');
  s = s.replace(/href="(privacy-policy|terms-of-service)\.html"/g, 'href="/$1.html"');

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
