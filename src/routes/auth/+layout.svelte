<script lang="ts">
	import { getPageTitle } from '$lib/utils/page-title'
</script>

<svelte:head>
	<title>{getPageTitle('Login')}</title>
</svelte:head>

<div class="flex flex-col gap-5 items-center p-5">
	<div class="md:w-1/2 border border-gray-300 rounded-sm">
		<slot />
	</div>
</div>
