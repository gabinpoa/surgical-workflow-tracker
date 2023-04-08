import type { DoctorRecord } from '$lib/pb';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(300, '/login');
	}
	try {
		const doctors: { name: string; id: string; email: string }[] = (
			await locals.pb.collection('users').getFullList<DoctorRecord>({
				sort: 'name',
				filter: 'profile = "Médico"'
			})
		).map((eachDoctor) => {
			return {
				name: eachDoctor.name,
				id: eachDoctor.id,
				email: eachDoctor.email
			};
		});

		return {
			doctors: doctors
		};
	} catch (err) {
		console.log(err);
		throw error(401);
	}
};
