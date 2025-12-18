import { query } from '$app/server';
import { db, search } from '$lib/server/db';
import { organization } from '$lib/server/db/schema';
import { getManyProps, type GetManyResp, addMeta } from '$lib/utils/dbParse';
import { and } from 'drizzle-orm';

const Props = getManyProps({
	'searchName?': 'string'
});

type Resp = GetManyResp<typeof db.$schema.organization.$inferSelect>;

export const list = query(Props, async ({ options, query }): Resp => {
	const dbQuery = db
		.select()
		.from(organization)
		.where(and(query.searchName ? search(organization.name, query.searchName) : undefined))
		.$dynamic();

	return addMeta(dbQuery, options);
});
