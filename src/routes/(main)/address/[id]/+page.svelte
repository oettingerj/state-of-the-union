<script lang="ts">
	import type { PageData } from './$types'
	import ViewAddress from '../../../../lib/components/ViewAddress.svelte'
	import { onMount } from 'svelte'
	import { registerAddressView } from '$lib/services/firebase/firestore'
	import { getPageTitle } from '$lib/utils/page-title'
	import { page } from '$app/stores'

	export let data: PageData

	onMount(() => {
		if ($page.url.searchParams.has('processing')) {
			$page.url.searchParams.delete('processing')
			window.history.replaceState({}, '', $page.url)
		}

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
