# Nutraceutical Website + Admin Panel

Build a light-green, natural-health product site with a JSON-shaped content model, plus a secure admin panel to edit everything. Backend runs on Lovable Cloud (database, auth, image storage).

## Public website

- **Home** — hero, brand tagline, featured products, trust/benefits strip, CTA.
- **Products** — category filter, product cards (image, name, price in NPR when shown, short description). Disabled categories/products never render.
- **Product detail** — image, description, price, WhatsApp enquiry CTA.
- **About** — editable paragraph content.
- **Contact** — phone, email, address, embedded location map.
- **Header** — logo top-left (admin-updatable), responsive nav, mobile menu.
- **Footer** — brand blurb, navigation, contact info, social icons, WhatsApp option, copyright. Nothing hard-coded.
- **Floating WhatsApp button** — bottom-right, fixed, subtle hover animation, accessible label, mobile-safe offset so it never covers key content.

Social icons (Facebook, Instagram, TikTok) render only when enabled and the URL is valid. Accessible labels: "Visit us on Facebook", "Follow us on Instagram", "Follow us on TikTok".

WhatsApp URL is generated at runtime from the stored number + message (URL-encoded), never hard-coded.

## Admin panel

Email + password login, protected routes. Sections:

- **Site settings** — brand name, tagline, logo upload.
- **Categories** — add/edit/delete, enable/disable, name.
- **Products** — enable/disable, category, name, price (NPR) with show/hide toggle, description, image upload (client-side compressed to under 1 MB before upload).
- **Home content** and **About** — editable text blocks.
- **Contact** — phone, email, address, map location.
- **Social media** — Facebook / Instagram / TikTok: enable toggle + URL. WhatsApp: enable, phone number, default message, button label.

Each form has Save Changes, success toasts, and inline validation errors.

## Validation

- Social URLs must be valid http/https; platform-appropriate host check.
- WhatsApp number: digits only, international format without `+`, spaces, or brackets (e.g. `9779800000000`).
- All input validated again server-side before saving; invalid or empty config is skipped on the public site rather than breaking it.

## Design

Light greenish natural-health theme: soft sage/mint surfaces, deep leaf-green accents, warm off-white background, generous whitespace, rounded cards, soft shadows. Fully responsive, large tap targets on mobile, fast image loading (lazy loading, compressed uploads).

## SEO

Per-page titles, descriptions, and Open Graph/Twitter tags. Single H1 per page, semantic HTML, alt text on all product/logo images, Organization JSON-LD including `sameAs` entries for only the enabled social profiles.

## Technical notes

- Lovable Cloud tables: `site_settings` (single row holding the JSON-shaped config incl. `socialMedia`), `categories`, `products`, plus `user_roles` with an `admin` role and a `has_role` security-definer function. RLS: public read of enabled content via `anon`; writes restricted to admins.
- Product/logo images stored in a Cloud storage bucket, public read.
- Reads and writes go through TanStack server functions (`/src/lib/*.functions.ts`) — the browser never writes settings directly; admin writes verify the caller's admin role server-side.
- Content is exposed to components through one typed `siteConfig` object matching the JSON shape from the brief, so the public site stays config-driven.
- First admin account: you sign up, then I grant the admin role.

## Verification

After build: admin can edit each social platform and WhatsApp fields, toggles hide/show icons, footer reflects changes, links open correctly, WhatsApp button opens the configured chat with the default message, changes persist across reloads, mobile layout is clean, no console errors.
