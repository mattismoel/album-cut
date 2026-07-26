<script lang="ts">
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	type Variant = 'primary' | 'secondary';

	type BaseProps = {
		variant?: Variant;
	};

	type ButtonAttributes = HTMLButtonAttributes & {
		href?: never;
	};

	type LinkButtonAttributes = HTMLAnchorAttributes & {
		href: string;
	};

	type Props = BaseProps & (ButtonAttributes | LinkButtonAttributes);

	let { variant = 'secondary', ...rest }: Props = $props();
</script>

<svelte:element
	this={rest.href ? 'a' : 'button'}
	data-variant={variant}
	{...rest}
	class={[
		'btn',
		variant === 'primary' && 'btn-primary',
		variant === 'secondary' && 'btn-secondary',
		rest.class
	]}
>
	{@render rest.children?.()}
</svelte:element>
