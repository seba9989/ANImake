<script lang="ts">
	import defaultBanner from '$lib/assets/default_banner.png';
	import { cn } from '$lib/utils/cn';

	type Props = {
		src?: string | null;
		class?: string;
		height?: string | number;
	};

	const { src = defaultBanner, height = 100, class: className }: Props = $props();
</script>

<div
	class={cn('absolute top-0 right-0 -z-10 w-screen bg-cover', className)}
	style=" background-image: url({src}); height: calc(var(--spacing) * {height})"
>
	<div class="h-full w-full bg-linear-to-t from-base-100 from-25% backdrop-brightness-80"></div>
</div>
