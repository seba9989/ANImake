import { relations, sql } from 'drizzle-orm';
import { boolean, date, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { seriesGenre_Enum, seriesRelation, seriesSeason_Enum, seriesType_Enum } from './';

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
	bannerUrl: text().notNull(),
	nsfw: boolean().notNull(),
	aired: date({ mode: 'date' }).notNull(),
	releaseYear: integer().notNull(),
	season: seriesSeason_Enum().notNull(),
	genre_s: seriesGenre_Enum().array().notNull(),
    
	// Optional
	trailerUrl: text(),
	description: text(),
    
});

export const series_Relations = relations(series, ({ many }) => ({
	seriesRelation_s: many(seriesRelation, { relationName: 'referenceSeries' })
}));
