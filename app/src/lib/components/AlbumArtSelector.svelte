<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import Cover from '$lib/assets/cd-cover.png';

	type Props = Omit<HTMLInputAttributes, 'type'> & {};

	let { ...rest }: Props = $props();

	let src = $derived.by(() => {
		const file = rest.files?.item(0);
		if (!file) return undefined;

		return URL.createObjectURL(file);
	});
</script>

<div class="container">
	<div class="image-container">
		<img {src} alt="" data-spin={src !== undefined ? 'true' : 'false'} />
		<img src={Cover} alt="" class="cover" />
	</div>

	<label for="file-input" class="btn btn-primary">
		<input id="file-input" class="btn file-input" type="file" {...rest} />
		Select Cover Art
	</label>
</div>

<style>
	input[type='file'] {
		display: none;
	}

	@keyframes record {
		from {
			rotate: 0deg;
		}

		to {
			--spin-count: 10;
			rotate: calc(var(--spin-count) * 360deg);
		}
	}

	.cover {
		position: absolute;

		top: 50%;
		left: 50%;

		transform: translate(-50%, -50%);
	}

	.image-container {
		position: relative;

		margin-bottom: var(--spacing-8);

		&::after {
			content: '';
			position: absolute;

			top: 50%;
			left: 50%;

			transform: translate(-50%, -50%);
			border-radius: 100%;

			z-index: 100;
			background: var(--clr-background);
			width: 2rem;
			aspect-ratio: 1 / 1;
		}
	}

	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	img {
		--cover-size: 15rem;

		&[data-spin='true'] {
			animation: record 3s cubic-bezier(0.075, 0.82, 0.165, 1);
		}

		width: var(--cover-size);
		aspect-ratio: 1 / 1;
		border-radius: 100%;
		border: none;
		object-fit: cover;
	}
</style>
