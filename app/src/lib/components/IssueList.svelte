<script lang="ts">
	import type { RemoteFormIssue } from '@sveltejs/kit';

	type Props = {
		issues?: RemoteFormIssue[] | undefined;
	};

	let { issues }: Props = $props();
</script>

{#if issues && issues.length > 0}
	<ul>
		{#each issues as issue}
			<li>{issue.message}</li>
		{/each}
	</ul>
{/if}
