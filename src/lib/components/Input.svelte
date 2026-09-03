<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = HTMLInputAttributes & {
		element?: HTMLInputElement | undefined;
		align?: 'left' | 'center' | 'right';
	};

	let { align = 'left', element = $bindable(), ...rest }: Props = $props();
</script>

<input {...rest} data-align={align} class="input" bind:this={element} />
