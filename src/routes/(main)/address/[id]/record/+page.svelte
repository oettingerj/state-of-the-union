<script lang="ts">
	import AddressCanvas from '$lib/components/AddressCanvas.svelte'
	import { Recorder } from '$lib/services/media/av'
	import { onDestroy, onMount } from 'svelte'
	import type { PageData } from './$types'
	import { uploadThumbnail, uploadVideo } from '$lib/services/firebase/storage'
	import InOutBox from '$lib/components/InOutBox.svelte'
	import { goto } from '$app/navigation'
	import { getPageTitle } from '$lib/utils/page-title'

	export let data: PageData

	let recording = false
	let recorder: Recorder
	let canvas: HTMLCanvasElement
	let mediaStream: MediaStream
	let uploading = false
	let loading = true
	let thumbnailBlob: Blob | null
	let errorMessage = ''

	onMount(async () => {
		try {
			mediaStream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: 'user'
				},
				audio: true
			})
		} catch (e) {
			console.warn(e)
			errorMessage = 'Unable to access camera and microphone. Please allow access.'
		}
	})

	onDestroy(() => {
		if (mediaStream) {
			mediaStream.getTracks().forEach((track) => {
				track.stop()
			})
		}
	})

	function handleLoadComplete() {
		loading = false
	}

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
		canvas.toBlob(
			(blob) => {
				thumbnailBlob = blob
			},
			'image/jpeg',
			0.5
		)
	}

	async function stopRecording() {
		const recordedData = await recorder.stop()
		recording = false
		uploading = true
		let recordedBlob = new Blob(recordedData, { type: 'video/webm' })
		const promises = []
		promises.push(uploadVideo(data.address.id, recordedBlob))

		if (thumbnailBlob) {
			promises.push(uploadThumbnail(data.address.id, thumbnailBlob))
		}

		await Promise.all(promises)
		uploading = false
		return goto(`/address/${data.address.id}?processing`)
	}
</script>

<svelte:head>
	<title>{getPageTitle('Record Address')}</title>
</svelte:head>

<div class="grid grid-cols-2 grid-rows-3 md:grid-rows-2 h-full gap-5 p-5">
	<div class="relative row-start-1 col-span-2 flex h-full items-center justify-center">
		<div class="relative h-full w-full">
			{#if !errorMessage && loading}
				<div
					class="absolute flex flex-col items-center gap-1 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
				>
					<nord-spinner size="xl" />
					<span class="text-xs text-gray-600">Loading video...</span>
				</div>
			{/if}
			{#if !errorMessage}
				{#if mediaStream}
					<AddressCanvas
						bind:canvas
						{mediaStream}
						on:load-complete={handleLoadComplete}
					/>
				{/if}
			{:else}
				<div class="flex h-full items-center justify-center">
					<span>{errorMessage}</span>
				</div>
			{/if}
			{#if !loading}
				<nord-button
					loading={uploading}
					on:click={handleRecordClick}
					size="m"
					class="absolute top-2 right-2"
				>
					{#if recording}
						<div
							slot="start"
							class="recording-indicator rounded-full bg-red-600 w-5 h-5"
						/>
					{/if}
					<span>
						{recording ? 'Stop' : 'Start'} Recording
					</span>
				</nord-button>
			{/if}
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
