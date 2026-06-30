# FilmGeneva — Deployment Guide (Updated)

## IMPORTANT — file placement matches your actual repo structure

Your repo deploys assets from the **repo root** (`directory: "."`), not a
`public/` subfolder. Place files accordingly:

```
tomo546/FilmGeneva/
├── worker.js                  <- replace existing
├── wrangler.jsonc              <- replace existing (or wrangler.toml equivalent)
├── index.html                  <- replace with filmgeneva_website.html, renamed
└── fr-translations.json        <- new file, add at repo root
```

If your project currently uses `wrangler.toml` instead of `wrangler.jsonc`,
translate the `assets`, `r2_buckets`, and `routes` blocks into TOML syntax
(same keys, different format) — keep `directory = "."`.

## What changed in this update

1. **Crawlable links + real URLs** — all 302 internal navigation elements
   (nav, footer, mobile menu, CTA buttons, service cards, gallery headings)
   are now real `<a href="/clean-url">` tags instead of `onclick`-only
   JavaScript handlers. Clicking still gives the instant SPA-style page
   swap (via `event.preventDefault()` + `goTo()`), but crawlers and
   no-JS visitors can now discover and follow every link.

2. **Server-side route rendering** — the Worker recognises all 72
   non-homepage clean URLs (e.g. `/video-production`,
   `/ceo-interview-video-geneva`) and uses `HTMLRewriter` to serve each
   one with the correct page already active and the correct `<title>`,
   meta description, canonical URL, and Open Graph tags baked into the
   HTML — before any JavaScript runs. The homepage (`/`) is served
   directly without rewriting, since it needs no changes.

3. **French dictionary lazy-loaded** — the ~42KB French translation
   object no longer ships inline on every page load. It's now a
   separate `fr-translations.json` file, fetched only the first time a
   visitor clicks the FR toggle.

4. **Security headers** — every response now includes CSP, HSTS,
   X-Frame-Options, X-Content-Type-Options, Referrer-Policy,
   Permissions-Policy, and Cross-Origin-Opener-Policy.

5. **YouTube embeds switched to youtube-nocookie.com** — reduces
   third-party cookie usage.

6. **Gallery loading deferred** via requestIdleCallback to reduce
   main-thread blocking on initial render.

7. **Accessibility** — added a `<main>` landmark and increased the
   opacity of several low-contrast text elements.

## Deploy

```bash
npx wrangler deploy
```

## If the site still doesn't load after this fix

Check the Cloudflare dashboard deploy log for the actual error message
and share it — "not opening" could mean several different things
(blank page, 404, 500 error, build failure) and the exact error message
narrows it down immediately. Also check:

- Did `fr-translations.json` get added at the repo root?
- Does the deploy log show `wrangler.jsonc configuration` warnings?
- Try a hard refresh (Cmd+Shift+R / Ctrl+Shift+R) — old cached JS
  referencing the previous file structure can cause stale-state bugs.

## What this does NOT fix (needs separate action)

**GIF file sizes.** header.gif, camera.gif, and livestream.gif are very
likely the single biggest contributor to the 8MB total page weight
Lighthouse flagged. Recommended: convert each to a compressed, muted,
looping MP4:
```bash
ffmpeg -i header.gif -movflags faststart -pix_fmt yuv420p \
  -vf "scale=1920:-2" -c:v libx264 -crf 23 header.mp4
```
Upload to the same Gifs/ folder in R2, then let me know — I'll switch
the CSS background-images to native <video> elements.

## Verifying the fix after deploy

1. Visit https://filmgeneva.ch/video-production directly — it should
   load with the Video page already showing and the correct tab title.
2. View page source on that URL — you should see
   `<title>Video Production Geneva...` and
   `<div class="page active" id="page-video">` in the raw HTML.
3. Re-run Lighthouse — Best Practices should improve significantly.
