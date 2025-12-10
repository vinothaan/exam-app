"use client";

import { addExamAction } from "../../actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface AddExamFormProps {
    initialCategories: { id: number; name: string }[];
}

export default function AddExamForm({ initialCategories }: AddExamFormProps) {
    const router = useRouter();
    const [message, setMessage] = useState("");

    async function handleSubmit(formData: FormData) {
        try {
            await addExamAction(formData);
            setMessage("Exam created successfully!");
            router.push('/dashboard/admin');
        } catch (e) {
            setMessage("Error creating exam.");
        }
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2>Create New Exam</h2>
            {message && <div style={{ padding: '1rem', background: 'hsl(var(--secondary)/0.1)', marginBottom: '1rem', borderRadius: '4px' }}>{message}</div>}

            <form action={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label>Exam Title (e.g. IBPS PO Prelims)</label>
                    <input name="title" required className="input" />
                </div>
                <div>
                    <label>Description</label>
                    <textarea name="description" required className="input" rows={3} />
                </div>
                <div>
                    <label>Category</label>
                    <input
                        name="category"
                        list="category-options"
                        required
                        className="input"
                        placeholder="Select or type a new category..."
                    />
                    <datalist id="category-options">
                        {initialCategories.map((cat) => (
                            <option key={cat.id} value={cat.name} />
                        ))}
                    </datalist>
                </div>
                <div>
                    <label>Duration (Minutes)</label>
                    <input name="duration" type="number" required className="input" defaultValue={60} />
                </div>

                <button type="submit" className="btn btn-primary">Create Exam</button>
            </form>
        </div>
    );
}
