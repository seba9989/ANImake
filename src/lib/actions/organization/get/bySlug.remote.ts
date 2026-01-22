import { query } from '$app/server';
import { db } from '$lib/server/db';
import { group } from '$lib/server/db/schema';
import { type } from 'arktype';
import { and, inArray } from 'drizzle-orm';

export const bySlug = query.batch(type('string'), async (groupSlug_s) => {
	const dbResponse = await db
		.select()
		.from(group)
		.where(and(inArray(group.slug, groupSlug_s)));
	const lookup = new Map(dbResponse.map((w) => [w.slug, w]));

	return (groupId) => lookup.get(groupId);
});
