<script lang="ts">
	import type { PageData } from './$types'

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

<div class="py-20 px-5 md:px-20 h-full">
	<h1 class="text-xl font-medium mb-2">Library</h1>
	<nord-card>
		<nord-tab-group class="h-full mb-2">
			<nord-tab
				on:click={() => handleSelectTab(Tabs.Yours)}
				slot="tab"
				selected={selectedTab === Tabs.Yours}
			>
				Your Addresses
			</nord-tab>
			<nord-tab
				on:click={() => handleSelectTab(Tabs.Viewed)}
				slot="tab"
				selected={selectedTab === Tabs.Viewed}
			>
				Viewed Addresses
			</nord-tab>
		</nord-tab-group>
		<div class="flex flex-wrap">
			{#if selectedTab === Tabs.Yours && data.myAddresses}
				{#each data.myAddresses as address}
					<nord-button href="/address/{address.id}">
						<div class="max-w-[200px] aspect-square">
							<h3 class="whitespace-normal">
								{address.title}
							</h3>
						</div>
					</nord-button>
				{/each}
			{:else if selectedTab === Tabs.Viewed && data.viewedAddresses}
				{#each data.viewedAddresses as address}
					<nord-card>
						{address.title}
					</nord-card>
				{/each}
			{/if}
		</div>
	</nord-card>
</div>
