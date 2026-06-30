/**
 * FilmGeneva Cloudflare Worker
 * Serves R2 photos at /photos/*, robots.txt, sitemap.xml
 * Falls back to static assets for everything else
 */

const ROBOTS_TXT = `User-agent: *
Allow: /
Sitemap: https://filmgeneva.ch/sitemap.xml
Crawl-delay: 1
Disallow: /api/
`;

const SITEMAP_XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://filmgeneva.ch/</loc><priority>1.0</priority><changefreq>weekly</changefreq></url>
  <url><loc>https://filmgeneva.ch/video-production</loc><priority>0.9</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/livestreaming-geneva</loc><priority>0.9</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/photography-geneva</loc><priority>0.9</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/podcast-recording-geneva</loc><priority>0.9</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/about-filmgeneva</loc><priority>0.7</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/contact-filmgeneva</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/corporate-video-production-geneva</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/conference-filming-geneva</loc><priority>0.85</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/ngo-video-production-geneva</loc><priority>0.85</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/conference-livestream-geneva</loc><priority>0.85</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/event-photography-geneva</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/executive-headshots-geneva</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/real-estate-photography-geneva</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/watch-photography-geneva</loc><priority>0.75</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/wedding-videographer-geneva</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/drone-filming-geneva-switzerland</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/video-podcast-production-geneva</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/short-film-production-geneva</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/political-diplomatic-video-geneva</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/who-interview-production-geneva</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/classical-music-livestream-geneva</loc><priority>0.75</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/interview-video-production-geneva</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/davos-wef-event-coverage-geneva</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/art-performance-video-geneva</loc><priority>0.75</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/beauty-lifestyle-video-geneva</loc><priority>0.75</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/sports-video-production-geneva</loc><priority>0.75</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/science-communication-video-geneva</loc><priority>0.75</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/social-media-video-production-geneva</loc><priority>0.75</priority><changefreq>monthly</changefreq></url>
</urlset>`;

function getContentType(key) {
  const ext = key.split('.').pop().toLowerCase();
  const types = {
    webp: 'image/webp', jpg: 'image/jpeg', jpeg: 'image/jpeg',
    png: 'image/png', gif: 'image/gif', avif: 'image/avif',
    html: 'text/html; charset=utf-8', css: 'text/css',
    js: 'application/javascript', json: 'application/json',
    xml: 'application/xml', txt: 'text/plain',
  };
  return types[ext] || 'application/octet-stream';
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // ── 301 redirect: old .com domain → new .ch domain (preserves SEO value) ──
    if (url.hostname === 'filmgeneva.com' || url.hostname === 'www.filmgeneva.com') {
      const target = 'https://filmgeneva.ch' + url.pathname + url.search;
      return Response.redirect(target, 301);
    }

    // ── redirect www.filmgeneva.ch → filmgeneva.ch (single canonical host) ───
    if (url.hostname === 'www.filmgeneva.ch') {
      const target = 'https://filmgeneva.ch' + url.pathname + url.search;
      return Response.redirect(target, 301);
    }

    // ── robots.txt ──────────────────────────────────────────────────────────
    if (path === '/robots.txt') {
      return new Response(ROBOTS_TXT, {
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }

    // ── sitemap.xml ─────────────────────────────────────────────────────────
    if (path === '/sitemap.xml') {
      return new Response(SITEMAP_XML, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }

    // ── API: list photos in a folder → /api/photos/watches ──────────────────
    if (path.startsWith('/api/photos/')) {
      const folder = decodeURIComponent(path.slice('/api/photos/'.length)).replace(/\/$/, '');
      if (!folder) {
        return new Response(JSON.stringify({ error: 'No folder specified' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      try {
        const list = await env.PHOTOS_BUCKET.list({ prefix: folder + '/' });
        const photos = list.objects
          .filter(obj => !obj.key.endsWith('/'))
          .filter(obj => /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(obj.key))
          // Exclude thumbnails subfolder from main listing
          .filter(obj => !obj.key.includes('/thumbnails/'))
          .map(obj => ({
            url: '/photos/' + obj.key,
            thumb: obj.key.includes('thumbnails/') ? '/photos/' + obj.key : null,
            key: obj.key,
            size: obj.size,
          }));

        return new Response(JSON.stringify({ folder, count: photos.length, photos }), {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=300',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // ── Serve R2 photo files → /photos/watches/DSC00005.webp ────────────────
    if (path.startsWith('/photos/')) {
      const key = decodeURIComponent(path.slice('/photos/'.length));
      if (!key || key.endsWith('/')) {
        return new Response('Not Found', { status: 404 });
      }

      try {
        // Check for Range request (for streaming)
        const rangeHeader = request.headers.get('Range');
        const object = rangeHeader
          ? await env.PHOTOS_BUCKET.get(key, { range: request.headers })
          : await env.PHOTOS_BUCKET.get(key);

        if (!object) {
          return new Response('Photo not found', { status: 404 });
        }

        const headers = new Headers({
          'Content-Type': getContentType(key),
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Access-Control-Allow-Origin': '*',
          'ETag': object.etag || '',
        });

        if (object.size) headers.set('Content-Length', object.size.toString());

        return new Response(object.body, {
          status: rangeHeader ? 206 : 200,
          headers,
        });
      } catch (err) {
        return new Response('Error fetching photo', { status: 500 });
      }
    }

    // ── Fall back to static assets ───────────────────────────────────────────
    try {
      return await env.ASSETS.fetch(request);
    } catch {
      return new Response('Not Found', { status: 404 });
    }
  },
};
