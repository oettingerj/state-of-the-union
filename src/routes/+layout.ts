import type { LayoutLoad } from './$types'
import { isLoggedIn } from '$lib/services/firebase/auth'
import { redirect } from '@sveltejs/kit'
import { browser } from '$app/environment'

export const ssr = true

export const load: LayoutLoad = async ({ route, url }) => {
	if (browser) {
		const loggedIn = await isLoggedIn()
		if (!loggedIn && route.id?.includes('(main)')) {
			throw redirect(307, '/auth/login')
		} else if (loggedIn && route.id?.includes('share')) {
			throw redirect(307, url.pathname.replace('share/', ''))
		}
	}
}
