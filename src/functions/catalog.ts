import { createServerFn } from "@tanstack/react-start";
import { eq, asc, desc, ilike, count } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { requireAdmin, logActivity, isDbConfigured } from "@/functions/auth";
import { categorySchema, collectionSchema, gallerySchema } from "@/lib/validators/admin";

async function authDb(accessToken: string) {
  if (!isDbConfigured()) throw new Error("Database not configured");
  const user = await requireAdmin(accessToken);
  return { db: getDb(), user };
}

// Categories
// export const getCategories = createServerFn({ method: "GET" })
//   .validator((data: { accessToken: string }) => data)
//   .handler(async ({ data }) => {
//     const { db } = await authDb(data.accessToken);
//     return db.query.categories.findMany({ orderBy: [asc(schema.categories.displayOrder)] });
//   });

export const getCategories = createServerFn({ method: "GET" })
  .validator((data: { accessToken: string }) => data)
  .handler(async ({ data }) => {
    console.log("1. getCategories called");

    try {
      console.log("2. Before authDb");

      const { db } = await authDb(data.accessToken);

      console.log("3. authDb success");

      const categories = await db.query.categories.findMany({
        orderBy: [asc(schema.categories.displayOrder)],
      });

      console.log("4. Query success");
      console.log(categories);

      return categories;
    } catch (err) {
      console.error("========== FULL ERROR ==========");
      console.error(err);
      console.error("================================");
      throw err;
    }
  });

    
export const createCategory = createServerFn({ method: "POST" })
  .validator((data: { accessToken: string; category: unknown }) => data)
  .handler(async ({ data }) => {
    const { db, user } = await authDb(data.accessToken);
    const parsed = categorySchema.parse(data.category);
    const [created] = await db.insert(schema.categories).values(parsed).returning();
    await logActivity(user.id, "create", "category", created.id);
    return created;
  });

export const updateCategory = createServerFn({ method: "POST" })
  .validator((data: { accessToken: string; id: string; category: unknown }) => data)
  .handler(async ({ data }) => {
    const { db, user } = await authDb(data.accessToken);
    const parsed = categorySchema.partial().parse(data.category);
    const [updated] = await db
      .update(schema.categories)
      .set({ ...parsed, updatedAt: new Date() })
      .where(eq(schema.categories.id, data.id))
      .returning();
    await logActivity(user.id, "update", "category", data.id);
    return updated;
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .validator((data: { accessToken: string; id: string }) => data)
  .handler(async ({ data }) => {
    const { db, user } = await authDb(data.accessToken);
    await db.delete(schema.categories).where(eq(schema.categories.id, data.id));
    await logActivity(user.id, "delete", "category", data.id);
    return { success: true };
  });

export const getPublicCategories = createServerFn({ method: "GET" }).handler(async () => {
  if (!isDbConfigured()) return null;
  try {
    const db = getDb();
    return db.query.categories.findMany({
      where: eq(schema.categories.visible, true),
      orderBy: [asc(schema.categories.displayOrder)],
    });
  } catch {
    return null;
  }
});

// Collections
export const getCollections = createServerFn({ method: "GET" })
  .validator((data: { accessToken: string; search?: string }) => data)
  .handler(async ({ data }) => {
    const { db } = await authDb(data.accessToken);
    return db.query.collections.findMany({
      where: data.search ? ilike(schema.collections.name, `%${data.search}%`) : undefined,
      orderBy: [asc(schema.collections.displayOrder)],
    });
  });

export const createCollection = createServerFn({ method: "POST" })
  .validator((data: { accessToken: string; collection: unknown }) => data)
  .handler(async ({ data }) => {
    const { db, user } = await authDb(data.accessToken);
    const parsed = collectionSchema.parse(data.collection);
    const [created] = await db.insert(schema.collections).values(parsed).returning();
    await logActivity(user.id, "create", "collection", created.id);
    return created;
  });

export const updateCollection = createServerFn({ method: "POST" })
  .validator((data: { accessToken: string; id: string; collection: unknown }) => data)
  .handler(async ({ data }) => {
    const { db, user } = await authDb(data.accessToken);
    const parsed = collectionSchema.partial().parse(data.collection);
    const [updated] = await db
      .update(schema.collections)
      .set({ ...parsed, updatedAt: new Date() })
      .where(eq(schema.collections.id, data.id))
      .returning();
    await logActivity(user.id, "update", "collection", data.id);
    return updated;
  });

export const deleteCollection = createServerFn({ method: "POST" })
  .validator((data: { accessToken: string; id: string }) => data)
  .handler(async ({ data }) => {
    const { db, user } = await authDb(data.accessToken);
    await db.delete(schema.collections).where(eq(schema.collections.id, data.id));
    await logActivity(user.id, "delete", "collection", data.id);
    return { success: true };
  });

export const getPublicCollections = createServerFn({ method: "GET" }).handler(async () => {
  if (!isDbConfigured()) return null;
  try {
    const db = getDb();
    return db.query.collections.findMany({
      where: eq(schema.collections.visible, true),
      orderBy: [asc(schema.collections.displayOrder)],
    });
  } catch {
    return null;
  }
});

// Gallery
export const getGalleryItems = createServerFn({ method: "GET" })
  .validator((data: { accessToken: string; search?: string }) => data)
  .handler(async ({ data }) => {
    const { db } = await authDb(data.accessToken);
    return db.query.gallery.findMany({
      where: data.search ? ilike(schema.gallery.title, `%${data.search}%`) : undefined,
      orderBy: [asc(schema.gallery.displayOrder)],
    });
  });

export const createGalleryItem = createServerFn({ method: "POST" })
  .validator((data: { accessToken: string; item: unknown }) => data)
  .handler(async ({ data }) => {
    const { db, user } = await authDb(data.accessToken);
    const parsed = gallerySchema.parse(data.item);
    const [created] = await db.insert(schema.gallery).values(parsed).returning();
    await logActivity(user.id, "create", "gallery", created.id);
    return created;
  });

export const updateGalleryItem = createServerFn({ method: "POST" })
  .validator((data: { accessToken: string; id: string; item: unknown }) => data)
  .handler(async ({ data }) => {
    const { db, user } = await authDb(data.accessToken);
    const parsed = gallerySchema.partial().parse(data.item);
    const [updated] = await db
      .update(schema.gallery)
      .set(parsed)
      .where(eq(schema.gallery.id, data.id))
      .returning();
    await logActivity(user.id, "update", "gallery", data.id);
    return updated;
  });

export const deleteGalleryItem = createServerFn({ method: "POST" })
  .validator((data: { accessToken: string; id: string }) => data)
  .handler(async ({ data }) => {
    const { db, user } = await authDb(data.accessToken);
    await db.delete(schema.gallery).where(eq(schema.gallery.id, data.id));
    await logActivity(user.id, "delete", "gallery", data.id);
    return { success: true };
  });

export const getPublicGallery = createServerFn({ method: "GET" }).handler(async () => {
  if (!isDbConfigured()) return null;
  try {
    const db = getDb();
    return db.query.gallery.findMany({
      where: eq(schema.gallery.visible, true),
      orderBy: [asc(schema.gallery.displayOrder)],
    });
  } catch {
    return null;
  }
});

export const getCollectionCount = createServerFn({ method: "GET" })
  .validator((data: { accessToken: string }) => data)
  .handler(async ({ data }) => {
    const { db } = await authDb(data.accessToken);
    const [result] = await db.select({ count: count() }).from(schema.collections);
    return result.count;
  });
