<script lang="ts">
	import { page } from '$app/stores';
	import { pb, StepHistoryWithUserRecord, SurgeryWithHistoryRecord } from '$lib/pb';
	import { steps } from '$lib/selectChoices';
	import { onMount } from 'svelte';
	import StepHistory from '../../../components/StepHistory.svelte';
	import { pbStringDateToDate } from '../../../utils/pb.utils';

	const {
		url: { pathname }
	} = $page;
	const id = pathname.slice(1).split('/')[1];

	let surgery: undefined | SurgeryWithHistoryRecord;
	let stepHistories: undefined | StepHistoryWithUserRecord[];

	onMount(async () => {
		if (!pb.authStore.isValid) {
			pb.authStore.loadFromLocalStorage();
		}
		try {
			surgery = await pb.collection('surgeries').getOne(id, {
				expand: 'stepHistory(surgery).user,surgeon'
			});
			stepHistories = surgery?.expand['stepHistory(surgery)'].reverse();
		} catch (err) {
			console.error(err);
		}
	});
</script>

{#if surgery}
	<div class="flex items-center flex-col min-h-screen bg-login">
		<div class="h-52 flex flex-col justify-center">
			<div class="bg-black text-white text-2xl bg-opacity-80 font-semibold p-3 rounded-xl">
				{#if pb.authStore.model}
					<h1>Bem-vindo(a),</h1>
					<h1>{pb.authStore.model.name}</h1>
				{:else}
					<h1>Bem vindo, Doutor</h1>
				{/if}
			</div>
		</div>
		<main
			class="flex flex-col items-center flex-1 rounded-t-xl bg-white p-6 pt-12 w-1/2 gap-y-8 max-w-4xl"
		>
			<div class="w-full space-y-6">
				<div class="card card-bordered shadow mb-10">
					<div class="card-body">
						<div class="flex items-center gap-x-6">
							<h3 class="card-title">{surgery.surgeryName}</h3>
							<div class="tooltip tooltip-bottom" data-tip="Progresso">
								<progress
									class="progress w-52"
									max="100"
									value={100 /
										((steps.length - 2) / steps.findIndex((el) => el === surgery?.currentStep))}
								/>
							</div>
						</div>

						<p class="font-light">
							Etapa em andamento: <span class="font-normal">{surgery.currentStep}</span>
						</p>
						<p class="font-light">
							Cirurgião: <span class="font-normal">{surgery.expand.surgeon.name}</span>
						</p>
						<p class="font-light">Paciente: <span class="font-normal">{surgery.patient}</span></p>
						<p class="font-light">
							Data estimada: <span class="font-normal"
								>{pbStringDateToDate(surgery.estimatedDate).toLocaleString()}</span
							>
						</p>
					</div>
				</div>
				{#if stepHistories}
					<h2 class="text-center text-xl">Histórico</h2>
					<div class="space-y-3">
						{#each stepHistories as stepHistoryItem}
							<StepHistory step={stepHistoryItem} />
						{/each}
					</div>
				{/if}
			</div>
		</main>
	</div>
{:else}
	<div class="h-screen bg-base-200 text-3xl font-semibold">Erro: Cirurgia não encontrada</div>
{/if}
