import { db } from '$lib/server/db';
import { url } from '$lib/utils/url';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ params }) => {
	const seriesData = await db.query.series.findFirst({
		where: (t, { eq }) => eq(t.title, url.decode(params.slug)),
		with: {
			seriesCategory_s: {
				with: {
					category: true
				}
			},
			seriesRelation_s: {
				with: {
					targetSeries: true
				}
			},
			episode_s: true,
			seriesGroup_s: {
				with: {
					group: true
				}
			}
		}
	});

	if (!seriesData) {
		error(404, 'Seria nie istnieje');
	}

	return { seriesData };
}) satisfies LayoutServerLoad;
