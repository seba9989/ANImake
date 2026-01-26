<script lang="ts">
	import defaultBanner from '$lib/assets/default_banner.png';
	import type { group as groupTable } from '$lib/server/db/schema';
	import { cn } from '$lib/utils/cn';
	import Icon from '@iconify/svelte';
	import type { type } from 'arktype';
	import type { ComponentProps, Snippet } from 'svelte';

	type Props = {
		group: typeof groupTable.$inferSelect;
		class?: string;
		links?: (
			| {
					href: string;
					icon: ComponentProps<Icon>['icon'];
			  }
			| undefined
		)[];
	};

	const { group, class: className, links }: Props = $props();
</script>

<div class="m-auto flex h-28 w-full overflow-hidden rounded-lg bg-base-300">
	<div
		class={cn('aspect-video h-full grow bg-cover', className)}
		style=" background-image: url({group?.bannerUrl ?? defaultBanner})"
	>
		<div class="h-full w-full bg-linear-to-l from-base-300 from-0% backdrop-brightness-90"></div>
	</div>
	<div class="m-3 ml-6 flex w-1/2 flex-col">
		<div class="flex items-center justify-between gap-2">
			<img class="h-5 text-lg font-semibold" src={group?.logoUrl} alt={group.name} />

			<div>
				{#each links as link}
					<!-- {JSON.stringify(link)} -->
					{#if link}
						<a class="btn btn-square btn-sm btn-secondary" href={link.href}>
							<Icon icon={link.icon} />
						</a>
					{/if}
				{/each}
			</div>
		</div>

		<p class=" m-auto line-clamp-2 opacity-50">{group?.description}</p>
	</div>
</div>
