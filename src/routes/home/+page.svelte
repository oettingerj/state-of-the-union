<script lang="ts">
	import { onMount } from 'svelte'
	import {
		extractFace,
		initProcessor,
		processFrame
	} from '$lib/services/media/facial-recognition'
	import {
		FACE_PLACEMENT_X,
		FACE_PLACEMENT_Y,
		FACE_WIDTH
	} from '$lib/services/media/image-mask-definitions'

	let videoRef: HTMLVideoElement
	let canvasRef: HTMLCanvasElement
	let bgRef: HTMLImageElement
	let lastTimestamp = -1

	function renderLoop(): void {
		if (videoRef && videoRef.currentTime !== lastTimestamp) {
			lastTimestamp = videoRef.currentTime
			const result = processFrame(videoRef)
			if (result.faceLandmarks.length > 0) {
				const faceData = extractFace(videoRef, result.faceLandmarks[0])
				if (faceData) {
					const ctx = canvasRef.getContext('2d')
					ctx.clearRect(0, 0, canvasRef.width, canvasRef.height)
					canvasRef.height = faceData.height
					canvasRef.width = faceData.width
					ctx.putImageData(faceData.data, 0, 0)
					calculateFacePlacement()
				}
			}
		}

		requestAnimationFrame(() => {
			renderLoop()
		})
	}

	function calculateFacePlacement() {
		const faceX = bgRef.clientWidth * FACE_PLACEMENT_X
		const faceY = bgRef.clientHeight * FACE_PLACEMENT_Y
		const faceWidth = bgRef.clientWidth * FACE_WIDTH
		canvasRef.style.top = faceY + 'px'
		canvasRef.style.left = faceX + 'px'
		canvasRef.style.width = faceWidth + 'px'
	}

	onMount(async () => {
		await initProcessor()
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

<div class="relative bg-black">
	<video hidden bind:this={videoRef}>
		<track kind="captions" />
	</video>
	<img
		bind:this={bgRef}
		src="/images/sotu-template.webp"
		alt="background"
		class="relative z-10"
	/>
	<canvas id="face" class="absolute" bind:this={canvasRef} />
</div>

<style>
	#face {
		transform: rotateY(180deg);
	}
</style>
