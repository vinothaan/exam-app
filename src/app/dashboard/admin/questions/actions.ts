"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { questions } from "@/db/schema";

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
