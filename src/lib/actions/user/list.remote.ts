import { query } from '$app/server';
import { db, search } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { getManyProps, type GetManyResp, addMeta } from '$lib/utils/dbParse';
import { and } from 'drizzle-orm';

const Props = getManyProps({
	'searchName?': 'string'
});

type Resp = GetManyResp<typeof user.$inferSelect>;

export const list = query(Props, async ({ options, query }): Resp => {
	const dbQuery = db
		.select()
		.from(user)
		.where(and(query.searchName ? search(user.name, query.searchName) : undefined))
		.$dynamic();

	return addMeta(dbQuery, options);
});
