import { createAuthClient } from 'better-auth/svelte';
import {
	usernameClient,
	twoFactorClient,
	adminClient,
	organizationClient
} from 'better-auth/client/plugins';

export const authClient = createAuthClient({
	plugins: [twoFactorClient(), adminClient(), organizationClient()]
});
