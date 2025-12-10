"use client";

import { addCategoryAction, deleteCategoryAction } from "../actions";
import { useState, useTransition } from "react";

export default function CategoriesPage({
    initialCategories
}: {
    initialCategories: { id: number, name: string }[]
}) {
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (formData: FormData) => {
        // Optimistic reset could go here
        await addCategoryAction(formData);
        // Reset form
        const form = document.getElementById('add-cat-form') as HTMLFormElement;
        form.reset();
    };

    const handleDelete = (id: number) => {
        if (!confirm("Delete this category?")) return;
        startTransition(() => deleteCategoryAction(id));
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2>Manage Categories</h2>
            <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '2rem' }}>
                Add or remove categories used for Study Materials.
            </p>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <form id="add-cat-form" action={handleSubmit} style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        name="name"
                        className="input"
                        placeholder="New Category Name (e.g. Interview Prep)"
                        required
                    />
                    <button type="submit" className="btn btn-primary">Add</button>
                </form>
            </div>

            <div className="card">
                <h3>Existing Categories</h3>
                {initialCategories.length === 0 ? (
                    <p style={{ padding: '1rem', color: 'hsl(var(--muted-foreground))' }}>No custom categories yet.</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {initialCategories.map(cat => (
                            <li key={cat.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid hsl(var(--border))', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>{cat.name}</span>
                                <button
                                    onClick={() => handleDelete(cat.id)}
                                    disabled={isPending}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--destructive))' }}
                                >
                                    🗑️
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
