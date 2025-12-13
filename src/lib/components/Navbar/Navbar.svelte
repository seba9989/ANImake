<script lang="ts">
	import { page } from '$app/state';
	import { authClient } from '$lib/auth-client';
	import {
		Calendar,
		House,
		LogIn,
		Menu,
		MoonStar,
		Search,
		Settings,
		ShieldUser,
		X,
		type Icon
	} from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import Link from './assets/Link.svelte';

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

	const session = authClient.useSession();

	const bottomMenu: MenuItem[] = !!$session.data
		? [
				// {
				// 	href: '/admin',
				// 	icon: ShieldUser
				// },
				{
					href: '/settings',
					icon: Settings
				}
			]
		: [
				{
					href: '/auth',
					icon: LogIn
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
			{#each topMenu as item}
				<Link {...item} />
			{/each}
		</div>
		<div class="grid grid-flow-row pr-2 gap-1 mt-auto">
			{#each bottomMenu as item}
				<Link {...item} />
			{/each}
		</div>
	</div>
</div>
