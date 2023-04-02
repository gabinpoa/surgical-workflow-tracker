import type { SurgeryRecord } from '$lib/pb';
import type { SendMailRequest } from '../../routes/api/send-mail/+server';
import { pbStringDateToDate } from '../../utils/pb.utils';

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
	const body: SendMailRequest = {
		text: `Olá Dr. ${name}, seu procedimento de ${surgeryName} para o paciente ${patient} foi atualizado hoje com o status: ${currentStep}, as ${time} do dia ${date}, pelo usuário ${userName}. Para checar o andamento completo deste procedimento, <a href="http://localhost:5173/${id}" >clique aqui</a>`,
		email: email,
		subject: 'Nova cirurgia criada'
	};
	fetch('/api/send-mail', {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify(body)
	});
}
