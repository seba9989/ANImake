import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	redirect(300, '/auth/login');
	return {};
}) satisfies PageServerLoad;
