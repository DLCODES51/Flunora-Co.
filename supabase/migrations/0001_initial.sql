-- Flunora & Co. Admin Dashboard Schema
-- Run in Supabase SQL Editor or via drizzle-kit push

CREATE TYPE "stock_status" AS ENUM ('in_stock', 'out_of_stock', 'low_stock');
CREATE TYPE "product_badge" AS ENUM ('new', 'bestseller', 'limited_edition', 'coming_soon');
CREATE TYPE "message_status" AS ENUM ('unread', 'read');
CREATE TYPE "user_role" AS ENUM ('admin', 'editor');

CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid PRIMARY KEY,
  "email" text NOT NULL UNIQUE,
  "full_name" text,
  "role" "user_role" DEFAULT 'admin' NOT NULL,
  "avatar_url" text,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "categories" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "slug" text NOT NULL UNIQUE,
  "description" text,
  "accent_color" text DEFAULT 'var(--pink)',
  "display_order" integer DEFAULT 0 NOT NULL,
  "featured" boolean DEFAULT false NOT NULL,
  "visible" boolean DEFAULT true NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "products" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "slug" text NOT NULL UNIQUE,
  "description" text,
  "short_description" text,
  "price" integer NOT NULL,
  "category_id" uuid REFERENCES "categories"("id") ON DELETE SET NULL,
  "tags" text[] DEFAULT '{}',
  "display_order" integer DEFAULT 0 NOT NULL,
  "featured" boolean DEFAULT false NOT NULL,
  "visible" boolean DEFAULT true NOT NULL,
  "archived" boolean DEFAULT false NOT NULL,
  "stock_status" "stock_status" DEFAULT 'in_stock' NOT NULL,
  "meesho_url" text,
  "badge" "product_badge",
  "seo_title" text,
  "seo_description" text,
  "meta_keywords" text[] DEFAULT '{}',
  "thumbnail_url" text,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "product_images" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "product_id" uuid NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "url" text NOT NULL,
  "alt" text,
  "display_order" integer DEFAULT 0 NOT NULL,
  "is_thumbnail" boolean DEFAULT false NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "collections" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "slug" text NOT NULL UNIQUE,
  "description" text,
  "banner_url" text,
  "thumbnail_url" text,
  "display_order" integer DEFAULT 0 NOT NULL,
  "featured" boolean DEFAULT false NOT NULL,
  "visible" boolean DEFAULT true NOT NULL,
  "seo_title" text,
  "seo_description" text,
  "accent_color" text,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "gallery" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" text,
  "url" text NOT NULL,
  "alt" text,
  "span" text,
  "bg_color" text,
  "display_order" integer DEFAULT 0 NOT NULL,
  "visible" boolean DEFAULT true NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "media" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "url" text NOT NULL,
  "mime_type" text,
  "size" integer,
  "folder" text DEFAULT 'general' NOT NULL,
  "alt" text,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "cms_content" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "key" text NOT NULL UNIQUE,
  "section" text NOT NULL,
  "content" jsonb NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "settings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "key" text NOT NULL UNIQUE,
  "value" jsonb NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "contact_messages" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "email" text NOT NULL,
  "message" text NOT NULL,
  "status" "message_status" DEFAULT 'unread' NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "newsletter" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" text NOT NULL UNIQUE,
  "subscribed_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "activity_logs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid REFERENCES "users"("id") ON DELETE SET NULL,
  "action" text NOT NULL,
  "entity_type" text,
  "entity_id" text,
  "details" jsonb,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS "products_slug_idx" ON "products" ("slug");
CREATE INDEX IF NOT EXISTS "products_category_idx" ON "products" ("category_id");
CREATE INDEX IF NOT EXISTS "products_featured_idx" ON "products" ("featured");
CREATE INDEX IF NOT EXISTS "products_visible_idx" ON "products" ("visible");
CREATE INDEX IF NOT EXISTS "gallery_order_idx" ON "gallery" ("display_order");
CREATE INDEX IF NOT EXISTS "contact_messages_status_idx" ON "contact_messages" ("status");

-- Row Level Security
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "product_images" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "collections" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "gallery" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "media" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "cms_content" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "contact_messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "newsletter" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "activity_logs" ENABLE ROW LEVEL SECURITY;

-- Public read for visible content
CREATE POLICY "public_read_visible_products" ON "products" FOR SELECT USING (visible = true AND archived = false);
CREATE POLICY "public_read_visible_categories" ON "categories" FOR SELECT USING (visible = true);
CREATE POLICY "public_read_visible_collections" ON "collections" FOR SELECT USING (visible = true);
CREATE POLICY "public_read_visible_gallery" ON "gallery" FOR SELECT USING (visible = true);
CREATE POLICY "public_read_cms" ON "cms_content" FOR SELECT USING (true);
CREATE POLICY "public_read_settings" ON "settings" FOR SELECT USING (true);
CREATE POLICY "public_insert_contact" ON "contact_messages" FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_newsletter" ON "newsletter" FOR INSERT WITH CHECK (true);

-- Authenticated admin full access
CREATE POLICY "admin_all_products" ON "products" FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_categories" ON "categories" FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_collections" ON "collections" FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_gallery" ON "gallery" FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_media" ON "media" FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_cms" ON "cms_content" FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_settings" ON "settings" FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_messages" ON "contact_messages" FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_newsletter" ON "newsletter" FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_activity" ON "activity_logs" FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_users" ON "users" FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_product_images" ON "product_images" FOR ALL USING (auth.role() = 'authenticated');

-- Seed default categories
INSERT INTO "categories" ("name", "slug", "accent_color", "display_order", "featured", "visible") VALUES
  ('Crochet Keychains', 'crochet-keychains', 'var(--pink)', 1, true, true),
  ('Crochet Plushies', 'crochet-plushies', 'var(--sky)', 2, true, true),
  ('Crochet Flowers', 'crochet-flowers', 'var(--butter)', 3, true, true),
  ('Home Decor', 'home-decor', 'var(--mint)', 4, false, true),
  ('Gift Collection', 'gift-collection', 'var(--peach)', 5, false, true),
  ('Coming Soon', 'coming-soon', 'var(--peach)', 6, false, false)
ON CONFLICT (slug) DO NOTHING;

-- Seed default CMS content
INSERT INTO "cms_content" ("key", "section", "content") VALUES
  ('hero', 'homepage', '{"heading":"Handmade Crochet Creations","subheading":"Made with Love, one stitch at a time.","description":"A tiny studio of soft cottons, slow afternoons, and little living things you can hold in your palm.","primaryButton":"Shop Collection","primaryButtonHref":"#shop","secondaryButton":"Explore","secondaryButtonHref":"#collections","badge":"New stitches every week"}'),
  ('about', 'about', '{"title":"Every stitch tells a story","paragraphs":["Flunora & Co. began as a quiet corner of yarn and patience — a place where cotton becomes companions.","No machines. No rush. Just hands, yarn, and a long love for the slow art of crochet."],"tagline":"Made with love, one stitch at a time."}'),
  ('contact', 'contact', '{"instagram":"https://instagram.com/flunora.co","whatsapp":"910000000000","email":"hello@flunora.co","mapsEmbed":""}'),
  ('footer', 'footer', '{"copyright":"Flunora & Co.","privacyUrl":"#","termsUrl":"#"}'),
  ('announcement', 'homepage', '{"enabled":false,"text":"","link":""}')
ON CONFLICT (key) DO NOTHING;

-- Seed default settings
INSERT INTO "settings" ("key", "value") VALUES
  ('site', '{"name":"Flunora & Co.","title":"Flunora & Co. — Cute Handmade Crochet Creations","description":"Adorable handmade crochet keychains, plushies, flowers and home decor from Flunora & Co.","logoUrl":"","faviconUrl":""}'),
  ('social', '{"instagram":"https://instagram.com/flunora.co","whatsapp":"910000000000","email":"hello@flunora.co","phone":""}'),
  ('loader', '{"enabled":true,"duration":2200}'),
  ('theme', '{"primaryColor":"#F5B3CB","backgroundColor":"#FFFDFC"}')
ON CONFLICT (key) DO NOTHING;
