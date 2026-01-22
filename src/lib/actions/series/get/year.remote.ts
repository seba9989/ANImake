import { prerender } from '$app/server';
import { db } from '$lib/server/db';
import { series } from '$lib/server/db/schema';

export const year = prerender(async () => {
	const result = await db
		.select({ releaseYear: series.releaseYear })
		.from(series)
		.groupBy(series.releaseYear);

	return result.map(({ releaseYear }) => releaseYear);
});
