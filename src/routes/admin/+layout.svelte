<script lang="ts">
	import { page } from '$app/state';
	import Menu from '$lib/components/Menu';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
	const pathArray = $derived(page.url.pathname.split('/'));
</script>

<div>
	<div class="breadcrumbs">
		<ul>
			{#each { length: pathArray.length }, i}
				{@const path = pathArray.slice(0, i + 1).join('/')}
				{#if path.length > 0}
					{#if i < pathArray.length - 1}
						<li><a href={path}>{pathArray[i]}</a></li>
					{:else}
						<li>{pathArray[i]}</li>
					{/if}
				{/if}
			{/each}
		</ul>
	</div>
</div>
<div class="divider mt-2"></div>
<div class="flex gap-2">
	<div>
		<Menu>
			<Menu.Item href="/admin/groups" regex={/\/admin\/groups.*/}>Groups</Menu.Item>
			<Menu.Item href="/admin/series">Series</Menu.Item>
		</Menu>
	</div>
	<div class="grow">
		{@render children()}
	</div>
</div>
