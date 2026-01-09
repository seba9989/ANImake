<script lang="ts">
	import defaultBanner from '$lib/assets/default_banner.png';

	import { api } from '$lib/actions/api';
	import { series } from '$lib/actions/series';
	import Form from '$lib/components/Form';
	import type { SeriesPrototype } from '$lib/server/db/schema';
	import { SvelteMap } from 'svelte/reactivity';
	import type { PageProps } from './$types';
	import { seriesSeasonEnum, seriesTypeEnum } from '$lib/utils/enums';
	import { type } from 'arktype';
	import Cover from '$lib/components/Cover';

	let { data }: PageProps = $props();

	let { fields } = series.create.series;

	//Data Import
	let anilistId = $state(new SvelteMap<string, string>());
	const importSeriesData = async () => {
		const id = anilistId.keys().toArray().at(0);

		if (id) {
			seriesData = await api.get({ anilistId: Number(id) });

			if (seriesData?.type)
				seriesType.set(seriesData.type, seriesTypeEnum.get(seriesData.type) as any);

			const data = coverParse($state.snapshot(seriesData));

			if (data instanceof type.errors) {
				console.log(data.summary);
			} else {
				const { title, coverUrl, releaseYear, type } = fields;
				title.set(data.title);
				coverUrl.set(data.coverUrl);
				// FIXME: Wprowadzić Field.Number
				releaseYear.set(String(data.releaseYear));
				type.set(data.type);
			}
		}
	};

	// Base Series Data
	let seriesData: SeriesPrototype = $state();

	let seriesType: SvelteMap<string, string> = $state(new SvelteMap());

	let coverData = $derived.by(() => {
		const t = coverParse.partial()({
			...fields.value(),
			type: seriesType.keys().toArray().at(0)
		});
		if (!(t instanceof type.errors)) {
			return t;
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

	const coverParse = type({
		title: 'string',
		coverUrl: 'string.url',
		releaseYear: 'number | string.numeric.parse',
		type: "'ona' | 'ova' | 'tv' | 'movie' | 'music' | 'special'"
	});

	function dateToString(date: Date) {
		const isoString = date.toISOString();
		return isoString.substring(0, isoString.indexOf('T'));
	}
</script>

<Form form={series.create.series} class="flex flex-col gap-2 rounded-lg bg-base-200 p-2">
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
	<input class="hidden" {...fields.kitsuId.as('number')} value={seriesData?.kitsuId} />

	<!-- Podstawowe dane serii -->
	<div class="contents">
		<div class="flex gap-2">
			<div class="m-auto">
				<Cover.Prototype series={coverData} />
			</div>
			<div class="flex grow flex-col gap-2">
				<Form.Field field={fields.title} placeholder="Tytuł" value={seriesData?.title} />
				<Form.Combobox
					field={fields.type}
					placeholder="Typ serii"
					options={new SvelteMap(seriesTypeEnum)}
					bind:value={seriesType}
				/>
				<Form.Field
					field={fields.coverUrl}
					placeholder="URL okładki"
					value={seriesData?.coverUrl}
				/>
				<Form.Field
					field={fields.aired}
					type="date"
					placeholder="Data wydania"
					value={seriesData?.aired ? dateToString(seriesData.aired) : undefined}
				/>
				<Form.Field
					field={fields.releaseYear}
					placeholder="Rok wydania"
					value={seriesData?.releaseYear}
				/>
				<Form.Combobox
					field={fields.season}
					placeholder="Sezon"
					options={new SvelteMap(seriesSeasonEnum)}
					value={seriesSeason}
				/>
				<Form.Checkbox field={fields.nsfw} placeholder="NSFW" value={seriesData?.nsfw} />
			</div>
		</div>

		<Form.Field
			optional
			field={fields.bannerUrl}
			placeholder="URL bannera"
			value={seriesData?.bannerUrl}
		/>
		<!-- TODO: Zamienić na komponent bannera -->
		<img
			src={fields.bannerUrl.value() && fields.bannerUrl.value().length > 0
				? fields.bannerUrl.value()
				: defaultBanner}
			alt=""
		/>
		<Form.Field
			optional
			field={fields.trailerUrl}
			placeholder="URL zwiastuna"
			value={seriesData?.trailerUrl}
		/>
		<Form.Textarea
			optional
			field={fields.description}
			placeholder="Opis serii"
			value={seriesData?.description}
		/>
	</div>
	<button class="btn btn-secondary" type="submit">Stwórz</button>
</Form>
