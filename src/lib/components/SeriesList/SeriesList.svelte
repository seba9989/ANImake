<script lang="ts">
	import { series } from '$lib/actions/series';
	import { Splide, SplideSlide } from '@splidejs/svelte-splide';
	import Cover from '../Cover/Cover.svelte';
	import '@splidejs/svelte-splide/css/core';

	type seriesQuery = Parameters<typeof series.list>[0]['query'];
	type Props = {
		listName: string;
	} & seriesQuery;

	const { listName, ...query }: Props = $props();

	const getUrl = (query: seriesQuery): string => {
		return '';
	};

	let seriesList = $derived(
		await series.list({
			options: {
				page: 1,
				perPage: 25
			},
			query: {}
		})
	);
</script>

<div class="">
	<a
		href={getUrl(query)}
		class="mr-6 mb-4 flex items-end justify-between opacity-70 transition-opacity duration-100 hover:opacity-100"
	>
		<h1 class="text-xl">{listName}</h1>

		<span class="text-xs">Pokaż więcej</span>
	</a>

	<Splide options={{ arrows: false, autoWidth: true, gap: 15, drag: 'free', snap: true }}>
		{#if seriesList}
			{#each seriesList.data as series}
				<SplideSlide>
					<Cover {series} />
				</SplideSlide>
			{/each}
		{/if}
	</Splide>
</div>
