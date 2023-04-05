import type { SurgeryRecord } from '$lib/pb';
import { CurrentStep } from '$lib/selectChoices';
import { error } from '@sveltejs/kit';
import nodemailer from 'nodemailer';
import type { SendMailRequest } from '../../routes/api/send-mail/+server';
import { pbStringDateToDate } from '../utils/pb.utils';

export async function sendSurgeryUpdateMail(updatedSurgery: SurgeryRecord, userName: string) {
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
	const text = `Olá Dr. ${name}, seu procedimento de ${surgeryName} para o paciente ${patient} foi atualizado hoje com o status: ${currentStep}, as ${time} do dia ${date}, pelo usuário ${userName}. Para checar o andamento completo deste procedimento, <a href="${
		import.meta.env.VITE_DOMAIN
	}cirurgias/${id}" >clique aqui</a>`;
	const subject =
		currentStep === CurrentStep.DocsEnviadosHJS
			? `Criada nova cirurgia ${patient}`
			: `Cirurgia para ${patient} avançou uma etapa`;

	try {
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
