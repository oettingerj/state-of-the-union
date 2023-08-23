import type { PageServerLoad } from './$types'
import { getAddress } from '$lib/services/firebase/admin.server'
import type { Address } from '$lib/types/address'
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ params }) => {
	let address: Address

	try {
		address = await getAddress(params.id)
	} catch (err) {
		console.error(err)
		throw error(404)
	}

	delete address.created
	delete address.updated

	return {
		address: {
			...address,
			id: params.id
		}
	}
}
