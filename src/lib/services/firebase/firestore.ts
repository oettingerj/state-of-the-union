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
		userId: currentUser.uid,
		userName: currentUser.displayName,
		in: address.in,
		out: address.out,
		created: timestamp,
		updated: timestamp
	} as Address)

	return docRef.id
}

export async function updateAddress(id: string, fields: Partial<Address>) {
	const db = getDB()
	const docRef = doc(db, 'addresses', id)
	await updateDoc(docRef, {
		...fields,
		updated: Date.now()
	} as Partial<Address>)
}

export async function getAddress(id: string): Promise<Address> {
	const db = getDB()
	const docRef = doc(db, 'addresses', id)
	const snapshot = await getDoc(docRef)
	if (!snapshot.exists()) {
		throw new Error(`Address does not exist with id ${id}`)
	} else {
		return {
			...snapshot.data(),
			id
		} as Address
	}
}

export async function updateAddressNames(userId: string, name: string) {
	const db = getDB()
	const addressesRef = collection(db, 'addresses')
	const q = query(addressesRef, where('userId', '==', userId))
	const snapshot = await getDocs(q)
	const promises: Promise<void>[] = []
	snapshot.forEach((doc) => {
		promises.push(
			updateDoc(doc.ref, {
				userName: name
			} as Partial<Address>)
		)
	})
	await Promise.all(promises)
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
	const viewedAddressesSet = new Set([...user.viewedAddresses, addressId])
	await setDoc(doc(db, 'users', userId), {
		viewedAddresses: Array.from(viewedAddressesSet)
	})
}

export async function getMyAddresses(currentUserId: string): Promise<Address[]> {
	const db = getDB()
	const addressesRef = collection(db, 'addresses')
	const q = query(addressesRef, where('userId', '==', currentUserId))
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
