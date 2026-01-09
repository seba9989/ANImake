<script lang="ts">
	import { series } from '$lib/actions/series';
	import Form from '$lib/components/Form';
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import { page } from '$app/state';
	import { api } from '$lib/actions/api';
	import { Trash2 } from 'lucide-svelte';

	let { data, params }: PageProps = $props();

	onMount(async () => {
		const kitsuId = page.url.searchParams.get('kitsuId');

		if (!!kitsuId && kitsuId.length > 0) {
			categoriesList =
				(
					await api.categories.list({
						options: {
							perPage: 'all'
						},
						query: {
							kitsuId: Number(kitsuId)
						}
					})
				)?.data ?? [];
		}
	});

	let { fields } = series.create.categories;

	let categoriesList: NonNullable<Awaited<ReturnType<typeof api.categories.list>>>['data'] = $state(
		[]
	);
</script>

<Form form={series.create.categories} class="flex flex-col gap-2 rounded-lg bg-base-200 p-2">
	<input class="hidden" {...fields.seriesId.as('text')} type="text" value={params.seriesId} />

	<!-- Categories -->
	<div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
		<table class="table table-sm">
			<!-- head -->
			<thead>
				<tr>
					<th></th>
					<th>Title</th>
					<th>Slug</th>
				</tr>
			</thead>
			<tbody>
				{#each categoriesList as { title, slug }, i}
					<tr>
						<th>
							<button
								onclick={() => {
									categoriesList.splice(i, 1);
								}}
								class="btn btn-square btn-sm btn-error"
								type="button"
							>
								<Trash2 size="20" />
							</button>
						</th>
						<td>
							<Form.Field class="input-sm" field={fields.categories[i].title} value={title} />
						</td>
						<td>
							<Form.Field class="input-sm" field={fields.categories[i].slug} value={slug} />
						</td>
					</tr>
				{:else}
					<tr>
						<th colspan="3" class="text-center"> Nie dodano żadnych kategorii </th>
					</tr>
				{/each}
				<tr>
					<th colspan="3" class="text-center">
						<button
							onclick={() => {
								categoriesList.push({ title: '', slug: '' });
							}}
							class="btn w-full btn-secondary"
							type="button">Dodaj</button
						>
					</th>
				</tr>
			</tbody>
		</table>
	</div>

	<button class="btn btn-secondary" type="submit">Stwórz</button>
</Form>
