import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { organization, series, seriesStatus_Enum } from './';
import { relations } from 'drizzle-orm';

export const seriesToOrganization = pgTable('series_to_organization', {
	seriesId: uuid()
		.references(() => series.id)
		.notNull(),
	organizationId: text().references(() => organization.id),
	status: seriesStatus_Enum().notNull()
});
export const seriesToOrganization_Relations = relations(seriesToOrganization, ({ one }) => ({
	series: one(series, {
		fields: [seriesToOrganization.seriesId],
		references: [series.id]
	}),
	organization: one(organization, {
		fields: [seriesToOrganization.organizationId],
		references: [organization.id]
	})
}));
