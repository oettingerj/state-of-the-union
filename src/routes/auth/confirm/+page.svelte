<script lang="ts">
	import type { PageData } from './$types'
	import {
		confirmSMSCode,
		initInvisibleRecaptcha,
		signInWithPhone
	} from '$lib/services/firebase/auth'
	import type { ConfirmationResult } from 'firebase/auth'
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'

	export let data: PageData
	let errorText = ''
	let confirmationResult: ConfirmationResult
	let codeSent = false
	let verificationCode: string
	let verifying = false

	const recaptchaContainerId = 'invisible-recaptcha-container'

	async function sendConfirmationCode() {
		confirmationResult = await signInWithPhone(data.phoneNumber)
		codeSent = true
	}

	onMount(() => {
		initInvisibleRecaptcha(recaptchaContainerId)
		sendConfirmationCode()
	})

	async function handleConfirm() {
		verifying = true
		errorText = ''
		try {
			const user = await confirmSMSCode(confirmationResult, verificationCode)
			verifying = false
			if (user.displayName) {
				return goto('/home')
			} else {
				return goto('/user/info')
			}
		} catch (err) {
			errorText = 'Invalid code'
			verifying = false
		}
	}

	function handleCodeInput(event: InputEvent) {
		errorText = ''
		verificationCode = event.target?.value
	}
</script>

<div class="flex flex-col items-center border-b border-gray-300 p-5">
	<h2 class="text-lg md:text-2xl font-normal">Confirm your phone number</h2>
</div>
<div class="p-5 flex flex-col items-center">
	<form novalidate class="flex flex-col gap-5" on:submit|preventDefault={handleConfirm}>
		<nord-input
			required
			disabled={!codeSent}
			error={errorText}
			on:input={handleCodeInput}
			hide-required
			hint={!codeSent ? 'Sending verification code...' : ''}
			size="l"
			label="Code"
			type="number"
			autocomplete="one-time-code"
			placeholder="#######"
		>
			<nord-icon slot="start" name="interface-shield" />
		</nord-input>
		<nord-button
			loading={verifying}
			disabled={!codeSent}
			class="self-end"
			variant="primary"
			type="submit"
		>
			Submit
		</nord-button>
	</form>
</div>

<div id={recaptchaContainerId} />
