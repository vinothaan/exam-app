"use client";

import { useState } from "react";
import readExcel from "read-excel-file";
import { bulkCreateQuestions } from "../actions";
import { useRouter } from "next/navigation";

type Exam = { id: number; title: string; category: string };
type Category = { id: number; name: string };

export default function BulkUploadForm({ exams, categories }: { exams: Exam[], categories: Category[] }) {
    const router = useRouter();
    const [uploadType, setUploadType] = useState<"exam" | "topic">("exam");
    const [selectedExam, setSelectedExam] = useState<string>("");
    const [selectedTopic, setSelectedTopic] = useState<string>("");

    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const downloadTemplate = () => {
        const headers = ["text", "option1", "option2", "option3", "option4", "correctAnswer"];
        const exampleRow = ["What is 2+2?", "3", "4", "5", "6", "4"];
        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + exampleRow.join(",");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "questions_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Please select a file.");
            return;
        }

        if (uploadType === "exam" && !selectedExam) {
            setMessage("Please select an exam.");
            return;
        }
        if (uploadType === "topic" && !selectedTopic) {
            setMessage("Please select a topic.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            // Check file type
            if (file.name.endsWith(".csv")) {
                const text = await file.text();
                const rows = text.split("\n").map(r => r.split(","));
                const dataRows = rows.slice(1).filter(r => r.length >= 6);
                const questions = dataRows.map(row => ({
                    text: row[0],
                    options: [row[1], row[2], row[3], row[4]],
                    correctAnswer: row[5]?.trim()
                }));
                await processQuestions(questions);

            } else {
                const rows = await readExcel(file);
                const dataRows = rows.slice(1);
                const questions = dataRows.map((row: any[]) => ({
                    text: String(row[0]),
                    options: [String(row[1]), String(row[2]), String(row[3]), String(row[4])],
                    correctAnswer: String(row[5])
                }));

                await processQuestions(questions);
            }

        } catch (error) {
            console.error(error);
            setMessage("Error processing file. Please check the format.");
            setLoading(false);
        }
    };

    const processQuestions = async (questions: any[]) => {
        try {
            let target: { examId?: number; topic: string };

            if (uploadType === "exam") {
                const exam = exams.find(e => e.id === parseInt(selectedExam));
                if (!exam) throw new Error("Exam not found");
                target = { examId: exam.id, topic: exam.category };
            } else {
                target = { topic: selectedTopic };
            }

            const res = await bulkCreateQuestions(target, questions);

            if (res.success) {
                setMessage(`Successfully added ${res.count} questions!`);
                setFile(null);
            }
        } catch (e) {
            setMessage("Failed to save questions.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2>Bulk Upload Questions</h2>

            <div className="card">
                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'hsl(var(--secondary)/0.1)', borderRadius: 'var(--radius)' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Step 1: Download Template</p>
                    <button onClick={downloadTemplate} className="btn" style={{ fontSize: '0.9rem', border: '1px solid hsl(var(--border))' }}>
                        📥 Download CSV Template
                    </button>
                    <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'hsl(var(--muted-foreground))' }}>
                        Columns: Question Text, Option A, Option B, Option C, Option D, Correct Answer
                    </p>
                </div>

                {/* Upload Type Selection */}
                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid hsl(var(--border))', paddingBottom: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', fontWeight: uploadType === 'exam' ? 'bold' : 'normal', cursor: 'pointer' }}>
                        <input
                            type="radio"
                            name="uploadType"
                            value="exam"
                            checked={uploadType === 'exam'}
                            onChange={() => setUploadType('exam')}
                            style={{ marginRight: '0.5rem' }}
                        />
                        Upload to Exam
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', fontWeight: uploadType === 'topic' ? 'bold' : 'normal', cursor: 'pointer' }}>
                        <input
                            type="radio"
                            name="uploadType"
                            value="topic"
                            checked={uploadType === 'topic'}
                            onChange={() => setUploadType('topic')}
                            style={{ marginRight: '0.5rem' }}
                        />
                        Upload to Topic (Practice Bank)
                    </label>
                </div>

                {/* Select Exam or Topic */}
                <div className="form-group">
                    <label className="label">
                        {uploadType === 'exam' ? 'Select Exam' : 'Select Topic (Category)'}
                    </label>

                    {uploadType === 'exam' ? (
                        <select
                            className="input"
                            value={selectedExam}
                            onChange={(e) => setSelectedExam(e.target.value)}
                        >
                            <option value="">-- Choose an Exam --</option>
                            {exams.map(exam => (
                                <option key={exam.id} value={exam.id}>
                                    [{exam.category}] {exam.title}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <select
                            className="input"
                            value={selectedTopic}
                            onChange={(e) => setSelectedTopic(e.target.value)}
                        >
                            <option value="">-- Choose a Topic --</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <div className="form-group">
                    <label className="label">Upload File (.csv or .xlsx)</label>
                    <input
                        type="file"
                        accept=".csv, .xlsx, .xls"
                        className="input"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                </div>

                {message && (
                    <div style={{ margin: '1rem 0', padding: '0.5rem', background: message.includes("Success") ? 'rgba(0,255,0,0.1)' : 'rgba(255,0,0,0.1)' }}>
                        {message}
                    </div>
                )}

                <button
                    className="btn btn-primary"
                    onClick={handleUpload}
                    disabled={loading || !file || (uploadType === 'exam' ? !selectedExam : !selectedTopic)}
                    style={{ width: '100%' }}
                >
                    {loading ? 'Processing...' : 'Upload & Process'}
                </button>
            </div>
        </div>
    );
}
