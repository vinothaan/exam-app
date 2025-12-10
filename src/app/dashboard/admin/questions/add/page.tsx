"use client";

import { addQuestion } from "../actions";
import { useState } from "react";

export default function AddQuestionPage() {
    const [message, setMessage] = useState("");

    async function handleSubmit(formData: FormData) {
        try {
            await addQuestion(formData);
            setMessage("Question added successfully!");
            // Reset form (simplified interaction)
            (document.getElementById('q-form') as HTMLFormElement).reset();
        } catch (e) {
            setMessage("Error adding question.");
        }
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2>Add New Question</h2>
            {message && <div style={{ padding: '1rem', background: 'hsl(var(--secondary)/0.1)', marginBottom: '1rem', borderRadius: '4px' }}>{message}</div>}

            <form id="q-form" action={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label>Exam ID (Enter ID manually for now or 1)</label>
                    <input name="examId" type="number" defaultValue="1" required className="input" />
                </div>
                <div>
                    <label>Question Text</label>
                    <textarea name="text" required className="input" rows={3} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <input name="option1" placeholder="Option 1" required className="input" />
                    <input name="option2" placeholder="Option 2" required className="input" />
                    <input name="option3" placeholder="Option 3" required className="input" />
                    <input name="option4" placeholder="Option 4" required className="input" />
                </div>

                <div>
                    <label>Correct Answer (Must match one option exactly)</label>
                    <input name="correctAnswer" required className="input" />
                </div>

                <button type="submit" className="btn btn-primary">Add Question</button>
            </form>
        </div>
    );
}
