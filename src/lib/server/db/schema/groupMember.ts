import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { group, memberRole_Enum, user } from '.';
import { sql } from 'drizzle-orm';

export const groupMember = pgTable('group_member', {
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
});
