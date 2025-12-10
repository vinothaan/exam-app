import { auth } from "@/auth";
import { db } from "@/db";
import { exams, questions, userProgress } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

export default async function ReviewExamPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const examId = parseInt(id);
    const session = await auth();

    if (!session?.user?.id) redirect("/auth/login");
    if (isNaN(examId)) return notFound();

    const exam = await db.query.exams.findFirst({
        where: eq(exams.id, examId),
        with: {
            questions: true
        }
    });

    if (!exam) return notFound();

    // Fetch user progress to get their answers
    // We need the latest attempt for this exam
    const progress = await db.query.userProgress.findFirst({
        where: (progress, { eq, and }) => and(
            eq(progress.userId, session.user.id!),
            eq(progress.examId, examId)
        ),
        orderBy: (progress, { desc }) => [desc(progress.completedAt)]
    });

    const userAnswers = (progress?.answers || {}) as Record<string, string>;

    return (
        <div className="container" style={{ maxWidth: '800px', margin: '2rem auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Answer Key: {exam.title}</h1>
                <Link href="/dashboard/exams" className="btn" style={{ border: '1px solid hsl(var(--border))' }}>
                    Back to Exams
                </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {exam.questions.map((q, idx) => {
                    const selectedAns = userAnswers[q.id];
                    const isCorrectSelected = selectedAns === q.correctAnswer;

                    return (
                        <div key={q.id} className="card" style={{ borderLeft: isCorrectSelected ? '4px solid #10b981' : '4px solid #ef4444' }}>
                            <p style={{ fontWeight: '500', fontSize: '1.1rem', marginBottom: '1rem' }}>
                                <span style={{ color: 'hsl(var(--muted-foreground))', marginRight: '0.5rem' }}>{idx + 1}.</span>
                                {q.text}
                            </p>
                            <div style={{ display: 'grid', gap: '0.5rem' }}>
                                {(q.options as string[]).map((opt, i) => {
                                    const isCorrect = opt === q.correctAnswer;
                                    const isSelected = opt === selectedAns;

                                    let bg = 'transparent';
                                    let borderColor = 'hsl(var(--border))';
                                    let color = 'inherit';

                                    if (isCorrect) {
                                        bg = 'rgba(16, 185, 129, 0.1)';
                                        borderColor = '#10b981';
                                        color = '#10b981';
                                    } else if (isSelected) {
                                        bg = 'rgba(239, 68, 68, 0.1)';
                                        borderColor = '#ef4444';
                                        color = '#ef4444';
                                    }

                                    return (
                                        <div
                                            key={i}
                                            style={{
                                                padding: '0.75rem',
                                                borderRadius: '4px',
                                                border: '1px solid',
                                                borderColor,
                                                backgroundColor: bg,
                                                color,
                                                fontWeight: isCorrect || isSelected ? '600' : 'normal',
                                                display: 'flex',
                                                justifyContent: 'space-between'
                                            }}
                                        >
                                            <span>{opt}</span>
                                            <span>
                                                {isCorrect && " ✅ Correct"}
                                                {isSelected && !isCorrect && " ❌ Your Answer"}
                                                {isSelected && isCorrect && " (You)"}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
