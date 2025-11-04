# Database Schema for Neon.tech PostgreSQL

## Overview
This document provides the PostgreSQL schema for your Bank Exam Prep application to be used with Neon.tech serverless database.

## Tables

### 1. users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('supervisor', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### 2. questions
```sql
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer CHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  subject VARCHAR(100) NOT NULL,
  topic VARCHAR(100) NOT NULL,
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  marks INTEGER NOT NULL DEFAULT 1,
  explanation TEXT,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_questions_subject ON questions(subject);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
CREATE INDEX idx_questions_created_by ON questions(created_by);
```

### 3. exams
```sql
CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  subject VARCHAR(100) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  total_marks INTEGER NOT NULL,
  passing_marks INTEGER NOT NULL,
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  is_active BOOLEAN DEFAULT true,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exams_subject ON exams(subject);
CREATE INDEX idx_exams_is_active ON exams(is_active);
CREATE INDEX idx_exams_created_by ON exams(created_by);
```

### 4. exam_questions (Junction table)
```sql
CREATE TABLE exam_questions (
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  question_order INTEGER NOT NULL,
  PRIMARY KEY (exam_id, question_id)
);

CREATE INDEX idx_exam_questions_exam ON exam_questions(exam_id);
CREATE INDEX idx_exam_questions_question ON exam_questions(question_id);
```

### 5. exam_attempts
```sql
CREATE TABLE exam_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  answers JSONB NOT NULL, -- Store as {"question_id": "answer"}
  score INTEGER NOT NULL,
  total_marks INTEGER NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  time_taken_minutes INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('in_progress', 'completed')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_exam_attempts_user ON exam_attempts(user_id);
CREATE INDEX idx_exam_attempts_exam ON exam_attempts(exam_id);
CREATE INDEX idx_exam_attempts_status ON exam_attempts(status);
CREATE INDEX idx_exam_attempts_completed ON exam_attempts(completed_at);
```

## Views for Statistics

### Subject-wise Performance
```sql
CREATE VIEW subject_performance AS
SELECT 
  q.subject,
  COUNT(DISTINCT ea.id) as total_attempts,
  AVG(ea.percentage) as avg_percentage,
  COUNT(DISTINCT ea.user_id) as unique_students
FROM exam_attempts ea
JOIN exams e ON ea.exam_id = e.id
JOIN exam_questions eq ON eq.exam_id = e.id
JOIN questions q ON q.id = eq.question_id
WHERE ea.status = 'completed'
GROUP BY q.subject;
```

### Recent Activity
```sql
CREATE VIEW recent_activity AS
SELECT 
  u.name as user_name,
  e.title as exam_title,
  ea.percentage as score,
  ea.completed_at
FROM exam_attempts ea
JOIN users u ON ea.user_id = u.id
JOIN exams e ON ea.exam_id = e.id
WHERE ea.status = 'completed'
ORDER BY ea.completed_at DESC
LIMIT 10;
```

## API Endpoints Structure

Replace the mock data calls with these API endpoints:

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Questions (Supervisor)
- `GET /api/questions` - Get all questions (with filters)
- `POST /api/questions` - Create single question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question
- `POST /api/questions/bulk` - Bulk upload questions

### Exams (Supervisor)
- `GET /api/exams` - Get all exams
- `POST /api/exams` - Create exam
- `PUT /api/exams/:id` - Update exam
- `DELETE /api/exams/:id` - Delete exam

### Student Endpoints
- `GET /api/exams/available` - Get available exams for student
- `GET /api/exams/:id` - Get exam details with questions
- `POST /api/attempts` - Submit exam attempt
- `GET /api/attempts/my` - Get student's attempts
- `GET /api/attempts/:id` - Get attempt details

### Statistics (Supervisor)
- `GET /api/stats/overview` - Dashboard statistics
- `GET /api/stats/subjects` - Subject-wise performance
- `GET /api/stats/recent` - Recent activity

## Environment Variables

Create a `.env` file:
```env
DATABASE_URL=your_neon_tech_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
```

## Connection Example (Node.js with Neon)

```javascript
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

// Example query
async function getQuestions() {
  const questions = await sql`
    SELECT * FROM questions 
    WHERE subject = $1
    ORDER BY created_at DESC
  `;
  return questions;
}
```

## Indexes for Performance
All major foreign keys have indexes for faster queries. Additional indexes to consider:
- Full-text search on question_text
- Composite index on (user_id, completed_at) for student history
- Composite index on (exam_id, status) for active attempts

## Security Considerations
1. Always hash passwords (use bcrypt)
2. Use parameterized queries to prevent SQL injection
3. Implement row-level security (RLS) if supported
4. Rate limit authentication endpoints
5. Validate and sanitize all user inputs
6. Use JWT tokens for authentication with short expiry
