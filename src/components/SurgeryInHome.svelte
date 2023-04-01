<script lang="ts">
	import { pb, StepHistoryRecord, type SurgeryRecord } from '$lib/pb';
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
			await pb.collection('surgeries').update(surgery.id, {
				currentStep: currentStep
			});
			await refreshSurgeries();
		} catch (err) {
			console.error(err);
		}
	}
</script>

<div>
	<p>{surgery.currentStep}</p>
	<p>{surgery.surgeryName}</p>
	<p>{surgery.surgeon}</p>
	<p>{surgery.patient}</p>
	<p>{pbStringDateToDate(surgery.estimatedDate).toLocaleString()}</p>
	<label>
		Data e hora
		<input bind:value={informedDate} type="datetime-local" />
	</label>
	<button on:click={handleSubmit}>Concluir etapa</button>
</div>
