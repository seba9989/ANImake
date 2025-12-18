import { getRequestEvent, query } from '$app/server';

export const user = query(async () => {
	const user = getRequestEvent().locals.user;

	return user;
});
