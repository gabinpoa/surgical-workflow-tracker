<script lang="ts">
	import FaSpinner from 'svelte-icons/fa/FaSpinner.svelte';
	import { surgeryNames } from '$lib/selectChoices';
	import Label from '../../components/Label.svelte';
	import type { PageData } from './$types';
	import BackToHome from '../../components/BackToHome.svelte';
	import { goto } from '$app/navigation';
	import type { NewSurgeryRequestBody } from './+server';
	import { fileToBase64, multipleFilesToBase64 } from '$lib/utils';

	export let data: PageData;
	let patient = '';
	let surgeryName = '';
	let surgeon = '';
	let loading = false;
	let yesBox = false;
	let noBox = false;
	let files: FileList | undefined;

	$: filesArray = files ? Array.from(files?.length > 0 ? files : []) : [];
	$: filesSize = filesArray.reduce((acc, file) => {
		return acc + file.size;
	}, 0);

	$: buttonDisabled =
		patient.length < 3 ||
		surgeryName.length === 0 ||
		surgeon.length === 0 ||
		(!yesBox && !noBox) ||
		filesSize > 1000 * 1000 * 10;

	async function handleSubmit() {
		loading = true;

		if (files) {
			const body: NewSurgeryRequestBody = {
				patient,
				surgeryName,
				surgeon,
				specialMaterials: yesBox,
				files: await multipleFilesToBase64(files)
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
	}
</script>

{#if loading}
	<div
		class="absolute z-10 flex items-center justify-center top-0 bottom-0 right-0 left-0 bg-white bg-opacity-60"
	>
		<div class="animate-spin w-20">
			<FaSpinner />
		</div>
	</div>
{/if}
<main
	class="min-h-screen py-8 pt-16 bg-pattern flex flex-col justify-center items-center bg-contain bg-fixed"
>
	<BackToHome />
	<form on:submit={handleSubmit} class="form-control bg-white rounded-xl p-4 gap-y-3">
		<h1 class="text-xl font-semibold text-neutral-600 mb-1 whitespace-break-spaces">
			Criar novo procedimento
		</h1>
		<div>
			<Label name="patient" title="Paciente" />
			<input
				autocapitalize="sentences"
				name="patient"
				bind:value={patient}
				placeholder="Digite o nome do paciente"
				type="text"
				class="input input-sm sm:input-md w-full text-sm placeholder:[text-transform:none;] capitalize font-semibold input-bordered"
			/>
		</div>
		<div>
			<Label name="surgeryName" title="Procedimento" />
			<select
				class="select w-full select-sm sm:select-md input-bordered"
				bind:value={surgeryName}
				name="surgeryName"
			>
				<option value="" selected>Selecione um procedimento</option>
				{#each surgeryNames as name}
					<option class="capitalize" value={name}>{name}</option>
				{/each}
			</select>
		</div>
		<div>
			<Label name="surgeon" title="Cirurgião" />
			<select
				class="select select-sm w-full sm:select-md input-bordered"
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
		<div>
			<Label name="file" title="Arquivos destinados à secretária" />
			<label
				class="input {filesArray.length > 0
					? 'bg-green-300'
					: 'bg-blue-200'} input-sm flex sm:input-md items-center font-semibold input-bordered cursor-pointer"
				for="file"
				>{filesArray.length > 0
					? 'Arquivos selecionados. Clique aqui para alterar'
					: 'Selecione os arquivos'}
			</label>
			<input type="file" name="file" id="file" multiple bind:files class="custom-file-input" />
			{#each filesArray as file}
				<p class="max-w-[50ch]">{file.name}</p>
			{/each}
			{#if filesSize > 1000 * 1000 * 10}
				<p class="text-red-600">
					Tamanho máximo: 10MB - Tamanho atual: {Number(filesSize / 1000 / 1000).toFixed(1)}MB
				</p>
			{/if}
		</div>
		<button disabled={buttonDisabled || loading} class="btn mt-3 btn-success" type="submit"
			>Criar</button
		>
	</form>
</main>

<style>
	.custom-file-input {
		opacity: 0;
		width: 0.1px;
		height: 0.1px;
		position: absolute;
	}
</style>
