<script lang="ts">
	import type { PageData } from './$types'
	import ViewAddress from '$lib/components/ViewAddress.svelte'
	import { getPageTitle } from '$lib/utils/page-title'

	export let data: PageData
</script>

<svelte:head>
	<title>{getPageTitle(data.address.title)}</title>
	<meta property="og:title" content={data.address.title} />
	<meta property="og:video" content={data.address.videoUrl} />
	<meta property="og:image" content={data.address.thumbnailUrl} />
</svelte:head>

<div class="h-screen p-5">
	<ViewAddress address={data.address} />
</div>
