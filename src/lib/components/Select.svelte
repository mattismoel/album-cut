<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements';

	type Props = HTMLSelectAttributes;

	let { ...rest }: Props = $props();
</script>

<select {...rest} class="input">
	{@render rest.children?.()}
</select>
