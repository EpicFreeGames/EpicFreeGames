import { Dialog, Transition } from "@headlessui/react";
import { Fragment, type ReactNode } from "react";

type Props = { children: ReactNode; isOpen: boolean; onClose: () => void };

export function Modal(props: Props) {
	return (
		<Transition appear show={props.isOpen} as={Fragment}>
			<Dialog as="div" open={props.isOpen} onClose={props.onClose} className="relative z-10">
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-200"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-900/40 backdrop-blur-[2px]" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-150"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="h-full max-h-[500px] w-full max-w-[420px] transform overflow-auto rounded-[25px] border border-gray-800 bg-gray-900 p-5 shadow-2xl transition-all">
								{props.children}
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}

Modal.Title = Dialog.Title;
Modal.Description = Dialog.Description;
