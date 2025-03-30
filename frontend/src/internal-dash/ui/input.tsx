import { ComponentProps } from "react";

export function Input(props: ComponentProps<"input">) {
	return <input className="border border-gray-600 bg-transparent px-3 py-2" {...props} />;
}
