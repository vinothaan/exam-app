import { auth } from "@/auth";
import { db } from "@/db";
import { userProgress } from "@/db/schema";
import { eq, avg, count, sum } from "drizzle-orm";

export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user?.id) return <div>Please log in</div>;

    // Fetch User Stats
    // 1. Total Exams Taken
    // 2. Average Score

    // Note: Drizzle's aggregate functions can be tricky with type inference in some versions, 
    // but basic queries work well.
    // For simplicity/reliability, we'll fetch entries and calculate in JS if volume is low, 
    // or use count() query.

    const userProgressEntries = await db.select().from(userProgress).where(eq(userProgress.userId, session.user.id));

    const examsTaken = userProgressEntries.length;

    const totalScore = userProgressEntries.reduce((acc, curr) => acc + curr.score, 0);
    const averageScore = examsTaken > 0 ? Math.round(totalScore / examsTaken) : 0;

    // Study Hours is placeholder as we don't track time yet
    const studyHours = Math.round(examsTaken * 1.5); // Mock: 1.5 hours per exam

    const isAdmin = session?.user?.role === 'admin';

    return (
        <div>
            {isAdmin && (
                <div style={{ background: 'hsl(var(--secondary)/0.1)', border: '1px solid hsl(var(--secondary))', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'hsl(var(--secondary))' }}>🛡️ Admin Access Detected</h3>
                        <p style={{ margin: 0, color: 'hsl(var(--muted-foreground))' }}>You have administrative privileges.</p>
                    </div>
                    <a href="/dashboard/admin" className="btn btn-primary">Go to Admin Dashboard &rarr;</a>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="stat-card">
                    <div className="stat-label">Total Exams Taken</div>
                    <div className="stat-value">{examsTaken}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Average Score</div>
                    <div className="stat-value">{averageScore}%</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Est. Study Hours</div>
                    <div className="stat-value">{studyHours}h</div>
                </div>
            </div>

            <h3>Recent Activity</h3>
            <div className="card" style={{ marginTop: '1rem' }}>
                {userProgressEntries.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {userProgressEntries.slice(-5).reverse().map((entry, i) => (
                            <li key={i} style={{ borderBottom: '1px solid hsl(var(--border))', padding: '1rem 0', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Exam #{entry.examId}</span>
                                <span style={{ color: entry.score >= 35 ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>{entry.score}%</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={{ color: 'hsl(var(--muted-foreground))', textAlign: 'center', padding: '2rem' }}>
                        No recent activity. Start an exam to see your progress!
                    </p>
                )}
            </div>
        </div>
    );
}
