import { verifyAccessToken } from "@/lib/supabase/server";
import { getDb, schema } from "@/db";

export async function requireAdmin(accessToken: string) {
  const user = await verifyAccessToken(accessToken);
  return user;
}

export async function logActivity(
  userId: string | undefined,
  action: string,
  entityType?: string,
  entityId?: string,
  details?: Record<string, unknown>,
) {
  try {
    const db = getDb();
    await db.insert(schema.activityLogs).values({
      userId: userId ?? null,
      action,
      entityType,
      entityId,
      details,
    });
  } catch {
    // Activity logging should not block operations
  }
}

export function isDbConfigured() {
  return Boolean(process.env.DATABASE_URL);
}
