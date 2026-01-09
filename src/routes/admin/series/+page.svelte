<script lang="ts">
	import { series } from '$lib/actions/series';
	import Cover from '$lib/components/Cover/Cover.svelte';
	import Form from '$lib/components/Form';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let page = $state(1);

	let seriesList = $derived(
		await series.list({
			options: { page, perPage: 20 },
			query: {}
		})
	);
</script>

<div class="flex flex-col rounded-lg bg-base-200 p-2">
	<Form class="flex gap-2">
		<Form.Field placeholder="Nazwa serii" wrapperClass="grow" />
		<div class="divider mx-1 divider-horizontal"></div>
		<a href="/admin/series/create" class="btn btn-secondary"> Stwórz nową </a>
	</Form>
	<div class="mr-auto">
		<div class="m-8 flex flex-wrap gap-8">
			{#each seriesList?.data as series}
				<div class="m-auto">
					<Cover {series} />
				</div>
			{/each}
		</div>
	</div>
	{#if seriesList && seriesList.metadata.total > 1}
		<div class="ml-auto">
			<Form.Pages metadata={seriesList.metadata} bind:value={page} />
		</div>
	{/if}
</div>
