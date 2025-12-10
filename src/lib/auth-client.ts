import { PUBLIC_BETTER_AUTH_URL } from '$env/static/public';
import { createAuthClient } from 'better-auth/svelte';
import {
	usernameClient,
	twoFactorClient,
	adminClient,
	organizationClient
} from 'better-auth/client/plugins';

export const authClient = createAuthClient({
	plugins: [twoFactorClient(), usernameClient(), adminClient(), organizationClient()]
});
