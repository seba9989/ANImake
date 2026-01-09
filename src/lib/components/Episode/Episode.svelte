<script lang="ts">
	import type { episode as episodeTable, episodeToGroup } from '$lib/server/db/schema';
	import { Search } from 'lucide-svelte';
	import Banner from '../Banner';
	import Form from '../Form';
	import { organization } from '$lib/actions/organization';
	import Icon from '@iconify/svelte';
	import { page } from '$app/state';

	type Props = {
		episode: typeof episodeTable.$inferInsert;
		groups?: (typeof episodeToGroup.$inferSelect.groupId)[];
		bannerUrl?: string;
	};

	const { episode, groups, bannerUrl }: Props = $props();

	const { number, title, description, coverUrl, duration } = $derived(episode);

	let dialog: HTMLDialogElement | undefined = $state();

	$inspect(groups);
</script>

<button
	class="z-20 flex h-28 cursor-pointer overflow-hidden rounded-md bg-base-300 transition-transform select-none hover:scale-102"
	onclick={() => dialog?.showModal()}
>
	<div
		class="relative aspect-video h-full bg-cover"
		style="background-image: url({coverUrl ??
			'https://img1.ak.crunchyroll.com/i/spire4-tmb/d80b3fbce742e6deb4d2caf37d08ca6e1395451246_full.jpg'});"
	>
		<div
			class="absolute right-0 bottom-0 m-1 rounded-lg bg-[color-mix(in_hsl,var(--color-base-300),transparent_40%)] px-1.5 text-sm font-semibold"
		>
			{duration} min
		</div>
	</div>
	<div class="flex flex-col p-4 text-left">
		<h4 class="line-clamp-1 font-semibold">
			{number}. {title}
		</h4>
		<p class="mt-auto line-clamp-2">
			{description}
		</p>
	</div>
</button>

<!-- {#if groups} -->
<dialog bind:this={dialog} class="modal p-5 backdrop-blur-xs">
	<div class="modal-box max-h-full min-h-max w-full max-w-4xl min-w-0">
		<Banner src={bannerUrl} height="50" />

		<div class="flex h-full flex-col pt-25">
			<h2 class="mb-4 text-2xl font-bold">{episode.title}</h2>
			<Form>
				<Form.Field placeholder="Nazwa grupy">
					{#snippet preChildren()}
						<Search class="h-5" />
						<div class="divider m-1 ml-0 divider-horizontal w-0"></div>
					{/snippet}
				</Form.Field>
			</Form>

			<div class="flex h-full flex-col gap-2 p-4">
				{#each groups as groupId}
					{@const group = await organization.getById(groupId)}
					<a
						href="{page.url.href}/{episode.number}?group={group?.slug}"
						class="m-auto flex h-28 w-full overflow-hidden rounded-lg bg-base-300"
					>
						<Banner.Group class="aspect-video h-full" src={group?.bannerUrl} />
						<div class="m-2 ml-6 flex flex-col">
							<div class="flex items-center justify-between gap-2">
								<h3 class="text-lg font-semibold">{group?.name}</h3>
							</div>

							<p class=" line-clamp-2 opacity-50">{group?.description}</p>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
<!-- {/if} -->
