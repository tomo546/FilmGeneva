# FilmGeneva — Cloudflare Worker Deployment

## Files
- `worker.js` — Cloudflare Worker (serves R2 photos, robots.txt, sitemap.xml)
- `wrangler.jsonc` — Worker configuration
- `filmgeneva_website.html` → rename to `index.html`, place in `public/` folder
- `sitemap.xml` — served by Worker code (no file needed)
- `robots.txt` — served by Worker code (no file needed)

## Setup steps

### 1. Project structure
```
filmgeneva_worker/
├── worker.js
├── wrangler.jsonc
└── public/
    └── index.html   ← rename filmgeneva_website.html
```

### 2. Install Wrangler
```bash
npm install -g wrangler
wrangler login
```

### 3. Deploy
```bash
npx wrangler deploy
```

### 4. Photo URLs (once deployed)
Photos are served at:
- `https://filmgeneva.ch/photos/watches/DSC00005.webp`
- `https://filmgeneva.ch/photos/portraits/CC_20250919_.webp`
- `https://filmgeneva.ch/photos/Events/PS1R0663n.webp`
- `https://filmgeneva.ch/photos/ngo/[filename]`
- `https://filmgeneva.ch/photos/production/[filename]`
- `https://filmgeneva.ch/photos/wedding/[filename]`
- `https://filmgeneva.ch/photos/Places/[filename]`
- `https://filmgeneva.ch/photos/influencers/[filename]`
- `https://filmgeneva.ch/photos/educational/[filename]`

### 5. Photo API
List all photos in a folder:
- `https://filmgeneva.ch/api/photos/watches` → JSON list of all watch photos
- `https://filmgeneva.ch/api/photos/Events` → JSON list of all event photos

### 6. R2 Binding
The Worker uses `PHOTOS_BUCKET` binding pointing to your `photoswebsite` R2 bucket.
This is configured in `wrangler.jsonc`.

## Notes
- `serve_directly: false` ensures Worker runs before static assets
- Photos cached for 1 year (immutable) via Cache-Control headers
- Galleries load dynamically via `/api/photos/[folder]` — no hardcoded filenames needed
- Lightbox opens on photo click with keyboard navigation (← → Esc)
