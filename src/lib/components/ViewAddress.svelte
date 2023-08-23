<script lang="ts">
	import type { Address } from '$lib/types/address'
	import type { User } from 'firebase/auth'
	import InOutBox from './InOutBox.svelte'
	import { getShareUrl } from '$lib/services/utils/share'

	export let address: Address
	export let currentUser: User | null | undefined = undefined

	function shareAddress() {
		if (navigator.share && navigator.canShare()) {
			navigator.share({
				title: address.title,
				url: getShareUrl(address.id)
			})
		} else {
			navigator.clipboard.writeText(getShareUrl(address.id))
		}
	}
</script>

<div class="grid grid-cols-2 h-full gap-5">
	<div class="row-start-1 col-span-2 flex items-center justify-center relative">
		<h1 class="text-xl font-medium">{address.title}</h1>
		<nord-button
			class="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1"
			on:click={shareAddress}
		>
			<nord-icon size="m" slot="start" name="interface-link" />
			Share
		</nord-button>
	</div>
	<div class="relative row-start-2 col-span-2 flex h-full items-center justify-center">
		<div class="relative h-full">
			<video controls class="max-h-full" src={address.videoUrl} />
			{#if address.user === currentUser?.uid}
				<nord-button class="absolute top-3 right-3" href="/address/{address.id}/record">
					<nord-icon name="interface-edit" size="m" />
				</nord-button>
			{/if}
		</div>
	</div>
	<InOutBox
		class="row-start-3 col-start-1"
		{address}
		{currentUser}
		title="💅 What's In"
		htmlContent={address.in}
	/>
	<InOutBox
		class="row-start-3 col-start-2"
		{address}
		{currentUser}
		title="🤢 What's Out"
		htmlContent={address.out}
	/>
</div>

<style>
	.grid {
		grid-template-rows: 1fr minmax(0, 8fr) 8fr;
	}
</style>
