// Database Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'supervisor' | 'user';
  created_at: string;
}

export interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
  explanation?: string;
  created_by: string;
  created_at: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  subject: string;
  duration_minutes: number;
  total_marks: number;
  passing_marks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  is_active: boolean;
  created_by: string;
  created_at: string;
  questions: Question[];
}

export interface ExamAttempt {
  id: string;
  exam_id: string;
  user_id: string;
  answers: Record<string, string>; // question_id -> answer
  score: number;
  total_marks: number;
  percentage: number;
  time_taken_minutes: number;
  status: 'completed' | 'in_progress';
  started_at: string;
  completed_at?: string;
}

export interface Statistics {
  total_users: number;
  total_exams: number;
  total_questions: number;
  total_attempts: number;
  average_score: number;
  subject_wise_performance: Array<{
    subject: string;
    avg_score: number;
    attempts: number;
  }>;
  recent_attempts: Array<{
    user_name: string;
    exam_title: string;
    score: number;
    completed_at: string;
  }>;
}
