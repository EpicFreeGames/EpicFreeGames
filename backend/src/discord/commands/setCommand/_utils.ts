export function autoCompleteSorter(a: string, b: string, query: string) {
	if (a.indexOf(query) < b.indexOf(query)) return -1;
	else if (a.indexOf(query) > b.indexOf(query)) return 1;
	else return 0;
}
