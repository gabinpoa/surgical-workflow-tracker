import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { pbDateString } from '$lib/utils/pb.utils';
import type { StepHistoryRecord, SurgeryRecord } from '$lib/pb';
import { CurrentStep } from '$lib/selectChoices';
import { sendSesMail } from '$lib/mail/sendSesMail';
import {
	SECRET_AWS_ACCESS_KEY,
	SECRET_AWS_KEY_ID,
	SECRET_EMAIL_ADDRESS
} from '$env/static/private';
import getMailMessage from '$lib/mail/getMailMessage';

export interface NextSurgeryRequestBody {
	patient: string;
	surgeryName: string;
	surgeon: string;
	date: string;
	time: string;
}

export const POST: RequestHandler = async ({ locals, request }) => {
	const data = (await request.json()) as NextSurgeryRequestBody;

	if (Object.values(data).some((el) => el.length === 0)) {
		throw error(400, 'Campos não preenchidos');
	}

	const estimatedDate = pbDateString(new Date(`${data.date} ${data.time}`));

	const surgeonObj: { name: string; id: string; email: string } = JSON.parse(
		data.surgeon as string
	);

	try {
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

		await locals.pb.collection('stepHistory').create<StepHistoryRecord>({
			user: locals.pb.authStore.model?.id,
			surgery: createdSurgery.id,
			step: CurrentStep.Criacao
		});

		await sendSesMail(
			{
				accessKeyId: SECRET_AWS_KEY_ID,
				senderEmail: SECRET_EMAIL_ADDRESS,
				secretAccessKey: SECRET_AWS_ACCESS_KEY
			},
			getMailMessage(createdSurgery, locals.pb.authStore.model?.name as string),
			createdSurgery.expand.surgeon.email
		);
	} catch (err) {
		throw error(400, 'Algo deu errado');
	}

	return new Response(JSON.stringify({ success: true }));
};
