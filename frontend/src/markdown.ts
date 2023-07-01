import { resolveHref } from "./utils";
import { marked } from "marked";

export function markdown(text: string, currentPath: string) {
	const parsedMarkdown = marked(text, { mangle: false, headerIds: false });

	const anchorMatches = [
		...parsedMarkdown.matchAll(/<a\s+([^>]*\s+)?href="([^"]*)"(?:\s+[^>]*?)?\s*>(.*?)<\/a>/gi),
	];

	const anchorMatchesWithResolvedHrefs = anchorMatches.map((matchArr) => {
		const [match, , href] = matchArr;

		if (!href) {
			throw new Error(`Could not find href in anchor match: ${match}`);
		}

		return {
			match,
			href: resolveHref({ currentPath, href }),
		};
	});

	const replacedMarkdown = parsedMarkdown
		// Replace all <a> tags
		.replaceAll(/<a\s+([^>]*\s+)?href="([^"]*)"(?:\s+[^>]*?)?\s*>(.*?)<\/a>/gi, (match) => {
			const withResolvedHref = anchorMatchesWithResolvedHrefs.find(
				({ match: anchorMatch }) => anchorMatch === match
			);

			if (!withResolvedHref) {
				throw new Error(`Could not find anchor match for: ${match}`);
			}

			return withResolvedHref?.match.replace(
				/<a\s+([^>]*\s+)?href="([^"]*)"(?:\s+[^>]*?)?\s*>(.*?)<\/a>/gi,
				`<a $1 class="focus w-max rounded-md" href="${withResolvedHref.href}"><span class="border-b-2 duration-150 transition-all border-b-blue-400 border-opacity-40 font-bold text-blue-400 hover:border-opacity-100">$3</span></a>`
			);
		})
		// Replace all <strong> tags
		.replaceAll(
			/<strong\b[^>]*>(.*?)<\/strong>/gi,
			'<strong class="font-bold text-blue-400">$1</strong>'
		)
		// Replace all <code> tags
		.replaceAll(
			/<code\b[^>]*>(.*?)<\/code>/gi,
			'<code tabindex="0" class="focus whitespace-nowrap rounded-md border border-gray-700 bg-gray-800 py-0.5 px-1.5 font-mono text-sm">$1</code>'
		);

	return replacedMarkdown;
}
