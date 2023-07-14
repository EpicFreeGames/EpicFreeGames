export function safeJsonParse<T>(jsonString: string): T | null {
	try {
		return JSON.parse(jsonString) as T;
	} catch (e) {
		return null;
	}
}
