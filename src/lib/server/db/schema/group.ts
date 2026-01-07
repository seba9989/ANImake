import { relations, sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { episodeToGroup, groupMember, groupToSource, seriesToGroup } from '.';

export const group = pgTable('group', {
	id: uuid().defaultRandom().primaryKey(),
	name: text().notNull(),
	slug: text().notNull(),
	logoUrl: text(),
	bannerUrl: text(),
	discordUrl: text(),
	description: text(),

	createdAt: timestamp().defaultNow().notNull(),
	updateAt: timestamp()
		.defaultNow()
		.$onUpdate(() => sql`now()`)
		.notNull()
});

export const group_Relations = relations(group, ({ one, many }) => ({
	member_s: many(groupMember),
	source_s: many(groupToSource),
	episode_s: many(episodeToGroup),
	series_s: many(seriesToGroup)
}));
