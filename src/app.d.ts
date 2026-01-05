// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/auth.ts').Session['user'] | undefined;
			session: import('$lib/server/auth.ts').Session['session'] | undefined;
		}
	}
}

export {};
