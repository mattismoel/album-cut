<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { Attachment } from 'svelte/attachments';
	import { onMount } from 'svelte';

	type Timestamp = {
		hours: number;
		minutes: number;
		seconds: number;
	};

	type Props = Omit<HTMLInputAttributes, 'type'>;

	const padZeroAttachment: Attachment<HTMLInputElement> = (element) => {
		const events = ['change'];

		const padZero = () => {
			if (isNaN(element.valueAsNumber)) return;

			const newValue = padNumber(element.valueAsNumber);
			console.log(newValue);
			element.value = newValue;
		};

		// padZero();

		events.forEach((e) => element.addEventListener(e, padZero));

		return () => events.forEach((e) => element.removeEventListener(e, padZero));
	};

	let time = $state<Timestamp>({
		hours: 0,
		minutes: 0,
		seconds: 0
	});

	const padNumber = (x: number) => {
		return x.toString().padStart(2, '0');
	};

	const formatTimestamp = ({ hours, minutes, seconds }: Timestamp) => {
		return `${padNumber(hours)}:${padNumber(minutes)}:${padNumber(seconds)}`;
	};

	let props: Props = $props();

	const parseTimestamp = (ts: string): Timestamp => {
		const [hours, minutes, seconds] = ts.split(':');

		return {
			hours: parseInt(hours),
			minutes: parseInt(minutes),
			seconds: parseInt(seconds)
		};
	};

	onMount(() => {
		if (!props.value) return;

		time = parseTimestamp(props.value);
	});
</script>

<input {...props} type="hidden" value={formatTimestamp(time)} />

<div class="container">
	<input
		type="text"
		value={padNumber(time.hours)}
		oninput={(e) => (time.hours = Number(e.currentTarget.value))}
	/>
	<span>:</span>
	<input
		type="text"
		value={padNumber(time.minutes)}
		oninput={(e) => (time.minutes = Number(e.currentTarget.value))}
	/>
	<span>:</span>
	<input
		type="text"
		value={padNumber(time.seconds)}
		oninput={(e) => (time.seconds = Number(e.currentTarget.value))}
	/>
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
