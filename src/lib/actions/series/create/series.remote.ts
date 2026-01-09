import { form, getRequestEvent } from '$app/server';
import { formScope } from '$lib/utils/typst';
import { series as seriesTable } from '$lib/server/db/schema';
import { seriesSeasonEnum, seriesTypeEnum } from '$lib/utils/enums';
import { type } from 'arktype';
import { db } from '$lib/server/db';
import { DrizzleQueryError } from 'drizzle-orm';
import { invalid, redirect } from '@sveltejs/kit';

// .declare<
//     ReplaceNullInObject<Omit<typeof seriesTable.$inferInsert, 'id' | 'updateAt'>>,
//     { side: 'out' }
// >()
const Props = formScope
	.type({
		'kitsuId?': 'number',

		title: 'string > 0',
		type: type.enumerated(...seriesTypeEnum.keys()),
		coverUrl: 'string.url',
		'nsfw?': 'boolean',
		aired: 'string.date.parse',
		releaseYear: 'string.numeric.parse',
		season: type.enumerated(...seriesSeasonEnum.keys()),

		'bannerUrl?': 'string.url.optional',
		'trailerUrl?': 'string.url.optional',
		'description?': 'string'
	})
	.pipe(({ nsfw, ...obj }) => ({ ...obj, nsfw: !!nsfw }));

export const series = form(Props, async (props, issue) => {
	let seriesData: typeof seriesTable.$inferSelect;
	try {
		[seriesData] = await db.insert(seriesTable).values(props).onConflictDoNothing().returning();
	} catch (e) {
		if (e instanceof DrizzleQueryError) {
			console.log(e);
		}
		return;
	}

	if (!seriesData) {
		invalid(issue('Seria już istnieje'));
	}

	const urlArray = getRequestEvent().url.href.split('/');

	urlArray.pop();

	const rUrl = new URL(`${urlArray.join('/')}/${seriesData.id}/categories`);

	if (props.kitsuId) {
		rUrl.searchParams.append('kitsuId', String(props.kitsuId));
	}

	redirect(300, rUrl);
});
