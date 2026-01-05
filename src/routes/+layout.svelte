<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/Navbar/Navbar.svelte';
	import { LoaderCircle } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<svelte:boundary>
	<div class="grid max-w-svw grid-cols-[auto_1fr]">
		<Navbar />

		<div class="min-w-0">
			{@render children()}
		</div>
	</div>

	{#snippet pending()}
		<div class="h-svh w-svw flex bg-base-300" out:fade>
			<LoaderCircle class="m-auto animate-spin duration-1200" size="48" />
		</div>
	{/snippet}
</svelte:boundary>
