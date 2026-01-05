<script lang="ts">
	import { page } from '$app/state';
	import { organization } from '$lib/actions/organization';
	import Form from '$lib/components/Form';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let org = $derived(data.organization);
	let { fields } = organization.create;
</script>

<div class="grid max-w-2xl gap-2">
	<Form form={organization.update} class="flex flex-col gap-2 bg-base-200 p-2 rounded-lg">
		<Form.Field field={fields.name} placeholder="Nazwa grupy" value={org?.name} />
		<Form.Field field={fields.slug} placeholder="Slug" value={org?.slug} />
		<Form.Field field={fields.logoUrl} placeholder="Logo URL" value={org?.logoUrl} required={false} />
		<Form.Field
			field={fields.bannerUrl}
			placeholder="Banner URL"
			value={org?.bannerUrl}
			required={false}
		/>
		<Form.Field
			field={fields.discordUrl}
			placeholder="Discord URL"
			value={org?.discordUrl}
			required={false}
		/>
		<Form.Textarea
			field={fields.description}
			placeholder="Opis grupy"
			value={org?.description}
			required={false}
		/>
		<button class="btn btn-secondary" type="submit">Zaktualizuj</button>
	</Form>
	<div class="grid grid-flow-col gap-2">
		<a class="btn btn-accent" href="{page.url.href}/members">Członkowie</a>
		<a class="btn btn-info" href="{page.url.href}/invitations">Zaproszenia</a>
	</div>
</div>
