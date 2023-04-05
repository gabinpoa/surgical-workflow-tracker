import type { SurgeryRecord } from '$lib/pb';
import { CurrentStep } from '$lib/selectChoices';
import { error } from '@sveltejs/kit';
import AWS from 'aws-sdk';
import type { SendEmailRequest } from 'aws-sdk/clients/ses';
import { pbStringDateToDate } from '../utils/pb.utils';

export async function sendSurgeryUpdateMail(updatedSurgery: SurgeryRecord, userName: string) {
	const ses = new AWS.SES();

	const {
		patient,
		id,
		currentStep,
		surgeryName,
		updated,
		expand: {
			surgeon: { name, email }
		}
	} = updatedSurgery;
	const dateTimeArr = pbStringDateToDate(updated).toLocaleString().split(', ');
	const { date, time } = {
		date: dateTimeArr[0],
		time: dateTimeArr[1].slice(0, 5)
	};
	const text = `Olá Dr. ${name}, seu procedimento de ${surgeryName} para o paciente ${patient} foi atualizado hoje com o status: ${currentStep}, as ${time} do dia ${date}, pelo usuário ${userName}. Para checar o andamento completo deste procedimento, <a href="https://orbits.hospital/cirurgias/${id}" >clique aqui</a>`;
	const subject =
		currentStep === CurrentStep.DocsEnviadosHJS
			? `Novo procedimento - ${surgeryName}`
			: `Procedimento avançou uma etapa - ${surgeryName}`;

	const params: SendEmailRequest = {
		Destination: {
			ToAddresses: [email]
		},
		Message: {
			Body: {
				Html: {
					Charset: 'UTF-8',
					Data: text
				}
			},
			Subject: {
				Charset: 'UTF-8',
				Data: subject
			}
		},
		Source: 'SENDER_EMAIL',
		ReplyToAddresses: ['EMAIL_ADRESS']
	};

	try {
		const sendPromise = await ses.sendEmail(params).promise();
	} catch (err) {
		console.error(err);
	}
}
