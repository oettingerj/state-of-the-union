import { onObjectFinalized, type StorageEvent } from 'firebase-functions/v2/storage'
import { initializeApp } from 'firebase-admin/app'
import { getStorage, getDownloadURL } from 'firebase-admin/storage'
import { getFirestore } from 'firebase-admin/firestore'
import ffmpegPath from 'ffmpeg-static'
import ffmpeg from 'fluent-ffmpeg'
import { error } from 'firebase-functions/logger'

initializeApp()

export const convertVideo = onObjectFinalized({ memory: '2GiB' }, async (event: StorageEvent) => {
	const storage = getStorage()
	const filePath = event.data.name
	const fileBucket = event.data.bucket
	const fileType = event.data.contentType

	if (!filePath.includes('video-staging/') || fileType !== 'video/webm') {
		return
	}

	const bucket = storage.bucket(fileBucket)
	const readStream = bucket.file(filePath).createReadStream()
	const outputFilePath = filePath.replace('video-staging', 'address-videos')
	const fileId = filePath.replace('video-staging/', '')

	await setVideoUrlToPending(fileId)

	return new Promise<void>((resolve, reject) => {
		ffmpeg()
			.setFfmpegPath(ffmpegPath!)
			.input(readStream)
			.outputOption('-f mp4')
			.outputOption('-c copy')
			.on('end', async () => {
				await bucket.upload(fileId, {
					destination: outputFilePath,
					metadata: {
						contentType: 'video/mp4'
					}
				})
				const url = await getDownloadURL(bucket.file(outputFilePath))
				await addVideoUrlToAddress(fileId, url)
				resolve()
			})
			.on('error', (err) => {
				error(err)
				reject()
			})
			.output(fileId)
			.run()
	})
})

async function addVideoUrlToAddress(addressId: string, url: string) {
	const db = getFirestore()
	const addressDoc = db.collection('addresses').doc(addressId)
	await addressDoc.update({
		videoUrl: url
	})
}

async function setVideoUrlToPending(addressId: string) {
	const db = getFirestore()
	const addressDoc = db.collection('addresses').doc(addressId)
	await addressDoc.update({
		videoUrl: '_pending'
	})
}
