import { form, getRequestEvent } from '$app/server';
import { auth } from '$lib/server/auth';
import { formScope } from '$lib/utils/typst';
import { APIError } from 'better-auth';

const props = formScope.type({
    organizationId: "string > 0",

	name: 'string > 0',
	slug: 'string > 0',
	logo: 'string.url.optional',
	banner: 'string.url.optional',
	discord: 'string.url.optional',
	description: 'string.optional'
});

export const update = form(props, async ({organizationId, ...body }) => {
	try {
		const t = await auth.api.updateOrganization({
            body: {
                data: body,
                organizationId: organizationId
            },
            headers: getRequestEvent().request.headers
        })
	} catch (e) {
		if (e instanceof APIError) {
			console.log(e.message);
		}
		console.log(e);
	}
});
