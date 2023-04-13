<script lang="ts">
	import FaSpinner from 'svelte-icons/fa/FaSpinner.svelte';
	import { surgeryNames } from '$lib/selectChoices';
	import Label from '../../components/Label.svelte';
	import type { PageData } from './$types';
	import BackToHome from '../../components/BackToHome.svelte';
	import { goto } from '$app/navigation';
	import type { NextSurgeryRequestBody } from './+server';

	export let data: PageData;
	let patient = '';
	let surgeryName = '';
	let surgeon = '';
	let loading = false;
	let yesBox = false;
	let noBox = false;

	$: buttonDisabled =
		patient.length < 3 || surgeryName.length === 0 || surgeon.length === 0 || (!yesBox && !noBox);

	async function handleSubmit() {
		loading = true;

		const body: NextSurgeryRequestBody = {
			patient,
			surgeryName,
			surgeon,
			specialMaterials: yesBox
		};

		const response = await (
			await fetch('/nova-cirurgia', {
				method: 'POST',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify(body)
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
		<p>{yesBox}</p>
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
			<Label name="" title="Necessita materiais especiais" />
			<div class="flex mt-1">
				<div class="flex gap-1">
					<label class="label-text" for="sim">Sim</label>
					<input
						class="checkbox checkbox-primary checkbox-sm"
						on:click={() => {
							noBox = false;
							yesBox = !yesBox;
						}}
						checked={yesBox}
						type="checkbox"
						name="sim"
					/>
				</div>
				<div class="flex gap-1">
					<label class="label-text ml-2" for="nao">Não</label>
					<input
						class="checkbox checkbox-primary checkbox-sm"
						on:click={() => {
							yesBox = false;
							noBox = !noBox;
						}}
						checked={noBox}
						type="checkbox"
						name="nao"
					/>
				</div>
			</div>
		</div>
		<button disabled={buttonDisabled || loading} class="btn mt-3 btn-success" type="submit"
			>Criar</button
		>
	</form>
</main>
