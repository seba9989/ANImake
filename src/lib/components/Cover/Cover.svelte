<script lang="ts">
	import { type series as seriesType } from '$lib/server/db/schema';
	import { seriesTypeEnum } from '$lib/utils/enums';
	import { url } from '$lib/utils/url';
	import Icon from '@iconify/svelte';
	import Image from './assets/Image.svelte';

	type Props = {
		series: Pick<typeof seriesType.$inferSelect, 'title' | 'coverUrl' | 'releaseYear' | 'type'>;
		href?: string;
	};

	const { series, href = `/anime/${url.encode(series.title)}` }: Props = $props();
</script>

<a {href} class=" flex w-min flex-col gap-1 text-sm select-none">
	<Image cover={series} />

	<h1 class="line-clamp-2 font-bold">
		{series.title}
		<br /> &nbsp; <!-- To jest w tym miejscu by osiągnąć efekt zawsze 2 lini -->
	</h1>
	<div class=" mt-auto flex justify-between opacity-60">
		<div class="flex items-center gap-1">
			<Icon icon="lucide:calendar-days" class="inline" />
			{series.releaseYear}
		</div>
		<div class="flex items-center gap-1">
			{seriesTypeEnum.get(series.type)}
			<Icon icon="lucide:tv" class="inline" />
		</div>
	</div>
</a>
