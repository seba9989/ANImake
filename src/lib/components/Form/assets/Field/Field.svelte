<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { FieldProps } from '.';

	let {
		field,
		class: className,
		type = 'text',
		placeholder,
		required = true,
		value = $bindable(),
		children
	}: FieldProps = $props();
	// const issues = $derived(field && field.issues());

	let issues = $derived(field?.issues());

	$inspect(issues);
</script>

{#if field}
	<div class="">
		<label class={cn({ 'input-error': issues }, 'input w-full min-w-0', className)}>
			<input {...field.as(type as any)} class="grow" {placeholder} bind:value />
			{@render children?.()}
			{#if !required}
				<span class="badge badge-neutral badge-xs">Optional</span>
			{/if}
		</label>
		{#each issues as issue}
			<p class="text-error visible mt-0.5">
				<span class="status status-sm status-error mr-0.5"></span>
				{issue.message}
			</p>
		{/each}
	</div>
{:else}
	<input {type} class={cn('validator input w-full min-w-0', className)} {placeholder} bind:value />
{/if}
