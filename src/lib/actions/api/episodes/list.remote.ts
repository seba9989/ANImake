import { query } from '$app/server';
import { KitsuEpisodesResponse } from '$lib/utils/api/kitsu';
import { getManyProps, type GetManyResp } from '$lib/utils/dbParse';
import type { Prettify } from '$lib/utils/typst';
import { error } from '@sveltejs/kit';
import { ArkErrors } from 'arktype';

const Props = getManyProps({
	kitsuId: 'number'
});

type Resp = GetManyResp<Prettify<(typeof KitsuEpisodesResponse.infer.data)[number]['attributes']>>;

export const list = query(Props, async ({ options, query }): Resp => {
	let episodeList: (typeof KitsuEpisodesResponse.infer.data)[number]['attributes'][] = [];
	let page = 0;
	let pageCount = 0;

	do {
		const kitsuResp = await fetch(
			`https://kitsu.io/api/edge/anime/${query.kitsuId}/episodes?page[limit]=20&page[offset]=${page*20}`
		);

		const kitsuData = KitsuEpisodesResponse(await kitsuResp.json());

		if (kitsuData instanceof ArkErrors) {
			error(500, kitsuData.summary);
		}

		episodeList.push(...kitsuData.data.map((v) => v.attributes));

		if (page === 0) {
			pageCount = Math.floor(kitsuData.meta.count / 20);
		}

		page++;
	} while (page <= pageCount);

	console.log(pageCount);

	return {
		data: episodeList,
		metadata: {
			isNext: false,
			isPrev: false,
			page: 1,
			total: 1
		}
	};
});
