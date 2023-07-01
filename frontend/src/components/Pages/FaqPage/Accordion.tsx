import { cn } from "../../../reactUtils";
import * as Collapsible from "@radix-ui/react-collapsible";
import { AnimatePresence, motion } from "framer-motion";
import { useState, type ReactNode } from "react";

export function FaqAccordion(props: {
	questionsAndAnswers: { question: string; answer: string }[];
}) {
	const [value, setValue] = useState("");

	const onChange = (open: boolean, value: string) => (open ? setValue(value) : setValue(""));

	return (
		<div className="flex flex-col gap-2">
			{props.questionsAndAnswers.map((qa, index) => (
				<AccordionItem
					key={index}
					titleNode={<h2 className="text-sm font-bold sm:text-base">{qa.question}</h2>}
					answer={qa.answer}
					value={index.toString()}
					currentValue={value}
					onChange={onChange}
				/>
			))}
		</div>
	);
}

type AccordionItemProps = {
	titleNode: ReactNode;
	answer: string;
	value: string;
	currentValue: string;
	onChange: (open: boolean, value: string) => void;
};

export function AccordionItem(props: AccordionItemProps) {
	const isOpen = props.value === props.currentValue;

	return (
		<Collapsible.Root
			open={isOpen}
			onOpenChange={(open) => props.onChange(open, props.value)}
			onClick={() => props.onChange(!isOpen, props.value)}
			className={cn(
				"cursor-default rounded-md border-[1px] bg-gray-800 p-3 transition-all duration-150",
				isOpen ? "border-gray-500" : "border-gray-700"
			)}
		>
			<div className="flex items-center justify-between gap-2">
				<Collapsible.Trigger className="focus cursor-default rounded-md text-left">
					{props.titleNode}
				</Collapsible.Trigger>

				<div className="rounded-md bg-gray-900/50 p-1">
					<AnimatedChevron open={isOpen} />
				</div>
			</div>

			<Collapsible.Content forceMount>
				<AnimatePresence initial={false}>
					{isOpen && (
						<motion.div
							key="content"
							className="overflow-hidden"
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ opacity: { duration: 0.2 } }}
						>
							<div
								className="pt-2"
								dangerouslySetInnerHTML={{ __html: props.answer }}
							/>
						</motion.div>
					)}
				</AnimatePresence>
			</Collapsible.Content>
		</Collapsible.Root>
	);
}

type AnimatedChevronProps = {
	open: boolean;
};

function AnimatedChevron(props: AnimatedChevronProps) {
	return (
		<motion.div
			key="chevron"
			aria-hidden="true"
			initial={{ transform: "rotate(0deg)" }}
			animate={props.open ? { transform: "rotate(180deg)" } : { transform: "rotate(0deg)" }}
			transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="lucide lucide-chevron-down h-5 w-5"
			>
				<polyline points="6 9 12 15 18 9"></polyline>
			</svg>
		</motion.div>
	);
}
