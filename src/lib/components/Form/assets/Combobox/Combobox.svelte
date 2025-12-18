<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import {
		arrow,
		autoUpdate,
		flip,
		offset,
		useClick,
		useDismiss,
		useFloating,
		useInteractions,
		useRole
	} from '@skeletonlabs/floating-ui-svelte';
	import type { RemoteFormField } from '@sveltejs/kit';
	import Fuse from 'fuse.js';
	import { ArrowUpDown, Search } from 'lucide-svelte';
	import Portal from 'svelte-portal';
	import { SvelteMap } from 'svelte/reactivity';
	import { fade } from 'svelte/transition';

	type Props = (
		| {
				field?: RemoteFormField<string>;
				multiple?: false;
		  }
		| {
				field?: RemoteFormField<string[]>;
				multiple?: true;
		  }
	) & {
		value?: SvelteMap<string, string>;
		filter?: string;
		placeholder?: string;
		options?: SvelteMap<string, string>;
		filterFn?: (filter: string, options: Map<string, string>) => Promise<Map<string, string>>;
	};

	let {
		field,

		multiple = false,
		value = $bindable(new SvelteMap()),
		placeholder,

		filter = $bindable(''),
		options = $bindable(new SvelteMap()),
		filterFn = async (filter: string) => {
			return filter.length > 0
				? new Map(fuse.search(filter).map(({ item }) => [item.key, item.value]))
				: options;
		}
	}: Props = $props();

	const fuse = new Fuse(
		options
			.entries()
			.toArray()
			.map(([key, value]) => ({
				key,
				value
			})),
		{
			keys: ['key', 'value']
		}
	);

	const visibleOptions = $derived(await filterFn(filter, options));

	const onCheckboxClick = (
		target: MouseEvent & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) => {
		let _map = new SvelteMap(value);
		const _key = target.currentTarget.value;

		if (_map.has(_key)) {
			_map.delete(_key);
		} else {
			if (!multiple) _map.clear();
			const _value = visibleOptions.get(_key);

			if (_value) {
				_map.set(_key, _value);
			}
		}

		value = _map;
	};

	let issues = $derived(field?.issues());

	// State
	let open = $state(false);
	let elemArrow: HTMLElement | null = $state(null);

	// Use Floating
	const floating = useFloating({
		whileElementsMounted: autoUpdate,
		get open() {
			return open;
		},
		onOpenChange: (v) => {
			open = v;
		},
		placement: 'bottom',
		get middleware() {
			return [offset(10), flip(), elemArrow && arrow({ element: elemArrow })];
		}
	});

	// Interactions
	const role = useRole(floating.context, { role: 'combobox' });
	const click = useClick(floating.context);
	const dismiss = useDismiss(floating.context);
	const interactions = useInteractions([role, click, dismiss]);
</script>

{#if field}
	<div class="hidden">
		{#if multiple}
			{#each value as [key]}
				<!-- prettier-ignore -->
				<input  defaultChecked {...(field as RemoteFormField<string[]>).as('checkbox', key)} checked />
			{/each}
		{:else}
			{#each value as [key]}
				<!-- prettier-ignore -->
				<input defaultChecked {...(field as RemoteFormField<string>).as('radio', key)} checked />
			{/each}
		{/if}
	</div>
{/if}

<button
	type="button"
	bind:this={floating.elements.reference}
	{...interactions.getReferenceProps()}
	class={cn('input w-full min-w-0 cursor-pointer')}
>
	{#if value.size > 0}
		<div class={cn('w-full truncate text-start')}>
			{new Intl.ListFormat('pl').format(value.values())}
		</div>
	{:else}
		<div class={cn('w-full text-start text-[--alpha(var(--color-base-content)/50%)]')}>
			{placeholder}
		</div>
	{/if}
	<span class="label">
		<ArrowUpDown />
	</span>
</button>
{#each issues as issue}
	<p class="text-error visible mt-0.5">
		<span class="status status-sm status-error mr-0.5"></span>
		{issue.message}
	</p>
{/each}

{#if open}
	<div
		bind:this={floating.elements.floating}
		style={floating.floatingStyles +
			` width: ${floating.elements.reference?.getBoundingClientRect().width}px;`}
		{...interactions.getFloatingProps()}
		class="z-50 flex w-full flex-col rounded-md bg-base-300 p-4 drop-shadow-lg"
		transition:fade={{ duration: 200 }}
	>
		<label class="input input-sm w-full input-ghost">
			<span class="label">
				<Search />
			</span>
			<input type="text" bind:value={filter} />
		</label>
		<div class="divider m-0"></div>
		<div class="flex max-h-40 flex-col overflow-y-scroll">
			<svelte:boundary>
				{#each visibleOptions.keys() as key}
					<label
						class="flex items-center gap-2 rounded-sm px-2 py-1 hover:bg-[--alpha(var(--color-base-content)/15%)]"
					>
						<input
							type={multiple ? 'checkbox' : 'radio'}
							class={cn({
								'checkbox checkbox-sm': multiple,
								'radio radio-sm': !multiple
							})}
							value={key}
							onclick={onCheckboxClick}
							checked={value.has(key)}
						/>

						<span>{visibleOptions.get(key)}</span>
					</label>
				{/each}
				{#snippet pending()}
					<div></div>
				{/snippet}
			</svelte:boundary>
		</div>
	</div>
{/if}
