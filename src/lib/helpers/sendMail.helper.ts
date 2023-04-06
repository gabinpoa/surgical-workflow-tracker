import type { SurgeryRecord } from '$lib/pb';
import { CurrentStep } from '$lib/selectChoices';
import { pbStringDateToDate } from '../utils/pb.utils';
import { SESClient, SendEmailCommand, type SendEmailCommandInput } from '@aws-sdk/client-ses';

export interface SecretKeys {
	accessKeyId: string;
	secretAccessKey: string;
	senderEmail: string;
	sourceArn: string;
}

export async function sendSurgeryUpdateMail(
	updatedSurgery: SurgeryRecord,
	userName: string,
	config: SecretKeys
) {
	const client = new SESClient({
		region: 'us-west-2',
		credentials: {
			accessKeyId: config.accessKeyId,
			secretAccessKey: config.secretAccessKey
		}
	});

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
	const text = `<p>Olá Dr. ${name}, seu procedimento de ${surgeryName} para o paciente ${patient} foi atualizado hoje com o status: ${currentStep}, as ${time} do dia ${date}, pelo usuário ${userName}. Para checar o andamento completo deste procedimento, <a href="https://orbits.hospital/cirurgias/${id}" >clique aqui</a></p>`;
	const subject =
		currentStep === CurrentStep.DocsEnviadosHJS
			? `Novo procedimento - ${surgeryName}`
			: `Procedimento avançou uma etapa - ${surgeryName}`;

	const input: SendEmailCommandInput = {
		Source: config.senderEmail,
		Destination: {
			ToAddresses: [email]
		},
		Message: {
			Subject: {
				Data: subject,
				Charset: 'UTF-8'
			},
			Body: {
				Html: {
					Data: text,
					Charset: 'UTF-8'
				}
			}
		},
		ReplyToAddresses: [],
		SourceArn: config.sourceArn
	};

	const command = new SendEmailCommand(input);

	try {
		await client.send(command);
	} catch (err) {
		console.error(err);
	}
}
