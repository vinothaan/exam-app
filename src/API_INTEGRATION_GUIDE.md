# API Integration Guide for Neon.tech

## Overview
This guide explains how to integrate your Neon.tech PostgreSQL database with the frontend application.

## Current Implementation
The app currently uses mock data in these files:
- `/lib/auth.ts` - Authentication logic
- `/lib/mockData.ts` - Sample data
- All component files have `// TODO:` comments where API calls should be added

## Step-by-Step Integration

### 1. Install Required Dependencies

```bash
npm install @neondatabase/serverless
npm install bcryptjs jsonwebtoken
npm install @types/bcryptjs @types/jsonwebtoken --save-dev
```

### 2. Create API Service Layer

Create `/lib/api.ts`:

```typescript
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL || '');

export const api = {
  // Auth endpoints
  async login(email: string, password: string) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  async signup(email: string, password: string, name: string) {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    return response.json();
  },

  // Question endpoints
  async getQuestions(filters?: { subject?: string; difficulty?: string }) {
    const params = new URLSearchParams(filters as any);
    const response = await fetch(`/api/questions?${params}`);
    return response.json();
  },

  async createQuestion(question: any) {
    const response = await fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(question)
    });
    return response.json();
  },

  async bulkCreateQuestions(questions: any[]) {
    const response = await fetch('/api/questions/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questions })
    });
    return response.json();
  },

  // Exam endpoints
  async getExams() {
    const response = await fetch('/api/exams');
    return response.json();
  },

  async createExam(exam: any) {
    const response = await fetch('/api/exams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(exam)
    });
    return response.json();
  },

  // Attempt endpoints
  async submitAttempt(attempt: any) {
    const response = await fetch('/api/attempts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(attempt)
    });
    return response.json();
  },

  async getMyAttempts() {
    const response = await fetch('/api/attempts/my');
    return response.json();
  },

  // Statistics
  async getStatistics() {
    const response = await fetch('/api/stats/overview');
    return response.json();
  }
};
```

### 3. Create Backend API Routes

If using Next.js API routes, create these files:

#### `/pages/api/auth/login.ts`
```typescript
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const sql = neon(process.env.DATABASE_URL!);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  try {
    const users = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}
```

#### `/pages/api/questions/index.ts`
```typescript
import { neon } from '@neondatabase/serverless';
import { verifyToken } from '../../../lib/auth-middleware';

const sql = neon(process.env.DATABASE_URL!);

export default async function handler(req, res) {
  const user = await verifyToken(req);
  
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const { subject, difficulty } = req.query;
    
    let query = sql`SELECT * FROM questions WHERE 1=1`;
    
    if (subject) {
      query = sql`${query} AND subject = ${subject}`;
    }
    
    if (difficulty) {
      query = sql`${query} AND difficulty = ${difficulty}`;
    }
    
    const questions = await query;
    return res.status(200).json(questions);
  }

  if (req.method === 'POST') {
    if (user.role !== 'supervisor') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const question = req.body;
    
    const result = await sql`
      INSERT INTO questions (
        question_text, option_a, option_b, option_c, option_d,
        correct_answer, subject, topic, difficulty, marks,
        explanation, created_by
      ) VALUES (
        ${question.question_text}, ${question.option_a}, 
        ${question.option_b}, ${question.option_c}, ${question.option_d},
        ${question.correct_answer}, ${question.subject}, ${question.topic},
        ${question.difficulty}, ${question.marks}, ${question.explanation},
        ${user.id}
      )
      RETURNING *
    `;

    return res.status(201).json(result[0]);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
```

### 4. Update Auth Service

Replace `/lib/auth.ts` with real API calls:

```typescript
import { User } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<User | null> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) return null;

    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  },

  async signup(email: string, password: string, name: string): Promise<User | null> {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });

    if (!response.ok) return null;

    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  }
};
```

### 5. Update Components to Use Real API

Example for Question Management component:

```typescript
// In /components/supervisor/QuestionManagement.tsx

// Replace mock data loading
useEffect(() => {
  loadQuestions();
}, []);

async function loadQuestions() {
  const data = await api.getQuestions({ subject: filterSubject });
  setQuestions(data);
}

// Replace handleAddQuestion
const handleAddQuestion = async () => {
  try {
    if (editingQuestion) {
      await api.updateQuestion(editingQuestion.id, formData);
      toast.success('Question updated successfully');
    } else {
      await api.createQuestion(formData);
      toast.success('Question added successfully');
    }
    await loadQuestions();
    resetForm();
    setIsAddDialogOpen(false);
  } catch (error) {
    toast.error('Failed to save question');
  }
};
```

### 6. Add Authentication Middleware

Create `/lib/auth-middleware.ts`:

```typescript
import jwt from 'jsonwebtoken';

export async function verifyToken(req: any) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded;
  } catch (error) {
    return null;
  }
}

export function withAuth(handler: any) {
  return async (req: any, res: any) => {
    const user = await verifyToken(req);
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.user = user;
    return handler(req, res);
  };
}
```

### 7. Environment Variables

Create `.env.local`:

```env
DATABASE_URL=your_neon_tech_postgresql_connection_string
JWT_SECRET=your_random_secret_key_min_32_characters
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 8. Axios Alternative (Optional)

If you prefer Axios over fetch:

```bash
npm install axios
```

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

## Testing Checklist

- [ ] Authentication (login/signup/logout)
- [ ] Question CRUD operations
- [ ] Bulk question upload
- [ ] Exam creation and management
- [ ] Exam taking flow
- [ ] Results calculation and storage
- [ ] Statistics dashboard
- [ ] User attempt history

## Security Best Practices

1. **Password Hashing**: Always use bcrypt with salt rounds >= 10
2. **JWT Tokens**: Keep expiry short (7 days max)
3. **Input Validation**: Validate all inputs on backend
4. **SQL Injection**: Always use parameterized queries
5. **Rate Limiting**: Implement rate limiting on auth endpoints
6. **HTTPS**: Always use HTTPS in production
7. **CORS**: Configure CORS properly

## Performance Tips

1. Use connection pooling with Neon
2. Implement pagination for large lists
3. Add database indexes (see DATABASE_SCHEMA.md)
4. Cache frequently accessed data
5. Use lazy loading for questions in exams
6. Implement debouncing for search inputs

## Deployment

1. Set environment variables in your hosting platform
2. Ensure DATABASE_URL uses SSL connection
3. Run database migrations
4. Test all endpoints in staging environment
5. Monitor database performance in Neon dashboard
