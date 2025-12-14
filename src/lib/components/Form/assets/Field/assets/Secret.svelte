<script lang="ts">
	import { Eye, EyeClosed } from 'lucide-svelte';
	import type { FieldProps } from '..';
	import Field from '../Field.svelte';

	type Props = { isHidden?: boolean } & FieldProps;

	let { isHidden = $bindable(true), type, ...fieldProps }: Props = $props();
</script>

<Field {...fieldProps} type={isHidden ? 'password' : type ? (type as any) : 'text'}>
	<button type="button" class="opacity-50" onclick={() => (isHidden = !isHidden)}>
		{#if isHidden}
			<EyeClosed size="20" />
		{:else}
			<Eye size="20" />
		{/if}
	</button>
</Field>
