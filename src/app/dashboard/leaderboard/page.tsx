import { auth } from "@/auth";
import { getLeaderboard } from "./actions";
import { redirect } from "next/navigation";

export default async function LeaderboardPage() {
    const session = await auth();
    if (!session) redirect("/auth/login");

    const leaderboard = await getLeaderboard();

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆 Top Performers</h1>
                <p style={{ color: 'hsl(var(--muted-foreground))' }}>
                    The highest scoring students across all exams.
                </p>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="table-container">
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                        <thead style={{ background: 'hsl(var(--secondary)/0.3)', borderBottom: '1px solid hsl(var(--border))' }}>
                            <tr>
                                <th style={{ padding: '1rem', textAlign: 'center', width: '60px' }}>Rank</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Student</th>
                                <th style={{ padding: '1rem', textAlign: 'center' }}>Exams</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>Total Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.map((user, index) => (
                                <tr key={user.userId} style={{ borderBottom: '1px solid hsl(var(--border))' }}>
                                    <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                        {index === 0 && "🥇"}
                                        {index === 1 && "🥈"}
                                        {index === 2 && "🥉"}
                                        {index > 2 && index + 1}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{
                                                width: '32px', height: '32px', borderRadius: '50%', background: 'hsl(var(--secondary)/0.2)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'hsl(var(--secondary))'
                                            }}>
                                                {user.name?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                            <div style={{ fontWeight: '500' }}>
                                                {user.name || 'Anonymous User'}
                                                {user.userId === session.user?.id && <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', background: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>You</span>}
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center', color: 'hsl(var(--muted-foreground))' }}>
                                        {user.examsTaken}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold', color: 'hsl(var(--secondary))' }}>
                                        {user.totalScore} pts
                                    </td>
                                </tr>
                            ))}
                            {leaderboard.length === 0 && (
                                <tr>
                                    <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'hsl(var(--muted-foreground))' }}>
                                        No data available yet. Be the first to take an exam!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
