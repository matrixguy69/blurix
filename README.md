# Blurix — Storefront

A glassmorphic, animated storefront for Blurix (Sialkot sports gear). Pure HTML/CSS/JS — no build step, no framework, deploys anywhere.

## What's inside
- `index.html` — full site: hero, product grid, cart, checkout, story, FAQ, contact, cookie banner
- `css/style.css` — all styling (design tokens at the top of the file under `:root`)
- `js/app.js` — product data, cart logic (saved in browser localStorage), filters, checkout flow, FAQ accordion

## Run it locally
Just open `index.html` in a browser. No install needed.

Or serve it properly (recommended, avoids some browser quirks):
```
npx serve .
```

## Deploy to GitHub + Vercel
1. Create a new GitHub repo and push this folder:
   ```
   git init
   git add .
   git commit -m "Blurix storefront"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/blurix.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) → **New Project** → import the `blurix` repo.
3. Framework preset: choose **Other** (it's static HTML, no build command needed).
4. Deploy. Vercel will give you a live `.vercel.app` URL immediately — you can attach a custom domain later in Project Settings.

## Things you'll want to do before going live
1. **Real product photos** — swap the emoji icons in `PRODUCTS` (in `js/app.js`) and `.product-media`/`.hero-card-icon` for real `<img>` tags of your actual products.
2. **Real payment processing** — right now checkout is a demo: it collects shipping info and "places" an order with no real payment happening. To actually charge cards, you need a backend + a payment gateway (JazzCash/Easypaisa merchant API for local, or Stripe for international cards). This needs a server — a static site alone can't safely handle payments.
3. **Order storage** — right now "placing an order" doesn't save anywhere except clearing the local cart. You'll want orders to hit a database or at minimum email/WhatsApp you the order details. Simple options: a serverless function on Vercel that sends the order to Google Sheets, Airtable, or your email via a service like Resend or Formspree.
4. **Real contact links** — update the WhatsApp number, Instagram handle, and email in `index.html` (`#contact` and footer sections) to your real ones.
5. **Analytics** — add Google Analytics or Plausible if you want to track visitors (make sure your cookie banner language matches whatever you actually track).

## Editing products
All products live in one array at the top of `js/app.js`:
```js
{ id: 1, name: "Match Pro '26", cat: "football", price: 3200, icon: "⚽", tag: "Best Seller" }
```
`cat` must be one of: `football`, `boxing`, `gym`, `apparel` (or add a new category — just add a matching filter chip in `index.html`).
