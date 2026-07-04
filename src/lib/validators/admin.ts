import { z } from "zod";

export const authInputSchema = z.object({
  accessToken: z.string().min(1),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  price: z.number().min(0),
  categoryId: z.string().uuid().nullable().optional(),
  tags: z.array(z.string()).optional(),
  displayOrder: z.number().optional(),
  featured: z.boolean().optional(),
  visible: z.boolean().optional(),
  archived: z.boolean().optional(),
  stockStatus: z.enum(["in_stock", "out_of_stock", "low_stock"]).optional(),
  meeshoUrl: z.string().url().optional().or(z.literal("")),
  badge: z.enum(["new", "bestseller", "limited_edition", "coming_soon"]).nullable().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  metaKeywords: z.array(z.string()).optional(),
  thumbnailUrl: z.string().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  accentColor: z.string().optional(),
  displayOrder: z.number().optional(),
  featured: z.boolean().optional(),
  visible: z.boolean().optional(),
});

export const collectionSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  bannerUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  displayOrder: z.number().optional(),
  featured: z.boolean().optional(),
  visible: z.boolean().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  accentColor: z.string().optional(),
});

export const gallerySchema = z.object({
  title: z.string().optional(),
  url: z.string().min(1),
  alt: z.string().optional(),
  span: z.string().optional(),
  bgColor: z.string().optional(),
  displayOrder: z.number().optional(),
  visible: z.boolean().optional(),
});

export const contactMessageSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
});

export const cmsUpdateSchema = z.object({
  key: z.string().min(1),
  section: z.string().min(1),
  content: z.record(z.unknown()),
});

export const settingsUpdateSchema = z.object({
  key: z.string().min(1),
  value: z.record(z.unknown()),
});

export const bulkProductActionSchema = z.object({
  ids: z.array(z.string().uuid()).min(1),
  action: z.enum(["delete", "hide", "publish", "archive", "restore", "feature", "unfeature"]),
  categoryId: z.string().uuid().optional(),
  stockStatus: z.enum(["in_stock", "out_of_stock", "low_stock"]).optional(),
});

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
