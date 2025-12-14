<script lang="ts">
	import { page } from '$app/state';
	import type { Icon as IconType } from 'lucide-svelte';

	type Props = {
		href: string;
		icon: typeof IconType;
		disable?: boolean;
	};

	const { href, icon: Icon, disable }: Props = $props();
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
		class={['pl-2 rounded-r-md', { 'bg-base-content text-base-100': page.route.id === href }]}
	>
		<div class={['aspect-square flex justify-center w-full items-center']}>
			<Icon />
		</div>
	</a>
{/if}
