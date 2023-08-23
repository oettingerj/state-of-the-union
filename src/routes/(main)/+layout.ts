import type { LayoutLoad } from './$types'
import { getCurrentUser } from '$lib/services/firebase/auth'

export const load: LayoutLoad = async () => {
	return {
		currentUser: await getCurrentUser()
	}
}
