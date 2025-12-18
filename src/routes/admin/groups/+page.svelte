<script lang="ts">
	import type { PageProps } from './$types';
	import { organization } from '$lib/actions/organization';
	import { ExternalLink, FileX, SquarePen } from 'lucide-svelte';
	import Form from '$lib/components/Form';

	let { data }: PageProps = $props();

	let searchName = $state('');

	let organizationList = $derived(
		await organization.list({
			options: {
				perPage: 'all',
				page: 0
			},
			query: {
				searchName
			}
		})
	);
</script>

<div class="bg-base-200 p-2 rounded-lg flex flex-col gap-2">
	<Form class="flex gap-2">
		<Form.Field placeholder="Nazwa grupy" wrapperClass="grow" bind:value={searchName} />
		<div class="divider divider-horizontal mx-1"></div>
		<a href="/admin/groups/create" class="btn btn-secondary"> Stwórz nową </a>
	</Form>
	<ul class="list bg-base-100 rounded-box shadow-md">
		{#each organizationList?.data as { name, slug, logo, createdAt }}
			{@const _createdAt = new Intl.DateTimeFormat('pl-PL').format(createdAt)}
			<li class="list-row">
				{#if logo}
					<div class="avatar">
						<div class="w-10 rounded">
							<img src={logo} alt="" />
						</div>
					</div>
				{:else}
					<div class="h-full w-10 btn btn-square flex btn-disabled">
						<FileX class="m-auto" />
					</div>
				{/if}
				<div>
					<div>{name}</div>
					<div class="text-xs uppercase font-semibold opacity-60">Create at: {_createdAt}</div>
				</div>
				<a href="/groups/{slug}" class="btn btn-square btn-ghost">
					<ExternalLink />
				</a>
				<a href="/admin/groups/{slug}" class="btn btn-square btn-ghost">
					<SquarePen />
				</a>
			</li>
		{/each}
	</ul>
</div>
