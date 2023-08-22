<script lang="ts">
	import TextArea from '$lib/components/TextArea.svelte'
	import { goto } from '$app/navigation'
	import { createAddress } from '$lib/services/firebase/firestore'

	const now = new Date()
	const dateString = now.toLocaleDateString('en-US')

	let title = `State of the Union Address ${dateString}`
	let whatsIn = ''
	let whatsOut = ''
	let editingTitle = false
	let titleRef: HTMLHeadingElement

	$: continueDisabled = whatsIn.length === 0 || whatsOut.length === 0

	async function submitAddress() {
		const id = await createAddress({
			title,
			in: whatsIn,
			out: whatsOut
		})
		await goto(`/address/${id}/record`)
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
		title = titleRef.textContent ?? title
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
			{title}
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
	<p class="prose">
		The American people are rudderless. They need to know – from the nation's highest office –
		what's in and what's out. Draft your talking points below, then record your address so you
		can share it with your constituents.
	</p>
	<div
		class="grid md:grid-cols-2 grid-rows-2 md:grid-rows-1 gap-x-5 gap-y-12 w-full min-h-[300px]"
	>
		<div class="col-start-1">
			<h3 class="text-xl font-medium mb-1">What's In?</h3>
			<TextArea bind:value={whatsIn} class="w-full h-full" />
		</div>
		<div class="row-start-2 md:row-start-1 md:col-start-2">
			<h3 class="text-xl font-medium mb-1">What's Out?</h3>
			<TextArea bind:value={whatsOut} class="w-full h-full" />
		</div>
	</div>
	<div class="mt-10">
		<nord-button
			disabled={continueDisabled}
			on:click={submitAddress}
			size="l"
			variant="primary"
		>
			<nord-icon slot="start" name="interface-video" size="l" />
			Record
		</nord-button>
	</div>
</div>
