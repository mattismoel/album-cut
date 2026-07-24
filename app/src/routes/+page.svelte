<script lang="ts">
	import { createAlbum } from '$lib/album.remote';
	import AlbumForm from '$lib/components/AlbumForm.svelte';
	import Input from '$lib/components/Input.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		createAlbum.fields.set({
			url: 'https://youtu.be/j4qfT2dxU6E?si=CvQC6jdw6nV4QNHB',
			albumArtist: 'James Blake',
			title: 'NPR Music Front Row',
			genre: 'Electronic',
			releaseDate: 2013,
			tracks: [
				{
					id: crypto.randomUUID(),
					trackNumber: 1,
					title: 'Air & Lack Thereof',
					from: '00:00:00',
					to: '00:03:40'
				},
				{
					id: crypto.randomUUID(),
					trackNumber: 2,
					title: 'I Never Learnt To Share',
					from: '00:03:40',
					to: '00:09:40'
				},
				{
					id: crypto.randomUUID(),
					trackNumber: 3,
					title: 'To The Last',
					from: '00:09:40',
					to: '00:14:44'
				},
				{
					id: crypto.randomUUID(),
					trackNumber: 4,
					title: 'Lindisfarne',
					from: '00:14:44',
					to: '00:20:22'
				},
				{
					id: crypto.randomUUID(),
					trackNumber: 5,
					title: 'I Am Sold',
					from: '00:20:22',
					to: '00:26:10'
				},
				{
					id: crypto.randomUUID(),
					trackNumber: 6,
					title: 'CMYK',
					from: '00:26:10',
					to: '00:31:07'
				},
				{
					id: crypto.randomUUID(),
					trackNumber: 7,
					title: 'Our Love Comes Back',
					from: '00:31:07',
					to: '00:36:00'
				},
				{
					id: crypto.randomUUID(),
					trackNumber: 8,
					title: 'Digital Lion',
					from: '00:36:00',
					to: '00:41:27'
				},
				{
					id: crypto.randomUUID(),
					trackNumber: 9,
					title: 'Unluck',
					from: '00:41:27',
					to: '00:45:30'
				},
				{
					id: crypto.randomUUID(),
					trackNumber: 10,
					title: 'Limit To Your Love',
					from: '00:45:30',
					to: '00:54:23'
				},
				{
					id: crypto.randomUUID(),
					trackNumber: 11,
					title: 'Klavierwerke',
					from: '00:54:23',
					to: '01:01:03'
				},
				{
					id: crypto.randomUUID(),
					trackNumber: 12,
					title: 'Overgrown',
					from: '01:01:03',
					to: '01:06:40'
				},
				{
					id: crypto.randomUUID(),
					trackNumber: 13,
					title: 'Voyeur',
					from: '01:06:40',
					to: '01:14:10'
				},
				{
					id: crypto.randomUUID(),
					trackNumber: 14,
					title: 'Retrograde',
					from: '01:14:10',
					to: '01:21:15'
				},
				{
					id: crypto.randomUUID(),
					trackNumber: 15,
					title: 'The Wilhelm Scream',
					from: '01:21:15',
					to: '01:27:30'
				},
				{
					id: crypto.randomUUID(),
					trackNumber: 16,
					title: 'A Case Of You',
					from: '01:27:30',
					to: '01:31:20'
				}
			]
		});
	});
</script>

<main class="mx-responsive">
	<AlbumForm />
</main>

<style>
	main {
		padding: 8rem 0;
	}
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
