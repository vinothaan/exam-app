import { auth } from "@/auth";
import { db } from "@/db";
import { exams, categories } from "@/db/schema";
import { redirect } from "next/navigation";
import QuestionsManager from "./questions-manager";
import Link from "next/link";

export default async function ManageQuestionsPage() {
    const session = await auth();
    if (session?.user?.role !== 'admin') redirect("/");

    const allExams = await db.select().from(exams);
    const allCategories = await db.select().from(categories);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Manage Questions</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link href="/dashboard/admin/questions/add" className="btn" style={{ border: '1px solid hsl(var(--border))' }}>
                        + Add Single
                    </Link>
                    <Link href="/dashboard/admin/questions/bulk" className="btn" style={{ border: '1px solid hsl(var(--border))' }}>
                        📄 Bulk Upload
                    </Link>
                </div>
            </div>

            <QuestionsManager exams={allExams} categories={allCategories} />
        </div>
    );
}
