import { getPosts, slugOf, excerpt } from '../../lib/content';

export async function GET() {
  const posts = await getPosts();
  const items = posts.map((p) => ({
    title: p.data.title,
    description: p.data.metaDescription ?? excerpt(p.body),
    url: `/blog/${slugOf(p)}`,
    date: p.data.date.toISOString(),
  }));
  return new Response(JSON.stringify(items), { headers: { 'Content-Type': 'application/json' } });
}
