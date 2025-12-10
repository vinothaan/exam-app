import { db } from "@/db";
import { exams } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { auth } from "@/auth";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function ExamsPage() {
    const session = await auth();
    const allExams = await db.query.exams.findMany({
        orderBy: [desc(exams.createdAt)],
    });

    return (
        <div>
            <h2 style={{ marginBottom: '2rem' }}>Available Exams</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {allExams.map((exam) => (
                    <div key={exam.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <h3 style={{ margin: 0 }}>{exam.title}</h3>
                                {session?.user?.role === 'admin' && <DeleteButton id={exam.id} type="exam" />}
                            </div>
                            <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                {exam.description}
                            </p>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                            <div style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>
                                ⏱ {exam.duration} mins
                            </div>
                            <Link href={`/dashboard/exams/${exam.id}`} className="btn btn-primary">
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}

                {allExams.length === 0 && (
                    <p style={{ color: 'hsl(var(--muted-foreground))' }}>No exams available at the moment.</p>
                )}
            </div>
        </div>
    );
}
