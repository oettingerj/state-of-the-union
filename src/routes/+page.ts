import type { PageLoad } from './$types'
import { redirect } from '@sveltejs/kit'
import { isLoggedIn } from '$lib/services/firebase/auth'
import { browser } from '$app/environment'

export const load: PageLoad = async () => {
	if (browser && (await isLoggedIn())) {
		throw redirect(307, '/home')
	}
}
