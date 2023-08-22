<script lang="ts">
	import { onMount } from 'svelte'
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

	async function renderLoop() {
		if (videoRef && videoRef.currentTime !== lastTimestamp) {
			lastTimestamp = videoRef.currentTime
			const result = processFrame(videoRef)
			if (result.faceLandmarks.length > 0) {
				const faceData = await extractFace(videoRef, result.faceLandmarks[0])
				if (faceData) {
					const bgRatio = bgRef.naturalHeight / bgRef.naturalWidth
					const bgWidth = canvas.width
					const bgHeight = canvas.width * bgRatio
					const facePlacement = calculateFacePlacement(faceData.image, bgWidth, bgHeight)
					const ctx = canvas.getContext('2d')
					if (ctx) {
						canvas.width = canvas.clientWidth ?? 0
						canvas.height = canvas.clientHeight ?? 0
						ctx.clearRect(0, 0, canvas.width, canvas.height)
						ctx.fillStyle = 'black'
						ctx.fillRect(0, 0, bgWidth, bgHeight)
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
						ctx.drawImage(bgRef, 0, 0, bgWidth, bgHeight)
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
		await initProcessor()
		try {
			videoRef.srcObject = mediaStream
			await videoRef.play()
			await renderLoop()
		} catch (e) {
			console.warn(e)
		}
	})
</script>

<div class="h-full">
	<video hidden bind:this={videoRef} />
	<img hidden bind:this={bgRef} src="/images/sotu-template.webp" alt="background" />
	<canvas bind:this={canvas} class="h-full w-full overflow-hidden rounded-lg shadow-lg" />
</div>
