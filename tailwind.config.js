import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
	content: ['src/**/*.{js,ts,html,svelte}'],
	theme: {
		extend: {
			scale: {
				20: '0.2',
				25: '0.25',
				40: '0.4'
			}
		}
	},
	plugins: [typography]
}
