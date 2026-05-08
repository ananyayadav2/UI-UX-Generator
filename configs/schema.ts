import { integer, pgTable, serial, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const Projects = pgTable('projects', {
    id: serial('id').primaryKey(),
    projectId: varchar('projectId').notNull().unique(),
    name: varchar('name').notNull(),
    userId: varchar('userId').notNull(),
    device: varchar('device').default('mobile'),
    theme: varchar('theme').default('light'),
    visualDesc: text('visualDesc'),
    createdAt: timestamp('createdAt').defaultNow()
});

export const ScreenConfig = pgTable('screenConfig', {
    id: serial('id').primaryKey(),
    projectId: varchar('projectId').notNull(),
    screenName: varchar('screenName').notNull(),
    screenDesc: text('screenDesc'),
    code: text('code'),
    screenId: integer('screenId'),
    createdAt: timestamp('createdAt').defaultNow()
});