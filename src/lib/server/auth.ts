import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';
import { admin, organization, twoFactor, username } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg'
	}),

	emailAndPassword: {
		enabled: true
	},
	// emailVerification: {
	// autoSignInAfterVerification: true;
	// },
	plugins: [
		sveltekitCookies(getRequestEvent),
		twoFactor(),
		admin(),
		organization({
			schema: {
				organization: {
					additionalFields: {
						banner: {
							type: 'string',
							input: true,
							required: false
						},
						description: {
							type: 'string',
							input: true,
							required: false
						},
						discord: {
							type: 'string',
							input: true,
							required: false
						}
					}
				}
			},
			creatorRole: 'admin'
		})
	]
});

export type Session = typeof auth.$Infer.Session;
