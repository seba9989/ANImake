<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { RemoteFormField } from '@sveltejs/kit';
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	type Props = {
		field?: RemoteFormField<string>;
		class?: string;
		wrapperClass?: string;
		placeholder?: string;
		optional?: boolean;
		value?: HTMLTextareaAttributes['value'];
	};

	let {
		field,
		class: className,
		wrapperClass,
		placeholder,
		optional = true,
		value = $bindable()
	}: Props = $props();

	let issues = $derived(field?.issues());
</script>

<div class={cn('flex w-full flex-col gap-1', wrapperClass)}>
	<textarea {...field?.as('text')} class={cn('textarea w-full', className)} {placeholder} bind:value
	></textarea>
	{#if optional}
		<span class="ml-auto badge badge-xs badge-neutral">Optional</span>
	{/if}
	{#each issues as issue}
		<p class="visible mt-0.5 text-error">
			<span class="mr-0.5 status status-sm status-error"></span>
			{issue.message}
		</p>
	{/each}
</div>
