<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { RemoteFormField } from '@sveltejs/kit';
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	type Props = {
		field?: RemoteFormField<string>;
		class?: string;
		wrapperClass?: string;
		placeholder?: string;
		required?: boolean;
		value?: HTMLTextareaAttributes['value'];
	};

	let {
		field,
		class: className,
		wrapperClass,
		placeholder,
		required = true,
		value = $bindable()
	}: Props = $props();

	let issues = $derived(field?.issues());
</script>

<div class={cn(wrapperClass)}>
	<textarea {...field?.as('text')} class={cn('textarea w-full', className)} {placeholder} bind:value
	></textarea>
	{#if !required}
		<span class="badge badge-neutral badge-xs">Optional</span>
	{/if}
	{#each issues as issue}
		<p class="text-error visible mt-0.5">
			<span class="status status-sm status-error mr-0.5"></span>
			{issue.message}
		</p>
	{/each}
</div>
