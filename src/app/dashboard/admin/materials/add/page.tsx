import { auth } from "@/auth";
import { db } from "@/db";
import { categories } from "@/db/schema";
import AddMaterialForm from "./form";
import { redirect } from "next/navigation";

type Category = typeof categories.$inferSelect;

export default async function AddMaterialPage() {
    const session = await auth();
    if (session?.user?.role !== 'admin') redirect("/");

    const dbCategories: Category[] = await db.select().from(categories);

    return <AddMaterialForm initialCategories={dbCategories} />;
}
