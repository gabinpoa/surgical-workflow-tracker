import { sendSurgeryUpdateMail } from '$lib/helpers/sendMail.helper';
import type { StepHistoryRecord, SurgeryRecord, DoctorRecord } from '$lib/pb';
import { CurrentStep } from '$lib/selectChoices';
import { pbDateString } from '$lib/utils/pb.utils';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { SECRET_EMAIL_PASSWORD, SECRET_EMAIL_ADDRESS } from '$env/static/private';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(300, '/login');
	}
	try {
		const doctors: { name: string; id: string; email: string }[] = (
			await locals.pb.collection('doctors').getFullList<DoctorRecord>({
				sort: 'name'
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
		throw error(401);
	}
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		if (!locals.pb.authStore.isValid) {
			throw redirect(302, '/login');
		}

		const data = Object.fromEntries(await request.formData());

		if (Object.values(data).some((el) => el.length === 0)) {
			return fail(404, {
				missing: true,
				message: 'Campos não preenchidos'
			});
		}

		try {
			const estimatedDate = pbDateString(new Date(`${data.date} ${data.time}`));
			const surgeonObj: { name: string; id: string; email: string } = JSON.parse(
				data.surgeon as string
			);

			const createdSurgery = await locals.pb.collection('surgeries').create<SurgeryRecord>(
				{
					patient: data.patient,
					surgeryName: data.surgeryName,
					surgeon: surgeonObj.id,
					estimatedDate,
					currentStep: CurrentStep.DocsEnviadosHJS
				},
				{
					expand: 'surgeon'
				}
			);

			sendSurgeryUpdateMail(
				createdSurgery,
				locals.pb.authStore.model?.name,
				SECRET_EMAIL_ADDRESS,
				SECRET_EMAIL_PASSWORD
			);

			await locals.pb.collection('stepHistory').create<StepHistoryRecord>({
				user: locals.pb.authStore.model?.id,
				surgery: createdSurgery.id,
				step: CurrentStep.Criacao
			});
		} catch (err) {
			console.log(err);
			return fail(400, {
				message: 'Algo deu errado, tente novamente'
			});
		}

		throw redirect(303, '/');
	}
};
