<script lang="ts">
	import type { RemoteForm } from '@sveltejs/kit';
	import type { HTMLFormAttributes } from 'svelte/elements';
	import Button from './Button.svelte';
	import Icon from '@iconify/svelte';

	type Props = HTMLFormAttributes & {
		title: string;
		description: string;
		form: RemoteForm<any, any>;
		submitBtnText?: { normal: string; submitting: string };
	};

	let {
		form,
		title,
		description,
		submitBtnText = { normal: 'Submit', submitting: 'Submitting...' },
		...rest
	}: Props = $props();

	let isSubmitting = $state(false);
</script>

<form
	{...form.enhance(async (form) => {
		try {
			isSubmitting = true;

			if (await form.submit()) {
				form.element.reset();
				isSubmitting = false;
			} else {
				const firstIssue = form.fields.allIssues()?.at(0);

				if (firstIssue) {
					const element = form.element.querySelector<
						HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
					>(`[name='${firstIssue.path}']`);

					if (!element) return;

					element.scrollIntoView({ behavior: 'smooth', block: 'center' });
					element.focus({ preventScroll: true });
				}

				isSubmitting = false;
			}
		} catch (err) {
			console.error(err);
		}
	})}
	{...rest}
>
	<header>
		<h1>{title}</h1>
		<p>{description}</p>
	</header>

	<div class="container stack">
		{@render rest.children?.()}
	</div>

	<Button disabled={isSubmitting} variant="primary" shrinkMode="responsive">
		{#if isSubmitting}
			<div class="spin">
				<Icon icon="boxicons:loader-lines-alt" />
			</div>
			{submitBtnText.submitting}
		{:else}
			{submitBtnText.normal}
		{/if}
	</Button>
</form>

<style>
	form {
		display: grid;
	}

	header {
		--max-description-width: 600px;

		margin-bottom: var(--spacing-8);

		h1 {
			font-family: var(--font-heading);
			font-weight: 1000;
			font-size: var(--text-xl);
			margin-bottom: var(--spacing-2);
			color: var(--clr-text-light);
		}

		p {
			max-width: var(--max-description-width);
		}
	}

	.container {
		margin-bottom: 2rem;
	}
</style>
