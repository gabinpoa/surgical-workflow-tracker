export function pbDateString(date: Date) {
	return date
		.toISOString()
		.replace('.', 'T')
		.split('T')
		.filter((str, i) => i !== 2)
		.join(' ');
}
export function pbStringDateToDate(pbDateString: string) {
	const date = new Date(pbDateString.split(' ').join('T'));

	return date;
}
