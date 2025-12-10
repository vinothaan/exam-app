import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function reset() {
  console.log('Resetting database...');
  try {
    await sql`DROP TABLE IF EXISTS "user_progress" CASCADE`;
    await sql`DROP TABLE IF EXISTS "questions" CASCADE`;
    await sql`DROP TABLE IF EXISTS "exams" CASCADE`;
    await sql`DROP TABLE IF EXISTS "account" CASCADE`;
    await sql`DROP TABLE IF EXISTS "session" CASCADE`;
    await sql`DROP TABLE IF EXISTS "verificationToken" CASCADE`;
    await sql`DROP TABLE IF EXISTS "user" CASCADE`;
    // Also drop the old 'users' table if it exists (renamed in schema)
    await sql`DROP TABLE IF EXISTS "users" CASCADE`;
    await sql`DROP TABLE IF EXISTS "drizzle_migrations" CASCADE`;
    console.log('Database reset complete.');
  } catch (error) {
    console.error('Error resetting database:', error);
  }
}

reset();
