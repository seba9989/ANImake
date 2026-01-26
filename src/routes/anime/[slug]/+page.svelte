<script lang="ts">
	import Banner from '$lib/components/Banner/Banner.svelte';
	import Cover from '$lib/components/Cover';
	import { seriesSeasonEnum, seriesTypeEnum } from '$lib/utils/enums';
	import { useSearchParams } from 'runed/kit';
	import type { PageProps } from './$types';
	import { type } from 'arktype';
	import { cn } from '$lib/utils/cn';
	import Episode from '$lib/components/Episode';
	import { episode } from '$lib/actions/episode';
	import Pages from '$lib/components/Pages/Pages.svelte';

	let { data }: PageProps = $props();

	let badge_s = $derived([
		seriesTypeEnum.get(data.seriesData.type),
		`${seriesSeasonEnum.get(data.seriesData.season)} ${data.seriesData.releaseYear}`
	]);

	let episodeSortOption_s = [
		{
			param: 'episodes',
			text: 'Odcinkach'
		},
		{
			param: 'groups',
			text: 'Grupach'
		}
	] as const;

	const searchParams = useSearchParams(
		type({
			sortBy: [type.enumerated('groups', 'episodes'), '=', 'episodes'],
			page: 'number = 1'
		}),
		{
			updateURL: true,
			noScroll: true
		}
	);

	let episodesList = $derived(
		await episode.list({
			options: {
				page: searchParams.page
			},
			query: {
				seriesId: data.seriesData.id,
				with: {
					groups: true
				}
			}
		})
	);

	// let episodesList = $derived(await episodesListPromise);

	// $inspect(episodesList?.data);
</script>

<Banner src={data.seriesData.bannerUrl} />

<div class="m-auto mt-40 w-full max-w-7xl space-y-2 p-2">
	<div class="flex gap-2">
		<div class="w-max">
			<Cover.Image class="h-[25vw] max-h-80 min-h-55 " cover={data.seriesData} />
		</div>
		<div class="flex w-full flex-col justify-end gap-2">
			<h1 class="fl-text-2xl/4xl font-bold">{data.seriesData.title}</h1>

			<div class="">
				{#each badge_s as badge}
					<div class="badge text-nowrap badge-secondary">{badge}</div>
					&nbsp;
				{/each}
			</div>
			<div>
				<p class="line-clamp-4">
					{data.seriesData.description}
				</p>
			</div>
		</div>
	</div>

	<div class="mb-4 flex flex-wrap gap-2">
		{#each data.seriesData.seriesCategory_s as { category }}
			<div class="badge text-nowrap badge-neutral">
				{category.title}
			</div>
		{/each}
	</div>

	<div class="flex items-center justify-between">
		<div class="flex flex-wrap items-center gap-2">
			<!-- <h3 class="text-2xl font-bold text-nowrap">Sortuj po:</h3>
			<div role="tablist" class="tabs-box tabs">
				{#each episodeSortOption_s as { param, text }}
					<button
						class={cn('tab', { 'tab-active': searchParams.sortBy === param })}
						onclick={() => {
							searchParams.sortBy = param;
						}}
						type="button"
					>
						{text}
					</button>
				{/each}
			</div> -->
		</div>
		{#if episodesList}
			<Pages metadata={episodesList.metadata} bind:value={searchParams.page} />
		{/if}
	</div>
	<div class="grid grid-cols-2 gap-4">
		{#if searchParams.sortBy === 'groups'}
			<!-- TODO: Dodać sortowanie po grupach -->
			<div>TODO: Dodać sortowanie po grupach</div>
		{:else if searchParams.sortBy === 'episodes'}
			{#each episodesList?.data as { episode, groups }}
				<Episode {episode} {groups} bannerUrl={episode.coverUrl ?? ''} />
			{/each}
		{/if}
	</div>
</div>
