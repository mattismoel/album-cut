<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { onMount } from 'svelte';
	import type { RemoteFormField } from '@sveltejs/kit';
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Timestamp = {
		hours: number;
		minutes: number;
		seconds: number;
	};

	type Props = HTMLInputAttributes & {
		field: RemoteFormField<string>;
	};

	const padNumber = (x: number) => {
		return x.toString().padStart(2, '0');
	};

	const formatTimestamp = ({ hours, minutes, seconds }: Timestamp) => {
		return `${padNumber(hours)}:${padNumber(minutes)}:${padNumber(seconds)}`;
	};

	const parseTimestamp = (ts: string): Timestamp => {
		const [hours, minutes, seconds] = ts.split(':');

		return {
			hours: parseInt(hours),
			minutes: parseInt(minutes),
			seconds: parseInt(seconds)
		};
	};

	let { field }: Props = $props();

	let time = $state<Timestamp>({
		hours: 0,
		minutes: 0,
		seconds: 0
	});

	$effect(() => {
		const value = field.value();
		if (!value) return;

		time = parseTimestamp(value);
	});

	const padZeroAttachment = (
		type: 'hours' | 'minutes' | 'seconds'
	): Attachment<HTMLInputElement> => {
		const events = ['input'];

		return (element) => {
			element.value = padNumber(time[type]);

			const handleInput = () => {
				const newValue = Number(element.value);
				time[type] = newValue;
				element.value = padNumber(newValue);
			};

			events.forEach((e) => element.addEventListener(e, handleInput));
			return () => events.forEach((e) => element.removeEventListener(e, handleInput));
		};
	};

	onMount(() => {
		const value = field.value();
		if (!value) return;

		time = parseTimestamp(value);
	});

	$effect(() => {
		field.set(formatTimestamp(time));
	});
</script>

<input {...field.as('text')} type="hidden" value={formatTimestamp(time)} />

<div class="container">
	<input type="text" {@attach padZeroAttachment('hours')} />
	<span>:</span>
	<input type="text" {@attach padZeroAttachment('minutes')} />
	<span>:</span>
	<input type="text" {@attach padZeroAttachment('seconds')} />
</div>

<style>
	.container {
		display: flex;
		align-items: center;
		width: 100%;
		font-family: var(--font-mono);
		background: var(--clr-surface-900);
		padding: var(--spacing-2);
		border-radius: var(--radius-lg);
		border: 1px solid var(--clr-surface-800);

		input {
			width: 100%;
			background: none;
			border: none;
			text-align: center;
		}

		/*
      Source - https://stackoverflow.com/a/23374725
      Posted by Richard Deeming, modified by community. See post 'Timeline' for change history
      Retrieved 2026-07-25, License - CC BY-SA 4.0
    */

		input[type='number']::-webkit-outer-spin-button,
		input[type='number']::-webkit-inner-spin-button {
			-webkit-appearance: none;
			margin: 0;
		}

		input[type='number'] {
			appearance: none;
			-moz-appearance: textfield;
		}
	}
</style>
