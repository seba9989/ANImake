import { form, getRequestEvent } from '$app/server';
import { auth } from '$lib/server/auth';
import { formScope } from '$lib/utils/typst';
import { APIError } from 'better-auth';

const props = formScope.type({
	name: 'string > 0',
	slug: 'string > 0',
	logo: 'string.url.optional',
	banner: 'string.url.optional',
	discord: 'string.url.optional',
	description: 'string.optional'
});

export const create = form(props, async ({ ...body }) => {
	try {
		const t = await auth.api.createOrganization({
			body,
			headers: getRequestEvent().request.headers
		});
	} catch (e) {
		if (e instanceof APIError) {
			console.log(e.message);
		}
		console.log(e);
	}
});
