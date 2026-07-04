import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const stockStatusEnum = pgEnum("stock_status", [
  "in_stock",
  "out_of_stock",
  "low_stock",
]);
export const productBadgeEnum = pgEnum("product_badge", [
  "new",
  "bestseller",
  "limited_edition",
  "coming_soon",
]);
export const messageStatusEnum = pgEnum("message_status", ["unread", "read"]);
export const userRoleEnum = pgEnum("user_role", ["admin", "editor"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  role: userRoleEnum("role").default("admin").notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    accentColor: text("accent_color").default("var(--pink)"),
    displayOrder: integer("display_order").default(0).notNull(),
    featured: boolean("featured").default(false).notNull(),
    visible: boolean("visible").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("categories_slug_idx").on(t.slug), index("categories_order_idx").on(t.displayOrder)],
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    shortDescription: text("short_description"),
    price: integer("price").notNull(),
    categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
    tags: text("tags").array().default([]),
    displayOrder: integer("display_order").default(0).notNull(),
    featured: boolean("featured").default(false).notNull(),
    visible: boolean("visible").default(true).notNull(),
    archived: boolean("archived").default(false).notNull(),
    stockStatus: stockStatusEnum("stock_status").default("in_stock").notNull(),
    meeshoUrl: text("meesho_url"),
    badge: productBadgeEnum("badge"),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    metaKeywords: text("meta_keywords").array().default([]),
    thumbnailUrl: text("thumbnail_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("products_slug_idx").on(t.slug),
    index("products_category_idx").on(t.categoryId),
    index("products_featured_idx").on(t.featured),
    index("products_visible_idx").on(t.visible),
    index("products_order_idx").on(t.displayOrder),
  ],
);

export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    alt: text("alt"),
    displayOrder: integer("display_order").default(0).notNull(),
    isThumbnail: boolean("is_thumbnail").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("product_images_product_idx").on(t.productId)],
);

export const collections = pgTable(
  "collections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    bannerUrl: text("banner_url"),
    thumbnailUrl: text("thumbnail_url"),
    displayOrder: integer("display_order").default(0).notNull(),
    featured: boolean("featured").default(false).notNull(),
    visible: boolean("visible").default(true).notNull(),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    accentColor: text("accent_color"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("collections_slug_idx").on(t.slug)],
);

export const gallery = pgTable(
  "gallery",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title"),
    url: text("url").notNull(),
    alt: text("alt"),
    span: text("span"),
    bgColor: text("bg_color"),
    displayOrder: integer("display_order").default(0).notNull(),
    visible: boolean("visible").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("gallery_order_idx").on(t.displayOrder)],
);

export const media = pgTable(
  "media",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    url: text("url").notNull(),
    mimeType: text("mime_type"),
    size: integer("size"),
    folder: text("folder").default("general").notNull(),
    alt: text("alt"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("media_folder_idx").on(t.folder)],
);

export const cmsContent = pgTable(
  "cms_content",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    key: text("key").notNull().unique(),
    section: text("section").notNull(),
    content: jsonb("content").notNull().$type<Record<string, unknown>>(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("cms_content_section_idx").on(t.section)],
);

export const settings = pgTable("settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(),
  value: jsonb("value").notNull().$type<Record<string, unknown>>(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const contactMessages = pgTable(
  "contact_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    message: text("message").notNull(),
    status: messageStatusEnum("status").default("unread").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("contact_messages_status_idx").on(t.status)],
);

export const newsletter = pgTable(
  "newsletter",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    subscribedAt: timestamp("subscribed_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("newsletter_email_idx").on(t.email)],
);

export const activityLogs = pgTable(
  "activity_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    entityType: text("entity_type"),
    entityId: text("entity_id"),
    details: jsonb("details").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("activity_logs_user_idx").on(t.userId)],
);

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  images: many(productImages),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, { fields: [productImages.productId], references: [products.id] }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type Collection = typeof collections.$inferSelect;
export type GalleryItem = typeof gallery.$inferSelect;
export type MediaItem = typeof media.$inferSelect;
export type CmsContent = typeof cmsContent.$inferSelect;
export type Setting = typeof settings.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type NewsletterSubscriber = typeof newsletter.$inferSelect;
export type ActivityLog = typeof activityLogs.$inferSelect;
