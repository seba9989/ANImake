import type { RemoteFormField, RemoteFormFieldType } from '@sveltejs/kit';
import Field from './Field.svelte';
import type { HTMLInputAttributes } from 'svelte/elements';
import Secret from './assets/Secret.svelte';
import type { Snippet } from 'svelte';

export type FieldProps = (
	| {
			field?: RemoteFormField<string>;
			type?: RemoteFormFieldType<string>;
	  }
	| {
			field?: undefined;
			type?: HTMLInputAttributes['type'];
	  }
) & {
	wrapperClass?: string;
	class?: string;
	placeholder?: string;
	optional?: boolean;
	value?: HTMLInputAttributes['value'];
	children?: Snippet;
	preChildren?: Snippet;
};

export default Object.assign(Field, { Secret });
