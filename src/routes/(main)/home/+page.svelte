<script lang="ts">
	import { getPageTitle } from '$lib/utils/page-title'
</script>

<svelte:head>
	<title>{getPageTitle()}</title>
</svelte:head>

<div class="relative flex flex-col h-full">
	<img
		class="absolute pointer-events-none rotate-45 -translate-x-1/4 translate-y-1/4 bottom-0 left-0 opacity-30"
		src="/images/nicki.webp"
		alt="nicki minaj"
	/>
	<div class="flex z-10 flex-col items-center px-10 py-16 gap-10">
		<p class="prose-lg md:w-1/2">
			Welcome! From here you can view addresses from States of the Union past, or contribute a
			new address to the national discourse.
		</p>
		<div class="flex flex-wrap gap-5 justify-center">
			<nord-button class="grow" expand href="/library">
				<div class="flex flex-col items-center gap-1">
					<nord-icon class="text-pink-600" name="interface-content-book" size="l" />
					<h3 class="font-medium text-lg">Library</h3>
					<p class="text-gray-700">Browse prior addresses</p>
				</div>
			</nord-button>
			<nord-button class="grow" expand href="/address/new">
				<div class="flex flex-col items-center gap-1">
					<nord-icon class="text-pink-600" name="file-notes" size="l" />
					<h3 class="font-medium text-lg">Draft</h3>
					<p class="text-gray-700">Draft and record a new address</p>
				</div>
			</nord-button>
		</div>
	</div>
</div>
