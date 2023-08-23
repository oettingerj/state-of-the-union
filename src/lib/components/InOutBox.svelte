<script lang="ts">
	import type { Address } from '$lib/types/address'
	import type { User } from 'firebase/auth'

	export let address: Address
	export let currentUser: User | null | undefined = undefined
	export let title: string
	export let htmlContent: string
	let className: string = ''
	export { className as class }
</script>

<div
	class="flex flex-col gap-1 bg-white pt-5 pb-16 px-10 rounded-lg shadow-md border border-gray-300 {className}"
>
	<div class="flex justify-between items-end">
		<h2 class="text-xl font-medium">{title}</h2>
		{#if address.user === currentUser?.uid}
			<nord-button href="/address/{address.id}/edit">
				<nord-icon name="interface-edit" size="m" />
			</nord-button>
		{/if}
	</div>
	{@html htmlContent}
</div>
