<script lang="ts">
	import { createAlbum } from '$lib/album.remote';
	import { onMount } from 'svelte';

	const GENRES = ['Rock', 'Pop', 'R&B'];

	onMount(() => {
		createAlbum.fields.set({
			url: 'https://youtu.be/hO0HFyeTp04?si=AcevWq6ib_cMTKIw',
			albumArtist: 'Adele',
			title: 'Hello',
			genre: 'Rock',
			releaseDate: 2020,
			tracks: [...Array(3)].map((_, i) => ({
				id: crypto.randomUUID(),
				trackNumber: i + 1,
				title: `Some Track ${i + 1}`,
				from: `00:0${i}:00`,
				to: `00:0${i + 1}:00`
			}))
		});
	});

	const handleAddTrack = () => {
		const prevTracks = createAlbum.fields.tracks.value() ?? [];

		const id = crypto.randomUUID();

		createAlbum.fields.tracks.set([...prevTracks, { id }]);
	};
</script>

<form {...createAlbum} enctype="multipart/form-data">
	<section class="stack">
		<input placeholder="URL" {...createAlbum.fields.url.as('url')} />

		<fieldset>
			<input placeholder="Cover Art" {...createAlbum.fields.coverArt.as('file')} />

			<div class="row">
				<input placeholder="Title" {...createAlbum.fields.title.as('text')} />
				<input placeholder="Album Artist" {...createAlbum.fields.albumArtist.as('text')} />
				<input placeholder="Year" {...createAlbum.fields.releaseDate.as('number')} />
			</div>
			<select placeholder="Genre" {...createAlbum.fields.genre.as('select')}>
				{#each GENRES as genre}
					<option value={genre}>{genre}</option>
				{/each}
			</select>
		</fieldset>

		<fieldset>
			<ul>
				{#each createAlbum.fields.tracks.value() as track, i (track?.id)}
					{@const trackNumber = i + 1}

					{#if track?.id}
						<li>
							<input {...createAlbum.fields.tracks[i].id.as('hidden', track.id)} />
							<input {...createAlbum.fields.tracks[i].trackNumber.as('hidden', trackNumber)} />
							<input placeholder="Title" {...createAlbum.fields.tracks[i].title.as('text')} />
							<input placeholder="From" {...createAlbum.fields.tracks[i].from.as('text')} />
							<input placeholder="To" {...createAlbum.fields.tracks[i].to.as('text')} />
						</li>
					{/if}
				{/each}
			</ul>

			<button type="button" onclick={() => handleAddTrack()}>+ Add Track</button>
		</fieldset>
	</section>

	<p>{JSON.stringify(createAlbum.fields.allIssues())}</p>
	<button>Submit</button>
</form>

<style>
	.stack {
		display: grid;
		gap: 0.5rem;
	}

	.row {
		width: 100%;
		display: flex;
		gap: 1rem;
	}
</style>
