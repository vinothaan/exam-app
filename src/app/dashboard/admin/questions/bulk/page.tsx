import { auth } from "@/auth";
import { db } from "@/db";
import { exams } from "@/db/schema";
import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import BulkUploadForm from "./form";

export default async function BulkUploadPage() {
    const session = await auth();
    if (session?.user?.role !== 'admin') redirect("/");

    // Fetch exams to populate dropdown
    const allExams = await db.select().from(exams).orderBy(desc(exams.createdAt));

    return <BulkUploadForm exams={allExams} />;
}
