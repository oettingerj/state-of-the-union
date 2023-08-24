import type { PageLoad } from './$types'
import { browser } from '$app/environment'
import { getCurrentUser } from '$lib/services/firebase/auth'
import { getMyAddresses, getViewedAddresses } from '$lib/services/firebase/firestore'

export const load: PageLoad = async () => {
	if (browser) {
		const user = await getCurrentUser()
		if (user) {
			return {
				myAddresses: getMyAddresses(user.uid),
				viewedAddresses: getViewedAddresses(user.uid)
			}
		}
	}
}
