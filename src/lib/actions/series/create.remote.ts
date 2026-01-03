import { form } from '$app/server';
import { db } from '$lib/server/db';
import { series } from '$lib/server/db/schema';
import { formScope } from '$lib/utils/typst';
import { redirect } from '@sveltejs/kit';
import { type } from 'arktype';
import { createInsertSchema } from 'drizzle-arktype';

const Props = createInsertSchema(series, {
	coverUrl: formScope.type('string.url'),

	bannerUrl: formScope.type('string.url.optional'),
	trailerUrl: formScope.type('string.url.optional'),

	kitsuId: formScope.type('string.numeric.parse'),
	description: formScope.type('string.optional'),
	aired: type('string.date.parse'),
	nsfw: (schema) => schema.optional(),
	releaseYear: type('string.numeric.parse')
})
	.omit('id', 'updateAt')
	.pipe(({ nsfw, ...obj }) => ({ ...obj, nsfw: !!nsfw }));

export const create = form(Props, async ({ ...seriesData }) => {
	await db.insert(series).values(seriesData).returning();

	redirect(300, '/admin/series');
	console.log(seriesData);
});
