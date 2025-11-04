# Bank Exam Prep - PWA Application

A comprehensive online bank examination preparation Progressive Web App (PWA) built with React, TypeScript, and Tailwind CSS, designed to work with Neon.tech PostgreSQL serverless database.

## 🚀 Features

### For Supervisors (Admin)
- **Dashboard**: Comprehensive statistics with charts and analytics
- **Question Management**: 
  - Add single questions with rich editor
  - Bulk upload via Excel (.xlsx/.xls)
  - Edit and delete questions
  - Filter by subject, topic, difficulty
  - Export questions to Excel
- **Exam Management**:
  - Create exams with custom settings
  - Select questions for each exam
  - Set duration, passing marks, difficulty
  - Activate/deactivate exams
  - Update exam configurations

### For Students (Users)
- **Dashboard**: 
  - Personal progress tracking
  - Subject-wise performance analytics
  - Recent activity feed
  - Performance trends
- **Available Exams**:
  - Browse all active exams
  - Filter by subject and difficulty
  - View exam details before starting
- **Exam Taking**:
  - Timed exam interface with countdown
  - Question palette for navigation
  - Mark questions for review
  - Auto-submit on time expiry
  - Visual progress tracking
- **Results & Analytics**:
  - Detailed score breakdown
  - Question-by-question review
  - Correct answers and explanations
  - Performance metrics
- **Exam History**:
  - View all attended exams
  - Compare performance over time
  - Retake exams for practice

## 📋 Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS v4.0
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **Excel**: XLSX (SheetJS)
- **Database**: Neon.tech PostgreSQL (serverless)
- **PWA**: Service Worker for offline capability

## 🏗️ Project Structure

```
├── components/
│   ├── supervisor/        # Supervisor-specific components
│   │   ├── SupervisorDashboard.tsx
│   │   ├── QuestionManagement.tsx
│   │   └── ExamManagement.tsx
│   ├── user/             # Student-specific components
│   │   ├── UserDashboard.tsx
│   │   ├── ExamList.tsx
│   │   ├── ExamTaking.tsx
│   │   ├── ExamResults.tsx
│   │   └── AttendedExams.tsx
│   ├── ui/               # Reusable UI components (Shadcn)
│   ├── AuthGuard.tsx
│   ├── LoginPage.tsx
│   └── SignupPage.tsx
├── lib/
│   ├── auth.ts           # Authentication service
│   ├── mockData.ts       # Sample data (replace with API)
│   └── excelUtils.ts     # Excel import/export utilities
├── types/
│   └── index.ts          # TypeScript type definitions
├── App.tsx               # Main application component
└── styles/
    └── globals.css       # Global styles and Tailwind config
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Neon.tech account (for database)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Install additional required packages:
```bash
npm install xlsx @neondatabase/serverless bcryptjs jsonwebtoken
npm install @types/bcryptjs @types/jsonwebtoken --save-dev
```

4. Set up environment variables (create `.env.local`):
```env
DATABASE_URL=your_neon_tech_connection_string
JWT_SECRET=your_jwt_secret_key
NEXT_PUBLIC_API_URL=http://localhost:3000
```

5. Set up the database (see DATABASE_SCHEMA.md)

6. Start the development server:
```bash
npm run dev
```

## 📊 Database Setup

1. Create a Neon.tech account at https://neon.tech
2. Create a new project and database
3. Copy the connection string
4. Run the SQL schema from `DATABASE_SCHEMA.md`
5. Update environment variables

See `DATABASE_SCHEMA.md` for complete schema details.

## 🔌 API Integration

The application currently uses mock data. To connect to your Neon database:

1. Review `API_INTEGRATION_GUIDE.md` for detailed instructions
2. Create API routes in `/pages/api/` (if using Next.js)
3. Update service files in `/lib/` to use real API calls
4. Replace `// TODO:` comments in components with actual API calls

## 📱 PWA Features

- **Offline Support**: Service Worker caches essential resources
- **Installable**: Can be installed on mobile devices and desktops
- **Responsive**: Works on all screen sizes
- **Fast Loading**: Optimized for performance

To test PWA features:
1. Build the production version: `npm run build`
2. Serve it: `npm run start`
3. Open in Chrome/Edge and check "Install App" option

## 🎨 Customization

### Styling
- Colors and themes: `styles/globals.css`
- Tailwind config: Built into CSS (v4.0)
- Component styles: Inline with Tailwind classes

### Subjects
Update subjects in multiple files:
- `/lib/mockData.ts`
- `/components/supervisor/QuestionManagement.tsx`
- `/components/supervisor/ExamManagement.tsx`

### Question Types
Currently supports single-choice (A/B/C/D). To add more types:
1. Update `Question` type in `/types/index.ts`
2. Modify question form in `QuestionManagement.tsx`
3. Update exam taking interface in `ExamTaking.tsx`

## 👥 User Roles

### Supervisor
- Email: supervisor@test.com
- Password: password123
- Access: Full system control

### Student  
- Email: user@test.com
- Password: password123
- Access: Take exams and view results

*Note: These are demo credentials. In production, users will register via signup.*

## 📤 Excel Import/Export

### Question Template Format
Download template from the app or use this structure:

| question_text | option_a | option_b | option_c | option_d | correct_answer | subject | topic | difficulty | marks | explanation |
|--------------|----------|----------|----------|----------|----------------|---------|-------|------------|-------|-------------|
| Your question? | Option A | Option B | Option C | Option D | A | Banking | NEFT | easy | 1 | Optional explanation |

- `correct_answer`: Must be A, B, C, or D
- `difficulty`: Must be easy, medium, or hard
- `marks`: Number (typically 1-5)

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control
- Input validation and sanitization
- Protected API routes
- SQL injection prevention (parameterized queries)

## 🎯 Future Enhancements

- [ ] Multiple question types (multiple choice, true/false, fill-in-blank)
- [ ] Image upload for questions
- [ ] Timer per question (not just exam)
- [ ] Negative marking option
- [ ] Topic-wise tests
- [ ] Practice mode (untimed)
- [ ] Discussion forum
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Certificate generation
- [ ] Leaderboards
- [ ] Social sharing
- [ ] Video explanations
- [ ] Study materials library

## 🐛 Known Issues

- Mock data is used by default (replace with API calls)
- PWA icons need to be created (192x192 and 512x512)
- Service worker needs production URL configuration
- Excel upload doesn't validate all edge cases

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📧 Support

For issues or questions:
1. Check `API_INTEGRATION_GUIDE.md` for API setup
2. Review `DATABASE_SCHEMA.md` for database structure
3. Check component comments for implementation details

## 🙏 Acknowledgments

- Shadcn/ui for beautiful components
- Lucide for icons
- Recharts for data visualization
- Neon.tech for serverless PostgreSQL
- Tailwind CSS for styling

---

Built with ❤️ for bank exam aspirants
