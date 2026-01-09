<script lang="ts">
	import defaultBanner from '$lib/assets/default_banner.png';

	type Props = {
		src?: string | null;
		height?: string | number;
	};

	const { src = defaultBanner, height = 100 }: Props = $props();
</script>

<div
	class="absolute top-0 right-0 -z-10 w-screen bg-cover"
	style=" background-image: url({src}); height: calc(var(--spacing) * {height})"
>
	<div class="h-full w-full bg-linear-to-t from-base-100 from-25% backdrop-brightness-80"></div>
</div>
