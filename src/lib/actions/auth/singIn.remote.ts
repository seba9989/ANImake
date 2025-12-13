import { form } from '$app/server';
import { auth } from '$lib/server/auth';
import { invalid, redirect } from '@sveltejs/kit';
import { type } from 'arktype';

export const singIn = form(
	type({
		email: 'string.email',
		_password: 'string > 0',
		'rememberMe?': 'boolean'
	}),
	async ({ email, _password, rememberMe }, issue) => {
		try {
			const t = await auth.api.signInEmail({
				body: {
					email: email,
					password: _password,
					rememberMe: rememberMe
				}
			});
			console.log(t);
		} catch (e) {
			const err = e as any;
			console.log(err);
			invalid(err.body.message as string);
		}
	}
);
