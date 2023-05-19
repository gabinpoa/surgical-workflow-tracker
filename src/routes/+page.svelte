<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { Profile } from '$lib/pb';
	import { CurrentStep } from '$lib/selectChoices';
	import { Filter } from '$lib/utils';
	import MainButtons from '../components/MainButtons.svelte';
	import SurgeryInHome from '../components/SurgeryInHome.svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
	import IoIosLogOut from 'svelte-icons/io/IoIosLogOut.svelte';
	let dataSurgeries = data.surgeries;
	let filter: Filter = Filter.OnGoing;
</script>

<a
	href="/login"
	class="absolute hidden sm:[display:unset;] top-20 right-20 bg-black bg-opacity-90 btn btn-circle p-2"
>
	<IoIosLogOut />
</a>
<div class="flex items-center flex-col min-h-screen bg-pattern bg-fixed bg-contain">
	<div class="h-44 flex items-center">
		<div class="bg-black text-white relative text-2xl bg-opacity-80 font-semibold p-3 rounded-xl">
			<h1>Bem-vindo(a),</h1>
			<h1>{data.user.profile === Profile.Medico ? 'Dr. ' + data.user.name : data.user.name}</h1>
			<a
				href="/login"
				class="absolute sm:hidden -top-4 -right-4 bg-black bg-opacity-90 btn btn-circle p-2"
			>
				<IoIosLogOut />
			</a>
		</div>
	</div>
	<main
		class="flex flex-col items-center flex-1 rounded-t-xl bg-white pb-14 sm:pb-4 sm:p-4 pt-10 gap-y-8"
	>
		<MainButtons />
		<div class="flex justify-center lg:btn-group flex-wrap gap-2 lg:gap-0">
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
