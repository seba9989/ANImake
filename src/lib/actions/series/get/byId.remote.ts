import { query } from '$app/server';
import { db } from '$lib/server/db';
import { series } from '$lib/server/db/schema';
import { type } from 'arktype';
import { and, inArray } from 'drizzle-orm';

export const byId = query.batch(type('string.uuid'), async (seriesId_s) => {
	const dbResponse = await db
		.select()
		.from(series)
		.where(and(inArray(series.id, seriesId_s)));
	const lookup = new Map(dbResponse.map((w) => [w.id, w]));

	return (seriesId) => lookup.get(seriesId);
});
