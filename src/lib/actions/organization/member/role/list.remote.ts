import { query } from '$app/server';

export const list = query(async () => {
	return ['owner', 'admin', 'member'];
});
