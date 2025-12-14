import { comment, series, source } from './';
import { relations, sql } from 'drizzle-orm';
import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const episode = pgTable('episode', {
	// System
	id: uuid().defaultRandom().primaryKey(),
	kitsuId: integer(),
	updateAt: timestamp()
		.$onUpdate(() => sql`now()`)
		.notNull(),

	// Required
	seriesId: uuid()
		.references(() => series.id, { onUpdate: 'cascade' })
		.notNull(),
	number: text().notNull(),
	title: text().notNull(),
	duration: integer().notNull(), // As a minutes

	// Optional
	description: text(),
	coverUrl: text()
});
export const episode_Relations = relations(episode, ({ one, many }) => ({
	series: one(series, {
		fields: [episode.seriesId],
		references: [series.id]
	}),

	comment_s: many(comment),

	source_s: many(source)
}));
