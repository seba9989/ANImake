import type { PageLoad } from './$types';

export const load = (async ({ data, parent, params }) => {
	const parentData = await parent();

	const episode = parentData.seriesData.episode_s.find(({ number }) => number === params.number);

	return { ...data, episode };
}) satisfies PageLoad;
