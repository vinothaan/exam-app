"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { questions } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteQuestionAction(id: number) {
    const session = await auth();
    if (session?.user?.role !== 'admin') throw new Error("Unauthorized");

    await db.delete(questions).where(eq(questions.id, id));
    revalidatePath('/dashboard/admin/questions');
    return { success: true };
}

export async function bulkDeleteQuestionsAction(examId?: number, topic?: string) {
    const session = await auth();
    if (session?.user?.role !== 'admin') throw new Error("Unauthorized");

    if (examId) {
        await db.delete(questions).where(eq(questions.examId, examId));
    } else if (topic) {
        await db.delete(questions).where(eq(questions.topic, topic));
    }

    revalidatePath('/dashboard/admin/questions');
    return { success: true };
}

export async function addQuestion(formData: FormData) {
    const session = await auth();
    if (session?.user?.role !== 'admin') throw new Error("Unauthorized");

    const examId = parseInt(formData.get("examId") as string);
    const text = formData.get("text") as string;
    const option1 = formData.get("option1") as string;
    const option2 = formData.get("option2") as string;
    const option3 = formData.get("option3") as string;
    const option4 = formData.get("option4") as string;
    const correctAnswer = formData.get("correctAnswer") as string;

    await db.insert(questions).values({
        examId,
        text,
        options: [option1, option2, option3, option4],
        correctAnswer
    });

    return { success: true };
}

export async function bulkCreateQuestions(
    target: { examId?: number; topic: string },
    questionsData: { text: string; options: string[]; correctAnswer: string }[]
) {
    const session = await auth();
    if (session?.user?.role !== 'admin') throw new Error("Unauthorized");

    if (!target.topic || !questionsData || questionsData.length === 0) {
        throw new Error("Invalid data");
    }

    const values = questionsData.map(q => ({
        examId: target.examId || null, // Nullable if generic practice
        topic: target.topic,
        text: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer
    }));

    await db.insert(questions).values(values);
    return { success: true, count: values.length };
}

export async function getQuestions(filter: { examId?: number; topic?: string }) {
    if (filter.examId) {
        return await db.select().from(questions).where(eq(questions.examId, filter.examId));
    }
    if (filter.topic) {
        return await db.select().from(questions).where(eq(questions.topic, filter.topic));
    }
    return [];
}
