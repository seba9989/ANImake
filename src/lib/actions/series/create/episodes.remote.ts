import { form } from '$app/server';
import { db } from '$lib/server/db';
import { episode, series } from '$lib/server/db/schema';
import { formScope, type ReplaceNullInObject } from '$lib/utils/typst';
import { redirect } from '@sveltejs/kit';
import { createInsertSchema, createSelectSchema } from 'drizzle-arktype';

const Props = formScope.type({
	seriesId: createSelectSchema(series).get('id'),
	episodes: [
		// .declare<
		//     ReplaceNullInObject<Omit<typeof episode.$inferInsert, 'id' | 'updateAt' | 'seriesId'>>,
		//     { side: 'out' }
		// >()
		formScope.type({
			'kitsuId?': 'number',

			title: 'string',
			number: 'string',
			duration: 'string.numeric.parse',
			'coverUrl?': 'string.optional',
			'description?': 'string.optional'
		}),
		'[]'
	]
});

export const episodes = form(Props, async ({ seriesId, episodes }) => {
	await db
		.insert(episode)
		.values(
			episodes.map((v) => ({
				...v,
				seriesId: seriesId
			}))
		)
		.onConflictDoNothing();

	redirect(300, '../../');
});
