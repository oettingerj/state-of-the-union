import type { PageLoad } from './$types'
import { redirect } from '@sveltejs/kit'
import { formatPhoneNumber } from '$lib/utils/format'

export const load: PageLoad = ({ url }) => {
	const phoneNumber = url.searchParams.get('phone')

	if (!phoneNumber) {
		throw redirect(307, '/auth/login')
	}

	return {
		phoneNumber: formatPhoneNumber(phoneNumber)
	}
}
