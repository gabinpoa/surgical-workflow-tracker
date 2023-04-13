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
	let dataSurgeries = data.surgeries;
	let filter: Filter = Filter.OnGoing;
</script>

<a href="/login" class="absolute top-20 right-20 bg-black bg-opacity-90 btn btn-circle p-2">
	<IoIosLogOut />
</a>
<div class="flex items-center flex-col min-h-screen bg-pattern bg-fixed bg-contain">
	<div class="h-44 flex items-center relative">
		<div class="bg-black text-white text-2xl bg-opacity-80 font-semibold p-3 rounded-xl">
			<h1>Bem-vindo(a),</h1>
			<h1>{data.user.profile === Profile.Medico ? 'Dr. ' + data.user.name : data.user.name}</h1>
		</div>
	</div>
	<main
		class="flex flex-col items-center flex-1 rounded-t-xl bg-white p-6 pt-10 w-1/2 gap-y-8 max-w-4xl"
	>
		<div class="flex justify-center gap-x-4 items-center">
			<a href="/nova-cirurgia" class="btn capitalize">Criar novo procedimento</a>
			<a
				target="_blank"
				class="btn btn-outline btn-primary bg-transparent capitalize"
				href="https://agendamentohsj.secure.simplybook.me/v2/">Agendar cirurgia</a
			>
		</div>
		<div class="btn-group">
			<button
				on:click={() => {
					filter = Filter.OnGoing;
				}}
				style="background-color: {filter === Filter.OnGoing
					? 'rgb(29, 78, 216)'
					: 'rgb(145, 145, 145)'};"
				class="btn btn-sm border-0 capitalize w-[17ch]">Em andamento</button
			>
			<button
				on:click={() => {
					filter = Filter.All;
				}}
				style="background-color: {filter === Filter.All
					? 'rgb(29, 78, 216)'
					: 'rgb(145, 145, 145)'};"
				class="btn btn-sm border-0 capitalize w-[17ch]">Todas</button
			>
			<button
				on:click={() => {
					filter = Filter.Finished;
				}}
				style="background-color: {filter === Filter.Finished
					? 'rgb(29, 78, 216)'
					: 'rgb(145, 145, 145)'};"
				class="btn btn-sm border-0 capitalize w-[17ch]">Concluídas</button
			>
		</div>
		<div class="w-full space-y-3">
			{#each dataSurgeries.filter((e) => {
				if (filter === Filter.OnGoing) {
					return e.currentStep !== CurrentStep.Concluido && e.currentStep !== CurrentStep.Suspensa;
				} else if (filter === Filter.Finished) {
					return e.currentStep === CurrentStep.Concluido || e.currentStep === CurrentStep.Suspensa;
				} else {
					return true;
				}
			}) as surgeryItem}
				<SurgeryInHome
					profile={data.user.profile}
					{filter}
					updateSurgeries={(response) => {
						dataSurgeries = response;
					}}
					surgery={surgeryItem}
				/>
			{/each}
		</div>
	</main>
</div>
