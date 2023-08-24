<script lang="ts">
	import AddressCanvas from '$lib/components/AddressCanvas.svelte'
	import { Recorder } from '$lib/services/media/av'
	import { onDestroy, onMount } from 'svelte'
	import type { PageData } from './$types'
	import { uploadVideo } from '$lib/services/firebase/storage'
	import InOutBox from '$lib/components/InOutBox.svelte'
	import { goto } from '$app/navigation'

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
		return goto(`/address/${data.address.id}`)
	}
</script>

<div class="grid grid-cols-2 grid-rows-3 h-full gap-5 p-5">
	<div class="relative row-start-1 col-span-2 flex h-full items-center justify-center">
		<div class="relative h-full w-full">
			{#if mediaStream}
				<AddressCanvas bind:canvas {mediaStream} />
			{/if}
			<nord-button
				loading={uploading}
				on:click={handleRecordClick}
				size="m"
				class="absolute top-2 right-2"
			>
				{#if recording}
					<div slot="start" class="recording-indicator rounded-full bg-red-600 w-5 h-5" />
				{/if}
				<span>
					{recording ? 'Stop' : 'Start'} Recording
				</span>
			</nord-button>
		</div>
	</div>
	<InOutBox
		class="row-start-2 col-start-1 col-span-2 md:col-span-1"
		address={data.address}
		currentUser={data.currentUser}
		title="💅 What's In"
		htmlContent={data.address.in}
	/>
	<InOutBox
		class="row-start-3 md:row-start-2 col-start-1 md:col-start-2 col-span-2 md:col-span-1"
		address={data.address}
		currentUser={data.currentUser}
		title="🤢 What's Out"
		htmlContent={data.address.out}
	/>
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
