import { query } from '$app/server';
import { db, search } from '$lib/server/db';
import { member, user } from '$lib/server/db/schema';
import { addMeta, getManyProps, type GetManyResp } from '$lib/utils/dbParse';
import { createSelectSchema } from 'drizzle-arktype';
import { and, eq, getTableColumns } from 'drizzle-orm';

const Props = getManyProps({
	organizationId: createSelectSchema(member).get('organizationId'),
	'searchName?': 'string',
	'role?': 'string | undefined'
});

type Resp = GetManyResp<
	typeof member.$inferSelect & {
		user: typeof user.$inferSelect;
	}
>;

export const list = query(Props, async ({ options, query }): Resp => {
	const dbQuery = db
		.select({
			...getTableColumns(member),
			user: {
				...getTableColumns(user)
			}
		})
		.from(member)
		.innerJoin(user, eq(member.userId, user.id))
		.where(
			and(
				eq(member.organizationId, query.organizationId),
				!!query.role ? eq(member.role, query.role) : undefined,
				!!query.searchName ? search(user.name, query.searchName) : undefined
			)
		)
		.$dynamic();

	return addMeta(dbQuery, options);
});
