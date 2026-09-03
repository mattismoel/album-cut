<script lang="ts">
	import type { RemoteFormIssue } from '@sveltejs/kit';
	import type { Snippet } from 'svelte';
	import IssueList from './IssueList.svelte';
	import type { ClassValue } from 'svelte/elements';

	type Props = {
		issues?: RemoteFormIssue[] | undefined;
		children: Snippet<[]>;
		class?: ClassValue;
	};

	let { issues, children, ...rest }: Props = $props();
</script>

<div class={['stack-2', rest.class]}>
	<div>
		{@render children()}
	</div>

	{#if issues && issues.length}
		<IssueList {issues} />
	{/if}
</div>
