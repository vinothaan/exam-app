import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { users } from '../src/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function createAdmin() {
    console.log('Creating Admin User...');

    const email = 'admin@bankprep.com';
    const password = 'adminpassword';

    // Check if exists
    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length > 0) {
        console.log('Admin user already exists.');
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
        name: 'Admin User',
        email: email,
        password: hashedPassword,
        role: 'admin',
        image: '', // Placeholder
    });

    console.log('Admin user created!');
    console.log('Email: admin@bankprep.com');
    console.log('Password: adminpassword');
}

createAdmin();
