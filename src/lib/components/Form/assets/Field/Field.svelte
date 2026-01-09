<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { onMount } from 'svelte';
	import type { FieldProps } from '.';

	let {
		field,
		wrapperClass,
		class: className,
		type = 'text',
		placeholder,
		optional,
		value = $bindable(),
		children,
		preChildren
	}: FieldProps = $props();
	// const issues = $derived(field && field.issues());

	let issues = $derived(field?.issues());

	onMount(() => {
		if (!!field) {
			field.set(value);
		}
	});
</script>

{#snippet input()}
	{#if field}
		<input {...field.as(type as any)} class="grow" {placeholder} bind:value />
	{:else}
		<input type="text" class="grow" {placeholder} bind:value />
	{/if}
{/snippet}

<div class={cn(wrapperClass)}>
	<label class={cn({ 'input-error': issues }, 'input w-full min-w-0', className)}>
		{@render preChildren?.()}
		{@render input()}
		{@render children?.()}
		{#if optional}
			<span class="badge badge-xs badge-neutral">Optional</span>
		{/if}
	</label>
	{#each issues as issue}
		<p class="visible mt-0.5 text-error">
			<span class="mr-0.5 status status-sm status-error"></span>
			{issue.message}
		</p>
	{/each}
</div>
