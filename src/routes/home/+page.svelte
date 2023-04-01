<script lang="ts">
	import { pb, SurgeryRecord } from '$lib/pb';
	import { onMount } from 'svelte';
	import SurgeryInHome from '../../components/SurgeryInHome.svelte';
	let userName = '';
	let surgeries: SurgeryRecord[] = [];

	onMount(async () => {
		if (!pb.authStore.isValid) {
			pb.authStore.loadFromLocalStorage();
		}
		userName = pb.authStore.model?.name;
		try {
			surgeries = await pb.collection('surgeries').getFullList<SurgeryRecord>({
				filter: `"${pb.authStore.model?.visibleSteps}" ~ currentStep`
			});
		} catch (err) {
			console.error(err);
		}
	});
</script>

<div class="flex items-center flex-col h-full bg-login">
	<div class="h-1/3 flex flex-col justify-center">
		<div class="bg-black text-white text-2xl bg-opacity-70 font-semibold p-2 rounded-xl">
			<h1>Bem-vindo(a),</h1>
			<h1>{userName}</h1>
		</div>
	</div>
	<main class="flex h-full flex-col items-center rounded-t-xl bg-white">
		<a href="/nova-cirurgia" class="btn capitalize">Criar cirurgia</a>
		{#each surgeries as surgeryItem}
			<SurgeryInHome
				refreshSurgeries={async () => {
					surgeries = await pb.collection('surgeries').getFullList({
						filter: `"${pb.authStore.model?.visibleSteps}" ~ currentStep`
					});
				}}
				surgery={surgeryItem}
			/>
		{/each}
	</main>
</div>
