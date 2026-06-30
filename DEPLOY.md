# FilmGeneva — Deployment Guide (Updated)

## What changed in this update

1. **Crawlable links + real URLs** — all 302 internal navigation elements
   (nav, footer, mobile menu, CTA buttons, service cards, gallery headings)
   are now real `<a href="/clean-url">` tags instead of `onclick`-only
   JavaScript handlers. Clicking still gives the instant SPA-style page
   swap (via `event.preventDefault()` + `goTo()`), but crawlers and
   no-JS visitors can now discover and follow every link.

2. **Server-side route rendering** — the Worker now recognises all 73
   clean URLs (e.g. `/video-production`, `/ceo-interview-video-geneva`)
   and uses `HTMLRewriter` to serve each one with the **correct page
   already active** and the **correct `<title>`, meta description,
   canonical URL, and Open Graph tags already baked into the HTML**
   — before any JavaScript runs. This is what actually fixes
   indexability: a crawler requesting `/video-production` directly now
   gets that page's real content, not just the homepage shell.

3. **French dictionary lazy-loaded** — the ~42KB French translation
   object no longer ships inline on every page load. It's now a
   separate `fr-translations.json` file, fetched only the first time a
   visitor clicks the FR toggle. English-only visitors (the majority)
   never download it.

4. **Security headers** — every response (HTML, JSON, assets) now
   includes CSP, HSTS, X-Frame-Options, X-Content-Type-Options,
   Referrer-Policy, Permissions-Policy, and Cross-Origin-Opener-Policy.

5. **YouTube embeds switched to youtube-nocookie.com** — reduces
   third-party cookie usage flagged by Lighthouse.

6. **Gallery loading deferred** — photo gallery fetches now run via
   requestIdleCallback instead of firing immediately on page load,
   reducing main-thread blocking time during initial render.

7. **Accessibility** — added a `<main>` landmark and increased the
   opacity of several low-contrast text elements (footer copyright,
   footer nav links, "previously worked with" label) to meet contrast
   requirements.

## Files in this delivery

- `filmgeneva_website.html` -> rename to `index.html`, place in `public/`
- `fr-translations.json` -> place in `public/` (same folder as index.html)
- `worker.js` -> place at the project root
- `wrangler.jsonc` -> place at the project root

### Folder structure
```
filmgeneva/
├── worker.js
├── wrangler.jsonc
└── public/
    ├── index.html
    └── fr-translations.json
```

## Deploy

```bash
npx wrangler deploy
```

## What this does NOT fix (needs separate action)

**GIF file sizes.** header.gif, camera.gif, and livestream.gif
are very likely the single biggest contributor to the 8MB total page
weight Lighthouse flagged, and to the slow Largest Contentful Paint.
GIF is a very inefficient format for video-like content — the same
visual result as an autoplaying looped MP4/WebM is typically 5-20x
smaller in file size.

Recommended: convert each GIF to a compressed, muted, looping MP4
(and a WebM fallback) using a tool like HandBrake or ffmpeg:
```bash
ffmpeg -i header.gif -movflags faststart -pix_fmt yuv420p \
  -vf "scale=1920:-2" -c:v libx264 -crf 23 header.mp4
```
Upload the resulting .mp4 files to the same Gifs/ folder in R2,
then let me know once they're uploaded — I'll switch the hero/page
banners from background-image: url(...) to native
<video autoplay muted loop playsinline> elements, which will
meaningfully improve both Performance score and LCP.

## Verifying the fix after deploy

1. Visit https://filmgeneva.ch/video-production directly (not via
   clicking from the homepage) — it should load with the Video page
   already showing, and the browser tab title should say "Video
   Production Geneva | FilmGeneva", not the homepage title.
2. View page source (Ctrl+U / Cmd+Option+U) on that URL — you
   should see <title>Video Production Geneva...</title> and
   <div class="page active" id="page-video"> directly in the raw
   HTML, confirming server-side rendering worked.
3. Re-run Lighthouse / PageSpeed Insights — Best Practices should jump
   significantly (security headers), and "Links are not crawlable"
   should no longer appear in any SEO audit.
4. In Google Search Console, use URL Inspection on a few service
   page URLs and request indexing — they should now be eligible.
