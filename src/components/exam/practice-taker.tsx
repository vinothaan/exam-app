"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { submitPractice } from "@/app/dashboard/study/practice/actions";

type Question = {
    id: number;
    text: string;
    options: string[] | any; // Handle jsonb
};

export default function PracticeTaker({
    initialQuestions,
    topic,
    duration
}: {
    initialQuestions: Question[],
    topic: string,
    duration: number
}) {
    const router = useRouter();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [timeLeft, setTimeLeft] = useState(duration * 60);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
    const [visited, setVisited] = useState<Set<number>>(new Set([initialQuestions[0]?.id]));

    // Update visited status when changing questions
    useEffect(() => {
        if (initialQuestions[currentQuestionIndex]) {
            setVisited(prev => new Set(prev).add(initialQuestions[currentQuestionIndex].id));
        }
    }, [currentQuestionIndex, initialQuestions]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const currentQuestion = initialQuestions[currentQuestionIndex];

    const handleOptionSelect = (option: string) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: option
        }));
    };

    const toggleReview = () => {
        setMarkedForReview(prev => {
            const next = new Set(prev);
            if (next.has(currentQuestion.id)) {
                next.delete(currentQuestion.id);
            } else {
                next.add(currentQuestion.id);
            }
            return next;
        });
    };

    const clearResponse = () => {
        setAnswers(prev => {
            const next = { ...prev };
            delete next[currentQuestion.id];
            return next;
        });
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await submitPractice(topic, answers);
            alert("Practice Session Completed!");
            router.push(`/dashboard/study`); // Redirect to study page or results
            // Note: Results page for practice is not yet built.
        } catch (error) {
            console.error(error);
            alert("Failed to submit practice. Please try again.");
            setIsSubmitting(false);
        }
    };

    const getQuestionStatus = (qId: number) => {
        if (currentQuestionIndex === initialQuestions.findIndex(q => q.id === qId)) return 'current';
        if (markedForReview.has(qId)) return 'review';
        if (answers[qId]) return 'answered';
        if (visited.has(qId)) return 'skipped';
        return 'not-visited';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'current': return 'hsl(var(--primary))'; // Active
            case 'review': return '#eab308'; // Yellow
            case 'answered': return '#22c55e'; // Green
            case 'skipped': return '#ef4444'; // Red
            default: return 'hsl(var(--muted))'; // Grey
        }
    };

    if (!currentQuestion) return <div>Loading...</div>;

    // Parse options if they are strings in JSON
    const currentOptions = Array.isArray(currentQuestion.options) ? currentQuestion.options : [];

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', background: 'hsl(var(--card))', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid hsl(var(--border))' }}>
                <h3 style={{ margin: 0 }}>{topic} Practice</h3>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: timeLeft < 300 ? 'red' : 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>⏱</span> {formatTime(timeLeft)}
                </div>
            </div>

            <div className="exam-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '2rem' }}>

                {/* Main Question Area */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                        <h4 style={{ margin: 0, color: 'hsl(var(--muted-foreground))' }}>Question {currentQuestionIndex + 1}</h4>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={toggleReview}
                                style={{
                                    background: markedForReview.has(currentQuestion.id) ? '#eab308' : 'transparent',
                                    color: markedForReview.has(currentQuestion.id) ? 'white' : 'hsl(var(--foreground))',
                                    border: '1px solid #eab308',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '20px',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer'
                                }}
                            >
                                {markedForReview.has(currentQuestion.id) ? '★ Marked' : '☆ Mark for Review'}
                            </button>
                        </div>
                    </div>

                    <p style={{ fontSize: '1.15rem', lineHeight: '1.7', marginBottom: '2rem', fontWeight: '500' }}>
                        {currentQuestion.text}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {currentOptions.map((option: string, idx: number) => (
                            <label
                                key={idx}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '1rem',
                                    borderRadius: 'var(--radius)',
                                    border: '1px solid',
                                    borderColor: answers[currentQuestion.id] === option ? 'hsl(var(--secondary))' : 'hsl(var(--border))',
                                    background: answers[currentQuestion.id] === option ? 'hsl(var(--secondary)/0.1)' : 'transparent',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <input
                                    type="radio"
                                    name={`question-${currentQuestion.id}`}
                                    value={option}
                                    checked={answers[currentQuestion.id] === option}
                                    onChange={() => handleOptionSelect(option)}
                                    style={{ marginRight: '1rem', accentColor: 'hsl(var(--secondary))', width: '18px', height: '18px' }}
                                />
                                {option}
                            </label>
                        ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '3rem' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                className="btn"
                                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentQuestionIndex === 0}
                                style={{ opacity: currentQuestionIndex === 0 ? 0.5 : 1 }}
                            >
                                Previous
                            </button>
                            <button
                                className="btn"
                                onClick={clearResponse}
                                style={{ color: 'hsl(var(--destructive))', borderColor: 'hsl(var(--destructive))', background: 'transparent' }}
                                disabled={!answers[currentQuestion.id]}
                            >
                                Clear
                            </button>
                        </div>

                        {currentQuestionIndex === initialQuestions.length - 1 ? (
                            <button className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Submit Test'}
                            </button>
                        ) : (
                            <button
                                className="btn btn-primary"
                                onClick={() => setCurrentQuestionIndex(prev => Math.min(initialQuestions.length - 1, prev + 1))}
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>

                {/* Question Palette Sidebar */}
                <div className="card question-palette" style={{ height: 'fit-content' }}>
                    <h4 style={{ marginTop: 0, marginBottom: '1rem' }}>Question Palette</h4>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem', marginBottom: '2rem' }}>
                        {initialQuestions.map((q, idx) => {
                            const status = getQuestionStatus(q.id);
                            return (
                                <button
                                    key={q.id}
                                    onClick={() => setCurrentQuestionIndex(idx)}
                                    title={status}
                                    style={{
                                        aspectRatio: '1',
                                        borderRadius: '50%',
                                        border: status === 'current' ? '2px solid hsl(var(--primary))' : '1px solid transparent',
                                        background: status === 'current' ? 'transparent' : getStatusColor(status),
                                        color: status === 'current' ? 'hsl(var(--foreground))' : 'white',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    {idx + 1}
                                </button>
                            )
                        })}
                    </div>

                    {/* Legend */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }}></div> Answered
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }}></div> Skipped
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#eab308' }}></div> Review
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'hsl(var(--muted))' }}></div> Not Visited
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @media (max-width: 768px) {
                    .exam-layout {
                        grid-template-columns: 1fr !important;
                    }
                    .question-palette {
                        order: -1;
                        margin-bottom: 2rem;
                    }
                }
            `}</style>
        </div>
    );
}
