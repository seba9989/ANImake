import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const tag = pgTable('tag', {
	id: uuid().defaultRandom().primaryKey(),
	// key: text().notNull(),
	value: text().notNull()
});
