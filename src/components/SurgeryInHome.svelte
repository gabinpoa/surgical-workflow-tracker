<script lang="ts">
	import { Profile, type SurgeryRecord } from '$lib/pb';
	import { CurrentStep, ResponseStatus } from '$lib/selectChoices';
	import { pbStringDateToDate } from '../lib/utils/pb.utils';
	import type { NextStepRequestBody } from '../routes/api/next-step/+server';
	import { dev } from '$app/environment';
	import FaSpinner from 'svelte-icons/fa/FaSpinner.svelte';
	import type { Filter } from '$lib/utils';

	export let surgery: SurgeryRecord;
	export let profile: Profile;
	export let updateSurgeries: (response: SurgeryRecord[]) => void;
	export let filter: Filter;

	let responseStatus = '';
	let loading = false;

	async function handleNextStep() {
		loading = true;
		const data: NextStepRequestBody = {
			surgery: {
				currentStep: surgery.currentStep,
				id: surgery.id
			},
			responseStatus,
			filter
		};

		const response: SurgeryRecord[] = await (
			await fetch('/api/next-step', {
				method: 'POST',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify(data)
			})
		).json();

		updateSurgeries(response);
		loading = false;
		responseStatus = '';
	}
</script>

{#if loading}
	<div
		class="fixed z-10 flex items-center h-full w-full justify-center bottom-0 right-0 left-0 bg-white bg-opacity-60"
	>
		<div class="animate-spin w-20">
			<FaSpinner />
		</div>
	</div>
{/if}

<div
	class="card card-bordered shadow {surgery.currentStep === CurrentStep.Suspensa &&
		'border-red-300'}"
>
	<div class="card-body">
		<p class="card-title capitalize">{surgery.surgeryName}</p>
		<p class="font-light">
			Etapa em andamento: <span class="font-normal">{surgery.currentStep}</span>
		</p>
		<p class="font-light">
			Cirurgião: <span class="font-normal">Dr. {surgery.expand.surgeon.name}</span>
		</p>
		<p class="font-light">Paciente: <span class="font-normal">{surgery.patient}</span></p>
		{#if surgery.currentStep === CurrentStep.RespostaConvenio || surgery.currentStep === CurrentStep.RespostaJustificativas}
			<div>
				<label for="responseStatus">Resposta do convênio: </label>
				<select
					class="select select-bordered select-sm"
					bind:value={responseStatus}
					name="responseStatusConvenio"
				>
					<option selected value="">Selecione uma resposta do convênio</option>
					<option value={ResponseStatus.AutorizadoIntegral}
						>{ResponseStatus.AutorizadoIntegral}</option
					>
					<option value={ResponseStatus.AutorizadoParcial}
						>{ResponseStatus.AutorizadoParcial}</option
					>
					<option
						value={surgery.currentStep === CurrentStep.RespostaConvenio
							? ResponseStatus.NecessitaJustificativas
							: ResponseStatus.NovasJustificativas}
						>{surgery.currentStep === CurrentStep.RespostaConvenio
							? ResponseStatus.NecessitaJustificativas
							: ResponseStatus.NovasJustificativas}</option
					>
					<option value={ResponseStatus.Negada}>{ResponseStatus.Negada}</option>
				</select>
			</div>
		{/if}
		{#if surgery.currentStep === CurrentStep.RetornoOPME}
			<div>
				<label for="responseStatus">Resposta do OPME: </label>
				<select
					class="select select-bordered select-sm"
					name="responseStatus"
					bind:value={responseStatus}
				>
					<option value="">Selecione uma resposta do OPME</option>
					<option value={ResponseStatus.EncaminhadoConvenio}
						>{ResponseStatus.EncaminhadoConvenio}</option
					>
					<option value={ResponseStatus.NecessitaJustificativasMaterial}
						>{ResponseStatus.NecessitaJustificativasMaterial}</option
					>
					<option value={ResponseStatus.Negada}>{ResponseStatus.Negada}</option>
				</select>
			</div>
		{/if}
		<div class="card-actions mt-2 items-center gap-x-4">
			{#if surgery.currentStep !== CurrentStep.Concluido && surgery.currentStep !== CurrentStep.Suspensa && profile !== Profile.Medico}
				<button
					on:click={handleNextStep}
					disabled={(surgery.currentStep === CurrentStep.RespostaConvenio ||
						surgery.currentStep === CurrentStep.RespostaJustificativas ||
						surgery.currentStep === CurrentStep.RetornoOPME) &&
						![
							String(ResponseStatus.Autorizada),
							String(ResponseStatus.AutorizadoParcial),
							String(ResponseStatus.AutorizadoIntegral),
							String(ResponseStatus.EncaminhadoConvenio),
							String(ResponseStatus.NecessitaJustificativasMaterial),
							String(ResponseStatus.Negada),
							String(ResponseStatus.NovasJustificativas)
						].includes(responseStatus)}
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
