import type { APIRoute } from 'astro';

const XML_HEADERS = {
  'Content-Type': 'application/xml; charset=utf-8',
};

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    return new Response('Astro site URL is not configured', { status: 500 });
  }

  const sitemapUrl = new URL('/sitemap-0.xml', site).href;
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${sitemapUrl}</loc>
  </sitemap>
</sitemapindex>`;

  return new Response(body, {
    headers: XML_HEADERS,
  });
};
