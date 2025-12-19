"use server";

import { db } from "@/db";
import { siteStats } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function incrementVisitorCount() {
    // Upsert view count
    await db.insert(siteStats)
        .values({ key: 'total_visitors', value: 1 })
        .onConflictDoUpdate({
            target: siteStats.key,
            set: { value: sql`${siteStats.value} + 1` }
        });

    // revalidatePath('/'); // Removed to avoid render error
}

export async function getVisitorCount() {
    const result = await db.select().from(siteStats).where(eq(siteStats.key, 'total_visitors'));
    return result[0]?.value || 0;
}
