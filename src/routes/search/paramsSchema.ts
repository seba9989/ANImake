import { seriesSeasonEnum, seriesTypeEnum } from '$lib/utils/enums';
import { type } from 'arktype';

export const SeriesSearchParams = type({
	title: ['string', '=', ''],
	year: ['string[] | undefined', '=', undefined],
	season: [[type.enumerated(...seriesSeasonEnum.keys()).array(), '|', 'undefined'], '=', undefined],
	type: [[type.enumerated(...seriesTypeEnum.keys()).array(), '|', 'undefined'], '=', undefined],
	group: ['string[] | undefined', '=', undefined],

	page: ['number', '=', 1]
});
