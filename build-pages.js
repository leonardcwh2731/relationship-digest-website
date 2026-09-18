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
  { dir: 'the-bureau',      name: 'The Bureau',      eyebrow: null,                               utm: 'the-bureau', badge: 'bureau', rate: 'Bureau members' },
  { dir: 'agencyhabits',    name: 'Agency Habits',   eyebrow: 'For Agency Habits readers only',   utm: 'agency-habits', rate: 'Agency Habits readers' },
  { dir: 'agency-outsight', name: 'Agency Outsight', eyebrow: 'For Agency Outsight readers only', utm: 'agency-outsight', rate: 'Agency Outsight readers' },
  { dir: 'surge',           name: 'Surge',           eyebrow: 'For clients of Surge only',        utm: 'surge', rate: 'Surge clients' },
  { dir: 'team-bubbly',     name: 'Team Bubbly',     eyebrow: 'For friends of Team Bubbly',       utm: 'team-bubbly', rate: 'Team Bubbly\u2019s network' },
  { dir: 'mark-depace',     name: 'Mark DePace',     eyebrow: 'For friends of Mark DePace',       utm: 'mark-depace', rate: 'Mark DePace\u2019s network' },
];

const MAIN_EYEBROW = 'For digital, creative, design and marketing agencies';

function generate(src, page) {
  let s = src;

  s = s.replace(
    '<title>VeraOps &middot; Win new work from relationships already in your inbox</title>',
    `<title>VeraOps &middot; ${page.name}</title>`);

  s = s.replace(/<meta name="description" content="[^"]*">/,
    `<meta name="description" content="VeraOps for ${page.name}. Every day we send three past relationships worth reconnecting with, plus the context and an email ready to send.">`);

  // Shared by link, so keep these out of search results.
  if (!s.includes('name="robots"')) {
    s = s.replace('<link rel="preconnect"',
      '<meta name="robots" content="noindex, nofollow">\n<link rel="preconnect"');
  }

  // The one line of copy that differs. A null eyebrow drops the line entirely,
  // for pages whose badge already names the audience.
  const eyebrow = `<p class="hero-eyebrow hero-anim">${MAIN_EYEBROW}</p>`;
  if (!s.includes(eyebrow)) {
    throw new Error(`index.html: hero eyebrow not found — update MAIN_EYEBROW in build-pages.js`);
  }
  s = page.eyebrow
    ? s.replace(eyebrow, `<p class="hero-eyebrow hero-anim">${page.eyebrow}</p>`)
    : s.replace(new RegExp('[ \\t]*' + eyebrow.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\n'), '');

  // Tag bookings so the calendar shows which community they came from.
  const booking = `${CAL}?utm_source=${page.utm}&amp;utm_medium=landing&amp;utm_campaign=${page.utm}`;
  s = s.split(`href="${CAL}"`).join(`href="${booking}"`);

  // The Bureau page carries their badge above the eyebrow, and moves the logo
  // strip out of the hero so the hero ends on the CTA's subtext.
  if (page.badge === 'bureau') {
    const anchorTag = page.eyebrow
      ? `<p class="hero-eyebrow hero-anim">${page.eyebrow}</p>`
      : '<h1 class="hero-headline hero-anim">';
    s = s.replace(anchorTag,
      `<div class="hero-badge hero-anim">
        <img src="/assets/BureauBadges_Horiz-01.webp" alt="Proud Member of the Flock &middot; The Bureau">
      </div>\n      ` + anchorTag);

    // Lift the marquee out of .hero-stack into its own band under the hero.
    // Matched by brace-counting, not a lazy regex: the marquee nests a track
    // and its figures, so a non-greedy match closes on the wrong </div>.
    const open = s.indexOf('<div class="agency-marquee hero-marquee hero-anim">');
    if (open !== -1) {
      let i = open, depth = 0, end = -1;
      while (i < s.length) {
        if (s.startsWith('<div', i)) depth++;
        else if (s.startsWith('</div>', i)) { depth--; if (depth === 0) { end = i + 6; break; } }
        i++;
      }
      if (end !== -1) {
        let lineStart = s.lastIndexOf('\n', open) + 1;
        const block = s.slice(lineStart, end) + '\n';
        s = s.slice(0, lineStart) + s.slice(end + 1);
        const digestTag = '<section class="section-white" id="digest">';
        if (!s.includes(digestTag)) throw new Error('build-pages: digest section anchor not found');
        s = s.replace(digestTag,
          `<section class="section-white logo-band">\n${block.replace('hero-marquee', 'band-marquee')}</section>\n\n${digestTag}`);
      }
    }

    s = s.replace('</style>', `
/* The Bureau page only: their badge above the eyebrow, and the logo strip
   as its own band so the hero ends on the CTA subtext. */
.hero-badge { display: inline-block; margin-bottom: 26px; }
.hero-badge img { height: 104px; width: auto; display: block;
  /* The badge ships on cream; multiply drops that tile so only the mark
     and type sit on the white hero. */
  mix-blend-mode: multiply; }
.logo-band { padding: 52px 0 72px; }
/* section + section draws a rule between consecutive sections. The band is
   part of the hero visually, so neither it nor the section after it should
   pick one up — that keeps this page identical to the main one. */
.logo-band, .logo-band + section { border-top: none; }
/* The strip sits in its own section here, so the hero's bottom padding would
   stack on top of it. Zeroing it keeps the gap identical to the other pages,
   where the marquee sits inside the hero with a 52px margin. */
.hero-redesign { padding-bottom: 0; }
.band-marquee { margin-top: 0; }
@media (max-width: 600px) { .hero-badge img { height: 72px; } }
</style>`);
  }

  // Network rate: these pages keep the $5,000 annual price the main site no
  // longer offers, and the badge names who it is for so the discount reads as
  // deliberate rather than an inconsistency.
  if (page.rate) {
    const mainAnnual = "annual:    { price: '$6,000', unit: '/ year',    line: 'Billed yearly',                                badge: '' },";
    if (!s.includes(mainAnnual)) throw new Error('build-pages: annual plan line not found');
    s = s.replace(mainAnnual,
      "annual:    { price: '$5,000', unit: '/ year',    line: '~$417/month \\u00b7 billed yearly',              badge: 'Save $1,000 \\u00b7 " + page.rate + " only' },");
    s = s.replace('<p>$500 monthly or $6,000 yearly. Same service on either term. No setup fee.</p>',
      '<p>$500 monthly or $5,000 yearly &mdash; the annual rate is held for ' + page.rate + '. Same service on either term. No setup fee.</p>');
  }

  // These pages live one level down, so same-origin paths must be absolute.
  s = s.replace(/src="assets\//g, 'src="/assets/');
  s = s.replace(/href="assets\//g, 'href="/assets/');   // <image href> inside inline SVG
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
