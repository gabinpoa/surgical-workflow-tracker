<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { Profile } from '$lib/pb';
	import { CurrentStep } from '$lib/selectChoices';
	import { Filter } from '$lib/utils';
	import SurgeryInHome from '../components/SurgeryInHome.svelte';
	import type { PageServerData } from './$types';
	export let data: PageServerData;
	import IoIosLogOut from 'svelte-icons/io/IoIosLogOut.svelte';

	let surgeries = data.surgeries.filter((el) => el.currentStep !== CurrentStep.Concluido);
	let filter: Filter = Filter.OnGoing;
</script>

<a href="/login" class="absolute top-20 right-20 bg-black bg-opacity-90 btn btn-circle p-2">
	<IoIosLogOut />
</a>
<div class="flex items-center flex-col min-h-screen bg-pattern bg-fixed bg-contain">
	<div class="h-52 flex flex-col justify-center">
		<div class="bg-black text-white text-2xl bg-opacity-80 font-semibold p-3 rounded-xl">
			<h1>Bem-vindo(a),</h1>
			<h1>{data.user.profile === Profile.Medico ? 'Dr. ' + data.user.name : data.user.name}</h1>
		</div>
	</div>
	<main
		class="flex flex-col items-center flex-1 rounded-t-xl bg-white p-6 pt-12 w-1/2 gap-y-8 max-w-4xl"
	>
		<a href="/nova-cirurgia" class="btn capitalize">Criar novo procedimento</a>
		<div class="btn-group">
			<button
				on:click={() => {
					filter = Filter.OnGoing;
					surgeries = data.surgeries.filter((el) => el.currentStep !== CurrentStep.Concluido);
				}}
				style="background-color: {filter === 'ongoing'
					? 'rgb(29, 78, 216)'
					: 'rgb(145, 145, 145)'};"
				class="btn btn-sm border-0 capitalize w-[17ch]">Em andamento</button
			>
			<button
				on:click={() => {
					filter = Filter.All;
					surgeries = data.surgeries;
				}}
				style="background-color: {filter === 'all' ? 'rgb(29, 78, 216)' : 'rgb(145, 145, 145)'};"
				class="btn btn-sm border-0 capitalize w-[17ch]">Todas</button
			>
			<button
				on:click={() => {
					filter = Filter.Finished;
					surgeries = data.surgeries.filter((el) => el.currentStep === CurrentStep.Concluido);
				}}
				style="background-color: {filter === 'finished'
					? 'rgb(29, 78, 216)'
					: 'rgb(145, 145, 145)'};"
				class="btn btn-sm border-0 capitalize w-[17ch]">Concluídas</button
			>
		</div>
		<div class="w-full space-y-3">
			{#each surgeries as surgeryItem}
				<SurgeryInHome
					{filter}
					updateSurgeries={(response) => {
						surgeries = response;
					}}
					surgery={surgeryItem}
				/>
			{/each}
		</div>
	</main>
</div>
