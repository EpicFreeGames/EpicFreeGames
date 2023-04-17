import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

import { WarningIcon } from "./Icons/WarningIcon";
import { cn } from "./_utils";

type Props = {
	message?: ReactNode;
	htmlFor?: string;
	className?: string;
};

export const Error = ({ message, htmlFor, className }: Props) => {
	const hasError = !!message;

	return (
		<AnimatePresence>
			{hasError && (
				<motion.span
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: "auto", transition: { duration: 0.15 } }}
					exit={{ opacity: 0, height: 0, transition: { duration: 0.15 } }}
					className={cn(className, "text-[15px] font-medium text-red-400")}
				>
					<label htmlFor={htmlFor} className="flex items-center gap-1 pt-2">
						<WarningIcon /> {message}
					</label>
				</motion.span>
			)}
		</AnimatePresence>
	);
};
