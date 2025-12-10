import { db } from "@/db";
import { auth } from "@/auth";
import { DeleteButton } from "@/components/admin/delete-button";
import { studyMaterials } from "@/db/schema";
import { desc } from "drizzle-orm";

export default async function StudyPage() {
    const session = await auth();
    const materials = await db.query.studyMaterials.findMany({
        orderBy: [desc(studyMaterials.createdAt)],
    });

    // Group by category
    const grouped = materials.reduce((acc, curr) => {
        if (!acc[curr.category]) acc[curr.category] = [];
        acc[curr.category].push(curr);
        return acc;
    }, {} as Record<string, typeof materials>);

    return (
        <div>
            <h2 style={{ marginBottom: '2rem' }}>Study Materials</h2>

            {Object.keys(grouped).length === 0 && (
                <p style={{ color: 'hsl(var(--muted-foreground))' }}>No study materials available yet.</p>
            )}

            {Object.entries(grouped).map(([category, items]) => (
                <div key={category} style={{ marginBottom: '3rem' }}>
                    <h3 style={{ borderBottom: '1px solid hsl(var(--border))', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: 'hsl(var(--secondary))' }}>
                        {category}
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {items.map((item) => (
                            <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ fontSize: '2rem' }}>📄</div>
                                        <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem', borderRadius: '4px', background: 'hsl(var(--muted))' }}>PDF</span>
                                    </div>
                                    {session?.user?.role === 'admin' && <DeleteButton id={item.id} type="material" />}
                                </div>
                                <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{item.title}</h4>
                                <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.9rem', marginBottom: '1rem', flex: 1 }}>
                                    {item.description}
                                </p>
                                <a
                                    href={item.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary"
                                    style={{ textDecoration: 'none', textAlign: 'center' }}
                                >
                                    Download / View
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
