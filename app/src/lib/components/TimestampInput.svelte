<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import Input from './Input.svelte';

	type Props = Omit<HTMLInputAttributes, 'type'> & {
		type: 'time';
	};

	let props: Props = $props();
</script>

<div class="container">
	<Input align="center" {...props} type="time" step="2" placeholder="00" />
</div>

<style>
	.container {
		width: 100%;
		font-family: var(--font-mono);
	}
</style>
