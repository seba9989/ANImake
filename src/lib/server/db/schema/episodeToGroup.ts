import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { episode, group } from '.';

export const episodeToGroup = pgTable(
	'episode_to_group',
	{
		groupId: uuid()
			.references(() => group.id, { onUpdate: 'cascade' })
			.notNull(),
		episodeId: uuid()
			.references(() => episode.id, { onUpdate: 'cascade' })
			.notNull()
	},
	(t) => [primaryKey({ columns: [t.episodeId, t.groupId] })]
);
