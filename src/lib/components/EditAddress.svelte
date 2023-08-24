<script lang="ts">
	import TextArea from '$lib/components/TextArea/TextArea.svelte'
	import { goto } from '$app/navigation'
	import { createAddress, updateAddress } from '$lib/services/firebase/firestore'
	import type { Address } from '$lib/types/address'
	import { createEventDispatcher } from 'svelte'

	const now = new Date()
	const dateString = now.toLocaleDateString('en-US')
	const dispatch = createEventDispatcher()

	export let address: Partial<Address> & Required<Pick<Address, 'title' | 'in' | 'out'>> = {
		title: `State of the Union Address ${dateString}`,
		in: '',
		out: ''
	}

	let editingTitle = false
	let titleRef: HTMLHeadingElement

	$: continueDisabled = address.in.length === 0 || address.out.length === 0

	async function recordAddress() {
		if (!address.id) {
			address.id = await createAddress(address)
		} else {
			await updateAddress(address.id, address)
		}
		return goto(`/address/${address.id}/record`)
	}

	async function saveAddress() {
		if (address.id) {
			await updateAddress(address.id, address)
			dispatch('save')
		}
	}

	function handleTitleFocus() {
		editingTitle = true
		const range = document.createRange()
		range.selectNodeContents(titleRef)
		const selection = window.getSelection()
		if (selection) {
			selection.removeAllRanges()
			selection.addRange(range)
		}
	}

	function handleTitleBlur() {
		editingTitle = false
	}

	function handleEditButtonClick() {
		if (editingTitle) {
			titleRef.blur()
		} else {
			titleRef.focus()
		}
	}

	function handleTitleInput() {
		address.title = titleRef.textContent ?? address.title
	}
</script>

<div class="flex flex-col items-center p-10 gap-5">
	<div class="flex gap-4 items-center">
		<h2
			bind:this={titleRef}
			contenteditable="true"
			class="p-2 text-xl font-medium outline-pink-500"
			on:focus={handleTitleFocus}
			on:blur={handleTitleBlur}
			on:input={handleTitleInput}
		>
			{address.title}
		</h2>
		<button
			on:click={handleEditButtonClick}
			class="flex items-center justify-center text-gray-700 hover:text-gray-500"
		>
			{#if editingTitle}
				<nord-icon name="interface-checked" size="l" />
			{:else}
				<nord-icon name="interface-edit" size="l" />
			{/if}
		</button>
	</div>
	{#if !address.id}
		<p class="prose">
			The American people are rudderless. They need to know – from the nation's highest office
			– what's in and what's out. Draft your talking points below, then record your address so
			you can share it with your constituents.
		</p>
	{/if}
	<div
		class="grid md:grid-cols-2 grid-rows-2 md:grid-rows-1 gap-x-5 gap-y-12 w-full min-h-[300px]"
	>
		<div class="col-start-1">
			<h3 class="text-xl font-medium mb-1">💅 What's In?</h3>
			<TextArea bind:value={address.in} class="w-full h-full" />
		</div>
		<div class="row-start-2 md:row-start-1 md:col-start-2">
			<h3 class="text-xl font-medium mb-1">🤢 What's Out?</h3>
			<TextArea bind:value={address.out} class="w-full h-full" />
		</div>
	</div>
	<div class="mt-10 flex items-center gap-2">
		<nord-button
			disabled={continueDisabled}
			on:click={recordAddress}
			size="l"
			variant={address.videoUrl ? 'default' : 'primary'}
		>
			<nord-icon slot="start" name="interface-video" size="l" />
			{address.videoUrl ? 'Re-Record Address' : 'Record Address'}
		</nord-button>
		{#if address.id}
			<nord-button size="l" variant="primary" on:click={saveAddress}>Save</nord-button>
		{/if}
	</div>
</div>
