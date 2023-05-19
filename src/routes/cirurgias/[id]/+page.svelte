<script lang="ts">
	import { steps } from '$lib/selectChoices';
	import BackToHome from '../../../components/BackToHome.svelte';
	import StepHistory from '../../../components/StepHistory.svelte';
	import { pbStringDateToDate } from '../../../lib/utils/pb.utils';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	let surgery = data.surgery;
	const stepHistories = data.stepHistories;
</script>

{#if surgery}
	<div class="flex items-center flex-col min-h-screen bg-pattern bg-contain bg-fixed pt-9 pb-6">
		<BackToHome />
		<main
			class="flex flex-col items-center flex-1 rounded-xl bg-white sm:p-6 p-2 pt-9 gap-y-8 max-w-4xl"
		>
			<div class="w-full space-y-6">
				<div class="flex justify-center gap-2 md:gap-4 items-center flex-wrap">
					<a href="/nova-cirurgia" class="btn capitalize">Criar novo registro</a>
					<a
						target="_blank"
						class="btn btn-outline btn-primary bg-transparent capitalize"
						href="https://agendamentohsj.secure.simplybook.me/v2/">Agendar cirurgia</a
					>
				</div>
				<div class="card card-bordered card-compact sm:card-normal shadow mb-10">
					<div class="card-body">
						<div class="flex items-center gap-x-6 flex-wrap">
							<h3 class="card-title capitalize">{surgery.surgeryName}</h3>
							<div class="tooltip tooltip-bottom" data-tip="Progresso">
								<progress
									class="progress w-52 progress-info"
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
