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

<style>
	ul {
		--clr-warning: oklch(40% 0.5 50);
		padding: 0;
		font-size: var(--text-sm);
		color: var(--clr-warning);
		list-style-position: inside;
		margin-bottom: var(--spacing-4);
	}
</style>
