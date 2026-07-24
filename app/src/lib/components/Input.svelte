<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = HTMLInputAttributes & {
		align?: 'left' | 'center' | 'right';
	};

	let { align = 'left', ...rest }: Props = $props();
</script>

<input {...rest} data-align={align} class="input" />
