import { initializeApp, type FirebaseApp } from 'firebase/app'
import firebaseConfig from './config'
import { browser } from '$app/environment'

let app: FirebaseApp

export function initApp() {
	app = initializeApp(firebaseConfig)
}

export function getApp() {
	if (!browser) {
		throw new Error('Cannot use Firebase in a Node context')
	}

	if (!app) {
		initApp()
	}
	return app
}
