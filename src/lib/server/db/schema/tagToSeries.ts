import { series, tag } from './index';
import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';

export const tagToSeries = pgTable(
	'tag_to_series',
	{
		tagId: uuid()
			.references(() => tag.id, { onUpdate: 'cascade' })
			.notNull(),
		seriesId: uuid()
			.references(() => series.id, { onUpdate: 'cascade' })
			.notNull()
	},
	(t) => [primaryKey({ columns: [t.tagId, t.seriesId] })]
);
export const tagToSeries_Relations = relations(tagToSeries, ({ one }) => ({
	series: one(series, {
		fields: [tagToSeries.seriesId],
		references: [series.id]
	})
}));
