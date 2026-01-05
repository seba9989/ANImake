import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { group, source } from '.';
import { relations } from 'drizzle-orm';

export const groupToSource = pgTable('group_to_source', {
	// System
	groupId: uuid()
		.references(() => group.id, { onUpdate: 'cascade' })
		.notNull(),
	sourceId: uuid()
		.references(() => source.id, { onUpdate: 'cascade' })
		.notNull()
});

export const organizationToSource_Relations = relations(groupToSource, ({ one }) => ({
	group: one(group, {
		fields: [groupToSource.groupId],
		references: [group.id]
	}),
	source: one(source, {
		fields: [groupToSource.sourceId],
		references: [source.id]
	})
}));
