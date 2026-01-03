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

<div>
	<button
		onclick={() => {
			value--;
		}}
		class="btn btn-square btn-secondary btn-sm"
		disabled={!metadata.isPrev}
		type="button"
	>
		<ChevronLeft />
	</button>
	&nbsp;
	{#if metadata.page > 2}
		<button onclick={() => (value = 1)} class="link link-hover hover:text-secondary" type="button">
			1
		</button>
		…
	{/if}
	{#each { length: 3 }, i}
		{@const page = metadata.page - 1 + i}
		{#if page >= 1 && page <= metadata.total}
			{#if page === metadata.page}
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
	{#if metadata.total > metadata.page + 1}
		…
		<button
			onclick={() => (value = metadata.total)}
			class="link link-hover hover:text-secondary"
			type="button">{metadata.total}</button
		>
	{/if}
	<button
		onclick={() => {
			value++;
		}}
		class="btn btn-square btn-secondary btn-sm"
		disabled={!metadata.isNext}
		type="button"
	>
		<ChevronRight />
	</button>
</div>
