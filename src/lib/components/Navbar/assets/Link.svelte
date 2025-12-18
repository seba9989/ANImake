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
	<button disabled class={['pl-2 rounded-r-md']}>
		<div class="tooltip tooltip-right" data-tip="Już wkrótce">
			<div class={['aspect-square flex justify-center w-full items-center opacity-50']}>
				<Icon />
			</div>
		</div>
	</button>
{:else}
	<a
		{href}
		class={cn(
			'pl-2 rounded-r-md',
			(!!regex ? regex.test(page.url.pathname) : page.url.pathname === href)
				? 'bg-base-content text-base-100 drop-shadow-lg'
				: 'hover:bg-[--alpha(var(--color-base-content)/15%)]'
		)}
	>
		<div class={['aspect-square flex justify-center w-full items-center']}>
			<Icon />
		</div>
	</a>
{/if}
