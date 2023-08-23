<script lang="ts">
	import EditAddress from '../../../../../lib/components/EditAddress.svelte'
	import type { PageData } from './$types'
	import { goto } from '$app/navigation'

	export let data: PageData

	function handleSave() {
		goto(`/address/${data.address.id}`)
	}
</script>

<EditAddress on:save={handleSave} address={data.address} />
