import {
	FaceLandmarker,
	type FaceLandmarkerResult,
	FilesetResolver,
	type NormalizedLandmark
} from '@mediapipe/tasks-vision'

interface Point {
	x: number
	y: number
}

let landmarker: FaceLandmarker
export function processFrame(video: HTMLVideoElement): FaceLandmarkerResult {
	return landmarker.detectForVideo(video, Date.now())
}

export async function initProcessor() {
	if (!landmarker) {
		const fileset = await FilesetResolver.forVisionTasks(
			'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
		)
		landmarker = await FaceLandmarker.createFromOptions(fileset, {
			baseOptions: {
				modelAssetPath: '/models/face_landmarker.task',
				delegate: 'GPU'
			},
			runningMode: 'VIDEO',
			numFaces: 1
		})
	}
}

export async function extractFace(video: HTMLVideoElement, landmarks: NormalizedLandmark[]) {
	const canvas = new OffscreenCanvas(video.videoWidth, video.videoHeight)
	const faceOval = FaceLandmarker.FACE_LANDMARKS_FACE_OVAL
	const canvasCtx = canvas.getContext('2d')
	if (canvasCtx) {
		canvasCtx.globalCompositeOperation = 'source-over'
		canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height)
		canvasCtx.globalCompositeOperation = 'destination-in'

		let minX = Infinity
		let maxX = -Infinity
		let minY = Infinity
		let maxY = -Infinity

		canvasCtx.beginPath()
		const start = landmarks[faceOval[0].start]
		const denormalizedStart = denormalizeLandmark(canvas, start)
		canvasCtx.moveTo(denormalizedStart.x, denormalizedStart.y)
		faceOval.forEach((connection) => {
			const end = landmarks[connection.end]
			const denormalizedEnd = denormalizeLandmark(canvas, end)
			canvasCtx.lineTo(denormalizedEnd.x, denormalizedEnd.y)

			if (denormalizedEnd.x < minX) {
				minX = denormalizedEnd.x
			}
			if (denormalizedEnd.x > maxX) {
				maxX = denormalizedEnd.x
			}
			if (denormalizedEnd.y < minY) {
				minY = denormalizedEnd.y
			}
			if (denormalizedEnd.y > maxY) {
				maxY = denormalizedEnd.y
			}
		})
		canvasCtx.fill()
		minX = Math.max(minX, 0)
		maxX = Math.min(maxX, canvas.width)
		minY = Math.max(minY, 0)
		maxY = Math.min(maxY, canvas.height)
		const faceWidth = maxX - minX
		const faceHeight = maxY - minY
		const imageData = canvasCtx.getImageData(minX, minY, faceWidth, faceHeight)
		const faceImage = await createImageBitmap(imageData)
		return {
			image: faceImage,
			height: faceHeight,
			width: faceWidth
		}
	}
	return null
}

function denormalizeLandmark(canvas: OffscreenCanvas, landmark: NormalizedLandmark): Point {
	return {
		x: landmark.x * canvas.width,
		y: landmark.y * canvas.height
	}
}
