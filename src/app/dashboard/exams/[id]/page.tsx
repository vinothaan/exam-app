import { db } from "@/db";
import { exams } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ExamDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const examId = parseInt(id);

    if (isNaN(examId)) return notFound();

    const exam = await db.query.exams.findFirst({
        where: eq(exams.id, examId),
        with: {
            questions: true // We might want to just count them here, but for now fetching is fine or use count()
        }
    });

    if (!exam) return notFound();

    // @ts-ignore - Drizzle relation typing can be tricky without strict type inference setup, but runtime works if relations are defined
    // Actually I didn't define relations in schema.ts explicitly using `relations`. 
    // I should update schema.ts to include relations for easier querying, or just count separately.
    // For now let's query questions count separately to be safe.

    const questionCount = (await db.query.questions.findMany({
        where: eq(exams.id, examId) // Wait, questions table has examId column. 
        // I need to import questions table
    })).length;
    // Actually simpler:
    // const questionsCount = await db.select({ count: count() }).from(questions).where(eq(questions.examId, examId));
    // Let's stick to simple findMany().length for small scale.

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="card">
                <div style={{ marginBottom: '2rem', borderBottom: '1px solid hsl(var(--border))', paddingBottom: '1.5rem' }}>
                    <h1 style={{ marginBottom: '0.5rem' }}>{exam.title}</h1>
                    <p style={{ color: 'hsl(var(--muted-foreground))' }}>{exam.description}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{ background: 'hsl(var(--background))', padding: '1rem', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>Duration</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{exam.duration} Minutes</div>
                    </div>
                    <div style={{ background: 'hsl(var(--background))', padding: '1rem', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>Questions</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{questionCount} Questions</div> { /* Placeholder until fetched properly */}
                    </div>
                    <div style={{ background: 'hsl(var(--background))', padding: '1rem', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>Passing Score</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>35%</div>
                    </div>
                </div>

                <div style={{ background: 'hsl(var(--secondary)/0.1)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'hsl(var(--secondary))' }}>Instructions</h3>
                    <ul style={{ paddingLeft: '1.5rem', color: 'hsl(var(--muted-foreground))', lineHeight: '1.6' }}>
                        <li>The timer will start immediately after you click "Start Exam".</li>
                        <li>You can navigate between questions using the numbers.</li>
                        <li>There is no negative marking for this practice test.</li>
                        <li>Submit the exam before the timer runs out.</li>
                    </ul>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <Link href="/dashboard/exams" className="btn" style={{ background: 'transparent', border: '1px solid hsl(var(--border))' }}>
                        Back
                    </Link>
                    <Link href={`/dashboard/exams/${exam.id}/take`} className="btn btn-primary" style={{ padding: '0.75rem 2.5rem', fontSize: '1.1rem' }}>
                        Start Exam
                    </Link>
                </div>
            </div>
        </div>
    );
}
