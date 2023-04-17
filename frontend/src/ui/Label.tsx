import { type ComponentProps, forwardRef } from "react";

import { cn } from "./_utils";

type Props = Omit<ComponentProps<"label">, "className"> & {
	required?: boolean;
	error?: boolean;
};

export const Label = forwardRef<HTMLLabelElement, Props>(
	({ children, required, htmlFor, error }, ref) => {
		return (
			<label ref={ref} className={cn("text-sm", error && "text-red-400")} htmlFor={htmlFor}>
				{children} {!!required && <b className="text-red-400"> *</b>}
			</label>
		);
	}
);

Label.displayName = "Label";
