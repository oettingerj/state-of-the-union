import { initializeApp, credential } from 'firebase-admin'
import { FIREBASE_SERVICE_ACCOUNT_KEY } from '$env/static/private'
import type { Address } from '$lib/types/address'
import { getFirestore } from 'firebase-admin/firestore'

const serviceAccountKey = JSON.parse(FIREBASE_SERVICE_ACCOUNT_KEY)
initializeApp({
	credential: credential.cert(serviceAccountKey)
})

export async function getAddress(id: string): Promise<Address> {
	const db = getFirestore()
	const docRef = db.collection('addresses').doc(id)
	const snapshot = await docRef.get()
	if (!snapshot.exists) {
		throw new Error(`Address does not exist with id ${id}`)
	}
	return snapshot.data() as Address
}
