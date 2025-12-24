import { auth } from "@/auth";
import { db } from "@/db";
import { users, userProgress, exams } from "@/db/schema";
import { count, ne, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminCharts from "@/components/admin/admin-charts";

export default async function AdminDashboard() {
    const session = await auth();

    if (session?.user?.role !== 'admin') {
        redirect('/dashboard');
    }

    // Fetch Stats
    // Fetch Stats
    // 1. Total Users (Exclude Admins)
    const userCount = (await db.select({ count: count() }).from(users).where(ne(users.role, 'admin')))[0].count;

    // 2. Total Exams (Content)
    const examCount = (await db.select({ count: count() }).from(exams))[0].count;

    // 3. Exams Taken (Exclude Admin Attempts)
    // Join userProgress with users table to check role
    // Since we don't have direct relation in 'select' builder easily without valid relation setup sometimes, 
    // let's use the 'query' builder for cleaner syntax or just filtering.
    // Actually, let's use a filter on the application side or a raw where if possible.
    // For now, let's just count ALL process, or if critical, filter.
    // Given the request, "admin tried also showing" -> Filter it.

    // We can fetch all progress and filter in JS for small app size, or use a join.
    // Let's use the query builder which handles relations if defined, or manual join.
    // For simplicity and speed in this demo app:
    const allProgress = await db.select({
        userId: userProgress.userId,
    }).from(userProgress);

    // We need to know which userIds are admins.
    const adminUsers = await db.select({ id: users.id }).from(users).where(eq(users.role, 'admin'));
    const adminIds = new Set(adminUsers.map(u => u.id));

    const progressCount = allProgress.filter(p => !adminIds.has(p.userId!)).length;

    // Data for chart - simplified for demo. Ideally group by date.
    const chartData = [
        { name: 'Current', users: userCount, exams: progressCount }
    ];

    return (
        <div>
            <h2 style={{ marginBottom: '2rem' }}>Admin Overview</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="stat-card" style={{ borderLeft: '4px solid #3b82f6' }}>
                    <div className="stat-label">Total Users</div>
                    <div className="stat-value">{userCount}</div>
                </div>
                <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
                    <div className="stat-label">Total Exams</div>
                    <div className="stat-value">{examCount}</div>
                </div>
                <div className="stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
                    <div className="stat-label">Exams Taken</div>
                    <div className="stat-value">{progressCount}</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div className="card">
                    <h3 style={{ marginBottom: '1rem' }}>Platform Activity</h3>
                    <AdminCharts data={chartData} />
                </div>

                <div className="card">
                    <h3>Quick Actions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                        <Link href="/dashboard/admin/exams/add" className="btn btn-primary">
                            + Add New Exam
                        </Link>
                        <Link href="/dashboard/admin/categories" className="btn" style={{ border: '1px solid hsl(var(--border))' }}>
                            🏷️ Manage Categories
                        </Link>
                        <Link href="/dashboard/admin/materials/add" className="btn" style={{ border: '1px solid hsl(var(--border))' }}>
                            + Add Material (PDF)
                        </Link>
                        <Link href="/dashboard/admin/questions/add" className="btn" style={{ border: '1px solid hsl(var(--border))' }}>
                            + Add Single Question
                        </Link>
                        <Link href="/dashboard/admin/questions/bulk" className="btn" style={{ border: '1px solid hsl(var(--border))' }}>
                            📄 Bulk Upload (CSV)
                        </Link>

                        <div style={{ marginTop: '1rem', borderTop: '1px solid hsl(var(--border))', paddingTop: '1rem' }}>
                            <form action={async () => {
                                "use server";
                                const { resetLeaderboardAction } = await import('./actions');
                                await resetLeaderboardAction();
                            }}>
                                <button className="btn" style={{ width: '100%', background: 'hsl(var(--destructive))', color: 'hsl(var(--destructive-foreground))' }}>
                                    ⚠️ Reset Leaderboard
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
