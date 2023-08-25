import type { PageLoad } from './$types'
import { redirect } from '@sveltejs/kit'
import { isLoggedIn } from '$lib/services/firebase/auth'

export const load: PageLoad = async () => {
	if (await isLoggedIn()) {
		throw redirect(307, '/home')
	}
}
