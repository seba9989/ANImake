<script lang="ts">
	import { page } from '$app/state';
	import { ArrowLeft, ArrowRight } from 'lucide-svelte';
	import type { PageProps } from './$types';
	import Episode from '$lib/components/Episode';
	import { cn } from '$lib/utils/cn';
	import Banner from '$lib/components/Banner';
	import { organization } from '$lib/actions/organization';

	let { data }: PageProps = $props();

	let {
		seriesData: series,
		episode,
		player,
		legacyPlayer_s,
		episodesInGroup,
		previous,
		next
	} = $derived(data);

	$inspect(player);

	const legacyPlayerVideo = $derived(legacyPlayer_s.find(({ type }) => type === 'video'));

	const group = $derived(await organization.get.bySlug(page.url.searchParams.get('group') ?? ''));
</script>

<div class="grid grid-cols-[2fr_1fr] gap-4 p-4 pl-0">
	<div class="flex flex-col gap-2">
		<div class="aspect-video w-full overflow-hidden rounded-lg bg-base-300">
			{#if player}
				<!-- Dodać Player -->
			{:else if legacyPlayerVideo}
				<iframe title="Player" src={legacyPlayerVideo?.url} class=" h-full w-full"></iframe>
			{:else}
				<div class="flex h-full items-center justify-center text-3xl font-bold">
					Odcinek nie aktywny
				</div>
			{/if}
		</div>
		<div class="mt-2 space-y-2">
			<div class="flex items-center justify-between gap-2">
				<a href={previous} class={cn('btn btn-secondary', { 'btn-disabled': !previous })}>
					<ArrowLeft /> Poprzedni
				</a>

				{#if group}
					<Banner.Group
						class="aspect-video h-full"
						{group}
						links={[
							group.discordUrl
								? {
										href: group.discordUrl,
										icon: 'simple-icons:discord'
									}
								: undefined
						]}
					/>
				{/if}

				<a href={next} class={cn('btn btn-secondary', { 'btn-disabled': !next })}>
					Następny <ArrowRight />
				</a>
			</div>

			<h1 class="flex flex-wrap text-3xl font-semibold">
				{series.title}
				<div class="divider divider-horizontal"></div>
				<span class="font-semibold">
					{episode?.title}
				</span>
			</h1>
			<p class="brightness-60">{episode?.description}</p>
		</div>
	</div>
	<div class="flex flex-col gap-2">
		{#each episodesInGroup as episode}
			<Episode {episode} />
			<!-- <pre>
				{JSON.stringify(episode, null, 2)}
			</pre> -->
		{/each}
	</div>
</div>
