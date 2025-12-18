<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { RemoteFormField } from '@sveltejs/kit';
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = {
		field?: RemoteFormField<boolean>;
		class?: string;
		wrapperClass?: string;
		placeholder?: string;
		required?: boolean;
		value?: HTMLInputAttributes['value'];
		checked?: boolean;
	};

	let {
		class: className,
		wrapperClass,
		placeholder,
		field,
		checked = $bindable(false)
	}: Props = $props();

	let issues = $derived(field?.issues());
</script>

<label class={cn('label', wrapperClass)}>
	<input
		{...field?.as('checkbox')}
		type="checkbox"
		bind:checked
		class={cn('checkbox checkbox-sm', { 'checkbox-error': !!issues }, className)}
	/>
	<p class={cn({ 'text-error': !!issues })}>
		{placeholder}
	</p>
</label>
