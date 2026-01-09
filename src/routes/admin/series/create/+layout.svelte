<script lang="ts">
	import { Check } from 'lucide-svelte';
	import type { LayoutProps } from './$types';
	import { cn } from '$lib/utils/cn';
	import { page } from '$app/state';

	let { data, children }: LayoutProps = $props();

	const sides: { url: string; label: string }[] = [
		{
			url: 'series',
			label: 'Seria'
		},
		{
			url: 'categories',
			label: 'Kategorie'
		},
		{
			url: 'relations',
			label: 'Relacje'
		},
		{
			url: 'episodes',
			label: 'Odcinki'
		}
	];

	let activePage = sides.findIndex(({ url }) => url === page.url.pathname.split('/').at(-1));
</script>

<div class="max-w-2xl space-y-2">
	<ul class="steps w-full">
		{#each sides as { label }, i}
			<li class={cn('step', { 'step-primary': activePage >= i })}>{label}</li>
		{/each}
	</ul>
	{@render children()}
</div>
