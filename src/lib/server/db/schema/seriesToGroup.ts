import { pgTable, primaryKey, text, uuid } from 'drizzle-orm/pg-core';
import { group, series, seriesStatus_Enum } from '.';
import { relations } from 'drizzle-orm';

export const seriesToGroup = pgTable(
	'series_to_group',
	{
		seriesId: uuid()
			.references(() => series.id)
			.notNull(),
		groupId: uuid().references(() => group.id),
		status: seriesStatus_Enum().notNull()
	},
	(t) => [primaryKey({ columns: [t.seriesId, t.groupId] })]
);
export const seriesToOrganization_Relations = relations(seriesToGroup, ({ one }) => ({
	series: one(series, {
		fields: [seriesToGroup.seriesId],
		references: [series.id]
	}),
	group: one(group, {
		fields: [seriesToGroup.groupId],
		references: [group.id]
	})
}));
