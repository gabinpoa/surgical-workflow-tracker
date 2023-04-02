import nodemailer from 'nodemailer';
import { error } from '@sveltejs/kit';

export interface SendMailRequest {
	text: string;
	subject: string;
	email: string;
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const { subject, email, text }: SendMailRequest = await request.json();
		const transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 587,
			secure: false,
			auth: { user: 'correamitor@gmail.com', pass: 'bwvbmiiszkjjkkcg' },
			tls: {
				rejectUnauthorized: false
			}
		});
		const mailSend = await transporter.sendMail({
			text: text,
			html: `<p>${text}</p>`,
			subject: subject,
			to: email
		});
		return new Response(JSON.stringify(mailSend));
	} catch (err) {
		console.log(err);
		throw error(400, 'Erro desconhecido');
	}
}
