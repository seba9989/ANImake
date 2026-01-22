<script lang="ts">
	import { useSearchParams } from 'runed/kit';
	import type { PageProps } from './$types';
	import { type } from 'arktype';
	import { seriesSeasonEnum, seriesTypeEnum } from '$lib/utils/enums';
	import { organization } from '$lib/actions/organization';
	import Form from '$lib/components/Form';
	import { series } from '$lib/actions/series';
	import { SvelteMap } from 'svelte/reactivity';
	import { Trash } from 'lucide-svelte';

	import { watch } from 'runed';
	import Cover from '$lib/components/Cover/Cover.svelte';

	let { data }: PageProps = $props();

	const params = useSearchParams(
		type({
			title: ['string', '=', ''],
			year: ['string[] | undefined', '=', undefined],
			season: [
				[type.enumerated(...seriesSeasonEnum.keys()).array(), '|', 'undefined'],
				'=',
				undefined
			],
			type: [[type.enumerated(...seriesTypeEnum.keys()).array(), '|', 'undefined'], '=', undefined],
			group: ['string[] | undefined', '=', undefined],

			page: ['number', '=', 1]
		})
	);

	class EnumParams {
		maps: Partial<Record<keyof typeof params, SvelteMap<string, string>>> = $state({});

		constructor(object: Partial<Record<keyof typeof params, Map<string, string>>>) {
			for (const [paramKey, enumMap] of Object.entries(object)) {
				const key = paramKey as keyof typeof params;

				this.maps[paramKey as keyof typeof params] = new SvelteMap(
					(params[key] as string[])?.map((value) => [value, String(enumMap.get(value))]) ?? []
				);

				watch(
					() => this.maps[paramKey as keyof typeof params],
					() => {
						const keys = this.maps[paramKey as keyof typeof params]?.keys().toArray();
						(params[key] as string[] | undefined) = keys?.length ? keys : undefined;
					}
				);
			}
		}

		reset() {
			for (const key of Object.keys(this.maps)) {
				this.maps[key as keyof typeof params] = new SvelteMap();
			}
		}
	}

	const group_sEnum =
		params.group &&
		(await organization.list({
			options: {
				perPage: 'all'
			},
			query: {
				slug_s: params.group
			}
		}));

	let enumParams = new EnumParams({
		year: new Map(params.year?.map((year) => [year, year])),
		season: seriesSeasonEnum,
		type: seriesTypeEnum,
		group: new Map(group_sEnum?.data.map(({ slug, name }) => [slug, name]))
	});

	let seriesList = $derived(
		await series.list({
			options: {
				page: 1
			},
			query: {
				searchTitle: params.title,

				releaseYear_s: params.year?.map((str) => Number(str)) ?? [],
				season_s: params.season ?? [],
				type_s: params.type ?? [],
				group_s: params.group ?? []
			}
		})
	);

	console.log(params.title);
</script>

<div class="flex flex-col gap-12 px-4 py-1">
	<Form class="flex flex-col gap-2">
		<div>
			<h3>Tytuł</h3>
			<Form.Field bind:value={params.title} placeholder="Dowolny" />
		</div>

		<div class="grid grid-cols-[repeat(4,1fr)_auto] gap-2">
			<div>
				<h3>Rok</h3>
				<Form.Combobox
					multiple
					options={new SvelteMap((await series.get.year()).map((t) => [String(t), String(t)]))}
					bind:value={enumParams.maps.year}
					placeholder="Dowolny"
				/>
			</div>
			<div>
				<h3>Sezon</h3>
				<Form.Combobox
					multiple
					options={new SvelteMap(seriesSeasonEnum)}
					bind:value={enumParams.maps.season}
					placeholder="Dowolny"
				/>
			</div>
			<div>
				<h3>Typ</h3>
				<Form.Combobox
					multiple
					options={new SvelteMap(seriesTypeEnum)}
					bind:value={enumParams.maps.type}
					placeholder="Dowolny"
				/>
			</div>
			<div>
				<h3>Grupa</h3>
				<Form.Combobox
					multiple
					filterFn={async (filter) => {
						const options = await organization.list({
							options: {
								page: 1
							},
							query: {
								searchName: filter
							}
						});

						return new Map(options?.data.map(({ slug, name }) => [slug, name]));
					}}
					bind:value={enumParams.maps.group}
					placeholder="Dowolny"
				/>
			</div>
			<div class="flex w-fit! items-end">
				<button
					type="button"
					onclick={() => enumParams.reset()}
					class="btn btn-square p-2.5 btn-secondary"
				>
					<Trash />
				</button>
			</div>
		</div>
	</Form>

	<div class="mx-8 flex flex-wrap gap-8">
		<svelte:boundary>
			{#each seriesList?.data as series}
				<Cover {series} />
			{/each}

			{#snippet pending()}
				<!-- <div class="flex h-svh w-svw bg-base-300" out:fade>
			<span class="loading m-auto loading-xl loading-spinner"></span>
		</div> -->
			{/snippet}
		</svelte:boundary>
	</div>
</div>

<style lang="postcss">
	@reference "../layout.css";
	h3 {
		@apply text-xl font-bold;
	}
</style>
