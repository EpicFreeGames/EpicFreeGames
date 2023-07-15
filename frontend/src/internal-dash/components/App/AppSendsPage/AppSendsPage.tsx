import { useState } from "react";
import { RouterOutputs, trpc } from "../../../trpc";
import { Modal } from "../Modal";
import { useForm } from "../useForm";

export function AppSendsPage() {
	return (
		<div className="flex flex-col gap-4 pt-4">
			<div className="flex gap-2 justify-between items-center">
				<h1 className="text-xl">Sends</h1>

				<CreateSend />
			</div>

			<SendsList />
		</div>
	);
}

function SendsList() {
	const sends = trpc.send.getAll.useQuery();

	if (sends.isLoading) {
		return (
			<div className="w-full bg-gray-900 border border-gray-800 px-3 py-10 rounded-xl flex items-center justify-center ">
				Loading...
			</div>
		);
	} else if (sends.error) {
		return (
			<div className="w-full bg-gray-900 border border-gray-800 px-3 py-10 rounded-xl flex items-center justify-center ">
				Error: {sends.error.message}
			</div>
		);
	} else if (!sends || !sends.data) {
		return (
			<div className="w-full bg-gray-900 border border-gray-800 px-3 py-10 rounded-xl flex items-center justify-center ">
				No data
			</div>
		);
	} else if (!sends.data.length) {
		return (
			<div className="w-full bg-gray-900 border border-gray-800 px-3 py-10 rounded-xl flex items-center justify-center ">
				No sends
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			{sends.data.map((send) => (
				<div
					key={send.id}
					className="bg-gray-900 border border-gray-800 p-3 rounded-xl flex flex-col gap-2"
				>
					<div className="flex justify-between items-center">
						<h2 className="text-lg">{send.id}</h2>

						<div className="flex gap-2">
							<RemoveSend sendId={send.id} />

							<StartSending send={send} />
						</div>
					</div>

					{send.games.map((game) => (
						<span key={game.id}>{game.name}</span>
					))}
				</div>
			))}
		</div>
	);
}

function CreateSend() {
	const [isOpen, setIsOpen] = useState(false);

	const games = trpc.games.getAll.useQuery();
	const trpcCtx = trpc.useContext();
	const createSendMutation = trpc.send.createSend.useMutation({
		onSuccess() {
			trpcCtx.send.getAll.invalidate();
		},
	});

	const createSendForm = useForm({
		defaultValues: {
			gameIds: new Array<string>(),
		},
		onSubmit: async (values) => {
			await createSendMutation.mutateAsync(values);
			setIsOpen(false);
		},
	});

	const now = new Date();

	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				className="py-2 px-3 rounded-lg border border-gray-600 bg-gray-700"
			>
				Create Send
			</button>

			<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
				<div className="flex flex-col gap-2">
					<h1 className="text-xl">Create Send</h1>

					<form className="flex flex-col gap-4">
						{games.isLoading ? (
							<div>Loading...</div>
						) : games.error ? (
							<div>Error: {games.error.message}</div>
						) : games.data?.length ? (
							<select
								className="p-2 focus rounded-lg bg-gray-700 border border-gray-500"
								multiple
								{...createSendForm.register("gameIds")}
							>
								{games.data.map((game) => (
									<option key={game.id} value={game.id}>
										{game.name} (
										{now < game.startDate
											? "upcoming"
											: game.endDate < now
											? "free"
											: "gone"}
										)
									</option>
								))}
							</select>
						) : (
							<div>No games</div>
						)}

						<div className="flex w-full gap-2">
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="py-2 w-full px-3 rounded-lg border border-gray-600 bg-gray-700"
							>
								Cancel
							</button>

							<button
								type="submit"
								onClick={createSendForm.handleSubmit}
								className="py-2 w-full px-3 rounded-lg border border-gray-600 bg-gray-700"
							>
								Create
							</button>
						</div>
					</form>
				</div>
			</Modal>
		</>
	);
}

function RemoveSend(props: { sendId: string }) {
	const [isOpen, setIsOpen] = useState(false);

	const trpcCtx = trpc.useContext();
	const removeSendMutation = trpc.send.removeSend.useMutation({
		onSuccess: () => {
			trpcCtx.send.getAll.invalidate();
		},
	});

	const removeSendForm = useForm({
		defaultValues: {
			gameIds: new Array<string>(),
		},
		onSubmit: async () => {
			await removeSendMutation.mutateAsync({ sendId: props.sendId });

			setIsOpen(false);
		},
	});

	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				className="p-2 rounded-lg border border-gray-600 bg-gray-700"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					className="lucide lucide-trash-2 h-5 w-5 text-red-500"
				>
					<path d="M3 6h18" />
					<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
					<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
					<line x1="10" x2="10" y1="11" y2="17" />
					<line x1="14" x2="14" y1="11" y2="17" />
				</svg>
			</button>

			<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
				<div className="flex flex-col gap-4">
					<h1 className="text-xl">Delete send</h1>

					<p>Are you sure you want to delete this send?</p>

					<div className="flex w-full gap-2">
						<button
							type="button"
							onClick={() => setIsOpen(false)}
							className="py-2 w-full px-3 rounded-lg border border-gray-600 bg-gray-700"
						>
							Cancel
						</button>

						<button
							type="submit"
							onClick={removeSendForm.handleSubmit}
							className="py-2 w-full px-3 rounded-lg border border-gray-600 bg-gray-700"
						>
							Remove
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
}

function StartSending(props: { send: Send }) {
	const [isOpen, setIsOpen] = useState(false);

	const trpcCtx = trpc.useContext();
	const startSendingMutation = trpc.send.startSending.useMutation({
		onSuccess() {
			trpcCtx.games.getAll.invalidate();
		},
	});

	const createSendForm = useForm({
		defaultValues: {
			gameIds: new Array<string>(),
		},
		onSubmit: async () => {
			await startSendingMutation.mutateAsync({ sendId: props.send.id });
		},
	});

	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				className="p-2 rounded-lg border border-gray-600 bg-gray-700"
			>
				Send
			</button>

			<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
				<div className="flex flex-col gap-4">
					<h1 className="text-xl">Start sending</h1>

					<p>Are you sure you want to start sending these?</p>

					<div className="flex flex-col gap-2">
						{props.send.games.map((game) => (
							<div key={game.id}>
								<div>{game.name}</div>
							</div>
						))}
					</div>

					<div className="flex w-full gap-2">
						<button
							type="button"
							onClick={() => setIsOpen(false)}
							className="py-2 w-full px-3 rounded-lg border border-gray-600 bg-gray-700"
						>
							Cancel
						</button>

						<button
							type="submit"
							onClick={createSendForm.handleSubmit}
							className="py-2 w-full px-3 rounded-lg border border-gray-600 bg-gray-700"
						>
							Send
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
}

type Send = RouterOutputs["send"]["getAll"][number];
