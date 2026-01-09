<script lang="ts">
	import { page } from '$app/state';
	import { cn } from '$lib/utils/cn';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		href: string;
		regex?: RegExp;
		disable?: boolean;
	};

	const { children, href, regex, disable }: Props = $props();
</script>

<a
	{href}
	class={cn(
		'rounded-sm px-3 py-2 transition duration-150',
		(!!regex ? regex.test(page.url.pathname) : page.url.pathname === href)
			? 'bg-base-content text-base-100 drop-shadow-lg'
			: 'hover:bg-[--alpha(var(--color-base-content)/15%)]'
	)}
>
	{@render children()}
</a>
