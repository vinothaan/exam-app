import { auth } from "@/auth";
import { db } from "@/db";
import { exams, userProgress } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ResultPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const examId = parseInt(id);
    const session = await auth();

    if (isNaN(examId) || !session?.user?.id) return notFound();

    // Fetch the LATEST attempt
    const progress = await db.query.userProgress.findFirst({
        where: and(
            eq(userProgress.examId, examId),
            eq(userProgress.userId, session.user.id)
        ),
        orderBy: [desc(userProgress.completedAt)]
    });

    // Fetch Exam details for title
    const exam = await db.query.exams.findFirst({
        where: eq(exams.id, examId)
    });

    if (!progress || !exam) {
        return (
            <div className="container">
                <h3>Result not found</h3>
                <p>It seems you haven't taken this exam yet or something went wrong.</p>
                <Link href="/dashboard/exams" className="btn btn-primary">Back to Exams</Link>
            </div>
        )
    }

    const isPass = progress.score >= 35; // Assuming 35% pass

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center' }}>
            <div className="card" style={{ padding: '3rem 2rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                    {isPass ? '🏆' : '📚'}
                </div>

                <h1 className="text-gradient" style={{ marginBottom: '0.5rem' }}>
                    {isPass ? 'Congratulations!' : 'Keep Practicing!'}
                </h1>

                <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '2rem' }}>
                    You have completed <strong>{exam.title}</strong>
                </p>

                <div style={{ background: 'hsl(var(--background))', padding: '2rem', borderRadius: '1rem', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Score</div>
                    <div style={{ fontSize: '3.5rem', fontWeight: '800', color: isPass ? '#10b981' : '#ef4444' }}>
                        {progress.score}%
                    </div>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))' }}>
                        {isPass ? 'Passed' : 'Failed'} • Completed just now
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link href={`/dashboard/exams/${examId}/review`} className="btn" style={{ border: '1px solid hsl(var(--secondary))', color: 'hsl(var(--secondary))' }}>
                        View Answer Key
                    </Link>
                    <Link href="/dashboard/exams" className="btn" style={{ border: '1px solid hsl(var(--border))' }}>
                        All Exams
                    </Link>
                    <Link href={`/dashboard/exams/${examId}/take`} className="btn btn-primary">
                        Retake Exam
                    </Link>
                </div>
            </div>
        </div>
    );
}
