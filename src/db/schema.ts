import { pgTable, serial, text, timestamp, boolean, integer, jsonb, primaryKey } from 'drizzle-orm/pg-core';
import type { AdapterAccount } from "next-auth/adapters";
import { relations } from 'drizzle-orm';

export const users = pgTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").notNull().unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    password: text("password"), // Added for credentials auth
    image: text("image"),
    role: text("role").default("user").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const accounts = pgTable(
    "account",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccount["type"]>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
    })
);

export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
    "verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (verificationToken) => ({
        compositePk: primaryKey({
            columns: [verificationToken.identifier, verificationToken.token],
        }),
    })
);

// Domain specific tables
export const exams = pgTable('exams', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    duration: integer('duration').notNull(), // in minutes
    category: text('category').default("General").notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const questions = pgTable('questions', {
    id: serial('id').primaryKey(),
    examId: integer('exam_id').references(() => exams.id),
    text: text('text').notNull(),
    options: jsonb('options').notNull(), // Array of strings or objects
    correctAnswer: text('correct_answer').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userProgress = pgTable('user_progress', {
    id: serial('id').primaryKey(),
    userId: text('user_id').references(() => users.id),
    examId: integer('exam_id').references(() => exams.id),
    score: integer('score').notNull(),
    answers: jsonb('answers'), // Store user selected answers {questionId: option}
    completedAt: timestamp('completed_at').defaultNow().notNull(),
});

export const studyMaterials = pgTable('study_materials', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    fileUrl: text('file_url').notNull(),
    category: text('category').notNull(), // 'Quant', 'Reasoning', 'English', etc.
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const categories = pgTable('categories', {
    id: serial('id').primaryKey(),
    name: text('name').notNull().unique(),
});

// Relations Definitions
export const examsRelations = relations(exams, ({ many }) => ({
    questions: many(questions),
}));

export const questionsRelations = relations(questions, ({ one }) => ({
    exam: one(exams, {
        fields: [questions.examId],
        references: [exams.id],
    }),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
    user: one(users, {
        fields: [userProgress.userId],
        references: [users.id],
    }),
    exam: one(exams, {
        fields: [userProgress.examId],
        references: [exams.id],
    }),
}));
