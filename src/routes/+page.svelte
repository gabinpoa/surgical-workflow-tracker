<script lang="ts">
	import { goto } from '$app/navigation';
	import { pb } from '$lib/pb';
	import { onMount } from 'svelte';

	onMount(async () => {
		pb.authStore.loadFromLocalStorage();
		if (pb.authStore.isValid) {
			goto('/home');
		} else {
			goto('/login');
		}
	});
</script>

<h1>carregando</h1>
