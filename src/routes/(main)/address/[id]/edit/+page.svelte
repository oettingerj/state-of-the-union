<script lang="ts">
	import EditAddress from '../../../../../lib/components/EditAddress.svelte'
	import type { PageData } from './$types'
	import { goto } from '$app/navigation'
	import { getPageTitle } from '$lib/utils/page-title'

	export let data: PageData

	function handleSave() {
		goto(`/address/${data.address.id}`)
	}
</script>

<svelte:head>
	<title>{getPageTitle('Edit Address')}</title>
</svelte:head>

<EditAddress on:save={handleSave} address={data.address} />
