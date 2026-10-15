import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { marked } from 'marked';

export const SITE: string = (import.meta.env.SITE as string).replace(/\/$/, '');
export const PAGE_SIZE = 9;
const RESERVED_BLOG_SLUGS = new Set(['page', 'category']);
const includeDrafts = import.meta.env.DEV || process.env.INCLUDE_DRAFTS === '1';

export const abs = (path?: string): string | undefined =>
  path ? new URL(path, SITE + '/').toString() : undefined;

export async function getSettings() {
  const entry = await getEntry('settings', 'site');
  if (!entry) throw new Error('Missing src/content/settings/site.yml');
  return entry.data;
}

export async function getPage(id: 'home' | 'about' | 'services' | 'contact' | 'blog') {
  const entry = await getEntry('pages', id);
  if (!entry) throw new Error(`Missing src/content/pages/${id}.yml`);
  return entry.data;
}

export const slugOf = (e: { id: string; data: { slug?: string } }) => e.data.slug || e.id;

export async function getServices() {
  const all = await getCollection('services');
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function getPosts(): Promise<CollectionEntry<'blog'>[]> {
  const posts = (await getCollection('blog', (p) => includeDrafts || !p.data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
  const seen = new Set<string>();
  for (const p of posts) {
    const slug = slugOf(p);
    if (RESERVED_BLOG_SLUGS.has(slug)) throw new Error(`Blog slug "${slug}" is reserved (${p.id})`);
    if (seen.has(slug)) throw new Error(`Duplicate blog slug "${slug}" (${p.id})`);
    seen.add(slug);
  }
  return posts;
}

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export async function getCategoryIndex() {
  const [posts, cats] = await Promise.all([getPosts(), getCollection('categories')]);
  const byId = new Map(cats.map((c) => [c.id, c]));
  const used = new Map<string, CollectionEntry<'blog'>[]>();
  for (const p of posts) for (const c of p.data.categories) used.set(c, [...(used.get(c) ?? []), p]);
  return [...used.entries()].map(([id, list]) => {
    const entry = byId.get(id);
    const title = entry?.data.title ?? id.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
    return { id, title, entry, posts: list };
  });
}

export function categoryTitle(id: string, cats: { id: string; title: string }[]) {
  return cats.find((c) => c.id === id)?.title ?? id;
}

// Inline Markdown (links, bold, italics) for FAQ answers.
export const renderInline = (md: string): string => marked.parseInline(md, { async: false }) as string;

export const plain = (md: string): string =>
  renderInline(md)
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

export function excerpt(body = '', max = 158): string {
  const text = body
    .replace(/^---[\s\S]*?---/, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length <= max ? text : text.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
