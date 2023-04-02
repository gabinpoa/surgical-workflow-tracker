<script lang="ts">
	import { goto } from '$app/navigation';
	import { sendSurgeryUpdateMail } from '$lib/helpers/sendMail.helper';
	import { DoctorRecord, pb, StepHistoryRecord, SurgeryRecord } from '$lib/pb';
	import { CurrentStep, surgeryNames } from '$lib/selectChoices';
	import { onMount } from 'svelte';
	import Label from '../../components/Label.svelte';
	import { pbDateString } from '../../utils/pb.utils';
	import MdArrowBack from 'svelte-icons/md/MdArrowBack.svelte';

	let surgeons: { name: string; id: string; email: string }[] = [];
	let patient = '';
	let surgeryName = '';
	let surgeon = '';
	let date = '';
	let time = '';

	$: buttonDisabled =
		patient.length < 3 ||
		surgeryName.length === 0 ||
		surgeon.length === 0 ||
		date.length === 0 ||
		time.length === 0;

	onMount(() => {
		pb.collection('doctors')
			.getFullList<DoctorRecord>()
			.then((records) => {
				surgeons = records.map((rec) => {
					return {
						name: rec.name,
						id: rec.id,
						email: rec.email
					};
				});
			})
			.catch((err) => console.log(err));
	});

	async function handleSubmit() {
		try {
			const estimatedDate = pbDateString(new Date(`${date} ${time}`));
			const surgeonObj: { name: string; id: string; email: string } = JSON.parse(surgeon);
			const createdSurgery = await pb.collection('surgeries').create<SurgeryRecord>(
				{
					patient,
					surgeryName,
					surgeon: surgeonObj.id,
					estimatedDate,
					currentStep: CurrentStep.DocsEnviadosHJS
				},
				{ expand: 'surgeon' }
			);
			const stepCreated = await pb.collection('stepHistory').create<StepHistoryRecord>({
				user: pb.authStore.model?.id,
				surgery: createdSurgery.id,
				step: CurrentStep.Criacao
			});
			sendSurgeryUpdateMail(createdSurgery, pb.authStore.model?.name);
			goto('/home');
		} catch (err) {
			console.error(err);
		}
	}
</script>

<main class="h-screen bg-login flex flex-col justify-center items-center">
	<a href="/home" class="absolute top-20 left-20 bg-black bg-opacity-90 btn btn-circle p-2">
		<MdArrowBack />
	</a>
	<form class="form-control bg-white rounded-xl p-10 gap-y-3" on:submit={handleSubmit}>
		<h1 class="text-xl font-semibold text-neutral-600 mb-1">Criar nova cirurgia solicitada</h1>
		<div>
			<Label name="patient" title="Paciente" />
			<input
				bind:value={patient}
				placeholder="Digite o nome do paciente"
				type="text"
				class="input w-full text-sm font-semibold input-bordered"
			/>
		</div>
		<div>
			<Label name="surgeryName" title="Procedimento" />
			<select class="select w-full input-bordered" bind:value={surgeryName} name="surgeryName">
				<option value="" selected>Selecione um procedimento</option>
				{#each surgeryNames as name}
					<option value={name}>{name}</option>
				{/each}
			</select>
		</div>
		<div>
			<Label name="surgeon" title="Cirurgião" />
			<select
				class="select w-full input-bordered"
				bind:value={surgeon}
				placeholder="Selecione um cirurgião"
				name="surgeon"
			>
				<option value="" selected>Selecione um cirurgião</option>
				{#each surgeons as eachSurgeon}
					<option value={JSON.stringify(eachSurgeon)}>{eachSurgeon.name}</option>
				{/each}
			</select>
		</div>
		<div>
			<Label name="date" title="Data" />
			<input
				class="input w-full input-bordered font-semibold text-sm"
				bind:value={date}
				type="date"
				name="date"
			/>
		</div>
		<div>
			<Label name="time" title="Horário" />
			<input
				class="input w-full input-bordered font-semibold text-sm"
				bind:value={time}
				name="time"
				type="time"
			/>
		</div>
		<button disabled={buttonDisabled} class="btn mt-3 btn-success" type="submit">Criar</button>
	</form>
</main>
