import type { SurgeryRecord } from '$lib/pb';
import type { CurrentStep, ResponseStatus } from '$lib/selectChoices';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	SECRET_EMAIL_ADDRESS,
	SECRET_AWS_ACCESS_KEY,
	SECRET_AWS_KEY_ID
} from '$env/static/private';
import getMailMessage from '$lib/mail/getMailMessage';
import { sendSesMail } from '$lib/mail/sendSesMail';
import {  getNextStep } from '$lib/utils';

export interface NextStepRequestBody {
	surgery: {
		currentStep: CurrentStep;
		id: string;
	};
	responseStatus: ResponseStatus;
	filter: string;
}

export const POST: RequestHandler = async ({ request, locals }) => {
	const data = (await request.json()) as NextStepRequestBody;
	try {
		const stepHistoryBody: {
			user: string;
			surgery: string;
			step: CurrentStep;
			responseStatus?: ResponseStatus;
		} = {
			user: locals.pb.authStore.model?.id as string,
			surgery: data.surgery.id,
			step: data.surgery.currentStep
		};

		if (data.responseStatus) {
			stepHistoryBody.responseStatus = data.responseStatus;
		}

		await locals.pb.collection('stepHistory').create(stepHistoryBody);

		const nextStep = getNextStep(data.surgery.currentStep, data.responseStatus);

		const updatedSurgery = await locals.pb.collection('surgeries').update<SurgeryRecord>(
			data.surgery.id,
			{
				currentStep: nextStep
			},
			{
				expand: 'surgeon'
			}
		);

		const surgeries = await locals.pb.collection('surgeries').getFullList<SurgeryRecord>({
			expand: 'surgeon',
			sort: '-created'
		});

		sendSesMail(
			{
				accessKeyId: SECRET_AWS_KEY_ID,
				senderEmail: SECRET_EMAIL_ADDRESS,
				secretAccessKey: SECRET_AWS_ACCESS_KEY
			},
			getMailMessage(updatedSurgery, locals.pb.authStore.model?.name as string),
			updatedSurgery.expand.surgeon.email
		);

		return new Response(JSON.stringify(surgeries));
	} catch (err) {
		console.log(err);
		throw error(400, 'Erro desconhecido');
	}
};
