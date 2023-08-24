<script lang="ts">
	import { page } from '$app/stores'
	import { signOut } from '$lib/services/firebase/auth'
	import { beforeNavigate, goto } from '$app/navigation'
	import type { LayoutData } from './$types'
	import { onMount } from 'svelte'
	import type { Layout } from '@nordhealth/components'

	export let data: LayoutData

	let navRef: Layout

	beforeNavigate(({ from, to, cancel, type }) => {
		if (type === 'popstate' && to?.route.id === '/(main)/address/new') {
			if (from?.route.id?.endsWith('/record')) {
				cancel()
				if (from?.params?.id) {
					goto(`/address/${from.params.id}/edit`)
				}
			}
		}
	})

	onMount(() => {
		navRef.navOpen = !navRef.isNarrow
	})

	async function handleSignOut() {
		await signOut()
		return goto('/auth/login')
	}
</script>

<nord-layout bind:this={navRef} padding="none">
	<nord-navigation slot="nav">
		<a href="/home" slot="header" class="flex items-center gap-3 px-3">
			<img
				slot="start"
				class="h-8 object-contain"
				src="/images/nicki-flag.jpg"
				alt="nicki minaj flag"
			/>
			<h3 class="text-lg font-medium">State of the Union</h3>
		</a>
		<nord-nav-item href="/home" active={$page.url.pathname === '/home'} icon="interface-home">
			Home
		</nord-nav-item>
		<nord-nav-item
			href="/library"
			active={$page.url.pathname === '/library'}
			icon="interface-content-book"
		>
			Library
		</nord-nav-item>
		<nord-nav-item
			href="/address/new"
			active={$page.url.pathname === '/address/new'}
			icon="file-notes"
		>
			Draft An Address
		</nord-nav-item>
		<nord-dropdown expand slot="footer">
			<nord-button slot="toggle" expand>
				<nord-avatar slot="start" />
				{data.currentUser?.displayName ?? ''}
			</nord-button>
			<nord-dropdown-item on:click={handleSignOut}>
				Sign out
				<nord-icon slot="end" name="interface-logout" />
			</nord-dropdown-item>
		</nord-dropdown>
	</nord-navigation>
	<div class="h-screen">
		<slot />
	</div>
</nord-layout>
