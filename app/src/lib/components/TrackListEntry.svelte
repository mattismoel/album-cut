<script lang="ts">
	import Icon from '@iconify/svelte';
	import Button from './Button.svelte';
	import Input from './Input.svelte';
	import TimestampInput from './TimestampInput.svelte';
	import type { createAlbum } from '$lib/album.remote';
	import { onMount } from 'svelte';
	import FormField from './FormField.svelte';

	type Props = {
		i: number;
		form: typeof createAlbum;
		field: (typeof createAlbum)['fields']['tracks'][number];

		onDelete: () => void;
	};

	let { i, form, field, onDelete }: Props = $props();

	let track = $derived(field.value());

	let titleInput = $state<HTMLInputElement>();

	const handleAddArtist = () => {
		const prevArtists = form.fields.tracks[i].artists.value();
		form.fields.tracks[i].artists.set(prevArtists ? [...prevArtists, ''] : ['']);
	};

	onMount(() => {
		if (!titleInput) return;
		titleInput.focus();
	});
</script>

<li class="track">
	{#if track.id}
		<Input {...form.fields.tracks[i].id.as('hidden', track.id)} />
	{/if}

	<Input {...form.fields.tracks[i].trackNumber.as('hidden', i + 1)} />

	<div class="row">
		<span class="track--count">#{i + 1}</span>

		<Input
			placeholder="Title"
			{...form.fields.tracks[i].title.as('text')}
			bind:element={titleInput}
		/>

		<div class="timestamps">
			<TimestampInput field={form.fields.tracks[i].from} />
			<div class="arrow">
				<Icon icon="boxicons:arrow-right-stroke" />
			</div>
			<TimestampInput field={form.fields.tracks[i].to} />
		</div>

		{#each form.fields.tracks[i].artists.value() as artist, j}
			<FormField issues={form.fields.tracks[i].artists[j].issues()}>
				<Input {...form.fields.tracks[i].artists[j].as('text')} placeholder="Artist" />
			</FormField>
		{/each}

		<Button type="button" onclick={handleAddArtist} shrinkMode="stretch">+ Artist</Button>

		<Button type="button" shrinkMode="stretch" onclick={onDelete}>
			<Icon icon="boxicons:trash" />
		</Button>
	</div>
</li>

<style>
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
