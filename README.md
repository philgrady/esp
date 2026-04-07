# ESP Ecommerce (Astro + Stripe Checkout)

A production-ready starter ecommerce site for small businesses:
- **Static Astro frontend** for speed and easy hosting.
- **Single spreadsheet** (`products.csv` or `products.xlsx`) as your source of truth.
- **Build-time data conversion** into JSON.
- **Minimal serverless backend** only for creating Stripe Checkout sessions.
- **No card details processed or stored by your app**.

## 1) Architecture choice (and why)

### Chosen architecture
- **Frontend:** Astro static site generation (SSG).
- **Product source:** Spreadsheet in `/data`.
- **Data pipeline:** `scripts/convert-products.mjs` converts spreadsheet to `/src/data/products.json` at build time.
- **Cart:** Client-side localStorage.
- **Payments:** Stripe Checkout session created by tiny serverless function.

### Why this is best for your goal
- **Fast pages:** Product and category pages are pre-rendered static HTML.
- **Simple maintenance:** Non-technical staff can edit one spreadsheet.
- **Secure checkout:** Stripe-hosted checkout collects card details securely.
- **Low cost & low complexity:** No database required for V1.
- **Portable deploy:** Works on Netlify and Vercel.

---

## 2) Folder structure

```text
.
├─ api/
│  └─ create-checkout-session.js        # Vercel serverless function
├─ data/
│  └─ products.csv                      # Spreadsheet source (or products.xlsx)
├─ netlify/
│  └─ functions/
│     └─ create-checkout-session.mjs    # Netlify serverless function
├─ public/
│  ├─ robots.txt
│  └─ images/                           # Mock/placeholder product images
├─ scripts/
│  └─ convert-products.mjs              # Spreadsheet -> JSON build step
├─ src/
│  ├─ components/
│  │  ├─ CartScript.astro
│  │  └─ ProductCard.astro
│  ├─ data/
│  │  └─ products.json                  # Generated file
│  ├─ layouts/
│  │  └─ BaseLayout.astro
│  ├─ lib/
│  │  └─ products.js
│  └─ pages/
│     ├─ category/[category].astro
│     ├─ product/[slug].astro
│     ├─ products/index.astro
│     ├─ cart.astro
│     ├─ checkout/success.astro
│     ├─ checkout/cancel.astro
│     ├─ index.astro
│     ├─ about.astro
│     ├─ contact.astro
│     ├─ delivery.astro
│     ├─ returns.astro
│     ├─ privacy.astro
│     └─ terms.astro
├─ astro.config.mjs
├─ netlify.toml
├─ vercel.json
└─ package.json
```

---

## 3) Spreadsheet template

Use these columns exactly (header row):

```csv
sku,slug,title,short_description,full_description,category,subcategory,price_gbp,sale_price_gbp,stripe_price_id,image_1,image_2,image_3,stock_status,lead_time,vat_rate,weight,meta_title,meta_description,canonical_url,status,featured,sort_order
```

### Notes for each important field
- `slug`: unique URL slug (`organic-cotton-tee`).
- `price_gbp` / `sale_price_gbp`: numbers only.
- `stripe_price_id`: Stripe Price ID like `price_123...`.
- `status`: use `active` to publish.
- `featured`: `true` / `false`.
- `sort_order`: smaller number appears first.

---

## 4) Full implementation (how it works)

### Build pipeline
1. Put product data in `data/products.csv` (or `products.xlsx`).
2. Run `npm run build`.
3. `prebuild` automatically runs `node scripts/convert-products.mjs`.
4. Script creates `src/data/products.json`.
5. Astro builds static pages from JSON.

### Frontend features included
- Home page
- Category pages
- Product listing page
- Product detail pages
- Search + category filter
- Basket/cart in localStorage
- Checkout button
- Success + cancel pages
- About/Contact/Delivery/Returns/Privacy/Terms pages
- Product JSON-LD schema markup
- Sitemap via `@astrojs/sitemap`
- `robots.txt`
- Mobile-first responsive layout

### Checkout flow
1. Customer adds items to basket.
2. On `/cart`, user clicks “Checkout securely”.
3. Browser sends basket items (with `stripe_price_id` + qty) to `/api/create-checkout-session`.
4. Serverless function creates Stripe Checkout session.
5. Browser redirects to returned Stripe Checkout URL.

---

## 5) Editing products / adding products

### Edit existing products
- Open `data/products.csv` in Excel/Sheets.
- Update rows.
- Keep headers unchanged.
- Commit and deploy.

### Add new products
- Add a new row.
- Required minimum fields:
  - `sku`
  - `slug`
  - `title`
  - `category`
  - `price_gbp`
  - `stripe_price_id`
  - `status=active`
- Add images under `public/images` and update `image_1..image_3`.

### Stripe setup
1. Create products/prices in Stripe dashboard (GBP).
2. Copy each `price_...` into spreadsheet `stripe_price_id`.
3. Set environment variable `STRIPE_SECRET_KEY` on host.

---

## 6) Local setup

```bash
npm install
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

---

## 7) Environment variables

Required:

- `STRIPE_SECRET_KEY` = your Stripe secret key (`sk_live_...` / `sk_test_...`)
- `SITE_URL` = your public site URL (recommended for redirects/sitemap)

Optional:
- `STRIPE_PUBLISHABLE_KEY` if you later add Stripe.js features.

---

## 8) Deployment: Netlify

1. Push repository to GitHub/GitLab/Bitbucket.
2. In Netlify: **New site from Git**.
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Netlify functions directory is already configured in `netlify.toml`.
5. Add environment variables:
   - `STRIPE_SECRET_KEY`
   - `SITE_URL`
6. Deploy.
7. Verify:
   - Product pages render.
   - Cart works.
   - `/api/create-checkout-session` redirects to Stripe Checkout.

---

## 9) Deployment: Vercel

1. Import repository into Vercel.
2. Framework preset: **Astro**.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Vercel serverless function is in `/api/create-checkout-session.js`.
6. Add environment variables:
   - `STRIPE_SECRET_KEY`
   - `SITE_URL`
7. Deploy and test checkout.

---

## 10) Security and compliance notes

- This app **does not** handle raw card details.
- Card data entry happens only on Stripe-hosted checkout page.
- Always use HTTPS in production.
- Review and complete your legal pages before going live.

---

## 11) Future enhancements (optional)

- Inventory sync from ERP/POS.
- Webhooks for order confirmation and fulfillment status.
- Analytics and conversion tracking.
- Multi-currency and localization.
- CMS admin UI if spreadsheet workflow outgrows needs.
