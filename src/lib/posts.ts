import { getCollection, type CollectionEntry } from 'astro:content';

const WORDPRESS_API_URL =
  import.meta.env.WORDPRESS_API_URL ?? 'https://cms.rolandwayne.com/wp-json/wp/v2';

type WordPressTerm = {
  name: string;
  taxonomy: string;
};

type WordPressMedia = {
  alt_text?: string;
  source_url?: string;
};

type WordPressPost = {
  slug: string;
  date: string;
  date_gmt?: string;
  sticky?: boolean;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  _embedded?: {
    'wp:featuredmedia'?: WordPressMedia[];
    'wp:term'?: WordPressTerm[][];
  };
};

type SharedPost = {
  id: string;
  title: string;
  description: string;
  pubDate: Date;
  tags: string[];
  cover?: string;
  coverAlt?: string;
  pinned: boolean;
};

export type LocalBlogPost = SharedPost & {
  source: 'markdown';
  entry: CollectionEntry<'blog'>;
};

export type WordPressBlogPost = SharedPost & {
  source: 'wordpress';
  contentHtml: string;
};

export type BlogPost = LocalBlogPost | WordPressBlogPost;

const decodeEntities = (value: string) =>
  value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");

const plainText = (value: string) =>
  decodeEntities(value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());

async function getWordPressPosts(): Promise<WordPressBlogPost[]> {
  const endpoint = new URL(`${WORDPRESS_API_URL.replace(/\/$/, '')}/posts`);
  endpoint.searchParams.set('status', 'publish');
  endpoint.searchParams.set('per_page', '100');
  endpoint.searchParams.set('_embed', 'wp:featuredmedia,wp:term');

  const posts: WordPressPost[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    endpoint.searchParams.set('page', String(page));
    const response = await fetch(endpoint, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`WordPress API returned HTTP ${response.status} for page ${page}`);
    }

    posts.push(...((await response.json()) as WordPressPost[]));
    totalPages = Number.parseInt(response.headers.get('X-WP-TotalPages') ?? '1', 10);
    page += 1;
  } while (page <= totalPages);

  return posts.map((post) => {
    const publishedAt = post.date_gmt ? `${post.date_gmt}Z` : post.date;
    const pubDate = new Date(publishedAt);
    if (Number.isNaN(pubDate.valueOf())) {
      throw new Error(`WordPress post ${post.slug} has an invalid publication date`);
    }

    const media = post._embedded?.['wp:featuredmedia']?.[0];
    const tags = (post._embedded?.['wp:term'] ?? [])
      .flat()
      .filter((term) => term.taxonomy === 'post_tag')
      .map((term) => plainText(term.name));

    return {
      id: post.slug,
      title: plainText(post.title.rendered),
      description: plainText(post.excerpt.rendered),
      pubDate,
      tags,
      cover: media?.source_url,
      coverAlt: media?.alt_text ? plainText(media.alt_text) : '',
      pinned: Boolean(post.sticky),
      source: 'wordpress',
      contentHtml: post.content.rendered,
    };
  });
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const localPosts: LocalBlogPost[] = (await getCollection('blog'))
    .filter((post) => !post.data.draft)
    .map((entry) => ({
      id: entry.id,
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.pubDate,
      tags: entry.data.tags,
      cover: entry.data.cover ?? entry.data.image,
      coverAlt: entry.data.coverAlt,
      pinned: entry.data.pinned,
      source: 'markdown',
      entry,
    }));

  const merged = new Map<string, BlogPost>();
  for (const post of localPosts) merged.set(post.id, post);
  for (const post of await getWordPressPosts()) merged.set(post.id, post);

  return [...merged.values()].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.pubDate.valueOf() - a.pubDate.valueOf();
  });
}
