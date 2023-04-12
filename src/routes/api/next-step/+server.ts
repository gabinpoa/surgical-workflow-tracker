import type { SurgeryRecord } from '$lib/pb';
import { CurrentStep, ResponseStatus, steps } from '$lib/selectChoices';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	SECRET_EMAIL_ADDRESS,
	SECRET_AWS_ACCESS_KEY,
	SECRET_AWS_KEY_ID
} from '$env/static/private';
import getMailMessage from '$lib/mail/getMailMessage';
import { sendSesMail } from '$lib/mail/sendSesMail';
import { Filter } from '$lib/utils';

export interface NextStepRequestBody {
	surgery: {
		currentStep: CurrentStep;
		id: string;
	};
	informedDate: string;
	responseStatus: string | boolean;
	filter: string;
}

export const POST: RequestHandler = async ({ request, locals }) => {
	const data = (await request.json()) as NextStepRequestBody;
	try {
		const stepHistoryBody: {
			user: string;
			surgery: string;
			informedDate: string;
			step: CurrentStep;
			responseStatus?: string | boolean;
		} = {
			user: locals.pb.authStore.model?.id as string,
			surgery: data.surgery.id,
			informedDate: data.informedDate,
			step: data.surgery.currentStep
		};
		if (
			(typeof data.responseStatus === 'string' && data.responseStatus.length > 0) ||
			typeof data.responseStatus === 'boolean'
		) {
			stepHistoryBody.responseStatus = data.responseStatus;
		}
		await locals.pb.collection('stepHistory').create(stepHistoryBody);

		let currentStep = steps[steps.findIndex((el) => el === data.surgery.currentStep) + 1];

		if (
			data.surgery.currentStep === CurrentStep.DocsEnviadosHJS &&
			stepHistoryBody.responseStatus === false
		) {
			currentStep = CurrentStep.DocsEnviadosConvenio;
		} else if (data.surgery.currentStep === CurrentStep.RespostaConvenio) {
			if (
				data.responseStatus === ResponseStatus.AutorizadoIntegral ||
				data.responseStatus === ResponseStatus.AutorizadoParcial
			) {
				currentStep = CurrentStep.Concluido;
			} else if (data.responseStatus === ResponseStatus.Negada) {
				currentStep = CurrentStep.Suspensa;
			}
		} else if (data.surgery.currentStep === CurrentStep.RetornoOPME) {
			if (data.responseStatus === ResponseStatus.EncaminhadoConvenio) {
				currentStep = CurrentStep.DocsEnviadosConvenio;
			}
		} else if (data.surgery.currentStep === CurrentStep.EnvioJustificativasOPME) {
			currentStep = CurrentStep.RetornoOPME;
		} else if (data.surgery.currentStep === CurrentStep.RespostaJustificativas) {
			if (data.responseStatus === ResponseStatus.NovasJustificativas) {
				currentStep = CurrentStep.EnvioJustificativas;
			} else if (data.responseStatus === ResponseStatus.Negada) {
				currentStep = CurrentStep.Suspensa;
			}
		}

		const updatedSurgery = await locals.pb.collection('surgeries').update<SurgeryRecord>(
			data.surgery.id,
			{
				currentStep: currentStep
			},
			{
				expand: 'surgeon'
			}
		);

		let surgeries = await locals.pb.collection('surgeries').getFullList<SurgeryRecord>({
			expand: 'surgeon',
			sort: '-created'
		});

		await sendSesMail(
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
