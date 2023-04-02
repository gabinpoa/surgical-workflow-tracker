<script lang="ts">
	import { sendSurgeryUpdateMail } from '$lib/helpers/sendMail.helper';
	import { pb, StepHistoryRecord, SurgeryRecord } from '$lib/pb';
	import { steps } from '$lib/selectChoices';
	import { pbDateString, pbStringDateToDate } from '../utils/pb.utils';

	export let refreshSurgeries: () => Promise<void>;
	export let surgery: SurgeryRecord;

	const initialDate = new Date();
	initialDate.setMinutes(0, 0, 0);
	let informedDate = initialDate.toISOString().slice(0, -1);

	async function handleSubmit() {
		try {
			await pb.collection('stepHistory').create<StepHistoryRecord>({
				user: pb.authStore.model?.id,
				surgery: surgery.id,
				informedDate: pbDateString(new Date(informedDate)),
				step: surgery.currentStep
			});

			const currentStep = steps[steps.findIndex((el) => el === surgery.currentStep) + 1];
			const updatedSurgery = await pb.collection('surgeries').update<SurgeryRecord>(
				surgery.id,
				{
					currentStep: currentStep
				},
				{
					expand: 'surgeon'
				}
			);
			sendSurgeryUpdateMail(updatedSurgery, pb.authStore.model?.name);
			await refreshSurgeries();
		} catch (err) {
			console.error(err);
		}
	}
</script>

<div class="card card-bordered">
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
				>{pbStringDateToDate(surgery.estimatedDate).toLocaleString()}</span
			>
		</p>
		<div>
			<label for="informedDate">Selecione data e hora: </label>
			<input
				name="informed-date"
				class="input input-bordered input-sm"
				bind:value={informedDate}
				type="datetime-local"
			/>
		</div>
		<button class="btn mt-2 btn-success btn-sm" on:click={handleSubmit}>Concluir etapa</button>
	</div>
</div>
