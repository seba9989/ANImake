<script lang="ts">
	import { organization } from '$lib/actions/organization';
	import Form from '$lib/components/Form';
	import { Info } from 'lucide-svelte';
	import type { PageProps } from './$types';
	import { page } from '$app/state';
	import Field from '$lib/components/Form/assets/Field';

	let { data }: PageProps = $props();

	let { fields } = organization.create;

	$inspect(fields.allIssues());
</script>

<Form form={organization.create} class="flex max-w-2xl flex-col gap-2 rounded-lg bg-base-200 p-2">
	<Form.Field field={fields.name} placeholder="Nazwa grupy" />
	<div class="flex gap-2">
		<Form.Field wrapperClass="grow" field={fields.slug} placeholder="Slug" />
		<div class="dropdown-hover dropdown dropdown-center">
			<div tabindex="0" role="button" class="btn btn-square text-info btn-ghost"><Info /></div>
			<div
				tabindex="-1"
				class="dropdown-content menu z-1 mt-1 rounded-md bg-neutral p-2 text-center text-nowrap shadow-sm"
			>
				<span> zapis url pod jakim będzie można znaleźć grupę. </span>
				<span> np. "jakaś_grupa" => "{page.url.origin}/jakaś_grupa" </span>
			</div>
		</div>
	</div>

	<Form.Field required={false} field={fields.logoUrl} placeholder="Logo URL" />
	<Form.Field required={false} field={fields.bannerUrl} placeholder="Banner URL" />
	<Form.Field required={false} field={fields.discordUrl} placeholder="Discord URL" />
	<Form.Textarea
		field={fields.description}
		placeholder="Opis grupy"
		class="w-full"
		required={false}
	/>
	<!-- <Form.Field field={fields.description} placeholder="Opi" /> -->

	<button class="btn btn-secondary" type="submit">Stwórz</button>
</Form>
