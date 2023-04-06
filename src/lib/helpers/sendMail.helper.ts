import type { SurgeryRecord } from '$lib/pb';
import { CurrentStep } from '$lib/selectChoices';
import { error } from '@sveltejs/kit';
import { pbStringDateToDate } from '../utils/pb.utils';
import nodemailer from 'nodemailer';

export async function sendSurgeryUpdateMail(
	updatedSurgery: SurgeryRecord,
	userName: string,
	senderEmail: string,
	emailPassword: string
) {
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

	const transporter = nodemailer.createTransport({
		service: 'kinghost',
		host: 'http://kinghost.uni5.net/',
		port: 465,
		secure: true,
		auth: { user: senderEmail, pass: emailPassword }
	});
	await transporter.sendMail({
		text: text,
		html: `<p>${text}</p>`,
		subject: subject,
		to: email
	});
	try {
	} catch (err) {
		console.error(err);
	}
}
