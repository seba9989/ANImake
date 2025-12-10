import { betterAuth } from 'better-auth';
import { PUBLIC_BETTER_AUTH_URL } from '$env/static/public';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';
import { admin, organization, twoFactor, username } from 'better-auth/plugins';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg'
	}),

	emailAndPassword: {
		enabled: true
	},
	plugins: [twoFactor(), username(), admin(), organization()]
});
