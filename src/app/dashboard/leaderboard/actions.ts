"use server";

import { db } from "@/db";
import { userProgress, users } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";

export async function getLeaderboard() {
    // Aggregate scores by user
    // We want: userId, name, totalScore, examsTaken
    // Since Drizzle ORM aggregation with relations can be verbose, we might stick to raw SQL or query builder aggregation

    const result = await db.select({
        userId: userProgress.userId,
        name: users.name,
        image: users.image,
        totalScore: sql<number>`sum(${userProgress.score})`.mapWith(Number),
        examsTaken: sql<number>`count(${userProgress.examId})`.mapWith(Number),
    })
        .from(userProgress)
        .leftJoin(users, eq(userProgress.userId, users.id))
        .groupBy(userProgress.userId, users.name, users.image)
        .orderBy(desc(sql`sum(${userProgress.score})`))
        .limit(10);

    return result;
}
