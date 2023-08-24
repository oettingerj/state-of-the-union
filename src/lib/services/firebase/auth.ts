import {
	getAuth,
	RecaptchaVerifier,
	signInWithPhoneNumber,
	updateProfile,
	type ConfirmationResult
} from 'firebase/auth'
import { getApp } from '$lib/services/firebase/firebase'
import type { FBUser } from '$lib/types/user'
import { updateAddressNames } from '$lib/services/firebase/firestore'

let recaptcha: RecaptchaVerifier

export function getFBAuth() {
	return getAuth(getApp())
}

export function initInvisibleRecaptcha(recaptchaContainerId: string) {
	if (!recaptcha) {
		const auth = getFBAuth()
		recaptcha = new RecaptchaVerifier(auth, recaptchaContainerId, {
			size: 'invisible'
		})
	}
}

export async function signInWithPhone(phoneNumber: string) {
	const auth = getFBAuth()
	return await signInWithPhoneNumber(auth, phoneNumber, recaptcha)
}

export async function confirmSMSCode(confirmationResult: ConfirmationResult, code: string) {
	const result = await confirmationResult.confirm(code)
	return result.user
}

export async function signOut() {
	const auth = getFBAuth()
	await auth.signOut()
}

export async function isLoggedIn() {
	const auth = getFBAuth()
	await auth.authStateReady()
	return auth.currentUser !== null
}

export async function getCurrentUser() {
	const auth = getFBAuth()
	await auth.authStateReady()
	return auth.currentUser
}

export async function updateUser(user: Partial<FBUser>) {
	const auth = getFBAuth()
	if (auth.currentUser === null) {
		throw new Error('No user is logged in.')
	} else {
		if (user.displayName && user.displayName !== auth.currentUser.displayName) {
			await updateProfile(auth.currentUser, user)
			await updateAddressNames(auth.currentUser.uid, user.displayName)
		} else {
			await updateProfile(auth.currentUser, user)
		}
	}
}
