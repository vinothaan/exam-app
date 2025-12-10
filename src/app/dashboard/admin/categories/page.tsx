import { auth } from "@/auth";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { redirect } from "next/navigation";
import CategoriesUI from "./categories-ui";
import { desc } from "drizzle-orm";

export default async function Page() {
    const session = await auth();
    if (session?.user?.role !== 'admin') redirect("/");

    const allCats = await db.select().from(categories).orderBy(desc(categories.id));

    return <CategoriesUI initialCategories={allCats} />;
}
