# Contributing: managing content (no code needed)

All content is managed at **https://rizqmarketing.com/admin/**. You never need to touch code.

## Logging in

1. Accept the invite email from Netlify ("You've been invited to join rizqmarketing.com"). The link opens the site, then forwards you to the CMS to set a password.
2. Afterwards, go to `/admin/`, click **Login with Netlify Identity**, and sign in with your email and password.

## How publishing works (editorial workflow)

Every change moves through three columns: **Drafts → In Review → Ready**.

1. Make your edits and click **Save** (it lands in *Drafts*).
2. When it's ready for someone to check, set the status to **In Review**.
3. When approved, set **Ready** and click **Publish → Publish now**.

Publishing commits to GitHub and Netlify rebuilds the site automatically. Changes are live in about a minute.

## Create a blog post

1. **Blog Posts → New Blog Post**.
2. Fill in:
   - **Title** (this becomes the page's H1).
   - **URL slug**: lowercase words with hyphens, e.g. `google-ads-budget-tips`. The post will live at `/blog/google-ads-budget-tips`.
   - **Meta title** (about 50 to 60 characters) and **Meta description** (150 to 160 characters). If left empty, the title and the start of the article are used.
   - **Publish date**, and an **Updated date** when you revise an old post.
   - **Featured image** and its **alt text** (describe the image).
   - **Categories**: pick one or more. Add new ones under **Blog Categories** first.
   - **Tags**, **Body**, and optional **FAQ** (shown as an accordion at the end and marked up for Google).
3. In the body, **start headings at H2** (`##`). The title is already the page's only H1.
4. Leave **Draft** off when you want it published. Turn **Draft** on to keep it out of the live site.

The blog index paginates automatically (9 posts per page), category pages are generated automatically, and the RSS feed is at `/rss.xml`.

The **Blog** link in the site header and footer appears automatically once at least one non-draft post exists.

> `Sample post (delete me)` is a draft that shows how formatting looks. Delete it from **Blog Posts** when you publish your first real article.

## Create or edit a service page

1. **Services → New Service** (or open an existing one).
2. Sections appear on the page in this order: Hero, Why [service], Services breakdown (exactly 4 cards), Results, Process (exactly 3 steps), FAQ, Closing CTA.
3. **URL slug** sets the address (`/services/your-slug`). **Order** sets the position of its card on the Home and Services pages.
4. Images: upload under each section's **Image** field and always fill in **Image alt text**.
5. The current copy is placeholder text, so replace it before promoting the pages.

## Edit meta tags (title, description, social image)

- **Pages → Home / About / Contact / Blog / Services**: Meta title, Meta description, Open Graph image, and a **Noindex** toggle.
- **Services** and **Blog Posts** have the same fields on each entry.
- **Open Graph image** is the picture shown when the page is shared (1200 x 630 works best). If empty, the default from **Site Settings** is used.
- **Noindex** hides a page from Google and removes it from the sitemap. Use it sparingly.
- **Site Settings** controls the business name, logos, default share image, social links and the contact details used in structured data (schema).

## Add a redirect

Redirects are needed whenever a URL changes (for example, after changing a slug) so old links and Google rankings carry over.

1. In GitHub, open the file `public/_redirects`.
2. Add one line per redirect: `/old-path  /new-path  301`. For example:
   ```
   /blog/old-post-name  /blog/new-post-name  301
   /services/seo  /services/seo-local-visibility  301
   ```
3. Commit the change. Netlify rebuilds and the redirect goes live.

(Redirects are the one task that happens in GitHub rather than the CMS.)

## SEO checklist before publishing

- One H1 per page (the title). Use H2 and H3 in order, without skipping levels.
- Meta title and description filled in and within the recommended lengths.
- Every image has alt text.
- Link to relevant service pages (`/services/...`) and to `/contact` where it makes sense.

## Running the site locally (developers)

```bash
npm install
npm run dev          # http://localhost:4321
npx decap-server     # optional: lets /admin edit local files without logging in
npm run build        # production build into dist/
```
