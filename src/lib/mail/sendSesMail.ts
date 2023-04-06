import type { SurgeryRecord } from '$lib/pb';
import { CurrentStep } from '$lib/selectChoices';
import { pbStringDateToDate } from '../utils/pb.utils';
import { SESClient, SendEmailCommand, type SendEmailCommandInput } from '@aws-sdk/client-ses';

export interface SecretKeys {
	accessKeyId: string;
	secretAccessKey: string;
	senderEmail: string;
}

export interface Message {
	html: string;
	subject: string;
}

export async function sendSesMail(secretKeys: SecretKeys, message: Message, email: string) {
	const client = new SESClient({
		region: 'us-west-2',
		credentials: {
			accessKeyId: secretKeys.accessKeyId,
			secretAccessKey: secretKeys.secretAccessKey
		}
	});

	const input: SendEmailCommandInput = {
		Source: secretKeys.senderEmail,
		Destination: {
			ToAddresses: [email]
		},
		Message: {
			Subject: {
				Data: message.subject,
				Charset: 'UTF-8'
			},
			Body: {
				Html: {
					Data: message.html,
					Charset: 'UTF-8'
				}
			}
		},
		ReplyToAddresses: []
	};

	const command = new SendEmailCommand(input);

	try {
		const response = await client.send(command);
		return response;
	} catch (err) {
		console.error(err);
	}
}
