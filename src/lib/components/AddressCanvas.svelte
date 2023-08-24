<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte'
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

	export let canvas: HTMLCanvasElement
	export let mediaStream: MediaStream
	let videoRef: HTMLVideoElement
	let bgRef: HTMLImageElement
	let lastTimestamp = -1

	const dispatch = createEventDispatcher()

	async function renderLoop() {
		if (videoRef && videoRef.currentTime !== lastTimestamp) {
			lastTimestamp = videoRef.currentTime
			const result = processFrame(videoRef)
			if (result.faceLandmarks.length > 0) {
				canvas.height = bgRef.naturalHeight
				canvas.width = bgRef.naturalWidth
				const faceData = await extractFace(videoRef, result.faceLandmarks[0])
				if (faceData) {
					const facePlacement = calculateFacePlacement(
						faceData.image,
						canvas.width,
						canvas.height
					)
					const ctx = canvas.getContext('2d')
					if (ctx) {
						canvas.width = canvas.clientWidth ?? 0
						canvas.height = canvas.clientHeight ?? 0
						ctx.clearRect(0, 0, canvas.width, canvas.height)
						ctx.fillStyle = 'black'
						ctx.fillRect(0, 0, canvas.width, canvas.height)
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
						ctx.drawImage(bgRef, 0, 0, canvas.width, canvas.height)
					}
				}
			}
		}

		requestAnimationFrame(() => {
			renderLoop()
		})
	}

	function calculateFacePlacement(faceImage: ImageBitmap, bgWidth: number, bgHeight: number) {
		const faceRatio = faceImage.height / faceImage.width
		const faceX = bgWidth * FACE_PLACEMENT_X_COEFFICIENT
		const faceY = bgHeight * FACE_PLACEMENT_Y_COEFFICIENT
		const faceWidth = bgWidth * FACE_WIDTH_COEFFICIENT
		return { y: faceY, x: faceX, width: faceWidth, height: faceWidth * faceRatio }
	}

	onMount(async () => {
		canvas.height = bgRef.naturalHeight
		canvas.width = bgRef.naturalWidth
		await initProcessor()
		try {
			videoRef.srcObject = mediaStream
			await videoRef.play()
			renderLoop()
		} catch (e) {
			console.warn(e)
		}
		dispatch('load-complete')
	})
</script>

<div class="h-full relative overflow-hidden rounded-lg shadow-lg">
	<video playsinline autoplay hidden bind:this={videoRef} muted />
	<img hidden bind:this={bgRef} src="/images/sotu-template.webp" alt="background" />
	<canvas
		class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-20 sm:scale-25 lg:scale-40"
		bind:this={canvas}
	/>
</div>
