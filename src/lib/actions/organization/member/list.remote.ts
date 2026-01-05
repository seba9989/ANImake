import { query } from '$app/server';
import { db, search } from '$lib/server/db';
import { groupMember, user } from '$lib/server/db/schema';
import { addMeta, getManyProps, type GetManyResp } from '$lib/utils/dbParse';
import { createSelectSchema } from 'drizzle-arktype';
import { and, eq, getTableColumns } from 'drizzle-orm';

const Props = getManyProps({
	groupId: createSelectSchema(groupMember).get('groupId'),
	'searchName?': 'string',
	role: createSelectSchema(groupMember).get('role').optional()
});

type Resp = GetManyResp<
	typeof groupMember.$inferSelect & {
		user: typeof user.$inferSelect;
	}
>;

export const list = query(Props, async ({ options, query }): Resp => {
	const dbQuery = db
		.select({
			...getTableColumns(groupMember),
			user: {
				...getTableColumns(user)
			}
		})
		.from(groupMember)
		.innerJoin(user, eq(groupMember.userId, user.id))
		.where(
			and(
				eq(groupMember.groupId, query.groupId),
				!!query.role ? eq(groupMember.role, query.role) : undefined,
				!!query.searchName ? search(user.name, query.searchName) : undefined
			)
		)
		.$dynamic();

	return addMeta(dbQuery, options);
});
