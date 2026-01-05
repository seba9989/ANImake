import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { episode, legacyPlayer, player, watchHistory } from './';
import { relations } from 'drizzle-orm';
import { groupToSource } from './groupToSource';

export const source = pgTable('source', {
	id: uuid().defaultRandom().primaryKey(),
	episodeId: uuid()
		.references(() => episode.id)
		.notNull()
});

export const source_Relations = relations(source, ({ one, many }) => ({
	episode: one(episode, {
		fields: [source.episodeId],
		references: [episode.id]
	}),

	organizationToSource_s: many(groupToSource),

	watchHistory_s: many(watchHistory),

	player_s: many(player),
	legacyPlayer_s: many(legacyPlayer)
}));
