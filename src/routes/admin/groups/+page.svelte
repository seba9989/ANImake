<script lang="ts">
	import type { PageProps } from './$types';
	import { organization } from '$lib/actions/organization';
	import { ExternalLink, FileX, SquarePen } from 'lucide-svelte';
	import Form from '$lib/components/Form';
	import Banner from '$lib/components/Banner';

	let { data }: PageProps = $props();

	let searchName = $state('');

	let organizationList = $derived(
		await organization.list({
			options: {
				perPage: 'all'
			},
			query: {
				searchName
			}
		})
	);
</script>

<div class="flex flex-col gap-2 rounded-lg bg-base-200 p-2">
	<Form class="flex gap-2">
		<Form.Field placeholder="Nazwa grupy" wrapperClass="grow" bind:value={searchName} />
		<div class="divider mx-1 divider-horizontal"></div>
		<a href="/admin/groups/create" class="btn btn-secondary"> Stwórz nową </a>
	</Form>
	<ul class="list rounded-box bg-base-100 shadow-md">
		{#each organizationList?.data as group}
			{@const _createdAt = new Intl.DateTimeFormat('pl-PL').format(group.createdAt)}
			<li class="list-row grid-cols-[1fr_auto_auto]">
				<!-- {#if logoUrl}
					<div class="avatar">
						<div class="w-10 rounded">
							<img src={logoUrl} alt="" />
						</div>
					</div>
				{:else}
					<div class="btn btn-disabled flex btn-square h-full w-10">
						<FileX class="m-auto" />
					</div>
				{/if} -->
				<div class="w-full max-w-3xl">
					<Banner.Group {group} />
					<div class="ml-4 text-xs font-semibold uppercase opacity-60">Create at: {_createdAt}</div>
				</div>
				<a href="/groups/{group.slug}" class="btn btn-square btn-ghost">
					<ExternalLink />
				</a>
				<a href="/admin/groups/{group.slug}" class="btn btn-square btn-ghost">
					<SquarePen />
				</a>
			</li>
		{/each}
	</ul>
</div>
