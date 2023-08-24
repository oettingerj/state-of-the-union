<script lang="ts">
	import { getCurrentUser, updateUser } from '$lib/services/firebase/auth'
	import { goto } from '$app/navigation'
	import { browser } from '$app/environment'
	import { onMount } from 'svelte'

	let name = ''
	let errorMessage = ''
	let saving = false

	onMount(async () => {
		if (browser) {
			const user = await getCurrentUser()
			if (user) {
				name = user.displayName ?? ''
			}
		}
	})

	async function handleSubmit() {
		if (!name) {
			errorMessage = 'Please enter your name.'
			return
		}
		saving = true
		try {
			await updateUser({
				displayName: name
			})
			return goto('/home')
		} catch (err) {
			console.error(err)
			saving = false
		}
	}

	function handleNameInput(event: InputEvent) {
		name = event.target?.value
		if (name) {
			errorMessage = ''
		}
	}
</script>

<nord-card class="p-10">
	<div slot="header" class="flex flex-col gap-2">
		{#if !name}
			<span class="text-lg md:text-2xl">Welcome!</span>
			<h2 class="text-lg md:text-2xl">Enter your name to continue to the main site.</h2>
		{:else}
			<h2 class="text-lg md:text-2xl">Edit display name</h2>
		{/if}
	</div>
	<div class="">
		<form novalidate class="flex flex-col gap-5" on:submit|preventDefault={handleSubmit}>
			<nord-input
				required
				value={name}
				size="l"
				label="Display Name"
				autocomplete="nickname"
				placeholder="Nicki Minaj"
				on:input={handleNameInput}
				error={errorMessage}
			/>
			<nord-button loading={saving} class="self-end" variant="primary" type="submit">
				Continue
			</nord-button>
		</form>
	</div>
</nord-card>
