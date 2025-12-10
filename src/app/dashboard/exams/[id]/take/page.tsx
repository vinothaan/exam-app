import { db } from "@/db";
import { exams, questions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ExamTaker from "@/components/exam/exam-taker";

export default async function TakeExamPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const examId = parseInt(id);
    if (isNaN(examId)) return notFound();

    const exam = await db.query.exams.findFirst({
        where: eq(exams.id, examId),
    });

    if (!exam) return notFound();

    // Fetch Questions
    // Using findMany on questions table
    const examQuestions = await db.select().from(questions).where(eq(questions.examId, examId));

    // Sanitize questions (hide correct answer if we were sending this to client but we are passing to a Client Component)
    // Ideally, we shouldn't pass correct answers to the client component to prevent cheating via inspection.
    // We will pass the text and options only.

    const formattedQuestions = examQuestions.map(q => ({
        id: q.id,
        text: q.text,
        options: q.options as string[] // Casting jsonb to string array
    }));

    return (
        <ExamTaker
            initialQuestions={formattedQuestions}
            examId={examId}
            duration={exam.duration}
        />
    );
}
