import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { users, exams, questions, categories } from '../src/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seedData() {
    console.log('Seeding Data...');

    // 1. Create Admin
    const email = 'admin@bankprep.com';
    const password = 'adminpassword';
    const existingUser = await db.select().from(users).where(eq(users.email, email));

    if (existingUser.length === 0) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.insert(users).values({
            name: 'Admin User',
            email: email,
            password: hashedPassword,
            role: 'admin',
        });
        console.log('Admin user created.');
    } else {
        console.log('Admin user already exists.');
    }

    // 2. Create Categories/Topics
    const topics = ['Quant', 'Reasoning', 'English', 'General Awareness'];
    for (const topic of topics) {
        await db.insert(categories).values({ name: topic }).onConflictDoNothing();
    }
    console.log('Categories seeded.');

    // 3. Create Sample Questions for Practice (Topic-wise)
    // We won't link these to an Exam ID necessarily, or validte if examId is nullable.
    // Schema says `examId: integer('exam_id').references(() => exams.id)`. It is nullable by default in drizzle if not set notNull().
    // Let's check schema.ts -> yes, examId is nullable (default).

    const sampleQuestions = [
        {
            text: 'What is 15% of 200?',
            options: ['20', '30', '40', '25'],
            correctAnswer: '30',
            topic: 'Quant'
        },
        {
            text: 'Complete the series: 2, 4, 8, 16, ?',
            options: ['20', '24', '30', '32'],
            correctAnswer: '32',
            topic: 'Reasoning'
        },
        {
            text: 'Synonym of "Happy"?',
            options: ['Sad', 'Joyful', 'Angry', 'Bored'],
            correctAnswer: 'Joyful',
            topic: 'English'
        },
        {
            text: 'Capital of India?',
            options: ['Mumbai', 'Delhi', 'Kolkata', 'New Delhi'],
            correctAnswer: 'New Delhi',
            topic: 'General Awareness'
        }
    ];

    // Add more dummy questions
    // Generate enough questions to allow for 50-question practice tests per topic
    for (let i = 0; i < 300; i++) {
        const topic = topics[i % topics.length];
        sampleQuestions.push({
            text: `Practice Question ${i + 1} for ${topic}: What represents this concept?`,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 'Option A',
            topic: topic
        });
    }

    // 4. Create a Sample Exam
    const [newExam] = await db.insert(exams).values({
        title: 'Bank PO Prelims Mock 1',
        description: 'A complete mock test for Bank PO Prelims.',
        duration: 60,
        category: 'General',
    }).returning();
    console.log('Sample Exam created:', newExam.title);

    // Link first 10 questions to this exam
    // We need to fetch inserted questions or just insert specific ones for the exam
    const examQuestions = sampleQuestions.slice(0, 5); // Take first 5
    for (const q of examQuestions) {
        await db.insert(questions).values({
            text: q.text,
            options: q.options,
            correctAnswer: q.correctAnswer,
            topic: q.topic,
            examId: newExam.id, // Linked to exam
        });
    }
    console.log('Linked questions to sample exam.');

    // 5. Seed General Practice Questions (No Exam Link)
    for (const q of sampleQuestions) {
        await db.insert(questions).values({
            text: q.text,
            options: q.options,
            correctAnswer: q.correctAnswer,
            topic: q.topic,
            examId: null,
        });
    }
    console.log('General practice questions seeded.');
}

seedData();
