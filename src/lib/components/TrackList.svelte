<script lang="ts">
	import { createAlbum } from '$lib/album.remote';
	import Button from './Button.svelte';
	import TrackListEntry from './TrackListEntry.svelte';

	type Props = {
		form: typeof createAlbum;
		onAdd: () => void;
		onDelete: (id: string) => void;
	};

	let { form, onAdd, onDelete }: Props = $props();
</script>

<div>
	{#if form.fields.tracks.value() && form.fields.tracks.value().length > 0}
		<ul>
			{#each form.fields.tracks.value() as track, i (track?.id)}
				<TrackListEntry
					{i}
					form={createAlbum}
					onDelete={() => (track?.id ? onDelete(track.id) : undefined)}
					field={form.fields.tracks[i]}
				/>
			{/each}
		</ul>
	{:else}
		<p class="empty-list-text">No tracks as of yet. Add the first one below...</p>
	{/if}

	<Button type="button" onclick={onAdd}>+ Add Track</Button>
</div>

<style>
	.empty-list-text {
		font-style: italic;
		margin-bottom: var(--spacing-8);
	}

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
			padding: var(--spacing-8) var(--spacing-4);
		}
	}

	@media (min-width: 50rem) {
		.track {
			padding: var(--spacing-2) 1rem;
			&:focus-within {
				background: var(--clr-surface-900);
			}
		}
	}

	.track--count {
		font-weight: 600;
	}
</style>
