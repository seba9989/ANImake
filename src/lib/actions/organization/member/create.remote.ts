import { form } from '$app/server';
import { auth } from '$lib/server/auth';
import { member } from '$lib/server/db/schema';
import { formScope } from '$lib/utils/typst';
import { error } from '@sveltejs/kit';
import { APIError } from 'better-auth';
import { createSelectSchema } from 'drizzle-arktype';

const r = formScope.type('"owner" | "admin" | "member"');

const props = formScope
	.type(createSelectSchema(member).pick('organizationId', 'userId', 'role'))
	.merge({
		role: [r, '[]']
	});

export const create = form(props, async ({ ...body }) => {
	try {
		await auth.api.addMember({
			body
		});
	} catch (e) {
		if (e instanceof APIError) {
			error(500, e.message);
		}
		console.log(e);
	}
});
