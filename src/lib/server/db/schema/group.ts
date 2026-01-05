import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const group = pgTable('group', {
	id: uuid().defaultRandom().primaryKey(),
	name: text().notNull(),
	slug: text().notNull(),
	logoUrl: text(),
	bannerUrl: text(),
	discordUrl: text(),
	description: text(),

	createdAt: timestamp().defaultNow().notNull(),
	updateAt: timestamp()
		.defaultNow()
		.$onUpdate(() => sql`now()`)
		.notNull()
});
