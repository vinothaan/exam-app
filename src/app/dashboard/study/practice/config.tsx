"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTopics, getPracticeStats } from "./actions";

export default function PracticeConfig() {
    const router = useRouter();
    const [topics, setTopics] = useState<{ id: number; name: string }[]>([]);
    const [selectedTopic, setSelectedTopic] = useState("");
    const [questionCount, setQuestionCount] = useState(10);
    const [timeLimit, setTimeLimit] = useState(15); // Minutes
    const [stats, setStats] = useState({ sessions: 0, visitors: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [isStarting, setIsStarting] = useState(false);

    useEffect(() => {
        Promise.all([getTopics(), getPracticeStats()]).then(([topicsData, statsData]) => {
            setTopics(topicsData);
            if (topicsData.length > 0) setSelectedTopic(topicsData[0].name);
            setStats(statsData);
            setIsLoading(false);
        });
    }, []);

    const handleStart = async () => {
        if (!selectedTopic) return;
        setIsStarting(true);

        const params = new URLSearchParams({
            topic: selectedTopic,
            count: questionCount.toString(),
            time: timeLimit.toString()
        });

        router.push(`/dashboard/study/practice/take?${params.toString()}`);
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h2 style={{ marginTop: 0 }}>Practice Mode</h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div style={{ background: 'hsl(var(--secondary)/0.1)', color: 'hsl(var(--secondary))', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        🧪 {stats.sessions} Practices
                    </div>
                    <div style={{ background: 'hsl(var(--primary)/0.1)', color: 'hsl(var(--primary))', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        👀 {stats.visitors} Visitors
                    </div>
                </div>
            </div>

            <p style={{ color: 'hsl(var(--muted-foreground))' }}>Customize your practice session.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>

                {/* Topic Selection */}
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Select Topic</label>
                    <select
                        value={selectedTopic}
                        onChange={(e) => setSelectedTopic(e.target.value)}
                        style={{
                            width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)',
                            border: '1px solid hsl(var(--border))', background: 'hsl(var(--background))', color: 'inherit'
                        }}
                    >
                        {topics.map(t => (
                            <option key={t.id} value={t.name}>{t.name}</option>
                        ))}
                    </select>
                </div>

                {/* Question Count Input */}
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Number of Questions (1-50)</label>
                    <input
                        type="number"
                        value={questionCount}
                        onChange={(e) => setQuestionCount(Math.min(50, Math.max(1, Number(e.target.value))))}
                        min="1" max="50"
                        style={{
                            width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)',
                            border: '1px solid hsl(var(--border))', background: 'hsl(var(--background))', color: 'inherit'
                        }}
                    />
                </div>

                {/* Time Limit */}
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Time Limit (Minutes)</label>
                    <input
                        type="number"
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(Number(e.target.value))}
                        min="1" max="180"
                        style={{
                            width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)',
                            border: '1px solid hsl(var(--border))', background: 'hsl(var(--background))', color: 'inherit'
                        }}
                    />
                </div>

                <button
                    className="btn btn-primary"
                    onClick={handleStart}
                    disabled={isStarting}
                    style={{ marginTop: '1rem' }}
                >
                    {isStarting ? 'Starting...' : 'Start Practice'}
                </button>
            </div>
        </div>
    );
}
