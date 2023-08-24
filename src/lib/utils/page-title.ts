export function getPageTitle(page?: string) {
	if (page) {
		return `${page} | State of the Union`
	} else {
		return 'State of the Union'
	}
}
