"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { exams, studyMaterials } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function addExamAction(formData: FormData) {
    const session = await auth();
    if (session?.user?.role !== 'admin') throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const duration = parseInt(formData.get("duration") as string);
    const category = formData.get("category") as string || "General";

    await db.insert(exams).values({
        title,
        description,
        duration,
        category
    });

    revalidatePath('/dashboard/exams');
    return { success: true };
}

export async function addMaterialAction(formData: FormData) {
    const session = await auth();
    if (session?.user?.role !== 'admin') throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const fileUrl = formData.get("fileUrl") as string;

    await db.insert(studyMaterials).values({
        title,
        description,
        category,
        fileUrl
    });

    revalidatePath('/dashboard/study');
    return { success: true };
}

export async function deleteExamAction(id: number) {
    const session = await auth();
    if (session?.user?.role !== 'admin') throw new Error("Unauthorized");

    await db.delete(exams).where(eq(exams.id, id));
    revalidatePath('/dashboard/exams');
    revalidatePath('/dashboard/admin');
}

export async function deleteMaterialAction(id: number) {
    const session = await auth();
    if (session?.user?.role !== 'admin') throw new Error("Unauthorized");

    await db.delete(studyMaterials).where(eq(studyMaterials.id, id));
    revalidatePath('/dashboard/study');
}

import { categories } from "@/db/schema";
// Category Actions
export async function addCategoryAction(formData: FormData) {
    const session = await auth();
    if (session?.user?.role !== 'admin') throw new Error("Unauthorized");

    const name = formData.get("name") as string;
    if (!name) return;

    try {
        await db.insert(categories).values({ name });
        revalidatePath('/dashboard/admin/categories');
        revalidatePath('/dashboard/admin/materials/add'); // Update dropdown
    } catch (e) {
        // Ignore unique constraint errors
        console.log("Category probably exists");
    }
}

export async function deleteCategoryAction(id: number) {
    const session = await auth();
    if (session?.user?.role !== 'admin') throw new Error("Unauthorized");

    await db.delete(categories).where(eq(categories.id, id));
    revalidatePath('/dashboard/admin/categories');
    revalidatePath('/dashboard/admin/materials/add');
}
