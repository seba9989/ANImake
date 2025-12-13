<script lang="ts" generics="TInput extends RemoteFormInput | void, TOutput">
	import type { RemoteForm, RemoteFormInput, RemoteFormIssue } from '@sveltejs/kit';
	import type { HTMLFormAttributes } from 'svelte/elements';

	type Props = HTMLFormAttributes & {
		form: RemoteForm<TInput, TOutput>;
		validation?: boolean;
	};

	let {
		children,
		form,
		validation = true,

		...formProps
	}: Props = $props();
</script>

<form
	{...formProps}
	{...form}
	enctype="multipart/form-data"
	oninput={validation ? () => form?.validate() : () => {}}
>
	{@render children?.()}
</form>
