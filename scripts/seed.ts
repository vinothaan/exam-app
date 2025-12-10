import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { exams, questions } from '../src/db/schema'; // Adjust path as needed

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seed() {
    console.log('Seeding database...');

    try {
        // 1. IBPS PO Prelims Mock
        const [exam1] = await db.insert(exams).values({
            title: 'IBPS PO Prelims Mock 1',
            description: 'Full length mock test for IBPS PO Preliminary Exam. Covers Quant, Reasoning, and English.',
            duration: 60, // 60 minutes
        }).returning();

        console.log('Created Exam:', exam1.title);

        await db.insert(questions).values([
            {
                examId: exam1.id,
                text: 'What is the synonym of "Benevolent"?',
                options: ['Kind', 'Cruel', 'Greedy', 'Lazy'],
                correctAnswer: 'Kind',
            },
            {
                examId: exam1.id,
                text: 'A train 150m long is running with a speed of 68 km/h. In what time will it pass a man who is running at 8 km/h in the same direction in which the train is going?',
                options: ['6 sec', '8 sec', '9 sec', '10 sec'],
                correctAnswer: '9 sec',
            },
            {
                examId: exam1.id,
                text: 'Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?',
                options: ['(1/3)', '(1/8)', '(2/8)', '(1/16)'],
                correctAnswer: '(1/8)',
            }
        ]);

        // 2. SBI Clerk Mock
        const [exam2] = await db.insert(exams).values({
            title: 'SBI Clerk Sectional Test - Quantitative Aptitude',
            description: 'Targeted practice for Quant section.',
            duration: 20,
        }).returning();

        console.log('Created Exam:', exam2.title);

        await db.insert(questions).values([
            {
                examId: exam2.id,
                text: 'The average of 20 numbers is zero. Of them, at the most, how many may be greater than zero?',
                options: ['0', '1', '10', '19'],
                correctAnswer: '19',
            },
            {
                examId: exam2.id,
                text: 'Find the H.C.F. of 513, 1134 and 1215.',
                options: ['18', '27', '33', '36'],
                correctAnswer: '27',
            }
        ]);

        console.log('Seeding complete!');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

seed();
