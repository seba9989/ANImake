<script lang="ts">
	import { page } from '$app/state';
	import { Calendar, House, Menu, MoonStar, Search, Settings, X, type Icon } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	type MenuItem = {
		href: string;
		icon: typeof Icon;
		disable?: boolean;
	};

	const topMenu: MenuItem[] = [
		{
			href: '/',
			icon: House
		},
		{
			href: '/search',
			icon: Search
		},
		{
			href: '/calender',
			icon: Calendar,
			disable: true
		}
	];

	const bottomMenu: MenuItem[] = [
		{
			href: '/settings',
			icon: Settings
		}
	];
</script>

<div class="max-sm:contents hidden">
	<div class="fab fab-flower">
		<div tabindex="0" role="button" class="btn btn-lg btn-circle btn-secondary"><Menu /></div>

		<div class="fab-close">
			<span class="btn btn-circle btn-lg btn-error"><X /></span>
		</div>

		{#each [...topMenu, ...bottomMenu].toReversed() as { href, icon, disable }}
			{@const Icon = icon}
			{#if disable}
				<button disabled class="btn btn-lg btn-circle"><Icon /></button>
			{:else}
				<a {href} class="btn btn-lg btn-circle"><Icon /></a>
			{/if}
		{/each}
	</div>
</div>
<div class="sm:contents hidden">
	<div class="flex flex-col h-svh w-14 drop-shadow-lg gap-2">
		<div class="flex justify-center w-full aspect-square items-center text-yellow-400">
			<MoonStar size="28" />
		</div>
		<div class="grid grid-flow-row pr-2 gap-1">
			{#each topMenu as { href, icon, disable }}
				{@const Icon = icon}
				<div
					class={['pl-2 rounded-r-md', { 'bg-base-content text-base-100': page.route.id === href }]}
				>
					<div class={['aspect-square flex justify-center w-full items-center']}>
						<Icon />
					</div>
				</div>
			{/each}
		</div>
		<div class="grid grid-flow-row pr-2 gap-1 mt-auto">
			{#each bottomMenu as { href, icon, disable }}
				{@const Icon = icon}
				<div
					class={['pl-2 rounded-r-md', { 'bg-base-content text-base-100': page.route.id === href }]}
				>
					<div class={['aspect-square flex justify-center w-full items-center']}>
						<Icon />
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
