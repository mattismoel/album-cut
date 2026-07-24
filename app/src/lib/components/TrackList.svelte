<script lang="ts">
	import { createAlbum } from '$lib/album.remote';
	import Button from './Button.svelte';
	import Input from './Input.svelte';
	import TimestampInput from './TimestampInput.svelte';
	import Icon from '@iconify/svelte';

	type Props = {
		form: typeof createAlbum;
		onAdd: () => void;
	};

	let { form, onAdd }: Props = $props();
</script>

<div>
	<ul>
		{#each form.fields.tracks.value() as track, i (track?.id)}
			<li class="track">
				{#if track?.id}
					<Input {...createAlbum.fields.tracks[i].id.as('hidden', track.id)} />
				{/if}

				<Input {...createAlbum.fields.tracks[i].trackNumber.as('hidden', i + 1)} />

				<div class="row">
					<span class="track--count">#{i + 1}</span>

					<Input placeholder="Title" {...createAlbum.fields.tracks[i].title.as('text')} />

					<div class="timestamps">
						<TimestampInput {...createAlbum.fields.tracks[i].from.as('time')} />
						<div class="arrow">
							<Icon icon="boxicons:arrow-right-stroke" />
						</div>
						<TimestampInput {...createAlbum.fields.tracks[i].to.as('time')} />
					</div>

					<Button shrinkMode="stretch">
						<Icon icon="boxicons:trash" />
					</Button>
				</div>
			</li>
		{/each}
	</ul>

	<Button type="button" onclick={onAdd}>+ Add Track</Button>
</div>

<style>
	ul {
		padding: 0;
		list-style-type: none;
		margin-bottom: var(--spacing-8);

		& > *:not(:last-child) {
			border-bottom: 1px solid var(--clr-surface-900);
		}
	}

	.arrow {
		flex-shrink: 0;
	}

	.timestamps {
		display: flex;
		align-items: center;
		gap: var(--spacing-2);
	}

	@media (max-width: 50rem) {
		.row {
			display: grid;
			gap: var(--spacing-2);
		}
	}

	@media (min-width: 50rem) {
		.row {
			display: grid;
			grid-template-columns: 32px 1fr 1fr 48px;
			gap: var(--spacing-4);
			align-items: center;
		}
	}

	@media (max-width: 50rem) {
		.track {
			padding: var(--spacing-8) 1rem;
		}
	}

	@media (min-width: 50rem) {
		.track {
			padding: var(--spacing-2) 1rem;
		}
	}

	.track {
		&:focus-within {
			background: var(--clr-surface-900);
		}
	}

	.track--count {
		font-weight: 600;
	}
</style>
