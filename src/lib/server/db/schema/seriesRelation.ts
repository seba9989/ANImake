import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { series, seriesRelationType_Enum } from './';
import { relations } from 'drizzle-orm';

export const seriesRelation = pgTable(
	'series_relation',
	{
		// System
		sourceSeriesId: uuid()
			.references(() => series.id, { onUpdate: 'cascade' })
			.notNull(),
		targetSeriesId: uuid()
			.references(() => series.id, { onUpdate: 'cascade' })
			.notNull(),

		// Required
		relationType: seriesRelationType_Enum().notNull()
	},
	(t) => [primaryKey({ columns: [t.sourceSeriesId, t.targetSeriesId] })]
);

export const seriesRelation_Relations = relations(seriesRelation, ({ one }) => ({
	sourceSeries: one(series, {
		fields: [seriesRelation.sourceSeriesId],
		references: [series.id],
		relationName: 'baseSeries'
	}),
	targetSeries: one(series, {
		fields: [seriesRelation.targetSeriesId],
		references: [series.id],
		relationName: 'referenceSeries'
	})
}));
