import type { LayoutServerLoad } from './$types'
import { getAddress, initApp } from '$lib/services/firebase/admin.server'
import type { Address } from '$lib/types/address'
import { error } from '@sveltejs/kit'
import { PENDING_VIDEO } from '$lib/constants/av'

export const load: LayoutServerLoad = async ({ params, url }) => {
	initApp()

	let address: Address

	try {
		address = await getAddress(params.id)
	} catch (err) {
		console.error(err)
		throw error(404)
	}

	if (url.searchParams.has('processing')) {
		address.videoUrl = PENDING_VIDEO
	}

	return {
		address
	}
}
