import { query } from '$app/server';
import { KitsuCategoriesResponse } from '$lib/utils/api/kitsu';
import { getManyProps, type GetManyResp } from '$lib/utils/dbParse';
import type { Prettify } from '$lib/utils/typst';
import { error } from '@sveltejs/kit';
import { ArkErrors } from 'arktype';

const Props = getManyProps({
	kitsuId: 'number'
});

type Resp = GetManyResp<
	Prettify<
		Pick<(typeof KitsuCategoriesResponse.infer.data)[number]['attributes'], 'title' | 'slug'>
	>
>;

export const list = query(Props, async ({ options, query }): Resp => {
	const kitsuResp = await fetch(`https://kitsu.io/api/edge/anime/${query.kitsuId}/categories`);

	const kitsuData = KitsuCategoriesResponse(await kitsuResp.json());

	if (kitsuData instanceof ArkErrors) {
		error(500, kitsuData.summary);
	}

	return {
		data: kitsuData.data.map((item) => item.attributes),
		metadata: {
			isNext: false,
			isPrev: false,
			page: 1,
			total: 1
		}
	};
});
