<script lang="ts">
	import { updateUser } from '$lib/services/firebase/auth'
	import { goto } from '$app/navigation'

	let name = ''
	let errorMessage = ''

	async function handleSubmit() {
		if (!name) {
			errorMessage = 'Please enter your name.'
			return
		}
		await updateUser({
			displayName: name
		})
		return goto('/home')
	}

	function handleNameInput(event: InputEvent) {
		name = event.target?.value
		if (name) {
			errorMessage = ''
		}
	}
</script>

<div class="flex flex-col items-center border-b border-gray-300 py-5 gap-5">
	<h2 class="text-2xl font-normal">Welcome! Enter your name to continue to the main site.</h2>
</div>
<div class="p-5 flex flex-col items-center">
	<form novalidate class="flex flex-col gap-5" on:submit|preventDefault={handleSubmit}>
		<nord-input
			required
			size="l"
			label="Display Name"
			autocomplete="nickname"
			placeholder="Nicki Minaj"
			on:input={handleNameInput}
			error={errorMessage}
		/>
		<nord-button class="self-end" variant="primary" type="submit">Continue</nord-button>
	</form>
</div>
