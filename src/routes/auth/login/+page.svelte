<script lang="ts">
	import { goto } from '$app/navigation'

	let phoneNumber: string
	let errorMessage = ''

	function handleLogin() {
		if (!phoneNumber) {
			errorMessage = 'Enter a phone number.'
		} else {
			errorMessage = ''
			goto(`/auth/confirm?phone=${encodeURIComponent(phoneNumber)}`)
		}
	}

	function handlePhoneInput(event: InputEvent) {
		phoneNumber = event.target?.value
		if (phoneNumber) {
			errorMessage = ''
		}
	}
</script>

<div class="flex flex-col items-center border-b border-gray-300 py-5 gap-5">
	<img class="h-32 object-contain" src="/images/nicki-flag.jpg" alt="nicki minaj flag" />
	<h2 class="text-2xl font-normal">Sign in with your phone number</h2>
</div>
<div class="p-5 flex flex-col items-center">
	<form novalidate class="flex flex-col gap-5" on:submit|preventDefault={handleLogin}>
		<nord-input
			required
			hide-required
			size="l"
			label="Phone Number"
			type="tel"
			autocomplete="tel"
			placeholder="xxx-xxx-xxxx"
			on:input={handlePhoneInput}
			error={errorMessage}
		>
			<nord-icon slot="start" name="generic-telephone" />
		</nord-input>
		<nord-button class="self-end" variant="primary" type="submit">Sign In</nord-button>
	</form>
</div>
