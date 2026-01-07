import { pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { group, memberRole_Enum, user } from '.';
import { relations, sql } from 'drizzle-orm';

export const groupMember = pgTable(
	'group_member',
	{
		userId: text()
			.references(() => user.id, { onUpdate: 'cascade' })
			.notNull(),
		groupId: uuid()
			.references(() => group.id, { onUpdate: 'cascade' })
			.notNull(),
		role: memberRole_Enum().notNull(),

		createdAt: timestamp().defaultNow().notNull(),
		updateAt: timestamp()
			.defaultNow()
			.$onUpdate(() => sql`now()`)
			.notNull()
	},
	(t) => [primaryKey({ columns: [t.userId, t.groupId] })]
);

export const groupMember_Relations = relations(groupMember, ({ one }) => ({
	group: one(group, {
		fields: [groupMember.groupId],
		references: [group.id],
		relationName: 'baseSeries'
	}),
	member: one(user, {
		fields: [groupMember.userId],
		references: [user.id],
		relationName: 'referenceSeries'
	})
}));
