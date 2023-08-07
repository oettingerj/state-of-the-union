<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import {
		extractFace,
		initProcessor,
		processFrame
	} from '$lib/services/media/facial-recognition'
	import {
		FACE_PLACEMENT_X_COEFFICIENT,
		FACE_PLACEMENT_Y_COEFFICIENT,
		FACE_WIDTH_COEFFICIENT
	} from '$lib/services/media/image-mask-definitions'
	import { Recorder } from '$lib/services/media/av'

	let videoRef: HTMLVideoElement
	let canvasRef: HTMLCanvasElement
	let bgRef: HTMLImageElement
	let lastTimestamp = -1
	let mediaStream: MediaStream
	let recorder: Recorder
	let recording = false

	async function renderLoop() {
		if (videoRef && videoRef.currentTime !== lastTimestamp) {
			lastTimestamp = videoRef.currentTime
			const result = processFrame(videoRef)
			if (result.faceLandmarks.length > 0) {
				const faceData = await extractFace(videoRef, result.faceLandmarks[0])
				if (faceData) {
					const bgRatio = bgRef.naturalHeight / bgRef.naturalWidth
					const bgWidth = canvasRef.width
					const bgHeight = canvasRef.width * bgRatio
					const bgOffsetY = (canvasRef.height - bgHeight) / 2
					const facePlacement = calculateFacePlacement(
						faceData.image,
						bgWidth,
						bgHeight,
						bgOffsetY
					)
					const ctx = canvasRef.getContext('2d')!
					canvasRef.width = canvasRef.clientWidth ?? 0
					canvasRef.height = canvasRef.clientHeight ?? 0
					ctx.clearRect(0, 0, canvasRef.width, canvasRef.height)
					ctx.save()
					ctx.translate(facePlacement.width, 0)
					ctx.scale(-1, 1)
					ctx.drawImage(
						faceData.image,
						-facePlacement.x,
						facePlacement.y,
						facePlacement.width,
						facePlacement.height
					)
					ctx.restore()
					ctx.drawImage(bgRef, 0, bgOffsetY, bgWidth, bgHeight)
				}
			}
		}

		requestAnimationFrame(() => {
			renderLoop()
		})
	}

	function calculateFacePlacement(
		faceImage: ImageBitmap,
		bgWidth: number,
		bgHeight: number,
		bgOffsetY: number
	) {
		const faceRatio = faceImage.height / faceImage.width
		const faceX = bgWidth * FACE_PLACEMENT_X_COEFFICIENT
		const faceY = bgHeight * FACE_PLACEMENT_Y_COEFFICIENT + bgOffsetY
		const faceWidth = bgWidth * FACE_WIDTH_COEFFICIENT
		return { y: faceY, x: faceX, width: faceWidth, height: faceWidth * faceRatio }
	}

	function handleRecordClick() {
		if (!recording) {
			startRecording()
		} else {
			stopRecording()
		}
	}

	function startRecording() {
		recorder = new Recorder(canvasRef, mediaStream)
		recorder.start()
		recording = true
	}

	async function stopRecording() {
		const data = await recorder.stop()
		let recordedBlob = new Blob(data, { type: 'video/webm' })
		const url = URL.createObjectURL(recordedBlob)
		const link = document.createElement('a')
		link.href = url
		link.download = 'video.webm'
		link.hidden = true
		document.body.appendChild(link)
		link.click()
		recording = false
	}

	onMount(async () => {
		await initProcessor()
		try {
			mediaStream = await navigator.mediaDevices.getUserMedia({
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

	onDestroy(() => {
		if (mediaStream) {
			mediaStream.getTracks().forEach((track) => {
				track.stop()
			})
		}
	})
</script>

<div class="relative bg-black h-full">
	<video hidden bind:this={videoRef} />
	<img hidden bind:this={bgRef} src="/images/sotu-template.webp" alt="background" />
	<canvas bind:this={canvasRef} class="absolute h-full w-full" />
	<nord-button on:click={handleRecordClick}>{recording ? 'Stop' : 'Record'}</nord-button>
</div>

<style>
	#face {
		transform: rotateY(180deg);
	}
</style>
