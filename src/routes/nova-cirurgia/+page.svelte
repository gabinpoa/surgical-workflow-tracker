<script lang="ts">
	import FaSpinner from 'svelte-icons/fa/FaSpinner.svelte';
	import { surgeryNames } from '$lib/selectChoices';
	import Label from '../../components/Label.svelte';
	import type { PageData } from './$types';
	import BackToHome from '../../components/BackToHome.svelte';
	import { goto } from '$app/navigation';

	export let data: PageData;
	let patient = '';
	let surgeryName = '';
	let surgeon = '';
	let date = '';
	let time = '';
	let loading = false;

	$: buttonDisabled =
		patient.length < 3 ||
		surgeryName.length === 0 ||
		surgeon.length === 0 ||
		date.length === 0 ||
		time.length === 0;

	async function handleSubmit() {
		loading = true;

		const response = await (
			await fetch('/nova-cirurgia', {
				method: 'POST',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify({ patient, surgeryName, surgeon, date, time })
			})
		).json();

		if (response.success === true) {
			goto('/');
		}
	}
</script>

{#if loading}
	<div
		class="absolute flex items-center justify-center top-0 bottom-0 right-0 left-0 bg-white bg-opacity-60"
	>
		<div class="animate-spin w-20">
			<FaSpinner />
		</div>
	</div>
{/if}
<main class="h-screen bg-pattern flex flex-col justify-center items-center bg-contain bg-fixed">
	<BackToHome />
	<form on:submit={handleSubmit} class="form-control bg-white rounded-xl p-10 gap-y-3">
		<h1 class="text-xl font-semibold text-neutral-600 mb-1">Criar novo procedimento</h1>
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
		<button disabled={buttonDisabled || loading} class="btn mt-3 btn-success" type="submit"
			>Criar</button
		>
	</form>
</main>
