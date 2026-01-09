import { query } from '$app/server';
import { db } from '$lib/server/db';
import { group } from '$lib/server/db/schema';
import { type } from 'arktype';
import { and, inArray } from 'drizzle-orm';

export const getById = query.batch(type('string.uuid'), async (groupId_s) => {
	const dbResponse = await db
		.select()
		.from(group)
		.where(and(inArray(group.id, groupId_s)));
	const lookup = new Map(dbResponse.map((w) => [w.id, w]));

	return (groupId) => lookup.get(groupId);
});
