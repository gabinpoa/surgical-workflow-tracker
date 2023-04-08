<script lang="ts">
	import type { SurgeryRecord } from '$lib/pb';
	import { CurrentStep } from '$lib/selectChoices';
	import SurgeryInHome from '../components/SurgeryInHome.svelte';
	import type { PageServerData } from './$types';
	export let data: PageServerData;

	let surgeries = data.surgeries.filter((el) => el.currentStep !== CurrentStep.Concluido);
	let filter = 'ongoing';
</script>

<div class="flex items-center flex-col min-h-screen bg-pattern bg-fixed bg-contain">
	<div class="h-52 flex flex-col justify-center">
		<div class="bg-black text-white text-2xl bg-opacity-80 font-semibold p-3 rounded-xl">
			<h1>Bem-vindo(a),</h1>
			<h1>{data.user.profile === 'doctors' ? 'Dr. ' + data.user.name : data.user.name}</h1>
		</div>
	</div>
	<main
		class="flex flex-col items-center flex-1 rounded-t-xl bg-white p-6 pt-12 w-1/2 gap-y-8 max-w-4xl"
	>
		<a href="/nova-cirurgia" class="btn capitalize">Criar novo procedimento</a>
		<div class="btn-group">
			<button
				on:click={() => {
					filter = 'ongoing';
					surgeries = data.surgeries.filter((el) => el.currentStep !== CurrentStep.Concluido);
				}}
				style="background-color: {filter === 'ongoing'
					? 'rgb(29, 78, 216)'
					: 'rgb(115, 115, 115)'};"
				class="btn btn-sm border-0 capitalize w-[17ch]">Em andamento</button
			>
			<button
				on:click={() => {
					filter = 'all';
					surgeries = data.surgeries;
				}}
				style="background-color: {filter === 'all' ? 'rgb(29, 78, 216)' : 'rgb(145, 145, 145)'};"
				class="btn btn-sm border-0 capitalize w-[17ch]">Todas</button
			>
			<button
				on:click={() => {
					filter = 'finished';
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
					profile={data.user.profile}
					updateSurgeries={(response) => {
						surgeries = response;
					}}
					surgery={surgeryItem}
				/>
			{/each}
		</div>
	</main>
</div>
