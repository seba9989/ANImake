<script lang="ts">
	import defaultBanner from '$lib/assets/default_banner.png';
	import { cn } from '$lib/utils/cn';

	type Props = {
		src?: string | null;
		class?: string;
	};

	const { src = defaultBanner, class: className }: Props = $props();
</script>

<div class={cn('bg-cover', className)} style=" background-image: url({src})">
	<div class="h-full w-full bg-linear-to-l from-base-300 from-0% backdrop-brightness-90"></div>
</div>
