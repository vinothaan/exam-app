"use client";

import { useState } from "react";
import { deleteQuestionAction, bulkDeleteQuestionsAction, getQuestions } from "./actions";

type Exam = { id: number; title: string; category: string };
type Category = { id: number; name: string };
type Question = { id: number; text: string; topic: string; correctAnswer: string };

export default function QuestionsManager({ exams, categories }: { exams: Exam[], categories: Category[] }) {
    const [filterMode, setFilterMode] = useState<"exam" | "topic">("exam");
    const [selectedId, setSelectedId] = useState<string>("");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(false);

    const handleFetch = async () => {
        if (!selectedId) return;
        setLoading(true);
        try {
            const res = await getQuestions(
                filterMode === 'exam'
                    ? { examId: parseInt(selectedId) }
                    : { topic: selectedId }
            );
            setQuestions(res);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this question?")) return;
        await deleteQuestionAction(id);
        setQuestions(prev => prev.filter(q => q.id !== id));
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Are you sure you want to DELETE ALL ${questions.length} questions in this list? This cannot be undone.`)) return;

        if (filterMode === 'exam') {
            await bulkDeleteQuestionsAction(parseInt(selectedId), undefined);
        } else {
            await bulkDeleteQuestionsAction(undefined, selectedId);
        }
        setQuestions([]);
    };

    // Auto-fetch when selection changes
    const onSelectionChange = (val: string) => {
        setSelectedId(val);
        // Only fetch if handled via effect or button. Let's add a "View" button for explicit action or just simple effect could work but button is safer.
        // Actually button is better UX for "Manage".
    };

    return (
        <div>
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginTop: 0 }}>Filter Questions</h3>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div>
                        <label className="label">Filter By</label>
                        <select
                            className="input"
                            style={{ minWidth: '150px' }}
                            value={filterMode}
                            onChange={(e) => { setFilterMode(e.target.value as any); setSelectedId(""); setQuestions([]); }}
                        >
                            <option value="exam">Exam</option>
                            <option value="topic">Topic</option>
                        </select>
                    </div>

                    <div style={{ flex: 1 }}>
                        <label className="label">Select {filterMode === 'exam' ? 'Exam' : 'Topic'}</label>
                        <select
                            className="input"
                            value={selectedId}
                            onChange={(e) => onSelectionChange(e.target.value)}
                        >
                            <option value="">-- Select --</option>
                            {filterMode === 'exam' ? (
                                exams.map(e => (
                                    <option key={e.id} value={e.id}>[{e.category}] {e.title}</option>
                                ))
                            ) : (
                                categories.map(c => (
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                ))
                            )}
                        </select>
                    </div>

                    <button className="btn btn-primary" onClick={handleFetch} disabled={!selectedId || loading}>
                        {loading ? 'Loading...' : 'View Questions'}
                    </button>
                </div>
            </div>

            {questions.length > 0 ? (
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h4>Found {questions.length} Questions</h4>
                        <button
                            className="btn"
                            style={{ background: '#ef4444', color: 'white', border: 'none' }}
                            onClick={handleBulkDelete}
                        >
                            🗑 Delete All Listed
                        </button>
                    </div>

                    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '2px solid hsl(var(--border))' }}>
                                    <th style={{ padding: '0.5rem' }}>ID</th>
                                    <th style={{ padding: '0.5rem' }}>Question Text</th>
                                    <th style={{ padding: '0.5rem' }}>Answer</th>
                                    <th style={{ padding: '0.5rem', textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {questions.map(q => (
                                    <tr key={q.id} style={{ borderBottom: '1px solid hsl(var(--border))' }}>
                                        <td style={{ padding: '0.5rem', verticalAlign: 'top', color: 'hsl(var(--muted-foreground))' }}>#{q.id}</td>
                                        <td style={{ padding: '0.5rem', verticalAlign: 'top' }}>
                                            <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>{q.text}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>Topic: {q.topic}</div>
                                        </td>
                                        <td style={{ padding: '0.5rem', verticalAlign: 'top' }}>{q.correctAnswer}</td>
                                        <td style={{ padding: '0.5rem', textAlign: 'right', verticalAlign: 'top' }}>
                                            <button
                                                onClick={() => handleDelete(q.id)}
                                                style={{ color: '#ef4444', background: 'transparent', border: '1px solid #ef4444', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                selectedId && !loading && <div style={{ textAlign: 'center', padding: '2rem', color: 'hsl(var(--muted-foreground))' }}>No questions found.</div>
            )}
        </div>
    );
}
