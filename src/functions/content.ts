import { createServerFn } from "@tanstack/react-start";
import { eq, desc, ilike, count, or } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { requireAdmin, logActivity, isDbConfigured } from "@/functions/auth";
import { cmsUpdateSchema, settingsUpdateSchema, contactMessageSchema } from "@/lib/validators/admin";

async function authDb(accessToken: string) {
  if (!isDbConfigured()) throw new Error("Database not configured");
  const user = await requireAdmin(accessToken);
  return { db: getDb(), user };
}

// CMS
export const getCmsContent = createServerFn({ method: "GET" })
  .validator((data: { accessToken: string }) => data)
  .handler(async ({ data }) => {
    const { db } = await authDb(data.accessToken);
    return db.query.cmsContent.findMany({ orderBy: [desc(schema.cmsContent.updatedAt)] });
  });

export const upsertCmsContent = createServerFn({ method: "POST" })
  .validator((data: { accessToken: string; payload: unknown }) => data)
  .handler(async ({ data }) => {
    const { db, user } = await authDb(data.accessToken);
    const parsed = cmsUpdateSchema.parse(data.payload);
    const existing = await db.query.cmsContent.findFirst({ where: eq(schema.cmsContent.key, parsed.key) });

    if (existing) {
      const [updated] = await db
        .update(schema.cmsContent)
        .set({ content: parsed.content, section: parsed.section, updatedAt: new Date() })
        .where(eq(schema.cmsContent.key, parsed.key))
        .returning();
      await logActivity(user.id, "update", "cms", parsed.key);
      return updated;
    }

    const [created] = await db.insert(schema.cmsContent).values(parsed).returning();
    await logActivity(user.id, "create", "cms", parsed.key);
    return created;
  });

export const getPublicCms = createServerFn({ method: "GET" }).handler(async () => {
  if (!isDbConfigured()) return null;
  try {
    const db = getDb();
    return db.query.cmsContent.findMany();
  } catch {
    return null;
  }
});

// Settings
export const getSettings = createServerFn({ method: "GET" })
  .validator((data: { accessToken: string }) => data)
  .handler(async ({ data }) => {
    const { db } = await authDb(data.accessToken);
    return db.query.settings.findMany();
  });

export const upsertSetting = createServerFn({ method: "POST" })
  .validator((data: { accessToken: string; payload: unknown }) => data)
  .handler(async ({ data }) => {
    const { db, user } = await authDb(data.accessToken);
    const parsed = settingsUpdateSchema.parse(data.payload);
    const existing = await db.query.settings.findFirst({ where: eq(schema.settings.key, parsed.key) });

    if (existing) {
      const [updated] = await db
        .update(schema.settings)
        .set({ value: parsed.value, updatedAt: new Date() })
        .where(eq(schema.settings.key, parsed.key))
        .returning();
      await logActivity(user.id, "update", "settings", parsed.key);
      return updated;
    }

    const [created] = await db.insert(schema.settings).values(parsed).returning();
    await logActivity(user.id, "create", "settings", parsed.key);
    return created;
  });

export const getPublicSettings = createServerFn({ method: "GET" }).handler(async () => {
  if (!isDbConfigured()) return null;
  try {
    const db = getDb();
    return db.query.settings.findMany();
  } catch {
    return null;
  }
});

// Media
export const getMedia = createServerFn({ method: "GET" })
  .validator((data: { accessToken: string; search?: string; folder?: string }) => data)
  .handler(async ({ data }) => {
    const { db } = await authDb(data.accessToken);
    return db.query.media.findMany({
      where: data.folder
        ? eq(schema.media.folder, data.folder)
        : data.search
          ? or(ilike(schema.media.name, `%${data.search}%`), ilike(schema.media.alt, `%${data.search}%`))
          : undefined,
      orderBy: [desc(schema.media.createdAt)],
    });
  });

export const createMedia = createServerFn({ method: "POST" })
  .validator((data: { accessToken: string; item: { name: string; url: string; mimeType?: string; size?: number; folder?: string; alt?: string } }) => data)
  .handler(async ({ data }) => {
    const { db, user } = await authDb(data.accessToken);
    const [created] = await db.insert(schema.media).values(data.item).returning();
    await logActivity(user.id, "create", "media", created.id);
    return created;
  });

export const deleteMedia = createServerFn({ method: "POST" })
  .validator((data: { accessToken: string; id: string }) => data)
  .handler(async ({ data }) => {
    const { db, user } = await authDb(data.accessToken);
    await db.delete(schema.media).where(eq(schema.media.id, data.id));
    await logActivity(user.id, "delete", "media", data.id);
    return { success: true };
  });

export const getMediaCount = createServerFn({ method: "GET" })
  .validator((data: { accessToken: string }) => data)
  .handler(async ({ data }) => {
    const { db } = await authDb(data.accessToken);
    const [result] = await db.select({ count: count() }).from(schema.media);
    return result.count;
  });

// Contact Messages
export const getMessages = createServerFn({ method: "GET" })
  .validator((data: { accessToken: string; status?: string; search?: string }) => data)
  .handler(async ({ data }) => {
    const { db } = await authDb(data.accessToken);
    return db.query.contactMessages.findMany({
      where: data.status
        ? eq(schema.contactMessages.status, data.status as "unread" | "read")
        : undefined,
      orderBy: [desc(schema.contactMessages.createdAt)],
    });
  });

export const updateMessageStatus = createServerFn({ method: "POST" })
  .validator((data: { accessToken: string; id: string; status: "read" | "unread" }) => data)
  .handler(async ({ data }) => {
    const { db, user } = await authDb(data.accessToken);
    const [updated] = await db
      .update(schema.contactMessages)
      .set({ status: data.status })
      .where(eq(schema.contactMessages.id, data.id))
      .returning();
    await logActivity(user.id, "update", "message", data.id);
    return updated;
  });

export const deleteMessage = createServerFn({ method: "POST" })
  .validator((data: { accessToken: string; id: string }) => data)
  .handler(async ({ data }) => {
    const { db, user } = await authDb(data.accessToken);
    await db.delete(schema.contactMessages).where(eq(schema.contactMessages.id, data.id));
    await logActivity(user.id, "delete", "message", data.id);
    return { success: true };
  });

export const submitContactMessage = createServerFn({ method: "POST" })
  .validator((data: unknown) => data)
  .handler(async ({ data }) => {
    if (!isDbConfigured()) return { success: true, offline: true };
    const parsed = contactMessageSchema.parse(data);
    const db = getDb();
    await db.insert(schema.contactMessages).values(parsed);
    return { success: true };
  });

export const getMessageCount = createServerFn({ method: "GET" })
  .validator((data: { accessToken: string }) => data)
  .handler(async ({ data }) => {
    const { db } = await authDb(data.accessToken);
    const [total] = await db.select({ count: count() }).from(schema.contactMessages);
    const [unread] = await db
      .select({ count: count() })
      .from(schema.contactMessages)
      .where(eq(schema.contactMessages.status, "unread"));
    return { total: total.count, unread: unread.count };
  });

// Newsletter
export const getNewsletterSubscribers = createServerFn({ method: "GET" })
  .validator((data: { accessToken: string; search?: string }) => data)
  .handler(async ({ data }) => {
    const { db } = await authDb(data.accessToken);
    return db.query.newsletter.findMany({
      where: data.search ? ilike(schema.newsletter.email, `%${data.search}%`) : undefined,
      orderBy: [desc(schema.newsletter.subscribedAt)],
    });
  });

export const deleteSubscriber = createServerFn({ method: "POST" })
  .validator((data: { accessToken: string; id: string }) => data)
  .handler(async ({ data }) => {
    const { db, user } = await authDb(data.accessToken);
    await db.delete(schema.newsletter).where(eq(schema.newsletter.id, data.id));
    await logActivity(user.id, "delete", "newsletter", data.id);
    return { success: true };
  });

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .validator((data: { email: string }) => data)
  .handler(async ({ data }) => {
    if (!isDbConfigured()) return { success: true, offline: true };
    const db = getDb();
    await db
      .insert(schema.newsletter)
      .values({ email: data.email })
      .onConflictDoNothing({ target: schema.newsletter.email });
    return { success: true };
  });

export const getNewsletterCount = createServerFn({ method: "GET" })
  .validator((data: { accessToken: string }) => data)
  .handler(async ({ data }) => {
    const { db } = await authDb(data.accessToken);
    const [result] = await db.select({ count: count() }).from(schema.newsletter);
    return result.count;
  });

// Activity & Analytics
export const getActivityLogs = createServerFn({ method: "GET" })
  .validator((data: { accessToken: string }) => data)
  .handler(async ({ data }) => {
    const { db } = await authDb(data.accessToken);
    return db.query.activityLogs.findMany({
      orderBy: [desc(schema.activityLogs.createdAt)],
      limit: 20,
    });
  });

export const globalSearch = createServerFn({ method: "GET" })
  .validator((data: { accessToken: string; query: string }) => data)
  .handler(async ({ data }) => {
    const { db } = await authDb(data.accessToken);
    const q = `%${data.query}%`;

    const [productResults, collectionResults, galleryResults, mediaResults, cmsResults] =
      await Promise.all([
        db.query.products.findMany({ where: ilike(schema.products.name, q), limit: 5 }),
        db.query.collections.findMany({ where: ilike(schema.collections.name, q), limit: 5 }),
        db.query.gallery.findMany({ where: ilike(schema.gallery.title, q), limit: 5 }),
        db.query.media.findMany({ where: ilike(schema.media.name, q), limit: 5 }),
        db.query.cmsContent.findMany({ where: ilike(schema.cmsContent.key, q), limit: 5 }),
      ]);

    return {
      products: productResults,
      collections: collectionResults,
      gallery: galleryResults,
      media: mediaResults,
      cms: cmsResults,
    };
  });

// Storage upload helper
export const uploadToStorage = createServerFn({ method: "POST" })
  .validator((data: { accessToken: string; fileName: string; fileData: string; folder?: string; mimeType?: string }) => data)
  .handler(async ({ data }) => {
    await requireAdmin(data.accessToken);
    const { getSupabaseAdmin } = await import("@/lib/supabase/server");
    const supabase = getSupabaseAdmin();
    const folder = data.folder ?? "uploads";
    const path = `${folder}/${Date.now()}-${data.fileName}`;

    const buffer = Buffer.from(data.fileData, "base64");
    const { error } = await supabase.storage.from("media").upload(path, buffer, {
      contentType: data.mimeType ?? "application/octet-stream",
      upsert: false,
    });

    if (error) throw new Error(error.message);

    const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
    return { url: urlData.publicUrl, path };
  });
