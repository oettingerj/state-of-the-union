<script lang="ts">
	import type { PageData } from './$types'
	import ViewAddress from '$lib/components/ViewAddress.svelte'

	export let data: PageData
</script>

<svelte:head>
	<title>{data.address.title}</title>
	<meta property="og:title" content={data.address.title} />
	<meta property="og:video" content={data.address.videoUrl} />
</svelte:head>

<div class="h-screen p-5">
	<ViewAddress address={data.address} />
</div>
