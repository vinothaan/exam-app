"use client";

import { addMaterialAction } from "../../actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface AddMaterialFormProps {
    initialCategories: { id: number; name: string }[];
}

export default function AddMaterialForm({ initialCategories }: AddMaterialFormProps) {
    const router = useRouter();
    const [message, setMessage] = useState("");

    async function handleSubmit(formData: FormData) {
        try {
            await addMaterialAction(formData);
            setMessage("Material added successfully!");
            router.push('/dashboard/admin');
        } catch (e) {
            setMessage("Error adding material.");
        }
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2>Upload Study Material</h2>
            {message && <div style={{ padding: '1rem', background: 'hsl(var(--secondary)/0.1)', marginBottom: '1rem', borderRadius: '4px' }}>{message}</div>}

            <form action={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label>Title</label>
                    <input name="title" required className="input" />
                </div>
                <div>
                    <label>Description</label>
                    <textarea name="description" required className="input" rows={2} />
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
                    <label>PDF URL (Google Drive / S3 Link)</label>
                    <input name="fileUrl" type="url" required className="input" placeholder="https://..." />
                </div>

                <button type="submit" className="btn btn-primary">Add Material</button>
            </form>
        </div>
    );
}
