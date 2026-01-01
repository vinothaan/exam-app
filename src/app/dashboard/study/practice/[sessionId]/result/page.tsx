import { auth } from "@/auth";
import { db } from "@/db";
import { practiceSessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PracticeResultPage({
    params,
}: {
    params: Promise<{ sessionId: string }>;
}) {
    const { sessionId } = await params;
    const sId = parseInt(sessionId);
    const session = await auth();

    if (isNaN(sId) || !session?.user?.id) return notFound();

    // Fetch Practice Session
    const pSession = await db.query.practiceSessions.findFirst({
        where: eq(practiceSessions.id, sId)
    });

    if (!pSession || pSession.userId !== session.user.id) {
        return (
            <div className="container">
                <h3>Result not found</h3>
                <p>It seems you haven't taken this practice test or something went wrong.</p>
                <Link href="/dashboard/study/practice" className="btn btn-primary">Back to Practice</Link>
            </div>
        )
    }

    const percentage = Math.round((pSession.score / pSession.totalQuestions) * 100);
    const isGood = percentage >= 70;

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center' }}>
            <div className="card" style={{ padding: '3rem 2rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                    {isGood ? '🎯' : '📝'}
                </div>

                <h1 className="text-gradient" style={{ marginBottom: '0.5rem' }}>
                    {isGood ? 'Great Job!' : 'Practice Makes Perfect!'}
                </h1>

                <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '2rem' }}>
                    You have completed a <strong>{pSession.topic}</strong> practice session.
                </p>

                <div style={{ background: 'hsl(var(--background))', padding: '2rem', borderRadius: '1rem', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Score</div>
                    <div style={{ fontSize: '3.5rem', fontWeight: '800', color: isGood ? '#10b981' : '#f59e0b' }}>
                        {pSession.score} <span style={{ fontSize: '1.5rem', color: 'hsl(var(--muted-foreground))' }}>/ {pSession.totalQuestions}</span>
                    </div>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))' }}>
                        {percentage}% Accuracy • Completed just now
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link href="/dashboard/study/practice" className="btn" style={{ border: '1px solid hsl(var(--border))' }}>
                        New Practice
                    </Link>
                    <Link href="/dashboard/study" className="btn btn-primary">
                        Back to Study
                    </Link>
                </div>
            </div>
        </div>
    );
}
