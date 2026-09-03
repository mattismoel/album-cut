<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements';
	import Button from './Button.svelte';

	type Option = {
		name: string;
		value: string;
	};

	type Props = HTMLSelectAttributes & {
		options: Option[];
		selected: string[];
		maxSelect?: number;
	};

	let { options, maxSelect, selected = $bindable(), ...rest }: Props = $props();

	const isSelected = (value: string): boolean => {
		if (!selected) return false;
		return selected.includes(value);
	};

	const toggle = (value: string) => {
		if (!selected) return;

		if (isSelected(value)) {
			selected = selected.filter((v) => v !== value);
		} else {
			if (maxSelect && selected.length >= maxSelect) return;

			selected = [...selected, value];
		}
	};
</script>

<select multiple hidden {...rest}>
	{#each options as { value, name }}
		<option selected={isSelected(value)} {value}>{name}</option>
	{/each}
</select>

<ul>
	{#each options as { value, name }}
		<li>
			<Button
				disabled={!isSelected(value) && (maxSelect ? selected.length >= maxSelect : false)}
				variant={isSelected(value) ? 'primary' : 'secondary'}
				type="button"
				onclick={() => toggle(value)}
			>
				{name}
			</Button>
		</li>
	{/each}
</ul>

<style>
	ul {
		padding: 0;
		list-style-type: none;
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-2);
	}
</style>
