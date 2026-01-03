<script lang="ts">
	import defaultBanner from '$lib/assets/default_banner.png';
	import { api } from '$lib/actions/api';
	import Form from '$lib/components/Form';
	import { SvelteMap } from 'svelte/reactivity';
	import type { PageProps } from './$types';
	import type { SeriesPrototype } from '$lib/server/db/schema';
	import { seriesSeasonEnum, seriesTypeEnum } from '$lib/utils/enums';
	import { series } from '$lib/actions/series';
	import Cover from '$lib/components/Cover/Cover.svelte';

	let { data }: PageProps = $props();

	let anilistId = $state(new SvelteMap<string, string>());
	const importSeriesData = async () => {
		const id = anilistId.keys().toArray().at(0);

		if (id) {
			seriesData = await api.get({ anilistId: Number(id) });
		}
	};

	let seriesData: SeriesPrototype = $state();

	let seriesType = $derived.by(() => {
		if (seriesData) {
			const type = seriesTypeEnum.get(seriesData.type);

			if (type) {
				return new SvelteMap([[seriesData.type, type]]);
			}
		}
	});
	let seriesSeason = $derived.by(() => {
		if (seriesData) {
			const season = seriesSeasonEnum.get(seriesData.season);

			if (season) {
				return new SvelteMap([[seriesData.season, season]]);
			}
		}
	});

	let { fields } = series.create;
	$inspect(fields.allIssues());

	function dateToString(date: Date) {
		const isoString = date.toISOString();
		return isoString.substring(0, isoString.indexOf('T'));
	}

	$effect(() => {
		if (series.create.result) {
			console.log(series.create.result);
		}
	});
</script>

<Form form={series.create} class="flex flex-col gap-2 max-w-2xl bg-base-200 p-2 rounded-lg">
	<div class="flex gap-2">
		<Form.Combobox
			filterFn={async (filter) => {
				const anilistResp = await api.search({
					options: {
						page: 1
					},
					query: {
						searchTitle: filter
					}
				});

				return new Map(
					anilistResp?.data.map(({ title, anilistId }) => {
						return [String(anilistId), title];
					})
				);
			}}
			placeholder="Importuj dane serii z Kitsu"
			bind:value={anilistId}
		/>
		<button onclick={importSeriesData} class="btn btn-secondary" type="button">Importuj</button>
	</div>
	{#if seriesData}
		<input class="hidden" {...fields.kitsuId.as('text')} value={seriesData.kitsuId} />
		<div class="flex gap-2">
			<Cover series={seriesData as any} />
			<div class="flex-col gap-2 flex grow m-auto">
				<Form.Field field={fields.title} placeholder="Tytuł" value={seriesData.title} />
				<Form.Combobox
					field={fields.type}
					placeholder="Typ serii"
					options={new SvelteMap(seriesTypeEnum)}
					value={seriesType}
				/>
				<Form.Field field={fields.coverUrl} placeholder="URL okładki" value={seriesData.coverUrl} />
				<Form.Checkbox field={fields.nsfw} placeholder="NSFW" value={seriesData.nsfw} />
				<Form.Field
					field={fields.aired}
					type="date"
					placeholder="Data wydania"
					value={dateToString(seriesData.aired)}
				/>
				<Form.Field
					field={fields.bannerUrl}
					placeholder="URL bannera"
					bind:value={seriesData.bannerUrl}
				/>
			</div>
		</div>

		<!-- TODO: Zamienić na komponent bannera -->
		<img
			src={seriesData.bannerUrl && seriesData.bannerUrl.length > 0
				? seriesData.bannerUrl
				: defaultBanner}
			alt=""
		/>

		<Form.Textarea
			field={fields.description}
			placeholder="Opis serii"
			value={seriesData.description}
		/>
		<Form.Field
			field={fields.releaseYear}
			placeholder="Rok wydania"
			value={seriesData.releaseYear}
		/>
		<Form.Combobox
			field={fields.season}
			placeholder="Sezon"
			options={new SvelteMap(seriesSeasonEnum)}
			value={seriesSeason}
		/>
		<Form.Field
			field={fields.trailerUrl}
			placeholder="URL zwiastuna"
			value={seriesData.trailerUrl}
		/>

		<button class="btn btn-secondary" type="submit">Stwórz</button>
	{/if}
</Form>
