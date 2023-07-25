<script lang="ts">
	import { onMount } from 'svelte'
	import { FilesetResolver, FaceLandmarker, type NormalizedLandmark } from '@mediapipe/tasks-vision'

	let videoRef: HTMLVideoElement
	let lastVideoTime = -1
	let faceLandmarker: FaceLandmarker
	let facialLandmarks: NormalizedLandmark[][] = []

	async function initProcessor(): Promise<FaceLandmarker> {
		const vision = await FilesetResolver.forVisionTasks(
			// path/to/wasm/root
			'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
		)
		faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
			baseOptions: {
				modelAssetPath: '/models/face_landmarker.task'
			},
			runningMode: 'VIDEO'
		})
	}

	function renderLoop(): void {
		if (videoRef && videoRef.currentTime !== lastVideoTime) {
			const faceLandmarkerResult = faceLandmarker.detectForVideo(videoRef, videoRef.currentTime)
			facialLandmarks = faceLandmarkerResult.faceLandmarks
			lastVideoTime = videoRef.currentTime
		}

		requestAnimationFrame(() => {
			renderLoop()
		})
	}

	onMount(async () => {
		const faceLandmarker = await initProcessor()

		try {
			const mediaStream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true
			})

			videoRef.srcObject = mediaStream
			await videoRef.play()
			renderLoop()
		} catch (e) {
			console.warn(e)
		}
	})
</script>

<div class="relative">
	<video class="h-[300px]" bind:this={videoRef} />
	{#each facialLandmarks as row}
		{#each row as landmark}
			<div
				class="absolute w-1 h-1 bg-white rounded-full"
				style="top: {videoRef.clientHeight * landmark.y}px; left: {videoRef.clientWidth *
					(1 - landmark.x)}px;"
			/>
		{/each}
	{/each}
</div>

<style>
	video {
		transform: rotateY(180deg);
	}
</style>
