import { createAuthClient } from 'better-auth/svelte';
import {
	usernameClient,
	twoFactorClient,
	adminClient,
	organizationClient,
	inferOrgAdditionalFields
} from 'better-auth/client/plugins';
import type { auth } from './server/auth';

export const authClient = createAuthClient({
	plugins: [
		twoFactorClient(),
		adminClient(),
		// organizationClient({
		// 	schema: inferOrgAdditionalFields<typeof auth>()
		// })
	]
});
