import type { LayoutServerLoad } from './$types'
import { getAddress, initApp } from '$lib/services/firebase/admin.server'
import type { Address } from '$lib/types/address'
import { error } from '@sveltejs/kit'

export const load: LayoutServerLoad = async ({ params }) => {
	initApp()

	let address: Address

	try {
		address = await getAddress(params.id)
	} catch (err) {
		console.error(err)
		throw error(404)
	}

	return {
		address: {
			...address,
			id: params.id
		}
	}
}
