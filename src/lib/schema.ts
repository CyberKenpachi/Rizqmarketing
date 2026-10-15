import { SITE, abs, plain } from './content';

export const ORG_ID = `${SITE}/#organization`;
export const WEBSITE_ID = `${SITE}/#website`;

type Settings = {
  businessName: string;
  description: string;
  logo: string;
  email: string;
  phone?: string;
  address?: Record<string, string | undefined>;
  areaServed?: string;
  languages: string[];
  socialLinks: { label: string; url: string }[];
};
type ServiceLite = { title: string; slug: string; serviceType?: string; summary: string };

export const organizationNode = (s: Settings, services: ServiceLite[]) => ({
  '@type': 'Organization',
  '@id': ORG_ID,
  name: s.businessName,
  url: `${SITE}/`,
  logo: { '@type': 'ImageObject', url: abs(s.logo) },
  image: abs(s.logo),
  description: s.description,
  email: s.email,
  ...(s.phone ? { telephone: s.phone } : {}),
  ...(s.address && Object.values(s.address).some(Boolean)
    ? {
        address: {
          '@type': 'PostalAddress',
          streetAddress: s.address.street,
          addressLocality: s.address.city,
          addressRegion: s.address.region,
          postalCode: s.address.postalCode,
          addressCountry: s.address.country,
        },
      }
    : {}),
  ...(s.areaServed ? { areaServed: s.areaServed } : {}),
  ...(s.languages.length ? { knowsLanguage: s.languages } : {}),
  ...(s.socialLinks.length ? { sameAs: s.socialLinks.map((l) => l.url) } : {}),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: `${s.businessName} Services`,
    itemListElement: services.map((v) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: v.title, url: `${SITE}/services/${v.slug}` },
    })),
  },
});

// SearchAction targets the blog search on /blog (?s=term).
export const websiteNode = (s: Settings) => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE}/`,
  name: s.businessName,
  publisher: { '@id': ORG_ID },
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE}/blog?s={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
});

export const breadcrumbNode = (items: { name: string; path: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: abs(it.path),
  })),
});

export const faqNode = (items: { question: string; answer: string }[]) => ({
  '@type': 'FAQPage',
  mainEntity: items.map((q) => ({
    '@type': 'Question',
    name: q.question,
    acceptedAnswer: { '@type': 'Answer', text: plain(q.answer) },
  })),
});

export const serviceNode = (v: ServiceLite & { description: string }) => ({
  '@type': 'Service',
  '@id': `${SITE}/services/${v.slug}#service`,
  name: v.title,
  ...(v.serviceType ? { serviceType: v.serviceType } : {}),
  provider: { '@id': ORG_ID },
  description: v.description,
  url: `${SITE}/services/${v.slug}`,
});

export const serviceListNode = (services: (ServiceLite & { description: string })[]) => ({
  '@type': 'ItemList',
  itemListElement: services.map((v, i) => ({ position: i + 1, ...serviceNode(v) })),
});

export const articleNode = (a: {
  url: string;
  title: string;
  description: string;
  image?: string;
  published: Date;
  modified?: Date;
}) => ({
  '@type': 'Article',
  '@id': `${a.url}#article`,
  mainEntityOfPage: { '@type': 'WebPage', '@id': a.url },
  headline: a.title,
  description: a.description,
  ...(a.image ? { image: [a.image] } : {}),
  datePublished: a.published.toISOString(),
  dateModified: (a.modified ?? a.published).toISOString(),
  author: { '@id': ORG_ID },
  publisher: { '@id': ORG_ID },
});
