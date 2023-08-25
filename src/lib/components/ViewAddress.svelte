<script lang="ts">
	import type { Address } from '$lib/types/address'
	import InOutBox from './InOutBox.svelte'
	import { getShareUrl } from '$lib/services/utils/share'
	import type { FBUser } from '$lib/types/user'
	import { notify } from '$lib/stores/notifications'
	import { PENDING_VIDEO } from '$lib/constants/av'
	import { getAddress } from '$lib/services/firebase/firestore'
	import { onDestroy, onMount } from 'svelte'

	export let address: Address
	export let currentUser: FBUser | null | undefined = undefined
	const isCurrentUser = address.userId === currentUser?.uid

	let maxPollingMs = 30000
	let pollingIntervalMs = 1000
	let intervalId: number | undefined
	let timerStart: number

	onMount(() => {
		if (address.videoUrl === PENDING_VIDEO) {
			intervalId = setInterval(pollForCompletedVideo, pollingIntervalMs)
			timerStart = Date.now()
		}
	})

	onDestroy(() => {
		if (intervalId) {
			clearInterval(intervalId)
		}
	})

	function shareAddress() {
		const sharePayload: ShareData = {
			title: address.title,
			url: getShareUrl(address.id)
		}
		if (navigator.share && navigator.canShare(sharePayload)) {
			navigator.share(sharePayload)
		} else {
			navigator.clipboard.writeText(getShareUrl(address.id))
			notify('Link copied to clipboard')
		}
	}

	async function pollForCompletedVideo() {
		if (timerStart + maxPollingMs < Date.now()) {
			stopPolling()
		} else {
			address = await getAddress(address.id)
			if (address.videoUrl !== PENDING_VIDEO) {
				stopPolling()
			}
		}
	}

	function stopPolling() {
		clearInterval(intervalId)
		intervalId = undefined
	}

	function refreshPage() {
		location.reload()
	}
</script>

<div class="grid grid-cols-2 h-full gap-5">
	<div class="row-start-1 col-span-2 flex items-center justify-end">
		<nord-button on:click={shareAddress}>
			<nord-icon size="m" slot="start" name="interface-link" />
			Share
		</nord-button>
	</div>
	<div class="row-start-2 col-span-2 flex flex-col items-center justify-center gap-1">
		<h1 class="text-xl font-medium">{address.title}</h1>
		<span class="text-sm font-medium text-gray-600">By {address.userName}</span>
		{#if address.userId !== currentUser?.uid}
			<span>{address.userName}</span>
		{/if}
	</div>
	<div class="relative row-start-3 col-span-2 flex h-full items-center justify-center">
		{#if address.videoUrl}
			<div class="relative h-full">
				{#if address.videoUrl !== PENDING_VIDEO}
					<video
						controls
						class="max-h-full rounded-lg"
						src={address.videoUrl}
						poster={address.thumbnailUrl}
					/>
					{#if address.userId === currentUser?.uid}
						<nord-button
							class="absolute top-1 md:top-3 right-1 md:right-3"
							href="/address/{address.id}/record"
						>
							<nord-icon name="interface-video" size="m" />
						</nord-button>
					{/if}
				{:else}
					<nord-empty-state class="rounded-lg">
						<h2>Video Processing In Progress</h2>
						<p>
							{isCurrentUser ? 'Your' : 'This'} video is processing. This typically takes
							less than a minute.
						</p>
						{#if intervalId}
							<nord-spinner size="l" />
						{:else}
							<nord-button on:click={refreshPage}>Refresh</nord-button>
						{/if}
					</nord-empty-state>
				{/if}
			</div>
		{/if}
	</div>
	<InOutBox
		class="row-start-4 col-start-1 col-span-2 md:col-span-1"
		{address}
		{currentUser}
		title="💅 What's In"
		htmlContent={address.in}
	/>
	<InOutBox
		class="row-start-5 md:row-start-4 col-start-1 md:col-start-2 col-span-2 md:col-span-1"
		{address}
		{currentUser}
		title="🤢 What's Out"
		htmlContent={address.out}
	/>
</div>

<style>
	.grid {
		grid-template-rows: 1fr 1fr minmax(0, 8fr) 8fr 8fr;
	}

	@media (min-width: 768px) {
		.grid {
			grid-template-rows: 1fr 1fr minmax(0, 8fr) 8fr;
		}
	}
</style>
