import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts, getSettings, slugOf, excerpt } from '../lib/content';

export async function GET(context: APIContext) {
  const [posts, settings] = await Promise.all([getPosts(), getSettings()]);
  return rss({
    title: `${settings.businessName} Blog`,
    description: settings.description,
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.metaDescription ?? excerpt(p.body),
      pubDate: p.data.date,
      link: `/blog/${slugOf(p)}`,
      categories: p.data.categories,
    })),
    customData: '<language>en-us</language>',
  });
}
