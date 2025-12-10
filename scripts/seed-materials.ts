import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { studyMaterials } from '../src/db/schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seedMaterials() {
    console.log('Seeding study materials...');

    try {
        await db.insert(studyMaterials).values([
            {
                title: 'Quantitative Aptitude Formula Sheet',
                description: 'Important formulas for Time & Work, Speed Distance, and Profit Loss.',
                fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // Public dummy PDF
                category: 'Quantitative Aptitude',
            },
            {
                title: 'Reasoning Puzzles Guide',
                description: 'Tips and tricks to solve high-level puzzles and seating arrangements.',
                fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                category: 'Reasoning',
            },
            {
                title: 'Daily Current Affairs - Dec 10',
                description: 'Top headlines and exam-relevant news for today.',
                fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                category: 'General Awareness',
            },
        ]);

        console.log('Study materials seeded!');
    } catch (error) {
        console.error('Error seeding materials:', error);
    }
}

seedMaterials();
