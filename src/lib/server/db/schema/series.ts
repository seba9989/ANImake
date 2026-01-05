import { relations, sql } from 'drizzle-orm';
import { boolean, date, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { seriesRelation, seriesSeason_Enum, seriesToCategory, seriesType_Enum } from './';
import type { Prettify } from '$lib/utils/typst';

export const series = pgTable('series', {
	// System
	id: uuid().defaultRandom().primaryKey(),
	kitsuId: integer(),
	updateAt: timestamp()
		.$onUpdate(() => sql`now()`)
		.notNull(),

	// Required
	title: text().unique().notNull(),
	type: seriesType_Enum().notNull(),
	coverUrl: text().notNull(),
	nsfw: boolean().notNull(),
	aired: date({ mode: 'date' }).notNull(),
	releaseYear: integer().notNull(),
	season: seriesSeason_Enum().notNull(),

	// Optional
	bannerUrl: text(),
	trailerUrl: text(),
	description: text()
});

export const series_Relations = relations(series, ({ many }) => ({
	seriesRelation_s: many(seriesRelation, { relationName: 'referenceSeries' }),
	seriesCategory_s: many(seriesToCategory)
}));

export type SeriesPrototype =
	| Prettify<Omit<Omit<typeof series.$inferInsert, 'id'>, 'updateAt'>>
	| undefined;
