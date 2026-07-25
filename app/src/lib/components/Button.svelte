<script lang="ts">
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	type Variant = 'primary' | 'secondary';
	type ShrinkMode = 'fit' | 'stretch' | 'responsive';

	type BaseProps = {
		shrinkMode?: ShrinkMode;
		variant?: Variant;
	};
	type ButtonAttributes = HTMLButtonAttributes & {
		href?: never;
	};

	type LinkButtonAttributes = HTMLAnchorAttributes & {
		href: string;
	};

	type Props = BaseProps & (ButtonAttributes | LinkButtonAttributes);

	let { shrinkMode = 'fit', variant = 'secondary', ...rest }: Props = $props();
</script>

<svelte:element
	this={rest.href ? 'a' : 'button'}
	data-variant={variant}
	data-shrink-mode={shrinkMode}
	{...rest}
	class="btn"
>
	{@render rest.children?.()}
</svelte:element>

<style>
	.btn {
		display: flex;
		gap: var(--spacing-4);
		align-items: center;
		justify-content: center;

		padding: var(--spacing-2) var(--spacing-4);
		border-radius: var(--radius-lg);
		border-width: 1px;
		border-style: solid;

		font-weight: 600;

		transition: color 50ms linear;

		&[data-variant='primary'] {
			background: var(--clr-primary);
			color: var(--clr-text-dark-muted);
			border-color: var(--clr-primary);

			&:hover {
				color: var(--clr-text-dark);
			}

			&:disabled {
				--clr-disabled: oklch(from var(--clr-primary) max(l - 0.15, 0) c h);

				background: var(--clr-disabled);
				border: var(--clr-disabled);
			}
		}

		&[data-variant='secondary'] {
			background: var(--clr-surface-700);
			color: var(--clr-text-light-muted);
			border-color: var(--clr-surface-600);

			&:hover {
				color: var(--clr-text-light);
			}
		}

		&[data-shrink-mode='fit'] {
			max-width: fit-content;
		}
		&[data-shrink-mode='stretch'] {
			height: 100%;
		}

		&[data-shrink-mode='responsive'] {
			@media (max-width: 700px) {
				max-width: 100%;
			}

			@media (min-width: 700px) {
				max-width: fit-content;
			}
		}
	}
</style>
