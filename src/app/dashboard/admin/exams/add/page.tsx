import { auth } from "@/auth";
import { db } from "@/db";
import { categories } from "@/db/schema";
import AddExamForm from "./form";
import { redirect } from "next/navigation";

type Category = typeof categories.$inferSelect;

export default async function AddExamPage() {
    const session = await auth();
    if (session?.user?.role !== 'admin') redirect("/");

    const dbCategories: Category[] = await db.select().from(categories);
    return <AddExamForm initialCategories={dbCategories} />;
}
