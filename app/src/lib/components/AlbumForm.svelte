<script lang="ts">
	import { createAlbum } from '$lib/album.remote';
	import Icon from '@iconify/svelte';
	import Button from './Button.svelte';
	import Form from './Form.svelte';
	import FormField from './FormField.svelte';
	import FormSection from './FormSection.svelte';
	import Input from './Input.svelte';
	import PillSelector from './PillSelector.svelte';
	import TrackList from './TrackList.svelte';
	import AlbumArtSelector from './AlbumArtSelector.svelte';
	import { onMount } from 'svelte';

	const MAX_GENRE_COUNT = 5;

	const DEFAULT_GENRES = [
		'Rock',
		'Pop',
		'R&B',
		'Hip Hop',
		'Rap',
		'Classical',
		'Electronic',
		'Punk',
		'Soul',
		'Electronica',
		'Jazz',
		'Trance',
		'Electropop',
		'Synth-Pop',
		'Indie Rock',
		'Blues',
		'Metal',
		'Fusion',
		'Funk'
	].sort();

	onMount(() => {
		createAlbum.fields.set({
			albumArtists: ['']
		});
	});

	const handleAddTrack = () => {
		const prevTracks = createAlbum.fields.tracks.value() ?? [];

		const id = crypto.randomUUID();

		const lastTrack = prevTracks.at(-1);

		const newTime = lastTrack?.to ?? '00:00:00';
		const artist = createAlbum.fields.albumArtists.value().at(0);

		createAlbum.fields.tracks.set([
			...prevTracks,
			{
				id,
				from: newTime,
				to: newTime,
				artists: artist ? [artist] : ['']
			}
		]);
	};

	let isGeneralFilled = $derived.by(() => {
		const { title, coverArt, releaseDate, url, albumArtist } = createAlbum.fields;

		return (
			title.value() !== '' &&
			coverArt.value() !== undefined &&
			releaseDate.value() !== undefined &&
			url.value() !== '' &&
			albumArtist.value() !== ''
		);
	});

	const handleDeleteTrack = (id: string) => {
		const prevTracks = createAlbum.fields.tracks.value();
		if (!prevTracks || prevTracks.length === 0) return;

		createAlbum.fields.tracks.set(prevTracks.filter((t) => t?.id !== id));
	};

	const handleAddGenre = () => {
		if (!genreInput) return;

		genres = [...genres, genreInput.value];
	};

	const handleAddAlbumArtist = () => {
		const prevArtists = createAlbum.fields.albumArtists.value() ?? [];

		createAlbum.fields.albumArtists.set([...prevArtists, '']);
	};

	let genres = $state([...DEFAULT_GENRES]);

	let genreCount = $derived(
		createAlbum.fields.genres.value() ? createAlbum.fields.genres.value().length : 0
	);

	let genreInput = $state<HTMLInputElement>();
</script>

<Form
	form={createAlbum}
	title="AlbumCut"
	description="With this tool you can cut any YouTube video into an album format with the correctly set metadata."
	submitBtnText={{ normal: 'Cut Album', submitting: 'Cutting Album...' }}
	enctype="multipart/form-data"
>
	<section class="stack-16">
		<FormSection title="General" description="Here you input the general album information.">
			<FormField issues={createAlbum.fields.coverArt.issues()}>
				<div class="album-art-container center-container">
					<AlbumArtSelector {...createAlbum.fields.coverArt.as('file')} />
				</div>
			</FormField>

			<FormField issues={createAlbum.fields.url.issues()}>
				<Input placeholder="URL" {...createAlbum.fields.url.as('url')} />
			</FormField>

			<div class="row-2">
				<FormField issues={createAlbum.fields.title.issues()}>
					<Input placeholder="Title" {...createAlbum.fields.title.as('text')} />
				</FormField>
				<FormField issues={createAlbum.fields.releaseDate.issues()}>
					<Input placeholder="Year" {...createAlbum.fields.releaseDate.as('number')} />
				</FormField>
			</div>

			{#each createAlbum.fields.albumArtists.value(), i}
				<FormField issues={createAlbum.fields.albumArtists[i].issues()}>
					<Input placeholder="Album Artist" {...createAlbum.fields.albumArtists[i].as('text')} />
				</FormField>
			{/each}
			<Button type="button" onclick={handleAddAlbumArtist}>+ Artist</Button>
		</FormSection>

		<FormSection
			title={`Genres (${genreCount} of ${MAX_GENRE_COUNT})`}
			description="Define the genres associated with this album."
		>
			<div class="genre-input--container">
				<Input placeholder="Genre Name" bind:element={genreInput} />
				<Button type="button" onclick={handleAddGenre}>
					<Icon icon="boxicons:plus" style="flex-shrink: 0" />
					Add
				</Button>
			</div>

			<FormField issues={createAlbum.fields.genres.issues()}>
				<PillSelector
					{...createAlbum.fields.genres.as('select multiple')}
					bind:selected={
						() => createAlbum.fields.genres.value() || [],
						(newGenres) => createAlbum.fields.genres.set(newGenres)
					}
					maxSelect={MAX_GENRE_COUNT}
					options={genres.map((g) => ({ value: g, name: g }))}
				/>
			</FormField>
		</FormSection>

		<FormSection
			title="Tracks"
			description="Here you add the tracks that the video should be split into."
		>
			{#if isGeneralFilled}
				<TrackList form={createAlbum} onAdd={handleAddTrack} onDelete={handleDeleteTrack} />
			{:else}
				<span class="italic">Please fill out the general section before adding tracks.</span>
			{/if}
		</FormSection>
	</section>
</Form>

<style>
	.album-art-container {
		margin-bottom: var(--spacing-8);
	}

	.genre-input--container {
		display: flex;
		gap: var(--spacing-2);
	}
</style>
