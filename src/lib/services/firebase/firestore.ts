import {
	getFirestore,
	collection,
	doc,
	addDoc,
	updateDoc,
	getDoc,
	query,
	where,
	getDocs,
	setDoc,
	documentId
} from 'firebase/firestore'
import { getApp } from '$lib/services/firebase/firebase'
import { getFBAuth } from '$lib/services/firebase/auth'
import type { Address } from '$lib/types/address'
import type { User } from '$lib/types/user'

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

	const timestamp = Date.now()
	const docRef = await addDoc(collection(db, 'addresses'), {
		title: address.title,
		user: currentUser.uid,
		in: address.in,
		out: address.out,
		created: timestamp,
		updated: timestamp
	})

	return docRef.id
}

export async function updateAddress(id: string, fields: Partial<Address>) {
	const db = getDB()
	const docRef = doc(db, 'addresses', id)
	await updateDoc(docRef, {
		...fields,
		updated: Date.now()
	})
}

export async function getAddress(id: string): Promise<Address> {
	const db = getDB()
	const docRef = doc(db, 'addresses', id)
	const snapshot = await getDoc(docRef)
	if (!snapshot.exists()) {
		throw new Error(`Address does not exist with id ${id}`)
	}
	return {
		...snapshot.data(),
		id: snapshot.id
	} as Address
}

export async function getUser(id: string): Promise<User> {
	const db = getDB()
	const docRef = doc(db, 'users', id)
	const snapshot = await getDoc(docRef)
	if (!snapshot.exists()) {
		return {
			viewedAddresses: []
		}
	}
	return snapshot.data() as User
}

export async function registerAddressView(userId: string, addressId: string) {
	const db = getDB()
	const user = await getUser(userId)
	await setDoc(doc(db, 'users', userId), {
		viewedAddresses: [...user.viewedAddresses, addressId]
	})
}

export async function getMyAddresses(currentUserId: string): Promise<Address[]> {
	const db = getDB()
	const addressesRef = collection(db, 'addresses')
	const q = query(addressesRef, where('user', '==', currentUserId))
	const snapshot = await getDocs(q)
	const results: Address[] = []
	snapshot.forEach((doc) => {
		results.push({
			...doc.data(),
			id: doc.id
		} as Address)
	})
	return results
}

export async function getViewedAddresses(currentUserId: string): Promise<Address[]> {
	const db = getDB()
	const user = await getUser(currentUserId)
	const results: Address[] = []
	if (user.viewedAddresses.length > 0) {
		const addressesRef = collection(db, 'addresses')
		const q = query(addressesRef, where(documentId(), 'in', user.viewedAddresses))
		const snapshot = await getDocs(q)
		snapshot.forEach((doc) => {
			results.push({
				...doc.data(),
				id: doc.id
			} as Address)
		})
	}
	return results
}
