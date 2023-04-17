import * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import React, { type ReactNode, createContext, useContext, useEffect, useState } from "react";

import { cn } from "./_utils";
import { colors } from "./colors";

const DropdownContext = createContext<{
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
	open: false,
	setOpen: () => {},
});

export default function Dropdown({ children }: { children: ReactNode }) {
	const [open, setOpen] = useState(false);

	return (
		<DropdownContext.Provider value={{ open, setOpen }}>
			<RadixDropdownMenu.Root open={open} onOpenChange={setOpen}>
				{children}
			</RadixDropdownMenu.Root>
		</DropdownContext.Provider>
	);
}

function DropdownButton({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<RadixDropdownMenu.Trigger
			className={cn(
				"cursor-default select-none rounded-md border border-gray-500 p-2 focus-visible:outline-none data-[state=open]:bg-gray-200",
				className
			)}
		>
			{children}
		</RadixDropdownMenu.Trigger>
	);
}

Dropdown.Button = DropdownButton;

const DropdownMenuContext = createContext({ closeMenu: () => {} });

function DropdownMenu({ children }: { children: ReactNode }) {
	const { open, setOpen } = useContext(DropdownContext);
	const controls = useAnimationControls();

	async function closeMenu() {
		await controls.start("closed");
		setOpen(false);
	}

	useEffect(() => {
		if (open) {
			controls.start("open");
		}
	}, [controls, open]);

	return (
		<DropdownMenuContext.Provider value={{ closeMenu }}>
			<AnimatePresence>
				{open && (
					<RadixDropdownMenu.Portal forceMount>
						<RadixDropdownMenu.Content
							align="start"
							className="bg-white/75 mt-1 overflow-hidden rounded-md border border-gray-600 p-1 text-left text-sm shadow-sm"
							asChild
						>
							<motion.div
								initial="closed"
								animate={controls}
								exit="closed"
								variants={{
									open: {
										opacity: 1,
										transition: { ease: "easeOut", duration: 0.1 },
									},
									closed: {
										opacity: 0,
										transition: { ease: "easeIn", duration: 0.2 },
									},
								}}
							>
								{children}
							</motion.div>
						</RadixDropdownMenu.Content>
					</RadixDropdownMenu.Portal>
				)}
			</AnimatePresence>
		</DropdownMenuContext.Provider>
	);
}

Dropdown.Menu = DropdownMenu;

function DropdownMenuItem({
	children,
	onSelect = () => {},
}: {
	children: ReactNode;
	onSelect?: () => void;
}) {
	const controls = useAnimationControls();
	const { closeMenu } = useContext(DropdownMenuContext);

	return (
		<RadixDropdownMenu.Item
			onSelect={async (e) => {
				e.preventDefault();

				const onPressColor = colors.gray[400];

				await controls.start({
					backgroundColor: "#fff",
					transition: { duration: 0.04 },
				});
				await controls.start({
					backgroundColor: onPressColor,
					transition: { duration: 0.04 },
				});
				await sleep(0.075);

				await closeMenu();
				onSelect();
			}}
			className="w-40 select-none rounded-sm px-2 py-1.5 data-[highlighted]:bg-gray-400 data-[highlighted]:focus:outline-none"
			asChild
		>
			<motion.div animate={controls}>{children}</motion.div>
		</RadixDropdownMenu.Item>
	);
}

Dropdown.MenuItem = DropdownMenuItem;

const sleep = (s: number) => new Promise((resolve) => setTimeout(resolve, s * 1000));
