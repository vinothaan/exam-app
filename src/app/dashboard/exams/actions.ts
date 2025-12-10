"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { questions, userProgress } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function submitExam(examId: number, answers: Record<number, string>) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    // Fetch all questions for this exam to check answers
    // Optimally we could fetch only the correct answers, but fetching questions is fine
    const examQuestions = await db.select().from(questions).where(eq(questions.examId, examId));

    let correctCount = 0;
    const totalQuestions = examQuestions.length;

    examQuestions.forEach((q) => {
        const userAnswer = answers[q.id];
        if (userAnswer && userAnswer === q.correctAnswer) {
            correctCount++;
        }
    });

    // Calculate score (percentage or raw?)
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    console.log(`Submitting Exam ${examId} for User ${session.user.id}. Score: ${score}% (${correctCount}/${totalQuestions})`);

    // Save progress
    // Save progress
    try {
        await db.insert(userProgress).values({
            userId: session.user.id,
            examId: examId,
            score: score,
            answers: answers,
        });

        revalidatePath('/dashboard');
        revalidatePath('/dashboard/admin');

    } catch (e) {
        console.error("Failed to save progress:", e);
        throw new Error("Database Error: Failed to save progress");
    }

    return { success: true, score, correctCount, totalQuestions };
}
