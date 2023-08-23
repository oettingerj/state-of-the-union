import type { LayoutLoad } from './$types'
import { isLoggedIn } from '$lib/services/firebase/auth'
import { redirect } from '@sveltejs/kit'
import { browser } from '$app/environment'

export const ssr = false

export const load: LayoutLoad = async ({ route }) => {
	if (browser) {
		if (!(await isLoggedIn()) && route.id?.includes('(main)')) {
			throw redirect(307, '/auth/login')
		}
	}

	return {}
}
