import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getApp } from '$lib/services/firebase/firebase'
import { updateAddress } from '$lib/services/firebase/firestore'
import { uid } from 'radash'

function getFBStorage() {
	return getStorage(getApp())
}

export async function uploadVideo(addressId: string, blob: Blob) {
	const storage = getFBStorage()
	const videoRef = ref(storage, `address-videos/${addressId}`)
	await uploadBytes(videoRef, blob)
	const downloadUrl = await getDownloadURL(videoRef)
	await updateAddress(addressId, {
		videoUrl: downloadUrl
	})
	return downloadUrl
}

export async function uploadImage(file: File) {
	const storage = getFBStorage()
	const imageRef = ref(storage, `address-images/${uid(10)}`)
	await uploadBytes(imageRef, file)
	return await getDownloadURL(imageRef)
}
