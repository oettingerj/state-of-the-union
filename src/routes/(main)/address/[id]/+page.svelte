<script lang="ts">
	import type { PageData } from './$types'
	import ViewAddress from '../../../../lib/components/ViewAddress.svelte'

	export let data: PageData
</script>

<div class="h-full p-5">
	<ViewAddress address={data.address} currentUser={data.currentUser} />
</div>
