import { query } from '$app/server';
import type { SeriesPrototype } from '$lib/server/db/schema';
import { KitsuMappingResponse, MediaSchema } from '$lib/utils/api/kitsu';
import { gql } from '$lib/utils/gql';
import { error } from '@sveltejs/kit';
import { ArkErrors, type } from 'arktype';
import { graphql } from 'gql.tada';

const Props = type({
	anilistId: 'number'
});

type Resp = Promise<SeriesPrototype>;

const animeSeasonQuery = graphql(`
	query animeSeason($id: Int) {
		Media(id: $id) {
			seasonYear
			season
			trailer {
				site
				id
			}
		}
	}
`);

export const get = query(Props, async ({ anilistId }): Resp => {
	const anilistData = MediaSchema(
		(await gql.anilist.query(animeSeasonQuery, { id: anilistId })).data?.Media
	);

	if (anilistData instanceof ArkErrors) {
		error(500, 'Anilist: ' + anilistData.summary);
	}

	const kitsuResp = await fetch(
		`https://kitsu.io/api/edge/mappings?filter[externalSite]=anilist/anime&filter[externalId]=${anilistId}&include=item`
	);

	const kitsuData = KitsuMappingResponse(await kitsuResp.json());

	if (kitsuData instanceof ArkErrors) {
		error(500, kitsuData.summary);
	}
	const seriesData = kitsuData.included.at(0);

	if (!seriesData) {
		error(500, 'Included 0 undefined');
	}

	return {
		// System
		kitsuId: Number(seriesData.id),

		// Required
		title: seriesData.attributes.canonicalTitle,
		type: seriesData.attributes.showType,
		coverUrl: seriesData.attributes.posterImage.medium,
		nsfw: seriesData.attributes.nsfw,
		aired: new Date(seriesData.attributes.startDate),
		releaseYear: anilistData.seasonYear,
		season: anilistData.season,

		// Optional
		bannerUrl: seriesData.attributes.coverImage?.large,
		trailerUrl: seriesData.attributes.youtubeVideoId
			? `https://www.youtube.com/watch?v=${seriesData.attributes.youtubeVideoId}`
			: anilistData.trailer,
		description: seriesData.attributes.description
	};

	return;
});
