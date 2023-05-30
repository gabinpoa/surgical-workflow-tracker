import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { StepHistoryRecord, SurgeryRecord } from '$lib/pb';
import { CurrentStep } from '$lib/selectChoices';
import { sendSesMail } from '$lib/mail/sendSesMail';
import {
	SECRET_AWS_ACCESS_KEY,
	SECRET_AWS_KEY_ID,
	SECRET_EMAIL_ADDRESS
} from '$env/static/private';
import getMailMessage from '$lib/mail/getMailMessage';
import { sendSesWithNodemailer } from '$lib/mail/sendSesWithNodeMailer';
import type { EncodedFile } from '$lib/utils';

export interface NewSurgeryRequestBody {
	patient: string;
	surgeryName: string;
	surgeon: string;
	specialMaterials: boolean;
	files: EncodedFile[] | null
}

export const POST: RequestHandler = async ({ locals, request }) => {
	const data = (await request.json()) as NewSurgeryRequestBody;

	if (Object.values(data).some((el) => el !== null && el.length === 0)) {
		throw error(400, 'Campos não preenchidos');
	}

	const surgeonObj: { name: string; id: string; email: string } = JSON.parse(
		data.surgeon as string
	);

	try {
		const createdSurgery = await locals.pb.collection('surgeries').create<SurgeryRecord>(
			{
				patient: data.patient,
				surgeryName: data.surgeryName,
				surgeon: surgeonObj.id,
				currentStep: data.specialMaterials
					? CurrentStep.SolicitadoOPME
					: CurrentStep.DocsEnviadosConvenio,
				specialMaterials: data.specialMaterials
			},
			{
				expand: 'surgeon'
			}
		);

		await locals.pb.collection('stepHistory').create<StepHistoryRecord>({
			user: locals.pb.authStore.model?.id,
			surgery: createdSurgery.id,
			step: CurrentStep.Criacao,
			files: data.files && data.files
				.reduce((acc, file): string => {
					return acc + ' ' + file.filename;
				}, '')
				.trimStart()
				.split(' ')
				.join(', ')
		});

		await sendSesMail(
			{
				accessKeyId: SECRET_AWS_KEY_ID,
				senderEmail: SECRET_EMAIL_ADDRESS,
				secretAccessKey: SECRET_AWS_ACCESS_KEY
			},
			getMailMessage(createdSurgery, locals.pb.authStore.model?.name as string, true),
			createdSurgery.expand.surgeon.email
		);

		if (data.files) {
		await sendSesWithNodemailer(
			{
				accessKeyId: SECRET_AWS_KEY_ID,
				senderEmail: SECRET_EMAIL_ADDRESS,
				secretAccessKey: SECRET_AWS_ACCESS_KEY
			},
				'agendamentohsj@santacasa.org.br',
			createdSurgery,
			data.files
		);
		}
	} catch (err) {
		console.log(err)
		throw error(400, 'Algo deu errado');
	}

	return new Response(JSON.stringify({ success: true }));
};
