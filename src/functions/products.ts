import { createServerFn } from "@tanstack/react-start";
import { eq, desc, asc, and, or, ilike, sql, inArray, count } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { requireAdmin, logActivity, isDbConfigured } from "@/functions/auth";
import { authInputSchema, productSchema, bulkProductActionSchema } from "@/lib/validators/admin";

async function authDb(accessToken: string) {
  if (!isDbConfigured()) throw new Error("Database not configured. Set DATABASE_URL in .env");
  const user = await requireAdmin(accessToken);
  return { db: getDb(), user };
}

export const getProducts = createServerFn({ method: "GET" })
  .validator((data: { accessToken: string; search?: string; categoryId?: string; featured?: boolean; visible?: boolean; archived?: boolean; stockStatus?: string; sort?: string }) => data)
  .handler(async ({ data }) => {
    const { db } = await authDb(data.accessToken);
    const conditions = [];

    if (data.search) {
      conditions.push(
        or(
          ilike(schema.products.name, `%${data.search}%`),
          ilike(schema.products.description, `%${data.search}%`),
        ),
      );
    }
    if (data.categoryId) conditions.push(eq(schema.products.categoryId, data.categoryId));
    if (data.featured !== undefined) conditions.push(eq(schema.products.featured, data.featured));
    if (data.visible !== undefined) conditions.push(eq(schema.products.visible, data.visible));
    if (data.archived !== undefined) conditions.push(eq(schema.products.archived, data.archived));
    if (data.stockStatus) {
      conditions.push(eq(schema.products.stockStatus, data.stockStatus as "in_stock" | "out_of_stock" | "low_stock"));
    }

    const orderBy =
      data.sort === "oldest"
        ? asc(schema.products.createdAt)
        : data.sort === "price_asc"
          ? asc(schema.products.price)
          : data.sort === "price_desc"
            ? desc(schema.products.price)
            : desc(schema.products.createdAt);

    return db.query.products.findMany({
      where: conditions.length ? and(...conditions) : undefined,
      with: { category: true, images: { orderBy: asc(schema.productImages.displayOrder) } },
      orderBy: [orderBy],
    });
  });

export const getProduct = createServerFn({ method: "GET" })
  .validator((data: { accessToken: string; id: string }) => data)
  .handler(async ({ data }) => {
    const { db } = await authDb(data.accessToken);
    return db.query.products.findFirst({
      where: eq(schema.products.id, data.id),
      with: { category: true, images: { orderBy: asc(schema.productImages.displayOrder) } },
    });
  });

export const createProduct = createServerFn({ method: "POST" })
  .validator((data: { accessToken: string; product: unknown }) => data)
  .handler(async ({ data }) => {
    const { db, user } = await authDb(data.accessToken);
    const parsed = productSchema.parse(data.product);
    const [created] = await db.insert(schema.products).values(parsed).returning();
    await logActivity(user.id, "create", "product", created.id);
    return created;
  });

export const updateProduct = createServerFn({ method: "POST" })
  .validator((data: { accessToken: string; id: string; product: unknown }) => data)
  .handler(async ({ data }) => {
    const { db, user } = await authDb(data.accessToken);
    const parsed = productSchema.partial().parse(data.product);
    const [updated] = await db
      .update(schema.products)
      .set({ ...parsed, updatedAt: new Date() })
      .where(eq(schema.products.id, data.id))
      .returning();
    await logActivity(user.id, "update", "product", data.id);
    return updated;
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .validator((data: { accessToken: string; id: string }) => data)
  .handler(async ({ data }) => {
    const { db, user } = await authDb(data.accessToken);
    await db.delete(schema.products).where(eq(schema.products.id, data.id));
    await logActivity(user.id, "delete", "product", data.id);
    return { success: true };
  });

export const duplicateProduct = createServerFn({ method: "POST" })
  .validator((data: { accessToken: string; id: string }) => data)
  .handler(async ({ data }) => {
    const { db, user } = await authDb(data.accessToken);
    const original = await db.query.products.findFirst({
      where: eq(schema.products.id, data.id),
      with: { images: true },
    });
    if (!original) throw new Error("Product not found");

    const { name, slug, description, shortDescription, price, categoryId, tags, displayOrder, featured, visible, archived, stockStatus, meeshoUrl, badge, seoTitle, seoDescription, metaKeywords, thumbnailUrl } = original;

    const [copy] = await db
      .insert(schema.products)
      .values({
        name: `${name} (Copy)`,
        slug: `${slug}-copy-${Date.now()}`,
        description,
        shortDescription,
        price,
        categoryId,
        tags,
        displayOrder,
        featured: false,
        visible: false,
        archived: false,
        stockStatus,
        meeshoUrl,
        badge,
        seoTitle,
        seoDescription,
        metaKeywords,
        thumbnailUrl,
      })
      .returning();

    if (original.images.length) {
      await db.insert(schema.productImages).values(
        original.images.map((img) => ({
          productId: copy.id,
          url: img.url,
          alt: img.alt,
          displayOrder: img.displayOrder,
          isThumbnail: img.isThumbnail,
        })),
      );
    }

    await logActivity(user.id, "duplicate", "product", copy.id);
    return copy;
  });

export const bulkProductAction = createServerFn({ method: "POST" })
  .validator((data: { accessToken: string; payload: unknown }) => data)
  .handler(async ({ data }) => {
    const { db, user } = await authDb(data.accessToken);
    const parsed = bulkProductActionSchema.parse(data.payload);

    const updates: Partial<typeof schema.products.$inferInsert> = {};
    switch (parsed.action) {
      case "hide":
        updates.visible = false;
        break;
      case "publish":
        updates.visible = true;
        updates.archived = false;
        break;
      case "archive":
        updates.archived = true;
        updates.visible = false;
        break;
      case "restore":
        updates.archived = false;
        updates.visible = true;
        break;
      case "feature":
        updates.featured = true;
        break;
      case "unfeature":
        updates.featured = false;
        break;
      case "delete":
        await db.delete(schema.products).where(inArray(schema.products.id, parsed.ids));
        await logActivity(user.id, "bulk_delete", "product", parsed.ids.join(","));
        return { success: true };
    }

    if (parsed.categoryId) updates.categoryId = parsed.categoryId;
    if (parsed.stockStatus) updates.stockStatus = parsed.stockStatus;

    await db
      .update(schema.products)
      .set({ ...updates, updatedAt: new Date() })
      .where(inArray(schema.products.id, parsed.ids));

    await logActivity(user.id, parsed.action, "product", parsed.ids.join(","));
    return { success: true };
  });

export const upsertProductImages = createServerFn({ method: "POST" })
  .validator((data: { accessToken: string; productId: string; images: { url: string; alt?: string; displayOrder: number; isThumbnail?: boolean }[] }) => data)
  .handler(async ({ data }) => {
    const { db, user } = await authDb(data.accessToken);
    await db.delete(schema.productImages).where(eq(schema.productImages.productId, data.productId));
    if (data.images.length) {
      await db.insert(schema.productImages).values(
        data.images.map((img) => ({ ...img, productId: data.productId })),
      );
    }
    await logActivity(user.id, "update_images", "product", data.productId);
    return { success: true };
  });

export const getPublicProducts = createServerFn({ method: "GET" }).handler(async () => {
  if (!isDbConfigured()) return null;
  try {
    const db = getDb();
    return db.query.products.findMany({
      where: and(eq(schema.products.visible, true), eq(schema.products.archived, false)),
      with: { category: true, images: { orderBy: asc(schema.productImages.displayOrder) } },
      orderBy: [asc(schema.products.displayOrder), desc(schema.products.createdAt)],
    });
  } catch {
    return null;
  }
});

export const getProductStats = createServerFn({ method: "GET" })
  .validator((data: { accessToken: string }) => data)
  .handler(async ({ data }) => {
    const { db } = await authDb(data.accessToken);
    const [total] = await db.select({ count: count() }).from(schema.products);
    const [featured] = await db.select({ count: count() }).from(schema.products).where(eq(schema.products.featured, true));
    const [hidden] = await db.select({ count: count() }).from(schema.products).where(eq(schema.products.visible, false));
    const [outOfStock] = await db.select({ count: count() }).from(schema.products).where(eq(schema.products.stockStatus, "out_of_stock"));
    return {
      total: total.count,
      featured: featured.count,
      hidden: hidden.count,
      outOfStock: outOfStock.count,
    };
  });

export const getProductsByCategory = createServerFn({ method: "GET" })
  .validator((data: { accessToken: string }) => data)
  .handler(async ({ data }) => {
    const { db } = await authDb(data.accessToken);
    return db
      .select({
        category: schema.categories.name,
        count: count(),
      })
      .from(schema.products)
      .leftJoin(schema.categories, eq(schema.products.categoryId, schema.categories.id))
      .groupBy(schema.categories.name);
  });
