<script lang="ts">
	import TextInput from '../../../components/TextInput.svelte';
	import IoMdEye from 'svelte-icons/io/IoMdEye.svelte';
	import IoMdEyeOff from 'svelte-icons/io/IoMdEyeOff.svelte';
	import type { ActionData } from './$types';
	let emailOrUsername = '';
	let password = '';
	let passwordVisible = false;

	export let form: ActionData;
</script>

<div class="min-h-screen flex justify-center items-center bg-pattern bg-contain bg-fixed">
	<main class="bg-white rounded-xl">
		<div class="p-4 pt-6 overflow-hidden grid gap-4 lg:w-96 lg:gap-6">
			<h1 class="font-crimsontext text-lg lg:mb-2">ORBITS</h1>
			<h1 class="text-2xl font-semibold text-neutral-800">Login</h1>
			<form method="POST" class="flex-col flex gap-y-3">
				<TextInput
					placeholder="Digite seu email ou usuário"
					bind:inputValue={emailOrUsername}
					label="Email ou usuário"
					name="email"
				/>
				<label class="font-semibold text-sm text-neutral-600">
					Senha
					<div class="border h-10 mt-1 flex rounded-md overflow-hidden pr-2">
						{#if passwordVisible}
							<input
								placeholder="Digite sua senha"
								class="block flex-1 rounded-md pl-2"
								type="text"
								bind:value={password}
								name="password"
							/>
						{:else}
							<input
								placeholder="Digite sua senha"
								class="block flex-1 placeholder:text-sm placeholder:font-semibold pl-2 rounded-md"
								type="password"
								bind:value={password}
								name="password"
							/>
						{/if}
						<button
							type="button"
							on:click={() => {
								passwordVisible = !passwordVisible;
							}}
							class="h-full text-neutral-600 py-1 w-auto"
						>
							{#if passwordVisible}
								<IoMdEyeOff />
							{:else}
								<IoMdEye />
							{/if}</button
						>
					</div>
				</label>
				{#if form?.message}
					<p class="text-red-600 text-sm">{form.message}</p>
				{/if}
				<button
					disabled={password.length <= 4 && emailOrUsername.length <= 3}
					class="bg-blue-700 h-10 disabled:bg-slate-400 rounded-md text-white mt-3 text-sm font-semibold"
					type="submit">Entrar</button
				>
			</form>
		</div>
	</main>
</div>
