import type { APIRoute } from 'astro';
import { getPublishedBlogPosts } from '../lib/posts';

const XML_HEADERS = {
  'Content-Type': 'application/xml; charset=utf-8',
};

const STATIC_PATHS = [
  '/',
  '/about/',
  '/research/',
  '/services/',
  '/blog/',
  '/contact/',
  '/zh/',
  '/zh/about/',
  '/zh/research/',
  '/zh/services/',
  '/zh/contact/',
];

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    return new Response('Astro site URL is not configured', { status: 500 });
  }

  const posts = await getPublishedBlogPosts();
  const publishedBlogPaths = posts.map((post) => `/blog/${post.id}/`);

  const allPaths = [...STATIC_PATHS, ...publishedBlogPaths];
  const urlItems = allPaths
    .map((path) => {
      const loc = new URL(path, site).href;
      return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n  </url>`;
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlItems}
</urlset>`;

  return new Response(body, {
    headers: XML_HEADERS,
  });
};
