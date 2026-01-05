import { form } from '$app/server';
import { db } from '$lib/server/db';
import { group } from '$lib/server/db/schema';
import { formScope } from '$lib/utils/typst';
import { error } from '@sveltejs/kit';
import { createInsertSchema } from 'drizzle-arktype';
import { DrizzleError, DrizzleQueryError } from 'drizzle-orm';

const props = createInsertSchema(group, {
	logoUrl: formScope.type('string.url.optional'),
	bannerUrl: formScope.type('string.url.optional'),
	discordUrl: formScope.type('string.url.optional'),
	description: formScope.type('string.optional')
}).omit('id', 'createdAt', 'updateAt');

export const create = form(props, async ({ ...body }) => {
	try {
		await db.insert(group).values(body);
	} catch (e) {
		if (e instanceof DrizzleError || e instanceof DrizzleQueryError) {
			error(500, e.message);
		}
		console.log(e);
		console.log(e);
	}
});
