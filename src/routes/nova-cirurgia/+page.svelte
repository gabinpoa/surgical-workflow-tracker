<script lang="ts">
	import { goto } from '$app/navigation';
	import { pb } from '$lib/pb';
	import { CurrentStep, surgeonNames, surgeryNames } from '$lib/selectChoices';
	import { pbDateString } from '../../utils/pb.utils';
	let patient = '';
	let surgeryName = '';
	let surgeon = '';
	let date = '';
	let time = '';

	async function handleSubmit() {
		try {
			const estimatedDate = pbDateString(new Date(`${date} ${time}`));

			const { id } = await pb.collection('surgeries').create({
				patient,
				surgeryName,
				surgeon,
				estimatedDate,
				currentStep: CurrentStep.DocsEnviadosHJS
			});
			await pb.collection('stepHistory').create({
				user: pb.authStore.model?.id,
				surgery: id,
				step: CurrentStep.Criacao
			});
			goto('/home');
		} catch (err) {
			console.error(err);
		}
	}
</script>

<main>
	<form on:submit={handleSubmit}>
		<label>
			Paciente
			<input bind:value={patient} name="patient" type="text" />
		</label>
		<label>
			Cirurgia
			<select bind:value={surgeryName} placeholder="Selecione uma cirurgia" name="surgeryName">
				{#each surgeryNames as name}
					<option value={name}>{name}</option>
				{/each}
			</select>
		</label>
		<label>
			Cirurgião
			<select bind:value={surgeon} placeholder="Selecione um cirurgião" name="surgeon">
				{#each surgeonNames as name}
					<option value={name}>{name}</option>
				{/each}
			</select>
		</label>
		<label>Data<input bind:value={date} type="date" name="date" /></label>
		<label>
			Horário
			<input bind:value={time} name="time" type="time" />
		</label>
		<button type="submit">Criar</button>
	</form>
</main>
