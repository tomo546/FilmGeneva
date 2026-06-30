/**
 * FilmGeneva Cloudflare Worker
 *
 * Responsibilities:
 *  - Server-side route rendering: requests to clean URLs like /video-production
 *    are rewritten server-side (via HTMLRewriter) so crawlers and no-JS visitors
 *    receive the correct page already marked active, with correct <title>,
 *    meta description, canonical URL, and Open Graph tags baked into the HTML
 *    response itself — not just set client-side after JS runs.
 *  - Serves R2 photos at /photos/*, and a JSON listing API at /api/photos/*
 *  - Serves robots.txt and sitemap.xml
 *  - 301 redirects from the old .com domain and www subdomain to filmgeneva.ch
 *  - Adds security headers (CSP, HSTS, X-Frame-Options, COOP, etc.) to every response
 *  - Falls back to static assets for everything else
 */

const ROBOTS_TXT = `User-agent: *
Allow: /
Sitemap: https://filmgeneva.ch/sitemap.xml
Crawl-delay: 1
Disallow: /api/
`;

const LLMS_TXT = `# FilmGeneva

> Professional video production, photography, livestreaming, and podcast recording company based in Geneva, Switzerland, serving NGOs, corporations, international organisations, and individual clients across Switzerland and internationally.

FilmGeneva produces corporate video, event filming, conference coverage, livestreaming, photography, podcast and audio recording, and drone/aerial work. Clients include the BBC, ITV, WHO, WTO, CERN, ICRC, AI for Good, TikTok, Campus Biotech, the Swiss Economic Forum, and the University of Geneva, among others. Cameras include Panasonic Lumix, Sony FX series, and Canon EOS, shooting up to 8K.

## Main sections

- [Home](https://filmgeneva.ch/) — Overview of services, clients, and company information
- [Video Production](https://filmgeneva.ch/video-production) — Corporate video, documentaries, event filming, NGO content
- [Livestreaming](https://filmgeneva.ch/livestreaming-geneva) — Conference, hybrid event, and concert livestreaming
- [Photography](https://filmgeneva.ch/photography-geneva) — Event, corporate, portrait, real estate, and product photography
- [Podcasts & Audio](https://filmgeneva.ch/podcast-recording-geneva) — Podcast recording, concert recording, lecture recording
- [Production Company](https://filmgeneva.ch/production-company-geneva) — End-to-end production support: location scouting, permits, crew, equipment
- [About](https://filmgeneva.ch/about-filmgeneva) — Company background, equipment, and client testimonials
- [Contact](https://filmgeneva.ch/contact-filmgeneva) — Phone, email, WhatsApp, Signal, Telegram, and quote request form

## Notable specialised pages

- [NGO Video Production](https://filmgeneva.ch/ngo-video-production-geneva)
- [Conference Filming](https://filmgeneva.ch/conference-filming-geneva)
- [Wedding Videography](https://filmgeneva.ch/wedding-videographer-geneva)
- [Drone & Aerial Filming](https://filmgeneva.ch/drone-filming-geneva-switzerland)
- [Watch & Jewellery Photography](https://filmgeneva.ch/watch-photography-geneva)
- [Political & Diplomatic Video](https://filmgeneva.ch/political-diplomatic-video-geneva)
- [WHO Interview Production](https://filmgeneva.ch/who-interview-production-geneva)

## Contact

Phone / WhatsApp / Signal / Telegram: +41 76 747 77 14
Email: filmgeneva1@gmail.com
Address: Rue de Vermont 42, Geneva, Switzerland
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
  <url><loc>https://filmgeneva.ch/production-company-geneva</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
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

// Maps every clean URL path to its page key, title, and meta description.
// Used for server-side route rendering so each URL returns correctly
// pre-rendered HTML (correct active page + correct <head> tags) even
// without JavaScript running — this is what makes the site crawlable.
const ROUTE_MAP = {"/":{"key":"home","title":"FilmGeneva — Professional Video & Photography in Geneva, Switzerland","desc":"Professional video production, photography, livestreaming and podcast recording in Geneva, Switzerland."},"/video-production":{"key":"video","title":"Video Production Geneva | FilmGeneva","desc":"Expert video production in Geneva — corporate films, documentaries, event filming, NGO content and more. Up to 8K."},"/livestreaming-geneva":{"key":"livestream","title":"Livestreaming Geneva | FilmGeneva","desc":"Professional livestreaming services in Geneva. Conferences, hybrid events, concerts, AGMs."},"/photography-geneva":{"key":"photography","title":"Photography Geneva | FilmGeneva","desc":"Professional event, corporate, portrait, real estate and aerial photography in Geneva and Switzerland."},"/podcast-recording-geneva":{"key":"podcasts","title":"Podcast & Audio Recording Geneva | FilmGeneva","desc":"Studio-quality podcast and audio recording in Geneva. On-location, no studio needed."},"/about-filmgeneva":{"key":"about","title":"About FilmGeneva | Video Production Company Geneva","desc":"FilmGeneva — professional video production company in Geneva. 4+ years experience, 100+ projects."},"/contact-filmgeneva":{"key":"contact","title":"Contact FilmGeneva | Get a Quote","desc":"Contact FilmGeneva for a free quote. Video production, photography, livestreaming in Geneva."},"/corporate-video-production-geneva":{"key":"corporate-videos","title":"Corporate Video Production Geneva | FilmGeneva","desc":"Professional corporate video production in Geneva."},"/ceo-interview-video-geneva":{"key":"ceo-interviews","title":"CEO & Executive Interview Video Geneva | FilmGeneva","desc":"Executive and CEO interview production in Geneva."},"/conference-filming-geneva":{"key":"conference-filming","title":"Conference Filming Geneva | FilmGeneva","desc":"Professional conference and summit filming in Geneva. Palexpo, WMO, CICG."},"/conference-highlight-reel-geneva":{"key":"conference-highlights","title":"Conference Highlight Reel Geneva | FilmGeneva","desc":"Conference highlight reels in Geneva."},"/ngo-video-production-geneva":{"key":"ngo-filming","title":"NGO Video Production Geneva | FilmGeneva","desc":"Video production for NGOs and international organisations in Geneva."},"/science-communication-video-geneva":{"key":"science-videos","title":"Science Communication Video Geneva | FilmGeneva","desc":"Science communication videos for research institutions in Geneva."},"/documentary-film-production-geneva":{"key":"documentary-filming","title":"Documentary Film Production Geneva | FilmGeneva","desc":"Documentary film production in Geneva."},"/drone-filming-geneva-switzerland":{"key":"drone-footage","title":"Drone & Aerial Filming Geneva | FilmGeneva","desc":"Licensed drone operator for aerial filming across Geneva and Switzerland."},"/wedding-videographer-geneva":{"key":"wedding-filming","title":"Wedding Videographer Geneva | FilmGeneva","desc":"Cinematic wedding films in Geneva and Switzerland."},"/real-estate-video-production-geneva":{"key":"real-estate-video","title":"Real Estate Video Production Geneva | FilmGeneva","desc":"Cinematic property walkthroughs and drone aerial footage in Geneva."},"/social-media-video-production-geneva":{"key":"social-media-video","title":"Social Media Video Production Geneva | FilmGeneva","desc":"Reels, Shorts and branded content for social media. Made in Geneva."},"/conference-livestream-geneva":{"key":"conference-livestream","title":"Conference Livestreaming Geneva | FilmGeneva","desc":"Broadcast-quality conference livestreaming in Geneva."},"/hybrid-event-production-geneva":{"key":"hybrid-events","title":"Hybrid Event Production Geneva | FilmGeneva","desc":"Professional hybrid event production in Geneva."},"/concert-livestreaming-geneva":{"key":"concert-streaming","title":"Concert Livestreaming Geneva | FilmGeneva","desc":"Professional concert livestreaming in Geneva."},"/agm-livestreaming-geneva":{"key":"agm-livestream","title":"AGM & General Assembly Livestreaming Geneva | FilmGeneva","desc":"Reliable AGM and general assembly livestreaming in Geneva."},"/event-photography-geneva":{"key":"event-photography","title":"Event Photography Geneva | FilmGeneva","desc":"Professional event photography in Geneva."},"/executive-headshots-geneva":{"key":"headshots-portraits","title":"Executive Headshots & Corporate Portraits Geneva | FilmGeneva","desc":"Natural, professional executive headshots in Geneva."},"/conference-photography-geneva":{"key":"conference-photography","title":"Conference Photography Geneva | FilmGeneva","desc":"Conference photography in Geneva at Palexpo, WMO, CICG."},"/real-estate-photography-geneva":{"key":"real-estate-photography","title":"Real Estate Photography Geneva | FilmGeneva","desc":"Professional real estate photography in Geneva."},"/airbnb-photography-geneva":{"key":"airbnb-photography","title":"Airbnb & Rental Photography Geneva | FilmGeneva","desc":"Professional Airbnb and vacation rental photography in Geneva."},"/watch-photography-geneva":{"key":"watches-photography","title":"Watch & Jewellery Photography Geneva | FilmGeneva","desc":"Precision product photography for Swiss watches and jewellery."},"/video-podcast-production-geneva":{"key":"video-podcast","title":"Video Podcast Production Geneva | FilmGeneva","desc":"Multi-camera video podcast recording in Geneva."},"/podcast-recording-service-geneva":{"key":"audio-podcast","title":"Audio Podcast Recording Geneva | FilmGeneva","desc":"Broadcast-quality audio podcast recording in Geneva."},"/concert-recording-geneva":{"key":"concert-recording","title":"Concert & Music Recording Geneva | FilmGeneva","desc":"Professional multi-camera concert recording in Geneva."},"/lecture-recording-geneva":{"key":"lecture-recording","title":"Lecture & Academic Recording Geneva | FilmGeneva","desc":"Professional lecture and academic recording in Geneva."},"/sports-video-production-geneva":{"key":"sports-filming","title":"Sports & Action Video Production Geneva | FilmGeneva","desc":"Dynamic sports filming for athletes, events and brands in Geneva."},"/behind-the-scenes-video-geneva":{"key":"behind-scenes","title":"Behind the Scenes Video Production Geneva | FilmGeneva","desc":"BTS content for productions and brand activations in Geneva."},"/influencer-video-production-geneva":{"key":"content-creator-video","title":"Influencer & Content Creator Video Geneva | FilmGeneva","desc":"Professional video production for content creators in Geneva."},"/greenscreen-production-geneva":{"key":"greenscreen","title":"Greenscreen & Studio Production Geneva | FilmGeneva","desc":"Professional greenscreen production for virtual studios in Geneva."},"/timelapse-video-geneva":{"key":"timelapse","title":"Time-lapse Video Production Geneva | FilmGeneva","desc":"Professional time-lapse filming in Geneva."},"/agm-corporate-event-video-geneva":{"key":"agm-corporate-events","title":"AGM & Corporate Event Video Geneva | FilmGeneva","desc":"Professional video and livestreaming for AGMs in Geneva."},"/short-film-production-geneva":{"key":"short-films","title":"Short Film Production Geneva | FilmGeneva","desc":"Award-winning short film production in Geneva. REBOOT won Best Film & Audience Award at 48HFP."},"/political-diplomatic-video-geneva":{"key":"political-diplomatic","title":"Political & Diplomatic Video Production Geneva | FilmGeneva","desc":"Video production for diplomatic missions and political events in Geneva."},"/who-interview-production-geneva":{"key":"who-interviews","title":"WHO Interview Production Geneva | FilmGeneva","desc":"Professional interview production for the World Health Organization."},"/classical-music-livestream-geneva":{"key":"classical-music-livestream","title":"Classical Music Livestream Geneva | FilmGeneva","desc":"Professional classical music filming and livestreaming in Geneva."},"/interview-video-production-geneva":{"key":"interviews","title":"Interview Video Production Geneva | FilmGeneva","desc":"Professional on-camera interview production in Geneva."},"/davos-wef-event-coverage-geneva":{"key":"davos-events","title":"Davos & International Summit Coverage | FilmGeneva","desc":"Event coverage for Davos, WEF and major international summits."},"/art-performance-video-geneva":{"key":"art-performance","title":"Art & Performance Video Production Geneva | FilmGeneva","desc":"Cinematic filming for performing arts and creative productions in Geneva."},"/beauty-lifestyle-video-geneva":{"key":"beauty-lifestyle","title":"Beauty & Lifestyle Video Production Geneva | FilmGeneva","desc":"Professional video for beauty brands and influencers in Geneva."},"/production-company-geneva":{"key":"production-company","title":"Production Company Geneva | FilmGeneva","desc":"End-to-end video production company in Geneva and Switzerland. Location scouting, permits, crew, equipment, set coordination and logistics."},"/geneva-locations-photography":{"key":"locations","title":"Geneva & Switzerland Locations | FilmGeneva","desc":"Aerial and location photography across Geneva, Lake Geneva and Switzerland."},"/testimonial-video-production-geneva":{"key":"testimonial-videos","title":"Testimonial Video Production Geneva | FilmGeneva","desc":"Authentic client testimonial videos for marketing, websites, and social media in Geneva."},"/explainer-video-production-geneva":{"key":"explainer-videos","title":"Explainer Video Production Geneva | FilmGeneva","desc":"Clear, engaging explainer videos for products, services, and concepts in Geneva."},"/product-launch-video-geneva":{"key":"product-launch-videos","title":"Product Launch Video Production Geneva | FilmGeneva","desc":"Cinematic product launch films for Swiss and international brands."},"/training-video-production-geneva":{"key":"training-videos","title":"Training & Onboarding Video Geneva | FilmGeneva","desc":"Clear, professional training and onboarding videos for businesses in Geneva."},"/music-video-production-geneva":{"key":"music-videos-filming","title":"Music Video Production Geneva | FilmGeneva","desc":"Creative music video production for artists in Geneva and Switzerland."},"/film-tv-production-support-geneva":{"key":"interviews-film-tv","title":"Film & TV Production Support Geneva | FilmGeneva","desc":"Local crew, equipment, and fixer services for international broadcasters filming in Geneva."},"/webinar-production-geneva":{"key":"webinars","title":"Webinar Production Geneva | FilmGeneva","desc":"Professional webinar production in Geneva — camera, audio, and streaming."},"/award-ceremony-livestream-geneva":{"key":"award-ceremony-livestream","title":"Award Ceremony Livestreaming Geneva | FilmGeneva","desc":"Multi-camera livestreaming of award ceremonies and gala dinners in Geneva."},"/memorial-livestream-geneva":{"key":"memorial-livestream","title":"Memorial & Ceremony Livestreaming Geneva | FilmGeneva","desc":"Discreet, respectful livestreaming of memorial services in Geneva."},"/multi-platform-livestreaming-geneva":{"key":"multi-platform-streaming","title":"Multi-Platform Livestreaming Geneva | FilmGeneva","desc":"Stream simultaneously to YouTube, LinkedIn, Zoom, Teams and any RTMP platform."},"/ngo-photography-geneva":{"key":"ngo-photography","title":"NGO & Field Photography Geneva | FilmGeneva","desc":"Impactful photography for international organisations and humanitarian projects in Geneva."},"/food-restaurant-photography-geneva":{"key":"food-photography","title":"Food & Restaurant Photography Geneva | FilmGeneva","desc":"Appetising food and restaurant photography in Geneva."},"/watch-jewellery-photography-geneva":{"key":"watch-jewellery-photography","title":"Watch & Jewellery Photography Geneva | FilmGeneva","desc":"Precision product photography for Swiss watches and jewellery."},"/drone-aerial-photography-geneva":{"key":"drone-photography","title":"Drone & Aerial Photography Geneva | FilmGeneva","desc":"Licensed drone aerial photography across Geneva and Switzerland."},"/architecture-photography-geneva":{"key":"architecture-photography","title":"Architecture Photography Geneva | FilmGeneva","desc":"Precise, beautiful architectural photography for buildings and properties in Geneva."},"/concert-performance-photography-geneva":{"key":"concert-photography","title":"Concert & Performance Photography Geneva | FilmGeneva","desc":"Dynamic live music and performance photography in Geneva."},"/fashion-photography-geneva":{"key":"fashion-photography","title":"Fashion Photography Geneva | FilmGeneva","desc":"Editorial and commercial fashion photography for designers and brands in Geneva."},"/interview-podcast-production-geneva":{"key":"interview-podcast","title":"Interview Podcast Production Geneva | FilmGeneva","desc":"Professional one-on-one interview podcast production in Geneva."},"/panel-discussion-podcast-geneva":{"key":"panel-podcast","title":"Panel Discussion Podcast Geneva | FilmGeneva","desc":"Multi-guest panel podcast production in Geneva."},"/conference-podcast-production-geneva":{"key":"conference-podcast","title":"Conference Podcast Production Geneva | FilmGeneva","desc":"On-site podcast recording at your conference in Geneva."},"/corporate-podcast-production-geneva":{"key":"corporate-podcast","title":"Corporate Podcast Production Geneva | FilmGeneva","desc":"Regular corporate podcast production for businesses in Geneva."},"/ngo-humanitarian-podcast-geneva":{"key":"ngo-podcast","title":"NGO & Humanitarian Podcast Geneva | FilmGeneva","desc":"Podcast production for NGOs and international organisations in Geneva."},"/music-session-recording-geneva":{"key":"music-session","title":"Music Session Recording Geneva | FilmGeneva","desc":"Studio-style music session recording in any space in Geneva."},"/audiogram-podcast-clips-geneva":{"key":"audiograms","title":"Audiogram & Podcast Clip Production Geneva | FilmGeneva","desc":"Animated audiogram and social media clip production for podcasts."},"/event-audio-support-geneva":{"key":"event-audio-support","title":"Event Audio Support Geneva | FilmGeneva","desc":"Professional technical audio support for events and conferences in Geneva."}};

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

// Adds security headers to any Response. Returns a new Response since
// Headers on an existing Response are immutable.
function withSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'sha256-AM3nRwwZZrO3Wd1oO/2LQkvYEsmAM7YNs2jX6bwdjsk=' 'sha256-BRkfkmKx7DKl3gnTItQzSgZbF6LLENogkPMWf+pcQZk=' https://static.cloudflareinsights.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' https: data:",
      "frame-src https://www.youtube-nocookie.com https://player.vimeo.com https://w.soundcloud.com",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests",
      "require-trusted-types-for 'script'",
      "trusted-types default",
    ].join('; ')
  );
  headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  headers.set('X-Frame-Options', 'SAMEORIGIN');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// Server-side render a specific page: fetches the base index.html and uses
// HTMLRewriter to (1) set correct <head> tags, (2) mark the correct page div
// active and remove "active" from the home page div, so the initial HTML
// response is already correct for crawlers and no-JS clients.
async function renderRoute(request, env, route) {
  const baseRequest = new Request(new URL('/', request.url), request);
  const assetResponse = await env.ASSETS.fetch(baseRequest);
  if (!assetResponse.ok) return assetResponse;

  const canonicalUrl = 'https://filmgeneva.ch' + route.url;

  const rewriter = new HTMLRewriter()
    .on('title', {
      element(el) {
        el.setInnerContent(route.title);
      },
    })
    .on('meta[name="description"]', {
      element(el) {
        el.setAttribute('content', route.desc);
      },
    })
    .on('meta[name="twitter:title"]', {
      element(el) {
        el.setAttribute('content', route.title);
      },
    })
    .on('meta[name="twitter:description"]', {
      element(el) {
        el.setAttribute('content', route.desc);
      },
    })
    .on('meta[property="og:title"]', {
      element(el) {
        el.setAttribute('content', route.title);
      },
    })
    .on('meta[property="og:description"]', {
      element(el) {
        el.setAttribute('content', route.desc);
      },
    })
    .on('meta[property="og:url"]', {
      element(el) {
        el.setAttribute('content', canonicalUrl);
      },
    })
    .on('link[rel="canonical"]', {
      element(el) {
        el.setAttribute('href', canonicalUrl);
      },
    })
    // Deactivate the home page div unless that IS the requested route
    .on('div.page#page-home', {
      element(el) {
        if (route.key !== 'home') {
          el.setAttribute('class', 'page');
        }
      },
    })
    // Activate the requested route's page div
    .on(`div.page#page-${route.key}`, {
      element(el) {
        if (route.key !== 'home') {
          el.setAttribute('class', 'page active');
        }
      },
    });

  const rewritten = rewriter.transform(assetResponse);
  return withSecurityHeaders(rewritten);
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // ── 301 redirect: old .com domain → new .ch domain (preserves SEO value) ──
    if (url.hostname === 'filmgeneva.com' || url.hostname === 'www.filmgeneva.com') {
      return Response.redirect('https://filmgeneva.ch' + url.pathname + url.search, 301);
    }

    // ── redirect www.filmgeneva.ch → filmgeneva.ch (single canonical host) ───
    if (url.hostname === 'www.filmgeneva.ch') {
      return Response.redirect('https://filmgeneva.ch' + url.pathname + url.search, 301);
    }

    // ── robots.txt ──────────────────────────────────────────────────────────
    if (path === '/robots.txt') {
      return withSecurityHeaders(new Response(ROBOTS_TXT, {
        headers: { 'Content-Type': 'text/plain', 'Cache-Control': 'public, max-age=86400' },
      }));
    }

    // ── llms.txt (for AI agent / LLM crawlers) ───────────────────────────────
    if (path === '/llms.txt') {
      return withSecurityHeaders(new Response(LLMS_TXT, {
        headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Cache-Control': 'public, max-age=86400' },
      }));
    }

    // ── sitemap.xml ─────────────────────────────────────────────────────────
    if (path === '/sitemap.xml') {
      return withSecurityHeaders(new Response(SITEMAP_XML, {
        headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, max-age=86400' },
      }));
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
          .filter(obj => !obj.key.includes('/thumbnails/'))
          .map(obj => ({ url: '/photos/' + obj.key, key: obj.key, size: obj.size }));

        return withSecurityHeaders(new Response(JSON.stringify({ folder, count: photos.length, photos }), {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=300',
            'Access-Control-Allow-Origin': '*',
          },
        }));
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
      if (!key || key.endsWith('/')) return new Response('Not Found', { status: 404 });

      try {
        const rangeHeader = request.headers.get('Range');
        const object = rangeHeader
          ? await env.PHOTOS_BUCKET.get(key, { range: request.headers })
          : await env.PHOTOS_BUCKET.get(key);

        if (!object) return new Response('Photo not found', { status: 404 });

        const headers = new Headers({
          'Content-Type': getContentType(key),
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Access-Control-Allow-Origin': '*',
          'ETag': object.etag || '',
        });
        if (object.size) headers.set('Content-Length', object.size.toString());

        return new Response(object.body, { status: rangeHeader ? 206 : 200, headers });
      } catch (err) {
        return new Response('Error fetching photo', { status: 500 });
      }
    }

    // ── Server-side render known clean-URL routes (the core SEO fix) ────────
    // Strip trailing slash for matching (except root)
    const matchPath = path !== '/' && path.endsWith('/') ? path.slice(0, -1) : path;
    const route = ROUTE_MAP[matchPath];
    // The homepage needs no rewriting (it's already correct by default in
    // the source HTML), so skip the rewriter entirely for "/" to minimise
    // risk on the most important page — just fall through to normal asset
    // serving below.
    if (route && route.key !== 'home') {
      try {
        return await renderRoute(request, env, route);
      } catch (err) {
        // If rendering fails for any reason, fall through to static assets
        // rather than breaking the page entirely.
      }
    }

    // ── Fall back to static assets for everything else (images, JS, etc.) ───
    try {
      const assetResponse = await env.ASSETS.fetch(request);
      return withSecurityHeaders(assetResponse);
    } catch {
      return new Response('Not Found', { status: 404 });
    }
  },
};
