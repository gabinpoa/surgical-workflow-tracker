<script lang="ts">
	import { pb, SurgeryRecord } from '$lib/pb';
	import { onMount } from 'svelte';
	import SurgeryInHome from '../../components/SurgeryInHome.svelte';
	let userName = '';
	let surgeries: SurgeryRecord[] = [];

	async function getSurgeries() {
		surgeries = await pb.collection('surgeries').getFullList<SurgeryRecord>({
			filter: `"${pb.authStore.model?.visibleSteps}" ~ currentStep`,
			expand: 'surgeon'
		});
	}

	onMount(async () => {
		if (!pb.authStore.isValid) {
			pb.authStore.loadFromLocalStorage();
		}
		await pb.collection('users').authRefresh();
		userName = pb.authStore.model?.name;
		try {
			await getSurgeries();
		} catch (err) {
			console.error(err);
		}
	});
</script>

<div class="flex items-center flex-col min-h-screen bg-login">
	<div class="h-52 flex flex-col justify-center">
		<div class="bg-black text-white text-2xl bg-opacity-80 font-semibold p-3 rounded-xl">
			<h1>Bem-vindo(a),</h1>
			<h1>{userName}</h1>
		</div>
	</div>
	<main
		class="flex flex-col items-center flex-1 rounded-t-xl bg-white p-6 pt-12 w-1/2 gap-y-8 max-w-4xl"
	>
		<a href="/nova-cirurgia" class="btn capitalize">Criar cirurgia</a>
		<h2 class="text-xl">
			{surgeries.length > 0 ? 'Operações pendentes' : 'Nenhuma operação pendente'}
		</h2>
		<div class="w-full">
			{#each surgeries as surgeryItem}
				<SurgeryInHome refreshSurgeries={getSurgeries} surgery={surgeryItem} />
			{/each}
		</div>
	</main>
</div>
