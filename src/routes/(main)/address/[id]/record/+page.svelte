<script lang="ts">
	import AddressCanvas from '$lib/components/AddressCanvas.svelte'
	import { Recorder } from '$lib/services/media/av'
	import { onDestroy, onMount } from 'svelte'
	import type { PageData } from './$types'
	import { uploadVideo } from '$lib/services/firebase/storage'

	export let data: PageData

	let recording = false
	let recorder: Recorder
	let canvas: HTMLCanvasElement
	let mediaStream: MediaStream
	let uploading = false

	onMount(async () => {
		try {
			mediaStream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true
			})
		} catch (e) {
			console.warn(e)
		}
	})

	onDestroy(() => {
		if (mediaStream) {
			mediaStream.getTracks().forEach((track) => {
				track.stop()
			})
		}
	})

	function handleRecordClick() {
		if (!recording) {
			startRecording()
		} else {
			stopRecording()
		}
	}

	function startRecording() {
		recorder = new Recorder(canvas, mediaStream)
		recorder.start()
		recording = true
	}

	async function stopRecording() {
		const recordedData = await recorder.stop()
		recording = false
		uploading = true
		let recordedBlob = new Blob(recordedData, { type: 'video/webm' })
		await uploadVideo(data.address.id, recordedBlob)
		uploading = false
	}
</script>

<div class="flex flex-col h-full items-center p-5 gap-5">
	<div class="relative h-2/3 w-full">
		{#if mediaStream}
			<AddressCanvas bind:canvas {mediaStream} />
		{/if}
		<nord-button
			loading={uploading}
			on:click={handleRecordClick}
			size="l"
			class="absolute top-0 right-0 m-5"
		>
			{#if recording}
				<div slot="start" class="recording-indicator rounded-full bg-red-600 w-5 h-5" />
			{/if}
			<span>
				{recording ? 'Stop' : 'Start'} Recording
			</span>
		</nord-button>
	</div>
	<div class="flex gap-5 w-full justify-around">
		<div class="flex grow flex-col gap-1 bg-white py-5 px-10 rounded-lg shadow-md">
			<h2 class="text-xl font-medium">What's In</h2>
			{@html data.address.in}
		</div>
		<div class="flex grow flex-col gap-1 bg-white py-5 px-10 rounded-lg shadow-md">
			<h2 class="text-xl font-medium">What's Out</h2>
			{@html data.address.out}
		</div>
	</div>
</div>

<style>
	.recording-indicator {
		animation: blink 1s step-end infinite;
	}

	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
</style>
