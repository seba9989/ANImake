import { query } from '$app/server';
import { db, search } from '$lib/server/db';
import { group } from '$lib/server/db/schema';
import { getManyProps, type GetManyResp, addMeta } from '$lib/utils/dbParse';
import { and, inArray } from 'drizzle-orm';

const Props = getManyProps({
	'searchName?': 'string',

	'slug_s?': 'string[]'
});

type Resp = GetManyResp<typeof db.$schema.group.$inferSelect>;

export const list = query(Props, async ({ options, query }): Resp => {
	const dbQuery = db
		.select()
		.from(group)
		.where(
			and(
				query.searchName ? search(group.name, query.searchName) : undefined,
				query.slug_s ? inArray(group.slug, query.slug_s) : undefined
			)
		)
		.$dynamic();

	return addMeta(dbQuery, options);
});
