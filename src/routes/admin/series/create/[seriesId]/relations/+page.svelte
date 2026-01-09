<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<!-- <Form form={series.create.categories} class="flex flex-col gap-2 bg-base-200 p-2 rounded-lg">
	<input {...fields.seriesId.as('text')} type="text" value={params.seriesId} />

	<div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
		<table class="table table-sm">
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
								class="btn btn-error btn-square btn-sm"
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
							class="btn btn-secondary w-full"
							type="button">Dodaj</button
						>
					</th>
				</tr>
			</tbody>
		</table>
	</div>

	<button class="btn btn-secondary" type="submit">Stwórz</button>
</Form> -->

<div class="flex flex-col gap-2 rounded-lg bg-base-200 p-2">
	<a class="btn btn-secondary" href="../../">Skip</a>
</div>
