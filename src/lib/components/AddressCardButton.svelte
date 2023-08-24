<script lang="ts">
	import type { Address } from '$lib/types/address'

	export let address: Address
</script>

<nord-button href="/address/{address.id}">
	<div class="md:max-w-[200px] md:aspect-square flex md:flex-col items-center gap-2 p-1">
		{#if address.thumbnailUrl}
			<img class="object-contain w-1/4 md:w-full" src={address.thumbnailUrl} />
		{/if}
		<div>
			<h3 class="text-xs md:text-sm whitespace-normal">
				{address.title}
			</h3>
			<span class="text-xs text-gray-600">By {address.userName}</span>
		</div>
	</div>
</nord-button>
