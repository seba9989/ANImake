<script lang="ts">
	import type { series } from '$lib/server/db/schema';
	import { cn } from '$lib/utils/cn';
	import { seriesSeasonEnum, seriesTypeEnum } from '$lib/utils/enums';
	import { url } from '$lib/utils/url';
	import Icon from '@iconify/svelte';
	import { Splide, SplideSlide } from '@splidejs/svelte-splide';
	import '@splidejs/svelte-splide/css/core';

	import { Bookmark, Dot, Heart } from 'lucide-svelte';
	import { onMount } from 'svelte';

	type Props = { seriesList: (typeof series.$inferSelect)[] };

	let { seriesList }: Props = $props();

	let elapsed = $state(0);
	let duration = 10000;

	let sliderIndex = $state(0);

	let slider1: Splide;
	let slider2: Splide;

	onMount(() => {
		slider1.sync(slider2.splide);

		let last_time = performance.now();

		let frame = requestAnimationFrame(function update(time) {
			frame = requestAnimationFrame(update);

			elapsed += Math.min(time - last_time, duration - elapsed);
			last_time = time;
		});

		return () => {
			cancelAnimationFrame(frame);
		};
	});

	$effect(() => {
		if (elapsed === duration) {
			const index = slider1.splide.index;
			slider1.go(index + 1);
			// slider2.go(index + 1);
			elapsed = 0;
		}
	});

	$inspect(sliderIndex);
</script>

<div class="absolute top-0 right-0 h-100 w-screen -z-10">
	<Splide
		bind:this={slider1}
		class="h-full *:h-full"
		options={{
			type: 'loop',
			arrows: false,
			drag: false,
			speed: 800
		}}
		on:active={(e) => {
			sliderIndex = e.detail.splide.index;
		}}
	>
		{#each seriesList as { bannerUrl }}
			<SplideSlide class="h-full *:h-full">
				<div class=" w-screen bg-cover" style="background-image: url({bannerUrl});">
					<div
						class="h-full w-full bg-linear-to-t from-base-100 from-25% backdrop-brightness-80"
					></div>
				</div>
			</SplideSlide>
		{/each}
	</Splide>
</div>
<div class="flex h-90 items-end px-4 mb-4">
	<div class="flex flex-col gap-2">
		<Splide
			bind:this={slider2}
			class="*:h-full"
			options={{ type: 'loop', arrows: false, drag: false, direction: 'ttb', height: 356 }}
			on:active={(e) => {
				sliderIndex = e.detail.splide.index;
			}}
		>
			{#each seriesList as { title, type, releaseYear, season, description }}
				<SplideSlide class="h-full *:h-full">
					<div class="h-full flex">
						<div class="flex flex-col gap-2 mt-auto">
							<h1 class="mb-4 text-4xl font-bold">{title}</h1>
							<div class="flex items-center text-sm">
								<span>{seriesTypeEnum.get(type)}</span>
								<Dot class="inline text-2xl opacity-60" />
								<span>13 Episodes</span>
								<Dot class="inline text-2xl opacity-60" />
								<span>{releaseYear} {seriesSeasonEnum.get(season)}</span>
							</div>
							<p class="line-clamp-2 max-w-150 brightness-75">
								{description}
							</p>
							<!-- TODO: Dodać wykaz gatunków -->
							<!-- <div class="flex items-center text-sm">
								<span>Adventure</span>
								<Dot class="inline text-2xl opacity-60" />
								<span>Fantasy</span>
							</div> -->
						</div>
					</div>
				</SplideSlide>
			{/each}
		</Splide>

		<div class="flex gap-2 -mt-4">
			<a href="/anime/{url.encode(seriesList[sliderIndex].title)}" class="btn w-fit btn-secondary">
				<Icon icon="material-symbols:play-arrow" class="inline text-xl" />
				Obejrzyj Teraz
			</a>

			<!-- TODO: dodać follow i zapis do playlisty -->
			<!-- <button class="btn btn-square btn-ghost">
									<Heart />
								</button>

								<button class="btn btn-square btn-ghost">
									<Bookmark />
								</button> -->
		</div>

		{#if seriesList.length > 1}
			<div class="flex mt-1 gap-2">
				{#each { length: seriesList.length }, i}
					<div
						class={cn(
							'grid grid-cols-1 grid-rows-1 overflow-hidden rounded-2xl transition-all duration-100',
							{
								'w-10': i == sliderIndex,
								'w-5': i != sliderIndex
							}
						)}
					>
						<div
							class="h-1 bg-base-content opacity-100 row-start-1 transition-all duration-125"
							style="width: {i == sliderIndex ? 2.5 * (elapsed / duration) : 0}rem"
						></div>
						<div
							class={cn(
								'h-1 bg-base-content rounded-2xl row-start-1 opacity-25 transition-all duration-100',
								{
									'w-10': i == sliderIndex,
									'w-5': i != sliderIndex
								}
							)}
						></div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="h-1"></div>
		{/if}
	</div>
</div>
