import { form } from '$app/server';
import { auth } from '$lib/server/auth';
import { type } from 'arktype';

const propsType = type({
	name: 'string > 0',
	email: 'string > 0',
	password: 'string > 0',
	confirmPassword: 'string > 0',
	'image?': 'string > 0 | undefined',
	'callbackURL?': 'string > 0 | undefined',
	'rememberMe?': 'boolean | undefined'
}).narrow((data, ctx) => {
	if (data.password === data.confirmPassword) {
		return true;
	}
	return ctx.reject({
		expected: 'identical to password',
		actual: '',
		path: ['confirmPassword']
	});
});

export const singUp = form(propsType, async (body) => {
	const t = await auth.api.signUpEmail({ body });
	console.log(t);
});
