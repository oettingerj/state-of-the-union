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

		this.mediaRecorder = new MediaRecorder(this.mediaStream)
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
				this.mediaRecorder.stop()
			} else {
				resolve(this.data)
			}
		})
	}
}
