import { form } from '$app/server';
import { db } from '$lib/server/db';
import { groupMember } from '$lib/server/db/schema';
import { formScope } from '$lib/utils/typst';
import { error } from '@sveltejs/kit';
import { createInsertSchema } from 'drizzle-arktype';
import { DrizzleError, DrizzleQueryError } from 'drizzle-orm';

const props = formScope.type(createInsertSchema(groupMember).omit('createdAt', 'updateAt'));

export const create = form(props, async ({ ...body }) => {
	try {
		await db.insert(groupMember).values(body);
	} catch (e) {
		if (e instanceof DrizzleError || e instanceof DrizzleQueryError) {
			error(500, e.message);
		}
		console.log(e);
	}
});
