import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Decap writes empty strings for blank optional fields; treat them as "not set".
const blank = (v: unknown) => (v === '' || v === null ? undefined : v);
const str = z.preprocess(blank, z.string().optional());
const date = z.coerce.date();

const faqItem = z.object({ question: z.string(), answer: z.string() });

const pages = defineCollection({
  loader: glob({ pattern: '*.yml', base: './src/content/pages' }),
  schema: z.object({
    metaTitle: z.string(),
    metaDescription: z.string(),
    ogImage: str,
    noindex: z.boolean().default(false),
    faq: z.array(faqItem).default([]),
  }),
});

const settings = defineCollection({
  loader: glob({ pattern: '*.yml', base: './src/content/settings' }),
  schema: z.object({
    businessName: z.string(),
    description: z.string(),
    logo: z.string(),
    markLogo: z.string(),
    defaultOgImage: z.string(),
    email: z.string(),
    phone: str,
    address: z
      .object({
        street: str,
        city: str,
        region: str,
        postalCode: str,
        country: str,
      })
      .optional(),
    areaServed: str,
    languages: z.array(z.string()).default([]),
    socialLinks: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
  }),
});

const iconText = z.object({ icon: z.string(), label: z.string() });
const iconCard = z.object({ icon: z.string(), title: z.string(), text: z.string() });

const services = defineCollection({
  loader: glob({ pattern: '*.yml', base: './src/content/services' }),
  schema: z.object({
    slug: str,
    title: z.string(),
    order: z.number().default(100),
    icon: z.string().default('◈'),
    serviceType: str,
    cardSummary: z.string(),
    summary: z.string(),
    outcomes: z.array(z.string()).default([]),
    quoteLabel: str,
    metaTitle: z.string(),
    metaDescription: z.string(),
    ogImage: str,
    noindex: z.boolean().default(false),
    hero: z.object({
      eyebrow: z.string(),
      headline: z.string(),
      subhead: z.string(),
      image: str,
      imageAlt: str,
      ctaLabel: str,
    }),
    why: z.object({
      heading: z.string(),
      paragraph: z.string(),
      image: str,
      imageAlt: str,
      benefits: z.array(iconText).default([]),
    }),
    breakdown: z.object({
      heading: z.string(),
      subhead: z.string(),
      cards: z.array(iconCard).default([]),
    }),
    results: z.object({
      heading: z.string(),
      paragraph: z.string(),
      image: str,
      imageAlt: str,
      ctaLabel: str,
    }),
    process: z.object({
      heading: z.string(),
      subhead: str,
      steps: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
    }),
    faqHeading: str,
    faq: z.array(faqItem).default([]),
    closing: z.object({ heading: z.string(), text: z.string(), ctaLabel: str }),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    slug: str,
    metaTitle: str,
    metaDescription: str,
    date,
    updated: z.preprocess(blank, date.optional()),
    featuredImage: str,
    featuredImageAlt: str,
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    faq: z.array(faqItem).default([]),
    draft: z.boolean().default(false),
  }),
});

const categories = defineCollection({
  loader: glob({ pattern: '*.yml', base: './src/content/categories' }),
  schema: z.object({
    title: z.string(),
    description: str,
    metaTitle: str,
    metaDescription: str,
  }),
});

export const collections = { pages, settings, services, blog, categories };
