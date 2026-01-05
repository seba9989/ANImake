<script lang="ts">
	import {
		Calendar,
		House,
		LogIn,
		Menu,
		MoonStar,
		Search,
		Settings,
		ShieldUser,
		X
	} from 'lucide-svelte';
	import type { ComponentProps } from 'svelte';
	import Link from './assets/Link.svelte';
	import { user as getUser } from '$lib/actions/auth/user.remote';

	type MenuItem = ComponentProps<typeof Link>;

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

	const user = $derived(await getUser());

	const bottomMenu: MenuItem[] = $derived(
		!!user
			? [
					...(user.role === 'admin'
						? [
								{
									href: '/admin',
									regex: /\/admin.*/,
									icon: ShieldUser
								}
							]
						: []),
					{
						href: '/settings',
						icon: Settings
					}
				]
			: [
					{
						href: '/auth',
						regex: /\/auth.*/,
						icon: LogIn
					}
				]
	);

	$inspect(user?.role);
</script>

<div class="max-sm:contents hidden">
	<div class="fab">
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
		<div class="grid grid-flow-row pr-2 gap-2">
			{#each topMenu as item}
				<Link {...item} />
			{/each}
		</div>
		<div class="grid grid-flow-row pr-2 gap-2 mt-auto mb-4">
			{#each bottomMenu as item}
				<Link {...item} />
			{/each}
		</div>
	</div>
</div>
