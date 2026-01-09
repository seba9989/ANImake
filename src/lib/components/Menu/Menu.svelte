<script lang="ts">
	import type { Snippet } from 'svelte';

	const { children }: { children: Snippet } = $props();
</script>

<div class="grid w-1/4 max-w-3xs min-w-min gap-2 rounded-lg bg-base-200 p-3 font-semibold">
	{@render children()}
</div>
