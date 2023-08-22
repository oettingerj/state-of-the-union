import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getApp } from '$lib/services/firebase/firebase'
import { updateAddress } from '$lib/services/firebase/firestore'

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
}
