"use client";

import { useState } from "react";
import readExcel from "read-excel-file";
import { bulkCreateQuestions } from "../actions";
import { useRouter } from "next/navigation";

type Exam = { id: number; title: string; category: string };

export default function BulkUploadForm({ exams }: { exams: Exam[] }) {
    const router = useRouter();
    const [selectedExam, setSelectedExam] = useState<string>("");
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
        if (!selectedExam || !file) {
            setMessage("Please select an exam and a file.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            // Check file type
            if (file.name.endsWith(".csv")) {
                // Simple CSV parse (fallback if user ignores Excel instruction or uses CSV)
                const text = await file.text();
                const rows = text.split("\n").map(r => r.split(","));
                // Remove header usually
                const dataRows = rows.slice(1).filter(r => r.length >= 6);
                const questions = dataRows.map(row => ({
                    text: row[0],
                    options: [row[1], row[2], row[3], row[4]],
                    correctAnswer: row[5]?.trim()
                }));
                await processQuestions(questions);

            } else {
                // Excel parse using read-excel-file
                const rows = await readExcel(file);
                // Assume Header: text, option1, option2, option3, option4, correctAnswer
                // Skip header row
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
            const res = await bulkCreateQuestions(parseInt(selectedExam), questions);
            if (res.success) {
                setMessage(`Successfully added ${res.count} questions!`);
                setFile(null);
                // Optional: router.refresh() or redirect
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

                <div className="form-group">
                    <label className="label">Select Exam</label>
                    <select
                        className="input"
                        value={selectedExam}
                        onChange={(e) => setSelectedExam(e.target.value)}
                        required
                    >
                        <option value="">-- Choose an Exam --</option>
                        {exams.map(exam => (
                            <option key={exam.id} value={exam.id}>
                                [{exam.category}] {exam.title}
                            </option>
                        ))}
                    </select>
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
                    disabled={loading || !file || !selectedExam}
                    style={{ width: '100%' }}
                >
                    {loading ? 'Processing...' : 'Upload & Process'}
                </button>
            </div>
        </div>
    );
}
