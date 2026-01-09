<script lang="ts">
	import { series } from '$lib/actions/series';
	import Form from '$lib/components/Form';
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import { page } from '$app/state';
	import { api } from '$lib/actions/api';

	let { data, params }: PageProps = $props();
	onMount(async () => {
		const kitsuId = page.url.searchParams.get('kitsuId');

		if (!!kitsuId && kitsuId.length > 0) {
			episodeList =
				(
					await api.episodes.list({
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

	let { fields } = series.create.episodes;

	let episodeList: Partial<
		NonNullable<Awaited<ReturnType<typeof api.episodes.list>>>['data'][number]
	>[] = $state([]);
</script>

<Form form={series.create.episodes} class="flex flex-col gap-2 rounded-lg bg-base-200 p-2">
	<input class="hidden" {...fields.seriesId.as('text')} type="text" value={params.seriesId} />

	<!-- Episodes -->
	{#each episodeList as episode, i}
		<div class="flex items-center gap-2">
			<div
				class="aspect-video h-45 bg-cover bg-center"
				style="background-image: url({fields.episodes[i].coverUrl.value()});"
			></div>
			<div class="grid grow gap-2">
				<Form.Field
					field={fields.episodes[i].title}
					value={episode.canonicalTitle}
					placeholder="Tytuł odcinka"
				/>
				<Form.Field
					field={fields.episodes[i].number}
					value={episode.number}
					placeholder="Numer odcinka"
				/>
				<Form.Field
					field={fields.episodes[i].duration}
					value={episode.length}
					placeholder="Długość odcinka"
				>
					min
				</Form.Field>
				<Form.Field
					field={fields.episodes[i].coverUrl}
					value={episode.thumbnail?.original}
					placeholder="Okładka odcinak"
				/>
			</div>
		</div>
		<Form.Textarea
			field={fields.episodes[i].description}
			value={episode.description}
			placeholder="Opis"
		/>
		<div class="divider m-0"></div>
	{/each}
	<button
		onclick={() => {
			episodeList.push({});
		}}
		class="btn btn-accent"
		type="button"
	>
		Dodaj
	</button>

	<button class="btn btn-secondary" type="submit">Stwórz</button>
</Form>
