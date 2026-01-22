import { form } from '$app/server';
import { db } from '$lib/server/db';
import { group } from '$lib/server/db/schema';
import { formScope } from '$lib/utils/typst';
import { APIError } from 'better-auth';
import { eq } from 'drizzle-orm';

const props = formScope.type({
	groupId: 'string > 0',

	name: 'string > 0',
	slug: 'string > 0',
	logoUrl: 'string.url.optional',
	bannerUrl: 'string.url.optional',
	discordUrl: 'string.url.optional',
	description: 'string.optional'
});

export const update = form(props, async ({ groupId, ...body }) => {
	try {
		await db.update(group).set(body).where(eq(group.id, groupId));
	} catch (e) {
		if (e instanceof APIError) {
			console.log(e.message);
		}
		console.log(e);
	}
});
