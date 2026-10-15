# Rizq Marketing website

Astro (static output) + Decap CMS, deployed on Netlify.

- Content editors: see [CONTRIBUTING.md](CONTRIBUTING.md).
- Site URL is set in `astro.config.mjs` (`site`). Canonicals, sitemap, RSS and robots all use it.

## Commands

| Command | Action |
| --- | --- |
| `npm install` | Install dependencies (Node 22.22+; Netlify uses Node 24) |
| `npm run dev` | Dev server at `localhost:4321` (drafts are visible in dev) |
| `npm run build` | Build to `dist/` |
| `npx astro check` | Type-check |

## Where things live

```
src/content/pages/       SEO fields per page (meta title/description, OG image, noindex) + Services FAQ
src/content/services/    One YAML file per service page
src/content/blog/        Blog posts (Markdown)
src/content/categories/  Blog categories
src/content/settings/    Site Settings (business name, logos, contact, social links)
src/pages/               Routes (/, /about, /services, /services/[slug], /contact, /blog ...)
src/layouts/Base.astro   Shared layout: SEO tags + JSON-LD schema graph
public/admin/            Decap CMS (index.html + config.yml)
public/_redirects        Netlify redirects
```

## Deploying: connect this repo to your existing Netlify site

1. **Push the repo to GitHub.** Create an empty repo at <https://github.com/new>, then:
   ```bash
   git remote add origin git@github.com:YOUR-ORG/rizq-astro.git
   git push -u origin main
   ```
2. **Link it to the existing Netlify site.** Netlify dashboard → your site → **Site configuration → Build & deploy → Continuous deployment → Link repository** (it may say *Link site to Git*). Choose GitHub, authorize, pick the repo and the `main` branch. Build settings are read from `netlify.toml` (`npm run build`, publish `dist`). Click **Save**, then trigger a deploy. The manual-upload workflow is replaced by Git-based deploys.
3. **Keep the contact form working.** The form uses Netlify Forms (`data-netlify`). After the first Git deploy, check **Forms** in the dashboard; the `quote` form should appear. Re-add any email notification under **Forms → Form notifications** if it's missing.
4. **Enable Netlify Identity.** Site configuration → **Identity** (under *Access & security*) → **Enable Identity**. Set **Registration preferences** to **Invite only**.
5. **Enable Git Gateway.** On the same Identity page → **Services → Git Gateway → Enable Git Gateway**. This lets the CMS commit to GitHub on editors' behalf.
6. **Invite the contractor.** **Identity → Invite users**, enter their email. They accept the emailed invite, set a password, and land in `/admin/`.
7. **Test the loop.** Log in at `https://rizqmarketing.com/admin/`, edit a meta description, move it through Draft → In Review → Ready, publish, and confirm Netlify builds a new deploy.

### Notes and caveats

- **Editorial workflow** creates a branch and pull request per change in GitHub. Branch deploy previews appear in Netlify if enabled.
- **Netlify Identity / Git Gateway**: Netlify announced a deprecation in 2025 and reversed it in February 2026, but Git Gateway has had reliability reports. If it ever becomes a problem, Decap supports a GitHub backend with an OAuth proxy; only `backend:` in `public/admin/config.yml` changes.
- **Decap CMS is loaded from a CDN** (`unpkg.com/decap-cms@^3`) in `public/admin/index.html`.
- **Search**: the site's structured data declares a `SearchAction` that points at `/blog?s=term`, which is handled client-side on the blog page.
