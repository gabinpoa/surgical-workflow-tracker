import type { Message } from './sendSesMail';
import nodemailer from 'nodemailer';

interface SecretKeys {
	email: string;
	password: string;
}

export default async function sendKingHostMail(
	secretKeys: SecretKeys,
	message: Message,
	email: string
) {
	const transporter = nodemailer.createTransport({
		service: 'kinghost',
		host: 'smtpi.uni5.net',
		port: 465,
		secure: true,
		auth: {
			user: secretKeys.email,
			pass: secretKeys.password
		}
	});

	try {
		const response = await transporter.sendMail({
			html: message.html,
			subject: message.subject,
			to: email,
			from: secretKeys.email
		});

		return response;
	} catch (err) {
		console.error(err);
	}
}
