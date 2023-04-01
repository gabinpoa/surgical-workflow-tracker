<script lang="ts">
	export let inputValue: string;
	export let name: string;
	export let label: string;
	export let placeholder: string;
</script>

<label class="text-sm font-semibold text-neutral-600">
	{label}
	<input
		{placeholder}
		class="block mt-1 placeholder:text-sm placeholder:font-semibold px-2 h-10 w-full border rounded-md"
		bind:value={inputValue}
		{name}
		type="text"
	/>
</label>
