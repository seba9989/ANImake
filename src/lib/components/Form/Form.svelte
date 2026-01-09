<script lang="ts" generics="TInput extends RemoteFormInput | void, TOutput">
	import type { RemoteForm, RemoteFormInput, RemoteFormIssue } from '@sveltejs/kit';
	import type { HTMLFormAttributes } from 'svelte/elements';

	type Props = HTMLFormAttributes & {
		form?: RemoteForm<TInput, TOutput>;
		validation?: boolean;
		enhance?: Parameters<RemoteForm<TInput, TOutput>['enhance']>[0];
	};

	let {
		children,
		form,
		validation = true,
		enhance,

		...formProps
	}: Props = $props();
</script>

{#if typeof enhance !== 'undefined'}
	<form
		{...formProps}
		{...form?.enhance(enhance)}
		enctype="multipart/form-data"
		oninput={validation ? () => form?.validate() : () => {}}
	>
		{@render children?.()}
		{#each form?.fields.issues() as issue}
			<p class="visible mt-0.5 text-error">
				<span class="mr-0.5 status status-sm status-error"></span>
				{issue.message}
			</p>
		{/each}
	</form>
{:else}
	<form
		{...formProps}
		{...form}
		enctype="multipart/form-data"
		oninput={validation ? () => form?.validate() : () => {}}
	>
		{@render children?.()}
		{#each form?.fields.issues() as issue}
			<p class="visible mt-0.5 text-error">
				<span class="mr-0.5 status status-sm status-error"></span>
				{issue.message}
			</p>
		{/each}
	</form>
{/if}
