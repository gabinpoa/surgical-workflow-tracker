import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();
		const emailOrUsername = data.get('email');
		const password = data.get('password');

		if (!(emailOrUsername?.length !== 0) || !(password?.length !== 0)) {
			return fail(400, {
				missing: true,
				message: 'Campos não preenchidos'
			});
		}

		try {
			await locals.pb
				.collection('users')
				.authWithPassword(emailOrUsername as string, password as string);
		} catch (_) {
			console.log(_);
			return fail(400, {
				message: 'Credenciais incorretas'
			});
		}

		throw redirect(302, '/');
	}
};
