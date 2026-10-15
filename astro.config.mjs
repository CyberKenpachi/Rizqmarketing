// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { parse } from 'yaml';
import { unified } from '@astrojs/markdown-remark';
import rehypeBlogBody from './src/lib/rehype-blog.mjs';

const SITE = 'https://rizqmarketing.com';
const includeDrafts = process.env.INCLUDE_DRAFTS === '1';

/** @param {string} dir */
const readDir = (dir) =>
  existsSync(dir) ? readdirSync(dir).map((f) => ({ file: f, text: readFileSync(`${dir}/${f}`, 'utf8') })) : [];

// URLs the CMS has flagged "noindex" are kept out of the sitemap.
function noindexPaths() {
  const out = new Set(['/admin', '/thank-you', '/404']);
  /** @type {Record<string, string>} */
  const pageUrls = { home: '/', about: '/about', services: '/services', contact: '/contact', blog: '/blog' };
  for (const { file, text } of readDir('./src/content/pages')) {
    const id = file.replace(/\.ya?ml$/, '');
    if (parse(text)?.noindex && pageUrls[id]) out.add(pageUrls[id]);
  }
  for (const { file, text } of readDir('./src/content/services')) {
    const data = parse(text) ?? {};
    if (data.noindex) out.add(`/services/${data.slug || file.replace(/\.ya?ml$/, '')}`);
  }
  return out;
}

// With zero published posts the blog hub would be an empty page, so keep it out of the sitemap.
function publishedPostCount() {
  return readDir('./src/content/blog').filter(({ text }) => {
    const front = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const draft = front ? parse(front[1])?.draft === true : false;
    return includeDrafts || !draft;
  }).length;
}

const excluded = noindexPaths();
const hasPosts = publishedPostCount() > 0;

export default defineConfig({
  site: SITE,
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'always' },
  markdown: { processor: unified({ rehypePlugins: [rehypeBlogBody] }) },
  integrations: [
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname.replace(/\/$/, '') || '/';
        if (excluded.has(path) || path.startsWith('/admin')) return false;
        if (!hasPosts && path.startsWith('/blog')) return false;
        return true;
      },
    }),
  ],
});
