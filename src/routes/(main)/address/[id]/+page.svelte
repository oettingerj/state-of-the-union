<script lang="ts">
	import type { PageData } from './$types'
	import ViewAddress from '../../../../lib/components/ViewAddress.svelte'
	import { onMount } from 'svelte'
	import { registerAddressView } from '$lib/services/firebase/firestore'
	import { getPageTitle } from '$lib/utils/page-title'

	export let data: PageData

	onMount(() => {
		if (data.currentUser && data.currentUser.uid !== data.address.userId) {
			registerAddressView(data.currentUser.uid, data.address.id)
		}
	})
</script>

<svelte:head>
	<title>{getPageTitle(data.address.title)}</title>
</svelte:head>

<div class="h-full p-5">
	<ViewAddress address={data.address} currentUser={data.currentUser} />
</div>
