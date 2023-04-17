import { type AriaButtonProps, useButton } from "@react-aria/button";
import { FocusRing } from "@react-aria/focus";
import { motion, useAnimation } from "framer-motion";
import { useRef } from "react";

import { colors } from "./colors";

export function Button(props: AriaButtonProps<"button">) {
	let ref = useRef<HTMLButtonElement>(null);
	let controls = useAnimation();
	let { children } = props;

	const backgroundColor = colors.gray[500];
	const pressColor = colors.gray[800];

	let { buttonProps } = useButton(
		{
			// Undocumented workaround for button press
			// not triggering when on iOS the keyboard is open
			// (and it has "moved" the button while sliding up)
			// and the button is pressed.
			// @ts-expect-error undocumented prop
			preventFocusOnPress: true,
			...props,
			onPress: (e) => {
				props.onPress?.(e);
				ref.current?.focus();
				controls.start({
					backgroundColor: [null, backgroundColor],
					transition: { duration: 0.4 },
				});
			},
			onPressStart: () => {
				controls.stop();
				controls.set({ backgroundColor: pressColor });
			},
			onPressEnd: () => {
				controls.start({
					backgroundColor: pressColor,
					transition: { duration: 0.4 },
				});
			},
		},
		ref
	);
	const { className, ...rest } = buttonProps;

	return (
		<FocusRing focusRingClass="ring ring-offset-2 ring-offset-black">
			{/* @ts-expect-error */}
			<motion.button
				animate={controls}
				style={{ backgroundColor }}
				className={`touch-none select-none rounded-md p-4 focus:outline-none ${className}`}
				ref={ref}
				{...rest}
			>
				{children}
			</motion.button>
		</FocusRing>
	);
}
