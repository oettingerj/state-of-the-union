<script context="module">
	import '../styles/font.css'
	import '../styles/tailwind.css'
	import '../styles/global.css'
	import '@nordhealth/css/lib/nord.min.css'

	import { browser } from '$app/environment'
	import { initApp } from '../lib/services/firebase/firebase'
	if (browser) {
		import('@nordhealth/components')
		initApp()
	}
</script>

<main class="min-h-screen flex flex-col">
	<slot />
</main>
