<script lang="ts">
	import { surgeryNames } from '$lib/selectChoices';
	import Label from '../../components/Label.svelte';
	import type { PageData } from './$types';
	import BackToHome from '../../components/BackToHome.svelte';

	export let data: PageData;
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
</script>

<main class="h-screen bg-pattern flex flex-col justify-center items-center bg-contain bg-fixed">
	<BackToHome />
	<form method="POST" class="form-control bg-white rounded-xl p-10 gap-y-3">
		<h1 class="text-xl font-semibold text-neutral-600 mb-1">Criar nova cirurgia solicitada</h1>
		<div>
			<Label name="patient" title="Paciente" />
			<input
				name="patient"
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
					<option class="capitalize" value={name}>{name}</option>
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
				{#each data.doctors as eachSurgeon}
					<option value={JSON.stringify(eachSurgeon)}>Dr. {eachSurgeon.name}</option>
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
