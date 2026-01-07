<script lang="ts">
	import defaultBanner from '$lib/assets/default_banner.png';
	import { api } from '$lib/actions/api';
	import Form from '$lib/components/Form';
	import { SvelteMap } from 'svelte/reactivity';
	import type { PageProps } from './$types';
	import type { SeriesPrototype } from '$lib/server/db/schema';
	import { seriesSeasonEnum, seriesTypeEnum } from '$lib/utils/enums';
	import { series } from '$lib/actions/series';
	import Cover from '$lib/components/Cover';
	import { type } from 'arktype';
	import { Trash2 } from 'lucide-svelte';

	let { data }: PageProps = $props();

	let { fields } = series.create;
	let { seriesData: seriesFields, categories: categoriesFields } = fields;

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
				const { title, coverUrl, releaseYear, type } = seriesFields;
				title.set(data.title);
				coverUrl.set(data.coverUrl);
				releaseYear.set(String(data.releaseYear));
				type.set(data.type);
			}

			if (seriesData?.kitsuId) {
				categoriesList =
					(
						await api.categories.list({
							options: {
								perPage: 'all'
							},
							query: {
								kitsuId: seriesData.kitsuId
							}
						})
					)?.data ?? [];
			}
		}
	};

	// Base Series Data
	let seriesData: SeriesPrototype = $state();

	let seriesType: SvelteMap<string, string> = $state(new SvelteMap());

	let coverData = $derived.by(() => {
		const t = coverParse.partial()({
			...seriesFields.value(),
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

	let categoriesList: NonNullable<Awaited<ReturnType<typeof api.categories.list>>>['data'] = $state(
		[]
	);

	$inspect('Issues: ', series.create.fields.allIssues());
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
	<input class="hidden" {...seriesFields.kitsuId.as('text')} value={seriesData?.kitsuId} />

	<!-- Podstawowe dane serii -->
	<div class="contents">
		<h1 class="text-xl font-semibold text-secondary">Podstawowe dane serii</h1>
		{#each seriesFields.issues() as issue}
			<p class="text-error visible">
				<span class="status status-sm status-error mr-0.5"></span>
				{issue.message}
			</p>
		{/each}
		<div class="flex gap-2">
			<Cover.Prototype series={coverData} />
			<div class="flex-col gap-2 flex grow">
				<Form.Field field={seriesFields.title} placeholder="Tytuł" value={seriesData?.title} />
				<Form.Combobox
					field={seriesFields.type}
					placeholder="Typ serii"
					options={new SvelteMap(seriesTypeEnum)}
					bind:value={seriesType}
				/>
				<Form.Field
					field={seriesFields.coverUrl}
					placeholder="URL okładki"
					value={seriesData?.coverUrl}
				/>
				<Form.Checkbox field={seriesFields.nsfw} placeholder="NSFW" value={seriesData?.nsfw} />
				<Form.Field
					field={seriesFields.aired}
					type="date"
					placeholder="Data wydania"
					value={seriesData?.aired ? dateToString(seriesData.aired) : undefined}
				/>
				<Form.Field
					field={seriesFields.bannerUrl}
					placeholder="URL bannera"
					value={seriesData?.bannerUrl}
				/>
			</div>
		</div>

		<!-- TODO: Zamienić na komponent bannera -->
		<img
			src={seriesFields.bannerUrl.value() && seriesFields.bannerUrl.value().length > 0
				? seriesFields.bannerUrl.value()
				: defaultBanner}
			alt=""
		/>

		<Form.Textarea
			field={seriesFields.description}
			placeholder="Opis serii"
			value={seriesData?.description}
		/>
		<Form.Field
			field={seriesFields.releaseYear}
			placeholder="Rok wydania"
			value={seriesData?.releaseYear}
		/>
		<Form.Combobox
			field={seriesFields.season}
			placeholder="Sezon"
			options={new SvelteMap(seriesSeasonEnum)}
			value={seriesSeason}
		/>
		<Form.Field
			field={seriesFields.trailerUrl}
			placeholder="URL zwiastuna"
			value={seriesData?.trailerUrl}
		/>
	</div>

	<!-- Categories -->
	<div class="contents">
		<h1 class="text-xl font-semibold text-secondary">Kategorie serii</h1>
		{#each categoriesFields.issues() as issue}
			<p class="text-error visible">
				<span class="status status-sm status-error mr-0.5"></span>
				{issue.message}
			</p>
		{/each}
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
									class="btn btn-error btn-square btn-sm"
									type="button"
								>
									<Trash2 size="20" />
								</button>
							</th>
							<td>
								<Form.Field class="input-sm" field={categoriesFields[i].title} value={title} />
							</td>
							<td>
								<Form.Field class="input-sm" field={categoriesFields[i].slug} value={slug} />
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
	</div>

	<button class="btn btn-secondary" type="submit">Stwórz</button>
</Form>
