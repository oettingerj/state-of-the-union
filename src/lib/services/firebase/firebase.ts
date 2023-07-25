import { initializeApp, type FirebaseApp } from 'firebase/app'

const firebaseConfig = {
	apiKey: 'AIzaSyAfDztO3cbCDe4JkTFRa35lXJK4rjCluQ0',
	authDomain: 'state-of-the-union.firebaseapp.com',
	projectId: 'state-of-the-union',
	storageBucket: 'state-of-the-union.appspot.com',
	messagingSenderId: '233326694438',
	appId: '1:233326694438:web:e032def9ca6ca64da816e7'
}

export let firebase: FirebaseApp

export function initApp() {
	firebase = initializeApp(firebaseConfig)
}
