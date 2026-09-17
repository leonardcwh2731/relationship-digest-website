# Community landing pages

`/the-bureau`, `/agencyhabits`, `/agency-outsight` and `/surge` are generated
from `index.html`. They are the main site with one line changed — the eyebrow
above the headline — so any edit to the main page reaches all of them.

**Edit `index.html` only.** Never edit the generated pages directly; the next
build overwrites them.

## How it stays in sync

A pre-commit hook runs `build-pages.js` and stages the result, so the pages
cannot fall behind. To run it by hand:

    node build-pages.js           # regenerate
    node build-pages.js --check   # exit 1 if any page is stale

If the hook ever stops firing (a fresh clone, for instance), reinstall it:

    git config core.hooksPath .githooks

## Adding another community

Add one line to `PAGES` in `build-pages.js`:

    { dir: 'example', name: 'Example', eyebrow: 'For Example readers only', utm: 'example' },

then add the directory name to the `noindex` header rule in `vercel.json`.

## What the generator changes

| Per page | Why |
|---|---|
| Hero eyebrow | The one intentional copy difference |
| `<title>`, meta description | Names the community |
| `noindex, nofollow` | Shared by link, kept out of search |
| `utm_source` on booking links | Shows the source in the calendar |
| Leading `/` on asset paths | Pages sit one level down |
