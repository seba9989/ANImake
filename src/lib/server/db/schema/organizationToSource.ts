import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { organization, source } from './';
import { relations } from 'drizzle-orm';

export const organizationToSource = pgTable('organization_to_source', {
	// System
	organizationId: text()
		.references(() => organization.id, { onUpdate: 'cascade' })
		.notNull(),
	sourceId: uuid()
		.references(() => source.id, { onUpdate: 'cascade' })
		.notNull()
});

export const organizationToSource_Relations = relations(organizationToSource, ({ one }) => ({
	organization: one(organization, {
		fields: [organizationToSource.organizationId],
		references: [organization.id]
	}),
	source: one(source, {
		fields: [organizationToSource.sourceId],
		references: [source.id]
	})
}));
