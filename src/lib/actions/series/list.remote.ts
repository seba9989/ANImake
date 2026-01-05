import { query } from '$app/server';
import { db, search } from '$lib/server/db';
import { series } from '$lib/server/db/schema';
import { addMeta, getManyProps, type GetManyResp } from '$lib/utils/dbParse';
import { and } from 'drizzle-orm';

const Props = getManyProps({
	'searchTitle?': 'string'
});

type Resp = GetManyResp<typeof series.$inferSelect>;

export const list = query(Props, async ({ options, query }): Resp => {
	const dbQuery = db
		.select()
		.from(series)
		.where(and(query.searchTitle ? search(series.title, query.searchTitle) : undefined))
		.$dynamic();

	return addMeta(dbQuery, options);
});
