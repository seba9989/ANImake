<script lang="ts">
	import Form from '$lib/components/Form';
	import { FileX } from 'lucide-svelte';
	import type { PageProps } from './$types';
	import { SvelteMap } from 'svelte/reactivity';
	import { organization } from '$lib/actions/organization';
	import { user } from '$lib/actions/user';

	let { data }: PageProps = $props();

	let searchName = $state('');
	let roleMap = $state(new SvelteMap<string, string>());

	const members = $derived(
		await organization.member.list({
			options: {
				page: 1,
				perPage: 100
			},
			query: {
				organizationId: data?.organization?.id ?? '',
				searchName,
				role: roleMap.keys().toArray().at(0)
			}
		})
	);

	const rules = $derived(await organization.member.role.list());

	let dialog: HTMLDialogElement;

	let memberForm = organization.member.create;
</script>

<div class="bg-base-200 p-2 rounded-lg flex flex-col gap-2">
	<Form class="flex gap-2">
		<div class="grid grid-cols-2 grow gap-2">
			<Form.Field placeholder="Nazwa członka" bind:value={searchName} />
			<Form.Combobox
				options={new SvelteMap(
					rules.map((role) => [role, role.charAt(0).toUpperCase() + role.slice(1)])
				)}
				bind:value={roleMap}
				placeholder="Rola"
			/>
		</div>
		<div class="divider divider-horizontal mx-1"></div>
		<button type="button" class="btn btn-secondary" onclick={() => dialog.showModal()}>
			Dodaj członka
		</button>
	</Form>
	<ul class="list bg-base-100 rounded-box shadow-md">
		{#each members?.data as { role, createdAt, user: { name, image } }}
			{@const _createdAt = new Intl.DateTimeFormat('pl-PL').format(createdAt)}
			<li class="list-row">
				{#if image}
					<div class="avatar">
						<div class="w-10 rounded">
							<img src={image} alt="" />
						</div>
					</div>
				{:else}
					<div class="h-full w-10 btn-disabled btn btn-square flex">
						<FileX class="m-auto" />
					</div>
				{/if}
				<div>
					<div>{name} ({role.charAt(0).toUpperCase() + role.slice(1)})</div>
					<div class="text-xs uppercase font-semibold opacity-60">Członek od: {_createdAt}</div>
				</div>
			</li>
		{/each}
	</ul>
</div>

<dialog bind:this={dialog} class="modal">
	<div class="modal-box overflow-visible">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<h3 class="text-lg font-bold mb-2">Nowy członek</h3>
		<Form form={memberForm} class="grid gap-2">
			<input
				class="hidden"
				defaultChecked
				{...memberForm.fields.organizationId.as('radio', data?.organization?.id ?? '')}
				checked
			/>
			<Form.Combobox
				field={memberForm.fields.userId}
				filterFn={async (filter: string) => {
					const userList = await user.list({
						options: { page: 1 },
						query: {
							searchName: filter
						}
					});

					return new Map(userList?.data.map(({ name, id }) => [id, name]));
				}}
				placeholder="Nazwa członka"
			/>
			<Form.Combobox
				multiple
				field={memberForm.fields.role}
				options={new SvelteMap(
					rules.map((role) => [role, role.charAt(0).toUpperCase() + role.slice(1)])
				)}
				placeholder="Nazwa członka"
			/>

			<button class="btn btn-secondary" type="submit">Dodaj</button>
		</Form>
	</div>
</dialog>
