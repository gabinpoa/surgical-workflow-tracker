<script lang="ts">
	import type { SurgeryRecord } from '$lib/pb';
	import { CurrentStep, ResponseStatus } from '$lib/selectChoices';
	import { pbStringDateToDate } from '../lib/utils/pb.utils';
	import type { NextStepRequestBody } from '../routes/api/next-step/+server';
	import { dev } from '$app/environment';

	export let surgery: SurgeryRecord;
	export let profile: string;
	export let updateSurgeries: (response: SurgeryRecord[]) => void;

	const initialDate = new Date();
	initialDate.setMinutes(0, 0, 0);
	let informedDate = initialDate.toISOString().slice(0, -1);
	let responseStatus = '';

	async function handleNextStep() {
		const data: NextStepRequestBody = {
			surgery: {
				currentStep: surgery.currentStep,
				id: surgery.id
			},
			informedDate,
			responseStatus
		};

		const response: {
			surgeries: SurgeryRecord[];
			emailSentResponse: any;
		} = await (
			await fetch('/api/next-step', {
				method: 'POST',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify(data)
			})
		).json();

		updateSurgeries(response.surgeries);
	}
</script>

<div class="card card-bordered shadow">
	<div class="card-body">
		<p class="card-title">{surgery.surgeryName}</p>
		<p class="font-light">
			Etapa em andamento: <span class="font-normal">{surgery.currentStep}</span>
		</p>
		<p class="font-light">
			Cirurgião: <span class="font-normal">{surgery.expand.surgeon.name}</span>
		</p>
		<p class="font-light">Paciente: <span class="font-normal">{surgery.patient}</span></p>
		<p class="font-light">
			Data estimada: <span class="font-normal"
				>{pbStringDateToDate(surgery.estimatedDate).toLocaleString('pt-BR', {
					hour12: false
				})}</span
			>
		</p>
		{#if surgery.currentStep === CurrentStep.RespostaConvenio || surgery.currentStep === CurrentStep.RespostaJustificativas}
			<div>
				<label for="responseStatus">Resposta do convênio</label>
				<select
					class="select select-bordered select-sm"
					bind:value={responseStatus}
					name="responseStatus"
				>
					<option value="">Selecione uma resposta do convênio</option>
					<option value={ResponseStatus.Autorizada}>{ResponseStatus.Autorizada}</option>
					<option
						value={surgery.currentStep === CurrentStep.RespostaConvenio
							? ResponseStatus.Pendente
							: ResponseStatus.NovasJustificativas}
						>{surgery.currentStep === CurrentStep.RespostaConvenio
							? ResponseStatus.Pendente
							: ResponseStatus.NovasJustificativas}</option
					>
				</select>
			</div>
		{/if}
		<div>
			<label for="informedDate">Selecione data e hora: </label>
			<input
				name="informed-date"
				class="input input-bordered input-sm"
				bind:value={informedDate}
				type="datetime-local"
			/>
		</div>
		<div class="card-actions mt-2 items-center gap-x-4">
			{#if profile === 'users'}
				<button
					on:click={handleNextStep}
					disabled={surgery.currentStep === CurrentStep.RespostaConvenio ||
					surgery.currentStep === CurrentStep.RespostaJustificativas
						? responseStatus.length === 0
						: false}
					class="btn btn-success btn-sm">Atendido</button
				>
			{/if}
			<a
				class="btn btn-primary btn-sm"
				href={`${dev ? 'http://localhost:5173' : 'https://orbits.hospital'}/cirurgias/${
					surgery.id
				}`}
				rel="noopener noreferrer">Visualizar</a
			>
		</div>
	</div>
</div>
