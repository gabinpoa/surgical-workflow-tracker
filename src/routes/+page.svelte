<script lang="ts">
	import SurgeryInHome from '../components/SurgeryInHome.svelte';
	import type { PageServerData } from './$types';
	export let data: PageServerData;
	let surgeries = data.surgeries;
</script>

<div class="flex items-center flex-col min-h-screen bg-pattern bg-contain">
	<div class="h-52 flex flex-col justify-center">
		<div class="bg-black text-white text-2xl bg-opacity-80 font-semibold p-3 rounded-xl">
			<h1>Bem-vindo(a),</h1>
			<h1>{data.user.profile === 'doctors' ? 'Dr. ' + data.user.name : data.user.name}</h1>
		</div>
	</div>
	<main
		class="flex flex-col items-center flex-1 rounded-t-xl bg-white p-6 pt-12 w-1/2 gap-y-8 max-w-4xl"
	>
		<a href="/nova-cirurgia" class="btn capitalize">Criar nova operação</a>
		<h2 class="text-xl">
			{surgeries.length > 0 ? 'Operações em andamento' : 'Nenhuma operação em andamento'}
		</h2>
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
