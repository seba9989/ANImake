<script lang="ts">
	import { page } from '$app/state';
	import { cn } from '$lib/utils/cn';
	import type { Icon as IconType } from 'lucide-svelte';

	type Props = {
		href: string;
		icon: typeof IconType;
		regex?: RegExp;
		disable?: boolean;
	};

	const { href, icon: Icon, regex, disable }: Props = $props();
</script>

{#if disable}
	<button disabled class={['rounded-r-md pl-2']}>
		<div class="tooltip tooltip-right" data-tip="Już wkrótce">
			<div class={['flex aspect-square w-full items-center justify-center opacity-50']}>
				<Icon />
			</div>
		</div>
	</button>
{:else}
	<a
		{href}
		class={cn(
			'rounded-r-md pl-2',
			(!!regex ? regex.test(page.url.pathname) : page.url.pathname === href)
				? 'bg-base-content text-base-100 drop-shadow-lg'
				: 'hover:bg-[--alpha(var(--color-base-content)/15%)]'
		)}
	>
		<div class={['flex aspect-square w-full items-center justify-center']}>
			<Icon />
		</div>
	</a>
{/if}
