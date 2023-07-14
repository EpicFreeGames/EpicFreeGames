import { markdown } from "../../../markdown";

export function ReactMarkdown(props: { children: string; currentPath: string }) {
	const parsedMarkdown = markdown(props.children, props.currentPath);

	return <span dangerouslySetInnerHTML={{ __html: parsedMarkdown }} />;
}
