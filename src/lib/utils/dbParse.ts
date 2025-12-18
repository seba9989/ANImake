import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import { type } from 'arktype';
import { DrizzleError, DrizzleQueryError } from 'drizzle-orm';
import type { PgSelect } from 'drizzle-orm/pg-core';

const options = type({
	page: 'number',
	perPage: '"all" | number = 12'
});

export const getManyProps = type('<query extends object>', {
	options,
	query: 'query'
});

export type GetManyResp<T> = Promise<
	| {
			data: T[];
			metadata: {
				page: number;
				isPrev: boolean;
				isNext: boolean;
				total: number;
			};
	  }
	| undefined
>;

export const addMeta = async <T extends PgSelect, O extends typeof options.inferOut>(
	qb: T,
	options: O
): GetManyResp<Awaited<T>[number]> => {
	try {
		if (options.perPage === 'all') {
			return {
				data: await qb,
				metadata: {
					page: 0,
					isNext: false,
					isPrev: false,
					total: 0
				}
			};
		} else {
			const count = await db.$count(qb);

			const dbResponse = await qb
				.limit(options.perPage)
				.offset(options.perPage * (options.page - 1));

			let total = Math.ceil(count / options.perPage);

			return {
				data: dbResponse,
				metadata: {
					page: options.page,
					isNext: options.page < total,
					isPrev: options.page > 1,
					total
				}
			};
		}
	} catch (e) {
		if (e instanceof DrizzleQueryError) {
			error(404, e.message);
		}
	}
};
