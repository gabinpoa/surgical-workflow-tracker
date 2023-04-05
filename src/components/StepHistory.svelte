<script lang="ts">
	import type { StepHistoryWithUserRecord } from '$lib/pb';
	import { CurrentStep } from '$lib/selectChoices';
	import { pbStringDateToDate } from '../lib/utils/pb.utils';

	export let step: StepHistoryWithUserRecord;
</script>

<div class="card card-compact bg-base-200">
	<div class="card-body">
		<p class="text-base">
			Etapa atendida: <span class="font-semibold">{step.step}</span>
		</p>
		<p class="font-light">Usuário: <span class="font-normal">{step.expand.user.name}</span></p>
		<p class="font-light">
			Data de conclusão: <span class="font-normal">
				{pbStringDateToDate(step.created).toLocaleString()}
			</span>
		</p>
		{#if step.informedDate}
			<p class="font-light">
				Data informada: <span class="font-normal">
					{pbStringDateToDate(step.informedDate).toLocaleString('pt-BR', { hour12: false })}
				</span>
			</p>
		{/if}
		{#if step.responseStatus}
			<p class="font-light">
				{step.step === CurrentStep.RespostaJustificativas
					? 'Resposta após justificativa: '
					: 'Resposta do convênio'}<span class="font-normal">{step.responseStatus}</span>
			</p>
		{/if}
	</div>
</div>
