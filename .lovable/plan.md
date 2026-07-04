## Flunora & Co. — Crumbl-Inspired Redesign Plan

Full rebuild of the public site to match the Crumbl-style playful crochet brief. Admin/CMS deferred (needs Lovable Cloud).

### 1. Design tokens (`src/styles.css`)

- Swap palette to exact hex from brief: `#FFFDFC` bg, `#F5B3CB` pink, `#DDF4FF` blue, `#FFE89A` yellow, `#D9F4D7` mint, `#FFD7BF` peach, `#111` ink/buttons.
- Fonts: Fredoka (headings), Plus Jakarta Sans (body), Pacifico (accent words). Load via `<link>` in `__root.tsx`.
- Chunky radii (`--radius: 1.75rem`), pill buttons, soft shadow `0 10px 30px rgba(0,0,0,0.08)`, 1.5px black borders for sticker feel.
- Category accent tokens (`--cat-keychain`, `--cat-flower`, etc).

### 2. Custom yarn-ball loader

- New `Loader.tsx`: SVG stitched circle, yarn ball rolls along path drawing dashed thread (Framer Motion `pathLength`), morphs into Flunora wordmark, fades out.
- Mount in `__root.tsx` with one-shot intro + route-change overlay.

### 3. Navbar

- Sticky pink bar, centered Pacifico+Fredoka logo, hamburger left, "Shop" pill CTA right.
- Slide-in side drawer (Framer Motion) with large rounded links, blurred backdrop, items: Home, Shop, Collections, About, Gallery, Contact, Instagram.

### 4. Hero

- Full-screen, centered headline "Handmade Crochet Creations / Made with Love, One Stitch at a Time."
- Pacifico accent word "Handmade".
- Floating crochet plushie images peeking from edges (strawberry, flower, whale, turtle, bee, yarn ball) with parallax + mouse tilt.
- Sticker tags, sparkles, curved arrow doodle, soft pastel gradient blobs.
- R3F yarn-ball kept as subtle background accent only.
- Two pill CTAs with bouncy hover.

### 5. Products (Crumbl "Weekly Flavors" feel)

- Oversized cards, per-category pastel background, large image, category sticker badge, name (Fredoka), price, short copy, black pill "Buy on Meesho".
- Hover: lift + image zoom + button bounce + brightness.
- Live search + category chip filters retained.

### 6. Collections

- Editorial alternating left/right cards, oversized rounded rectangles in pastel bg, big heading, blurb, pill CTA.
- Categories: Keychains, Plushies, Flowers, Home Decor, Gift Collection, Coming Soon.

### 7. About / Gallery / Contact / Footer

- About: image+text collage, short punchy lines, sticker accents.
- Gallery: masonry, rounded, hover zoom, existing lightbox.
- Contact: Instagram/WhatsApp/Email cards + form + map placeholder.
- Footer: cream, rounded top, social icons, quick links, legal, back-to-top button.

### 8. Decorations & motion

- Reusable `<Doodle>` SVGs (yarn squiggle, heart, sparkle, ribbon, arrow) scattered with gentle float/rotate loops.
- Scroll-reveal wrapper using `whileInView`.
- Subtle global mouse follower (soft pink blob).

### 9. Assets

- Generate new sticker-style decorative SVGs/PNGs as needed (sparkles, ribbons, arrows). Reuse existing product photos.

### Deferred (need Lovable Cloud)

Admin auth, CMS editing, media library, analytics, inventory. Will offer to enable Cloud after public site lands.

### Out-of-scope this pass

Next.js migration (project is TanStack Start — keeping it; functionally equivalent for the brief). GSAP (Framer Motion covers everything).
