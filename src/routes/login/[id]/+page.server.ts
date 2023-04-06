import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals, params: { id } }) => {
	if (locals.pb.authStore.isValid) {
		throw redirect(302, '/cirurgias/' + id);
	}
};

export const actions: Actions = {
	default: async ({ locals, request, params: { id } }) => {
		const data = await request.formData();
		const emailOrUsername = data.get('email');
		const password = data.get('password');
		const profile = data.get('profile');

		if (!(emailOrUsername?.length !== 0) || !(password?.length !== 0)) {
			return fail(400, {
				missing: true,
				message: 'Campos não preenchidos'
			});
		}

		try {
			if (profile === 'doctor') {
				await locals.pb
					.collection('doctors')
					.authWithPassword(emailOrUsername as string, password as string);
			} else {
				await locals.pb
					.collection('users')
					.authWithPassword(emailOrUsername as string, password as string);
			}
		} catch (_) {
			console.log(_);
			return fail(400, {
				message: 'Credenciais incorretas'
			});
		}

		throw redirect(302, '/cirurgias/' + id);
	}
};
