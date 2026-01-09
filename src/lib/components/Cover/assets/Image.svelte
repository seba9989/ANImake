<script lang="ts">
	import { type series as seriesType } from '$lib/server/db/schema';
	import { cn } from '$lib/utils/cn';

	type Props = {
		cover: Pick<typeof seriesType.$inferSelect, 'title' | 'coverUrl'>;
		class?: string;
	};

	const { cover, class: className }: Props = $props();
</script>

<div class={cn('relative aspect-cover h-55 overflow-hidden rounded-sm bg-base-300', className)}>
	<img src={cover.coverUrl} alt={cover.title} class="absolute inset-0 h-full w-full object-cover" />
</div>
