import type { SurgeryRecord } from '$lib/pb';
import { CurrentStep, ResponseStatus, steps } from '$lib/selectChoices';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
export interface NextStepRequestBody {
	surgery: {
		currentStep: CurrentStep;
		id: string;
	};
	informedDate: string;
	responseStatus: string;
}

export const POST: RequestHandler = async ({ request, locals, url }) => {
	const data = (await request.json()) as NextStepRequestBody;
	try {
		const stepHistoryBody: {
			user: string;
			surgery: string;
			informedDate: string;
			step: CurrentStep;
			responseStatus?: string;
		} = {
			user: locals.pb.authStore.model?.id as string,
			surgery: data.surgery.id,
			informedDate: data.informedDate,
			step: data.surgery.currentStep
		};
		if (data.responseStatus.length > 0) {
			stepHistoryBody.responseStatus = data.responseStatus;
		}
		await locals.pb.collection('stepHistory').create(stepHistoryBody);

		const currentStep =
			data.responseStatus === ResponseStatus.Autorizada
				? CurrentStep.Concluido
				: data.responseStatus === ResponseStatus.NovasJustificativas
				? CurrentStep.EnvioJustificativas
				: steps[steps.findIndex((el) => el === data.surgery.currentStep) + 1];

		const updatedSurgery = await locals.pb.collection('surgeries').update<SurgeryRecord>(
			data.surgery.id,
			{
				currentStep: currentStep
			},
			{
				expand: 'surgeon'
			}
		);

		const surgeries = await locals.pb.collection('surgeries').getFullList<SurgeryRecord>({
			expand: 'surgeon'
		});

		return new Response(JSON.stringify(surgeries));
	} catch (err) {
		console.log(err);
		throw error(400, 'Erro desconhecido');
	}
};
