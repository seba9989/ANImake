import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { group, series, seriesStatus_Enum } from '.';
import { relations } from 'drizzle-orm';

export const seriesToGroup = pgTable('series_to_group', {
	seriesId: uuid()
		.references(() => series.id)
		.notNull(),
	groupId: uuid().references(() => group.id),
	status: seriesStatus_Enum().notNull()
});
export const seriesToOrganization_Relations = relations(seriesToGroup, ({ one }) => ({
	series: one(series, {
		fields: [seriesToGroup.seriesId],
		references: [series.id]
	}),
	organization: one(group, {
		fields: [seriesToGroup.groupId],
		references: [group.id]
	})
}));
