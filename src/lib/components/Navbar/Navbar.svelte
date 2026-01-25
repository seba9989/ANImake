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

	// $inspect(user?.role);
</script>

<div class="hidden max-sm:contents">
	<div class="fab">
		<div tabindex="0" role="button" class="btn btn-circle btn-lg btn-secondary"><Menu /></div>

		<div class="fab-close">
			<span class="btn btn-circle btn-lg btn-error"><X /></span>
		</div>

		{#each [...topMenu, ...bottomMenu].toReversed() as { href, icon, disable }}
			{@const Icon = icon}
			{#if disable}
				<button disabled class="btn btn-circle btn-lg"><Icon /></button>
			{:else}
				<a {href} class="btn btn-circle btn-lg"><Icon /></a>
			{/if}
		{/each}
	</div>
</div>
<div class="hidden sm:contents">
	<div class="sticky top-0 flex h-svh w-14 flex-col gap-2 drop-shadow-lg">
		<div
			class="flex aspect-square w-full items-center justify-center text-yellow-400 drop-shadow-md"
		>
			<MoonStar size="28" />
		</div>
		<div class="grid grid-flow-row gap-2 pr-2">
			{#each topMenu as item}
				<Link {...item} />
			{/each}
		</div>
		<div class="mt-auto mb-4 grid grid-flow-row gap-2 pr-2">
			{#each bottomMenu as item}
				<Link {...item} />
			{/each}
		</div>
	</div>
</div>
