import { page } from '$app/state';
import type { series } from '$lib/actions/series';
import type { SeriesSearchParams } from '../../routes/search/paramsSchema';

const unicodeMap = new Map([
	['~q', '?'],
	['~e', '!'],
	['~a', '&'],
	['~eq', '='],
	['~s', '/'],
	['~p', '%'],
	['~u', '_'],
	['_', ' ']
]);

function encodeUrl(url: string): string {
	let encodedUrl = url;
	unicodeMap.entries().forEach(([replacement, char]) => {
		encodedUrl = encodedUrl.split(char).join(replacement);
	});
	return encodedUrl;
}

function decodeUrl(encodedUrl: string): string {
	let decodedUrl = encodedUrl;
	unicodeMap.entries().forEach(([char, replacement]) => {
		decodedUrl = decodedUrl.split(char).join(replacement);
	});

	return decodedUrl;
}

type seriesQuery = Parameters<typeof series.list>[0]['query'];

const searchUrl = (query: seriesQuery): string => {
	const url = new URL(page.url.origin + '/search');

	if (query)
		Object.entries({
			title: query.searchTitle,

			year: query.releaseYear_s?.map((v) => String(v)),
			season: query.season_s,
			type: query.type_s,
			group: query.group_s
		} satisfies typeof SeriesSearchParams.inferIn).forEach(([key, v]) => {
			if (v) {
				const value = JSON.stringify(v);

				url.searchParams.set(key, value ?? '');
			}
		});

	return url.toString();
};

export const url = {
	encode: encodeUrl,
	decode: decodeUrl,
	searchUrl,
	unicodeMap
};
