export function formatPhoneNumber(phoneNumber: string): string {
	if (!phoneNumber.startsWith('+')) {
		return '+1'.concat(phoneNumber)
	} else {
		return phoneNumber
	}
}
