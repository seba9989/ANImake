import { getRequestEvent } from '$app/server';
import { auth } from '$lib/server/auth';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({}) => {
	const data = await auth.api.getSession({ headers: getRequestEvent().request.headers });

	const isAdmin = data?.user.role === 'admin';

	if (!isAdmin) {
		error(403, 'Access denied');
	}
	return {};
}) satisfies LayoutServerLoad;
