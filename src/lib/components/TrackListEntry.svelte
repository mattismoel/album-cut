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

	const handleDeleteArtist = (idx: number) => {
		const prevArtists = form.fields.tracks[i].artists.value();
		form.fields.tracks[i].artists.set(prevArtists.filter((_, i) => i !== idx));
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
	</div>

	<div class="artists stack-2">
		<ul class="stack-2 artists--list">
			{#each form.fields.tracks[i].artists.value(), j}
				<li class="stretch row-2">
					<FormField class="stretch" issues={form.fields.tracks[i].artists[j].issues()}>
						<Input {...form.fields.tracks[i].artists[j].as('text')} placeholder="Artist" />
					</FormField>
					<Button class="btn-dangerous" type="button" onclick={() => handleDeleteArtist(j)}>
						<Icon icon="boxicons:trash" />
					</Button>
				</li>
			{/each}
		</ul>

		<Button type="button" onclick={handleAddArtist}>+ Artist</Button>
	</div>

	<Button type="button" class="stretch btn-dangerous" onclick={onDelete}>
		<Icon icon="boxicons:trash" />
		Delete Track
	</Button>
</li>

<style>
	.artists {
		margin-bottom: var(--spacing-4);

		.artists--list {
			list-style-type: none;
		}
	}

	.arrow {
		flex-shrink: 0;
	}

	.timestamps {
		display: flex;
		align-items: center;
		gap: var(--spacing-2);
		margin-bottom: var(--spacing-4);
	}

	.row {
		display: grid;
		gap: var(--spacing-2);
	}

	.track {
		padding: var(--spacing-8) var(--spacing-4);
	}

	.track--count {
		font-weight: 600;
	}
</style>
