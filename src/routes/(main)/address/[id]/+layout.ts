import type { LayoutLoad } from './$types'
import { getAddress } from '$lib/services/firebase/firestore'
import type { Address } from '$lib/types/address'
import { error } from '@sveltejs/kit'

export const load: LayoutLoad = async ({ params }) => {
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
