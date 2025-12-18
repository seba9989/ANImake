<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/Navbar/Navbar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<svelte:boundary>
	<div class="flex">
		<Navbar />
		<div class="p-4 w-full">
			{@render children()}
		</div>
	</div>

	{#snippet pending()}
		<p>loading...</p>
	{/snippet}
</svelte:boundary>
