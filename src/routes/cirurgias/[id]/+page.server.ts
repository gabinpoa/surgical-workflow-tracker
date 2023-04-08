import { Profile, serializeNonPOJOs, type SurgeryWithHistoryRecord } from '$lib/pb';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.pb.authStore.isValid || locals.pb.authStore.model === null) {
		throw redirect(302, '/login/' + params.id);
	}

	try {
		const surgery: SurgeryWithHistoryRecord = await locals.pb
			.collection('surgeries')
			.getOne(params.id, { expand: 'stepHistory(surgery).user,surgeon' });

		return {
			surgery: serializeNonPOJOs(surgery) as SurgeryWithHistoryRecord,
			stepHistories: serializeNonPOJOs(surgery.expand['stepHistory(surgery)'].reverse())
		};
	} catch (err) {
		throw error(404, 'Cirurgia não encontrada');
	}
};
