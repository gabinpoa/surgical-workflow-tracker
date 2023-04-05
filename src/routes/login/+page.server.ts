import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();
		const emailOrUsername = data.get('email');
		const password = data.get('password');

		if (typeof emailOrUsername !== 'string' || typeof password !== 'string') {
			return fail(400, {
				missing: true,
				message: 'Campos não preenchidos'
			});
		}

		const authResponse = await locals.pb
			.collection('users')
			.authWithPassword(emailOrUsername, password);

		if (!authResponse.token) {
			try {
				await locals.pb.collection('doctors').authWithPassword(emailOrUsername, password);
			} catch (err) {
				console.log(err);

				return fail(401, {
					message: 'Credenciais incorretas'
				});
			}
		}

		throw redirect(303, '/');
	}
};
