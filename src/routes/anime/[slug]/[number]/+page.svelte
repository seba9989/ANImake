<script lang="ts">
	import { page } from '$app/state';
	import { ArrowLeft, ArrowRight } from 'lucide-svelte';
	import type { PageProps } from './$types';
	import Episode from '$lib/components/Episode';
	import { cn } from '$lib/utils/cn';
	import Banner from '$lib/components/Banner';
	import { organization } from '$lib/actions/organization';
	import { afterNavigate, goto, onNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

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

	let legacyPlayerVideoUrl: {
		loading: boolean;
		url: string | undefined;
	} = $state({
		loading: true,
		url: undefined
	});

	const group = $derived(await organization.get.bySlug(page.url.searchParams.get('group') ?? ''));

	const reload = async () => {
		legacyPlayerVideoUrl.loading = true;
		await new Promise((r) => setTimeout(r, 10));
		legacyPlayerVideoUrl = {
			loading: false,
			url: legacyPlayer_s.find(({ type }) => type === 'video')?.url
		};
	};

	afterNavigate(reload);
	onMount(reload);
</script>

<div class="h-svh *:py-4 lg:grid lg:grid-cols-[2fr_1fr]">
	<div class="overflow-scroll">
		<div class="flex flex-col gap-2">
			<div class="aspect-video w-full overflow-hidden rounded-lg bg-base-300">
				{#if player}
					<!-- Dodać Player -->
				{:else if legacyPlayerVideoUrl}
					{#if legacyPlayerVideoUrl.loading}
						<div class="flex h-full w-full" out:fade={{ delay: 200 }}>
							<!-- <LoaderCircle class="m-auto animate-spin duration-1200" size="48" /> -->
							<span class="loading m-auto loading-xl loading-spinner"></span>
						</div>
					{:else}
						<iframe title="Player" src={legacyPlayerVideoUrl.url} class="h-full w-full"></iframe>
					{/if}
				{:else}
					<div class="flex h-full items-center justify-center text-3xl font-bold">
						Odcinek nie aktywny
					</div>
				{/if}
			</div>
			<div class="mt-2 flex h-min flex-col space-y-2">
				<div
					class="grid grid-cols-2 items-center justify-between gap-2 lg:grid-cols-[auto_1fr_auto]"
				>
					<a
						href={previous}
						class={cn('btn btn-secondary not-lg:row-start-2', { 'btn-disabled': !previous })}
					>
						<ArrowLeft /> Poprzedni
					</a>

					{#if group}
						<div class="not-lg:col-span-2 not-lg:col-start-1">
							<Banner.Group
								class=" aspect-video h-full"
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
						</div>
					{/if}

					<a
						href={next}
						class={cn('btn btn-secondary not-lg:row-start-2', { 'btn-disabled': !next })}
					>
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
				<p class="line-clamp-4 h-min overflow-scroll brightness-60">{episode?.description}</p>
			</div>
		</div>
	</div>
	<div class="flex h-screen flex-col gap-2 overflow-x-visible overflow-y-scroll px-4">
		{#each episodesInGroup as episode}
			<div class="h-full">
				<Episode {episode} href="./{episode.number}{page.url.search}" />
			</div>
			<!-- <pre>
				{JSON.stringify(episode, null, 2)}
			</pre> -->
		{/each}
	</div>
</div>
