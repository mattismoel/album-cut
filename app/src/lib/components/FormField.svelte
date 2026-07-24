<script lang="ts">
	import type { RemoteFormIssue } from '@sveltejs/kit';
	import type { Snippet } from 'svelte';
	import IssueList from './IssueList.svelte';

	type Props = {
		issues?: RemoteFormIssue[] | undefined;
		children: Snippet<[]>;
	};

	let { issues, children }: Props = $props();
</script>

<div class="stack-2">
	<div>
		{@render children()}
	</div>

	{#if issues && issues.length}
		<IssueList {issues} />
	{/if}
</div>
