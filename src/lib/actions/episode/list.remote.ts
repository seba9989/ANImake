import { query } from '$app/server';
import { db, sortTextAsNumber } from '$lib/server/db';
import { episode, episodeToGroup } from '$lib/server/db/schema';
import { addMeta, getManyProps, type GetManyResp } from '$lib/utils/dbParse';
import { createSelectSchema } from 'drizzle-arktype';
import { and, eq, sql } from 'drizzle-orm';

const Props = getManyProps({
	// 'seriesId?':
	'seriesId?': createSelectSchema(episode).get('seriesId'),

	'with?': {
		'groups?': 'boolean'
	}
});

type Resp = GetManyResp<{
	episode: typeof episode.$inferSelect;
	groups?: (typeof episodeToGroup.$inferSelect.groupId)[];
}>;

export const list = query(Props, async ({ options, query }): Resp => {
	let dbQuery = query.with?.groups
		? db
				.select({
					episode,
					groups: sql<
						string[]
					>`COALESCE( ARRAY_AGG(${episodeToGroup.groupId}) FILTER (WHERE ${episodeToGroup.groupId} IS NOT NULL), ARRAY[]::uuid[] )`.as(
						'groups'
					)
				})
				.from(episode)
				.leftJoin(episodeToGroup, eq(episode.id, episodeToGroup.episodeId))
				.$dynamic()
		: db.select({ episode }).from(episode).$dynamic();

	dbQuery
		.where(and(query.seriesId ? eq(episode.seriesId, query.seriesId) : undefined))
		.orderBy(...sortTextAsNumber(episode.number))
		.groupBy(episode.id)
		.$dynamic();

	return addMeta(dbQuery, options);
});
