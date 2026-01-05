import { query } from '$app/server';
import { db, search } from '$lib/server/db';
import { group } from '$lib/server/db/schema';
import { getManyProps, type GetManyResp, addMeta } from '$lib/utils/dbParse';
import { and } from 'drizzle-orm';

const Props = getManyProps({
	'searchName?': 'string'
});

type Resp = GetManyResp<typeof db.$schema.group.$inferSelect>;

export const list = query(Props, async ({ options, query }): Resp => {
	const dbQuery = db
		.select()
		.from(group)
		.where(and(query.searchName ? search(group.name, query.searchName) : undefined))
		.$dynamic();

	return addMeta(dbQuery, options);
});
