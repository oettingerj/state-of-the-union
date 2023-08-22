import {
	getFirestore,
	collection,
	doc,
	addDoc,
	serverTimestamp,
	updateDoc,
	getDoc
} from 'firebase/firestore'
import { getApp } from '$lib/services/firebase/firebase'
import { getFBAuth } from '$lib/services/firebase/auth'
import type { Address } from '$lib/types/address'

function getDB() {
	return getFirestore(getApp())
}

export async function createAddress(
	address: Pick<Address, 'title' | 'in' | 'out'>
): Promise<string> {
	const db = getDB()
	const currentUser = getFBAuth().currentUser
	if (!currentUser) {
		throw new Error('No user is signed in')
	}
	const docRef = await addDoc(collection(db, 'addresses'), {
		title: address.title,
		user: currentUser.uid,
		in: address.in,
		out: address.out,
		created: serverTimestamp(),
		updated: serverTimestamp()
	})

	return docRef.id
}

export async function updateAddress(id: string, fields: Partial<Address>) {
	const db = getDB()
	const docRef = doc(db, 'addresses', id)
	await updateDoc(docRef, fields)
}

export async function getAddress(id: string): Promise<Address> {
	const db = getDB()
	const docRef = doc(db, 'addresses', id)
	const snapshot = await getDoc(docRef)
	if (!snapshot.exists()) {
		throw new Error(`Address does not exist with id ${id}`)
	}
	return snapshot.data() as Address
}
