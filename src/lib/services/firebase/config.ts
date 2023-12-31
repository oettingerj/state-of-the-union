import {
	PUBLIC_FIREBASE_API_KEY,
	PUBLIC_FIREBASE_APP_ID,
	PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	PUBLIC_FIREBASE_PROJECT_ID
} from '$env/static/public'

export default {
	apiKey: PUBLIC_FIREBASE_API_KEY,
	authDomain: `${PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
	projectId: PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: `${PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`,
	messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: PUBLIC_FIREBASE_APP_ID
}
