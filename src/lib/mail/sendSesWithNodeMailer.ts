import type { Message, SecretKeys } from './sendSesMail';
import nodemailer from 'nodemailer';
import type { SurgeryRecord } from '$lib/pb';
import AWS from 'aws-sdk';
import { error } from '@sveltejs/kit';
import type { EncodedFile } from '$lib/utils';

export async function sendSesWithNodemailer(
	secretKeys: SecretKeys,
	email: string,
	surgery: SurgeryRecord,
	files: EncodedFile[]
) {
	const transporter = nodemailer.createTransport({
		SES: new AWS.SES({
			region: 'us-west-2',
			credentials: {
				accessKeyId: secretKeys.accessKeyId,
				secretAccessKey: secretKeys.secretAccessKey
			}
		})
	});

	try {
		await transporter.sendMail({
			from: secretKeys.senderEmail,
			to: email,
			subject: `Novos arquivos de Dr. ${surgery.expand.surgeon.name}`,
			text: `Dr. ${surgery.expand.surgeon.name} enviou arquivos referentes ao registro de ${surgery.surgeryName} do paciente ${surgery.patient}`,
			html: `<p>Dr. ${surgery.expand.surgeon.name} enviou arquivos referentes ao registro de ${surgery.surgeryName} do paciente ${surgery.patient}.</p>
        <a href="https://orbits.hospital/cirurgias/${surgery.id}">Clique aqui para visualizar registro</a>`,
			attachments: files
		});
	} catch (err) {
		console.error(err);
		throw error(500, 'Não foi possível enviar o e-mail');
	}
}
