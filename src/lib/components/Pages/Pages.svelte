<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { MetaData } from '$lib/utils/dbParse';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';

	type Props = {
		metadata: MetaData;
		value?: number;
	};

	let { metadata, value = $bindable(metadata.page) }: Props = $props();
</script>

<div class="text-nowrap">
	<button
		onclick={() => {
			value--;
		}}
		class="btn btn-square btn-sm btn-secondary"
		disabled={!metadata.isPrev}
		type="button"
	>
		<ChevronLeft />
	</button>
	&nbsp;
	{#if value > 2}
		<button onclick={() => (value = 1)} class="link link-hover hover:text-secondary" type="button">
			1
		</button>
		…
	{/if}
	{#each { length: 3 }, i}
		{@const page = value - 1 + i}
		{#if page >= 1 && page <= metadata.total}
			{#if page === value}
				<button class="link text-secondary">
					{value}
				</button>
			{:else}
				<button
					onclick={() => (value = page)}
					class="link link-hover hover:text-secondary"
					type="button"
				>
					{page}
				</button>
			{/if}
			{#if i < 2}
				&nbsp;
			{/if}
		{/if}
	{/each}
	{#if metadata.total > value + 1}
		…
		<button
			onclick={() => (value = metadata.total)}
			class="link link-hover hover:text-secondary"
			type="button">{metadata.total}</button
		>
	{/if}
	&nbsp;
	<button
		onclick={() => {
			value++;
		}}
		class="btn btn-square btn-sm btn-secondary"
		disabled={!metadata.isNext}
		type="button"
	>
		<ChevronRight />
	</button>
</div>
