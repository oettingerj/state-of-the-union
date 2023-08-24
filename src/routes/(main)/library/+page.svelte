<script lang="ts">
	import type { PageData } from './$types'
	import AddressCardButton from '$lib/components/AddressCardButton.svelte'
	import { getPageTitle } from '$lib/utils/page-title'

	enum Tabs {
		Yours,
		Viewed
	}

	export let data: PageData
	let selectedTab = Tabs.Yours

	function handleSelectTab(tab: Tabs) {
		selectedTab = tab
	}
</script>

<svelte:head>
	<title>{getPageTitle('Library')}</title>
</svelte:head>

<div class="py-20 px-5 md:px-20 h-full">
	<h1 class="text-xl font-medium mb-2">Library</h1>
	<nord-card>
		<nord-tab-group class="h-full mb-2">
			<nord-tab
				on:click={() => handleSelectTab(Tabs.Yours)}
				slot="tab"
				aria-selected={selectedTab === Tabs.Yours}
				selected={selectedTab === Tabs.Yours}
			>
				Your Addresses
			</nord-tab>
			<nord-tab
				on:click={() => handleSelectTab(Tabs.Viewed)}
				slot="tab"
				aria-selected={selectedTab === Tabs.Viewed}
				selected={selectedTab === Tabs.Viewed}
			>
				Viewed Addresses
			</nord-tab>
		</nord-tab-group>
		<div class="flex flex-wrap items-center gap-3 p-5">
			{#if data.myAddresses && data.viewedAddresses}
				{#if selectedTab === Tabs.Yours}
					{#if data.myAddresses.length > 0}
						{#each data.myAddresses as address}
							<AddressCardButton {address} />
						{/each}
					{:else}
						<nord-empty-state>
							<h2>Nothing to see here</h2>
							<p>Draft an address to get started!</p>
							<nord-button variant="primary" href="/address/new">
								Draft an Address
							</nord-button>
						</nord-empty-state>
					{/if}
				{:else if selectedTab === Tabs.Viewed}
					{#if data.viewedAddresses.length > 0}
						{#each data.viewedAddresses as address}
							<AddressCardButton {address} />
						{/each}
					{:else}
						<nord-empty-state>
							<h2>Nothing to see here</h2>
							<p>
								When someone shares an address with you, it will appear here once
								you open it.
							</p>
						</nord-empty-state>
					{/if}
				{/if}
			{:else}
				<nord-spinner class="m-5" size="l" />
			{/if}
		</div>
	</nord-card>
</div>
