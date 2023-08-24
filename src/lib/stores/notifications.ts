import { type Writable, writable } from 'svelte/store'
import type { Notification } from '$lib/types/notification'
import { uid } from 'radash'

export const notifications: Writable<Notification[]> = writable([])

export function notify(text: string) {
	const id = uid(6)
	notifications.update((notifications) =>
		notifications.concat({
			id,
			text
		})
	)
	setTimeout(() => {
		notifications.update((notifications) => notifications.filter((n) => n.id !== id))
	}, 3000)
}
