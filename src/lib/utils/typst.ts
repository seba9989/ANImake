import { scope, type } from 'arktype';

const extensionToStringScope = scope({
	'url.optional': type("string.url | ''").pipe((s) => (s === '' ? undefined : s))
});

export const formScope = scope({
	string: type.module({
		...type.keywords.string,
		optional: type('string').pipe((s) => (s === '' ? undefined : s)),
		url: type.module({
			...type.keywords.string.url,
			optional: type("string.url | ''").pipe((s) => (s === '' ? undefined : s))
		})
	})
});
