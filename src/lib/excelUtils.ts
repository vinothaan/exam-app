import * as XLSX from 'xlsx';
import { Question } from '../types';

export interface QuestionRow {
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  subject: string;
  topic: string;
  difficulty: string;
  marks: number;
  explanation?: string;
}

export const parseExcelFile = async (file: File): Promise<QuestionRow[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<QuestionRow>(worksheet);
        
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsBinaryString(file);
  });
};

export const downloadExcelTemplate = () => {
  const template: QuestionRow[] = [
    {
      question_text: 'Sample question text here?',
      option_a: 'Option A',
      option_b: 'Option B',
      option_c: 'Option C',
      option_d: 'Option D',
      correct_answer: 'A',
      subject: 'Banking Awareness',
      topic: 'Payment Systems',
      difficulty: 'easy',
      marks: 1,
      explanation: 'Explanation for the correct answer (optional)',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(template);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Questions');
  
  // Set column widths
  worksheet['!cols'] = [
    { wch: 50 }, // question_text
    { wch: 30 }, // option_a
    { wch: 30 }, // option_b
    { wch: 30 }, // option_c
    { wch: 30 }, // option_d
    { wch: 15 }, // correct_answer
    { wch: 20 }, // subject
    { wch: 20 }, // topic
    { wch: 15 }, // difficulty
    { wch: 10 }, // marks
    { wch: 50 }, // explanation
  ];
  
  XLSX.writeFile(workbook, 'question_template.xlsx');
};

export const exportQuestionsToExcel = (questions: Question[]) => {
  const data = questions.map(q => ({
    question_text: q.question_text,
    option_a: q.option_a,
    option_b: q.option_b,
    option_c: q.option_c,
    option_d: q.option_d,
    correct_answer: q.correct_answer,
    subject: q.subject,
    topic: q.topic,
    difficulty: q.difficulty,
    marks: q.marks,
    explanation: q.explanation || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Questions');
  
  XLSX.writeFile(workbook, `questions_export_${Date.now()}.xlsx`);
};
