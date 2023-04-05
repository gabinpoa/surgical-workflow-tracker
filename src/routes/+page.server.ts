import { serializeNonPOJOs, type SurgeryRecord } from '$lib/pb';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.pb.authStore.isValid || locals.pb.authStore.model === null) {
		throw redirect(302, '/login');
	}
	try {
		const surgeries = await locals.pb.collection('surgeries').getFullList<SurgeryRecord>({
			expand: 'surgeon'
		});
		return {
			surgeries: serializeNonPOJOs(surgeries) as SurgeryRecord[],
			user: {
				name: locals.pb.authStore.model?.name as string,
				profile: locals.pb.authStore.model.collectionName
			}
		};
	} catch (err) {
		throw error(403);
	}
};
