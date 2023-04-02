<script lang="ts">
	import { goto } from '$app/navigation';
	import { pb, UserRecord } from '$lib/pb';
	import TextInput from '../../components/TextInput.svelte';
	import IoMdEye from 'svelte-icons/io/IoMdEye.svelte';
	import IoMdEyeOff from 'svelte-icons/io/IoMdEyeOff.svelte';

	let emailOrUsername = '';
	let password = '';
	let passwordVisible = false;
	let error = false;

	async function handleSubmit(e: SubmitEvent) {
		try {
			const { token, record } = await pb
				.collection('users')
				.authWithPassword<UserRecord>(emailOrUsername, password);
			pb.authStore.save(token, record);
			goto('/home');
		} catch (e) {
			error = true;
		}
	}
</script>

<div class="min-h-screen flex justify-center items-center bg-login">
	<main class="bg-white rounded-xl">
		<div class="p-4 pt-6 overflow-hidden grid gap-4 lg:w-96 lg:gap-6">
			<h1 class="font-crimsontext text-xl lg:mb-2">Orbit</h1>
			<h1 class="text-2xl font-semibold text-neutral-800">Login</h1>
			<form class="flex-col flex gap-y-3" on:submit={handleSubmit}>
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
				{#if error}
					<p class="text-red-600 text-sm">Credenciais incorretas</p>
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
