<script lang="ts">
	import { createAlbum } from '$lib/album.remote';
	import { onMount } from 'svelte';

	onMount(() => {
		createAlbum.fields.url.set('https://youtu.be/hO0HFyeTp04?si=AcevWq6ib_cMTKIw');
	});
</script>

<form {...createAlbum}>
	<input placeholder="URL" {...createAlbum.fields.url.as('url')} />
	<p>{JSON.stringify(createAlbum.fields.allIssues())}</p>
	<button>Submit</button>
</form>
