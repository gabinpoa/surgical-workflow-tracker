import type { SurgeryRecord } from '$lib/pb';
import { CurrentStep } from '$lib/selectChoices';
import { pbStringDateToDate } from '$lib/utils/pb.utils';

export default function getMailMessage(
	surgeryRecord: SurgeryRecord,
	userName: string,
	newSurgery?: boolean
) {
	const {
		patient,
		id,
		currentStep,
		surgeryName,
		updated,
		expand: {
			surgeon: { name }
		}
	} = surgeryRecord;
	const dateTimeArr = pbStringDateToDate(updated).toLocaleString().split(', ');
	const { date, time } = {
		date: dateTimeArr[0],
		time: dateTimeArr[1].slice(0, 5)
	};
	const html = `<p>Olá Dr. ${name}, seu procedimento de ${surgeryName} para o paciente ${patient} foi atualizado hoje com o status: ${currentStep}, as ${time} do dia ${date}, pelo usuário ${userName}. Para checar o andamento completo deste procedimento, <a href="https://orbits.hospital/cirurgias/${id}" >clique aqui</a></p>`;
	const subject = newSurgery
		? `Novo procedimento - ${surgeryName}`
		: `Procedimento avançou uma etapa - ${surgeryName}`;

	return { html, subject };
}
