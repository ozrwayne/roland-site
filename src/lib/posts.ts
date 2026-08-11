import { getCollection, type CollectionEntry } from 'astro:content';

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

// Kept in the public type until the article route is fully migrated. The
// production feed no longer reads WordPress, so only repository Markdown can
// appear in the homepage, archive, and article routes.
export type WordPressBlogPost = SharedPost & {
  source: 'wordpress';
  contentHtml: string;
};

export type BlogPost = LocalBlogPost | WordPressBlogPost;

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const localPosts: LocalBlogPost[] = (await getCollection('blog'))
    .filter((post) => !post.data.draft)
    .map((entry) => ({
      id: entry.data.slug ?? entry.id,
      title: entry.data.title,
      description: entry.data.description,
      // Lists use the date the article entered this site. The source date stays
      // in pubDate and remains the canonical date on the article itself.
      pubDate: entry.data.siteDate ?? entry.data.pubDate,
      tags: entry.data.tags,
      cover: entry.data.cover ?? entry.data.image,
      coverAlt: entry.data.coverAlt,
      pinned: entry.data.pinned,
      source: 'markdown',
      entry,
    }));

  return localPosts.sort((a, b) => {
    const dateOrder = b.pubDate.valueOf() - a.pubDate.valueOf();
    return dateOrder || a.id.localeCompare(b.id);
  });
}
