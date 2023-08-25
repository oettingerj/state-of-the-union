const mimeTypes = ['video/webm;codecs=vp9']

export class Recorder {
	mediaRecorder: MediaRecorder
	mediaStream: MediaStream
	data: Blob[]

	constructor(canvas: HTMLCanvasElement, audioSource: MediaStream) {
		this.data = []
		this.mediaStream = canvas.captureStream(30)
		const audioTracks = audioSource.getAudioTracks()

		if (audioTracks.length > 0) {
			this.mediaStream.addTrack(audioTracks[0])
		}

		this.mediaRecorder = new MediaRecorder(this.mediaStream, {
			videoBitsPerSecond: 5000000,
			mimeType: getPreferredMIMEType()
		})
		this.mediaRecorder.ondataavailable = (event) => {
			this.data.push(event.data)
		}
	}

	start() {
		this.mediaRecorder.start()
	}

	stop(): Promise<Blob[]> {
		return new Promise((resolve) => {
			if (this.mediaRecorder.state !== 'inactive') {
				this.mediaRecorder.onstop = () => {
					resolve(this.data)
				}
				this.mediaRecorder.onerror = (err) => {
					console.error(err)
				}
				this.mediaRecorder.stop()
			} else {
				resolve(this.data)
			}
		})
	}
}

function getPreferredMIMEType() {
	for (const type of mimeTypes) {
		if (MediaRecorder.isTypeSupported(type)) {
			return type
		}
	}
	return undefined
}
