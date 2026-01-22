import { query } from '$app/server';
import { db, search } from '$lib/server/db';
import { group, series, seriesToGroup } from '$lib/server/db/schema';
import { addMeta, getManyProps, type GetManyResp } from '$lib/utils/dbParse';
import { createSelectSchema } from 'drizzle-arktype';
import { and, eq, inArray, isNotNull } from 'drizzle-orm';

const Props = getManyProps({
	'searchTitle?': 'string',

	'releaseYear_s?': createSelectSchema(series).get('releaseYear').array(),
	'season_s?': createSelectSchema(series).get('season').array(),
	'type_s?': createSelectSchema(series).get('type').array(),
	'group_s?': createSelectSchema(group).get('slug').array(),

	'hasBanner?': 'boolean'
});

type Resp = GetManyResp<typeof series.$inferSelect>;

export const list = query(Props, async ({ options, query }): Resp => {
	const dbQuery = db
		.select()
		.from(series)
		.where(
			and(
				query.searchTitle ? search(series.title, query.searchTitle) : undefined,

				query.releaseYear_s && query.releaseYear_s.length > 0
					? inArray(series.releaseYear, query.releaseYear_s)
					: undefined,
				query.season_s && query.season_s.length > 0
					? inArray(series.season, query.season_s)
					: undefined,
				query.type_s && query.type_s.length > 0 ? inArray(series.type, query.type_s) : undefined,

				query.hasBanner ? isNotNull(series.bannerUrl) : undefined,

				query.group_s && query.group_s.length > 0
					? inArray(
							series.id,
							db
								.select({ seriesId: seriesToGroup.seriesId })
								.from(seriesToGroup)
								.innerJoin(group, eq(seriesToGroup.groupId, group.id))
								.where(inArray(group.slug, query.group_s))
						)
					: undefined
			)
		)
		.$dynamic();

	return addMeta(dbQuery, options);
});
