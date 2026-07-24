<script lang="ts">
	import type { RemoteForm } from '@sveltejs/kit';
	import type { HTMLFormAttributes } from 'svelte/elements';
	import Button from './Button.svelte';

	type Props = HTMLFormAttributes & {
		title: string;
		description: string;
		form: RemoteForm<any, any>;
	};

	let { form, title, description, ...rest }: Props = $props();

	let isSubmitting = $state(false);
</script>

<form
	{...form.enhance(async (form) => {
		try {
			isSubmitting = true;

			if (await form.submit()) {
				form.element.reset();
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

	<Button variant="primary" shrinkMode="responsive">Submit</Button>
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
