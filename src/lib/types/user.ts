import type { User as FirebaseUser } from 'firebase/auth'

export interface User {
	viewedAddresses: string[]
}

export type FBUser = FirebaseUser
