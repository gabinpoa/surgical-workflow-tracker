<script lang="ts">
	import Label from './Label.svelte';

	export let inputValue: string;
	export let name: string;
	export let label: string;
	export let placeholder: string;
</script>

<Label {name} title={label} />
<input
	{placeholder}
	class="block mt-1 placeholder:text-sm placeholder:font-semibold px-2 h-10 w-full border rounded-md"
	bind:value={inputValue}
	{name}
	type="text"
/>
