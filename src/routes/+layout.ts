import type { LayoutLoad } from './$types'
import { isLoggedIn } from '$lib/services/firebase/auth'
import { redirect } from '@sveltejs/kit'

export const ssr = false

export const load: LayoutLoad = async ({ route }) => {
	const loggedIn = await isLoggedIn()
	if (!loggedIn && route.id?.includes('(main)')) {
		throw redirect(307, '/auth/login')
	} else {
		return {}
	}
}
