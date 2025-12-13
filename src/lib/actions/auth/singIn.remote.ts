import { form } from '$app/server';
import { type } from 'arktype';

export const singIn = form(
	type({
		login: 'string > 0',
		_password: 'string > 0'
	}),
	async ({ login }) => {
		console.log(login);
	}
);
