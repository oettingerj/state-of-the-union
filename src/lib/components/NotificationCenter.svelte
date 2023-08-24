<script lang="ts">
	import { notifications } from '../stores/notifications'
	import { fade } from 'svelte/transition'
	import { flip } from 'svelte/animate'
</script>

<div class="fixed bottom-3 right-3 flex flex-col gap-2">
	{#each $notifications as notification (notification.id)}
		<nord-banner transition:fade animate:flip>
			{notification.text}
		</nord-banner>
	{/each}
</div>
