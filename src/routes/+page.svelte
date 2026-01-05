<script lang="ts">
	import { series } from '$lib/actions/series';
	import Hero from '$lib/components/Hero/Hero.svelte';
	import SeriesList from '$lib/components/SeriesList/SeriesList.svelte';

	let seriesList = await series.list({
		options: {
			page: 1,
			perPage: 5
		},
		query: {}
	});
</script>

{#if seriesList}
	<Hero seriesList={seriesList.data} />
{/if}

<SeriesList listName="test" />
