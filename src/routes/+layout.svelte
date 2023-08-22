<script context="module">
	import '../styles/font.css'
	import '../styles/tailwind.css'
	import '../styles/global.css'
	import '@nordhealth/css/lib/nord.min.css'

	import { browser } from '$app/environment'
	if (browser) {
		import('@nordhealth/components')
	}
</script>

<main class="min-h-screen">
	<slot />
</main>
