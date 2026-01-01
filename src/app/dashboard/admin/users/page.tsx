import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { ne, desc } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
    const session = await auth();

    if (session?.user?.role !== 'admin') {
        redirect('/dashboard');
    }

    const allUsers = await db.select()
        .from(users)
        .where(ne(users.role, 'admin'))
        .orderBy(desc(users.createdAt));

    return (
        <div>
            <h2 style={{ marginBottom: '2rem' }}>Registered Users</h2>

            <div className="card">
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid hsl(var(--border))', textAlign: 'left' }}>
                                <th style={{ padding: '1rem' }}>Name</th>
                                <th style={{ padding: '1rem' }}>Email</th>
                                <th style={{ padding: '1rem' }}>Role</th>
                                <th style={{ padding: '1rem' }}>Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'hsl(var(--muted-foreground))' }}>
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                allUsers.map(user => (
                                    <tr key={user.id} style={{ borderBottom: '1px solid hsl(var(--border))' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontWeight: '500' }}>{user.name || 'N/A'}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>{user.email}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.2rem 0.6rem',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                background: 'hsl(var(--secondary)/0.1)',
                                                color: 'hsl(var(--secondary))'
                                            }}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', color: 'hsl(var(--muted-foreground))' }}>
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
