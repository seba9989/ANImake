import { query } from '$app/server';
import { getManyProps, type GetManyResp } from '$lib/utils/dbParse';
import { gql } from '$lib/utils/gql';
import { error } from '@sveltejs/kit';
import { graphql } from 'gql.tada';

const Props = getManyProps({
	'searchTitle?': 'string'
});

type Resp = GetManyResp<{ title: string; anilistId: number }>;

const searchAnimeByTitleQuery = graphql(`
	query SearchAnimeByTitle($title: String, $page: Int, $perPage: Int) {
		Page(page: $page, perPage: $perPage) {
			media(type: ANIME, search: $title) {
				id
				title {
					romaji
				}
			}
			pageInfo {
				total
				perPage
				currentPage
				lastPage
				hasNextPage
			}
		}
	}
`);

export const search = query(Props, async ({ options, query }): Resp => {
	const apiResp = await gql.anilist.query(searchAnimeByTitleQuery, {
		title: query.searchTitle && query.searchTitle?.length > 0 ? query.searchTitle : undefined,
		page: options.page,
		perPage: options.perPage === 'all' ? 50 : options.perPage
	});

	if (apiResp.data?.Page?.media && apiResp.data.Page.pageInfo) {
		return {
			data: apiResp.data.Page.media.map((media) => {
				if (!media?.title?.romaji || !media?.id) error(500, 'Anilist error');
				return {
					title: media.title.romaji,
					anilistId: media.id
				};
			}),
			metadata: {
				isNext: apiResp.data.Page.pageInfo.hasNextPage ?? false,
				isPrev: apiResp.data.Page.pageInfo.hasNextPage ?? false,
				page: apiResp.data.Page.pageInfo.currentPage ?? 0,
				total: apiResp.data.Page.pageInfo.lastPage ?? 0
			}
		};
	}

	return;
});
