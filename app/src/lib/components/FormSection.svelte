<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		title: string;
		description: string;
		children: Snippet<[]>;
	};

	let { title, description, children }: Props = $props();
</script>

<fieldset>
	<header class="header">
		<h2>{title}</h2>
		<p>{description}</p>
	</header>

	<div class="stack-2">
		{@render children()}
	</div>
</fieldset>

<style>
	.header {
		margin-bottom: var(--spacing-8);
	}

	h2 {
		font-family: var(--font-heading);
		font-weight: 1000;
		font-size: var(--text-lg);
		color: var(--clr-text-light);
	}
</style>
