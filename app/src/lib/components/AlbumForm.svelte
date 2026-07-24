<script lang="ts">
	import { createAlbum } from '$lib/album.remote';
	import Form from './Form.svelte';
	import FormField from './FormField.svelte';
	import FormSection from './FormSection.svelte';
	import Input from './Input.svelte';
	import Select from './Select.svelte';
	import TrackList from './TrackList.svelte';

	const GENRES = ['Rock', 'Pop', 'R&B', 'Electronic'];

	const handleAddTrack = () => {
		const prevTracks = createAlbum.fields.tracks.value() ?? [];

		const id = crypto.randomUUID();

		const lastTrack = prevTracks.at(-1);

		createAlbum.fields.tracks.set([
			...prevTracks,
			{
				id,
				from: lastTrack ? lastTrack.to : undefined
			}
		]);
	};
</script>

<Form
	form={createAlbum}
	title="AlbumCut"
	description="With this tool you can cut any YouTube video into an album format with the correctly set metadata."
	enctype="multipart/form-data"
>
	<section class="stack-16">
		<FormSection title="General" description="Here you input the general album information.">
			<FormField issues={createAlbum.fields.url.issues()}>
				<Input placeholder="URL" {...createAlbum.fields.url.as('url')} />
			</FormField>
			<FormField issues={createAlbum.fields.coverArt.issues()}>
				<Input placeholder="Cover Art" {...createAlbum.fields.coverArt.as('file')} />
			</FormField>

			<div class="row-2">
				<FormField issues={createAlbum.fields.title.issues()}>
					<Input placeholder="Title" {...createAlbum.fields.title.as('text')} />
				</FormField>
				<FormField issues={createAlbum.fields.albumArtist.issues()}>
					<Input placeholder="Album Artist" {...createAlbum.fields.albumArtist.as('text')} />
				</FormField>
				<FormField issues={createAlbum.fields.releaseDate.issues()}>
					<Input placeholder="Year" {...createAlbum.fields.releaseDate.as('number')} />
				</FormField>
			</div>

			<FormField issues={createAlbum.fields.genre.issues()}>
				<Select placeholder="Genre" {...createAlbum.fields.genre.as('select')}>
					{#each GENRES as genre}
						<option value={genre}>{genre}</option>
					{/each}
				</Select>
			</FormField>
		</FormSection>

		<FormSection
			title="Tracks"
			description="Here you add the tracks that the video should be split into."
		>
			<TrackList form={createAlbum} onAdd={handleAddTrack} />
		</FormSection>
	</section>
</Form>
