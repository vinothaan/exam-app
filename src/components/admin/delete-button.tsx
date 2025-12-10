"use client";

import { useTransition } from "react";
import { deleteExamAction, deleteMaterialAction } from "@/app/dashboard/admin/actions";

export function DeleteButton({ id, type }: { id: number, type: 'exam' | 'material' }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (!confirm("Are you sure you want to delete this? This action cannot be undone.")) return;

        startTransition(async () => {
            if (type === 'exam') await deleteExamAction(id);
            if (type === 'material') await deleteMaterialAction(id);
        });
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: 'hsl(var(--destructive))',
                opacity: 0.7,
                marginLeft: '0.5rem',
                fontSize: '1.2rem'
            }}
            title="Delete (Admin Only)"
        >
            {isPending ? '...' : '🗑️'}
        </button>
    );
}
