import { onObjectFinalized, type StorageEvent } from 'firebase-functions/v2/storage'
import { initializeApp } from 'firebase-admin/app'
import { getStorage, getDownloadURL } from 'firebase-admin/storage'
import { getFirestore } from 'firebase-admin/firestore'
import ffmpegPath from 'ffmpeg-static'
import ffmpeg from 'fluent-ffmpeg'
import { error } from 'firebase-functions/logger'
import { randomUUID } from 'crypto'
import { unlinkSync } from 'fs'

initializeApp()

export const convertVideo = onObjectFinalized({ memory: '4GiB' }, async (event: StorageEvent) => {
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
	const addressId = filePath.replace('video-staging/', '')
	const tempFile = randomUUID()

	await setVideoUrlToPending(addressId)

	return new Promise<void>((resolve, reject) => {
		ffmpeg()
			.setFfmpegPath(ffmpegPath!)
			.input(readStream)
			.outputOption('-f mp4')
			.outputOption('-c:v copy')
			.outputOption('-c:a aac')
			.on('end', async () => {
				try {
					await bucket.upload(tempFile, {
						destination: outputFilePath,
						metadata: {
							contentType: 'video/mp4'
						}
					})
					const url = await getDownloadURL(bucket.file(outputFilePath))
					await addVideoUrlToAddress(addressId, url)
					deleteTempFile(tempFile)
					resolve()
				} catch (err) {
					error(err)
					deleteTempFile(tempFile)
					await updateAddress(addressId, {
						videoUrl: null
					})
					reject()
				}
			})
			.on('error', async (err) => {
				error(err)
				deleteTempFile(tempFile)
				await updateAddress(addressId, {
					videoUrl: null
				})
				reject()
			})
			.output(tempFile)
			.run()
	})
})

async function addVideoUrlToAddress(addressId: string, url: string) {
	await updateAddress(addressId, {
		videoUrl: url
	})
}

async function setVideoUrlToPending(addressId: string) {
	await updateAddress(addressId, {
		videoUrl: '_pending'
	})
}

async function updateAddress(addressId: string, address: object) {
	const db = getFirestore()
	const addressDoc = db.collection('addresses').doc(addressId)
	await addressDoc.update(address)
}

function deleteTempFile(path: string) {
	unlinkSync(path)
}
