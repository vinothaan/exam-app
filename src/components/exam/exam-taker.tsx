"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { submitExam } from "@/app/dashboard/exams/actions";

// Define simpler Types for client
type Question = {
    id: number;
    text: string;
    options: string[];
};

export default function ExamTaker({
    initialQuestions,
    examId,
    duration
}: {
    initialQuestions: Question[],
    examId: number,
    duration: number
}) {
    const router = useRouter();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [timeLeft, setTimeLeft] = useState(duration * 60);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await submitExam(examId, answers);
            router.push(`/dashboard/exams/${examId}/result`);
        } catch (error) {
            console.error(error);
            alert("Failed to submit exam. Please try again.");
            setIsSubmitting(false);
        }
    };

    if (!currentQuestion) return <div>Loading...</div>;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: 'hsl(var(--card))', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid hsl(var(--border))' }}>
                <h3 style={{ margin: 0 }}>Question {currentQuestionIndex + 1} / {initialQuestions.length}</h3>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: timeLeft < 300 ? 'red' : 'inherit' }}>
                    ⏱ {formatTime(timeLeft)}
                </div>
            </div>

            <div style={{ display: 'flex', gap: '2rem', flexDirection: 'column' }}>

                {/* Main Question Area */}
                <div className="card" style={{ flex: 2 }}>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                        {currentQuestion.text}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {currentQuestion.options.map((option, idx) => (
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
                                    style={{ marginRight: '1rem', accentColor: 'hsl(var(--secondary))' }}
                                />
                                {option}
                            </label>
                        ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem' }}>
                        <button
                            className="btn"
                            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                            disabled={currentQuestionIndex === 0}
                            style={{ visibility: currentQuestionIndex === 0 ? 'hidden' : 'visible' }}
                        >
                            Previous
                        </button>

                        {currentQuestionIndex === initialQuestions.length - 1 ? (
                            <button className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Submit Exam'}
                            </button>
                        ) : (
                            <button
                                className="btn btn-primary"
                                onClick={() => setCurrentQuestionIndex(prev => Math.min(initialQuestions.length - 1, prev + 1))}
                            >
                                Next & Save
                            </button>
                        )}
                    </div>
                </div>

                {/* Sidebar Question Palette */}
                {/* <div className="card" style={{ flex: 1, alignSelf: 'start' }}>
            <h3>Questions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', marginTop: '1rem' }}>
              {initialQuestions.map((q, idx) => (
                <button 
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  style={{ 
                    padding: '0.5rem', 
                    borderRadius: '4px',
                    border: '1px solid hsl(var(--border))',
                    background: currentQuestionIndex === idx ? 'hsl(var(--secondary))' : (answers[q.id] ? 'hsl(var(--accent))' : 'transparent'),
                    color: currentQuestionIndex === idx ? 'white' : 'inherit',
                    cursor: 'pointer'
                  }}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
        </div> */}
            </div>
        </div>
    );
}
