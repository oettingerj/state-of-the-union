import type { LayoutLoad } from './$types'
import { getCurrentUser } from '$lib/services/firebase/auth'
import { browser } from '$app/environment'

export const load: LayoutLoad = async () => {
	if (browser) {
		return {
			currentUser: await getCurrentUser()
		}
	}
}
