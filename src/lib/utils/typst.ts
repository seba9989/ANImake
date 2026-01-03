import { scope, type } from 'arktype';

export const formScope = scope({
	string: type.module({
		...type.keywords.string,
		optional: type('string').pipe((s) => (s === '' ? undefined : s)),
		url: type.module({
			...type.keywords.string.url,
			optional: type("string.url | ''").pipe((s) => (s === '' ? undefined : s))
		})
	}),
});

export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};
