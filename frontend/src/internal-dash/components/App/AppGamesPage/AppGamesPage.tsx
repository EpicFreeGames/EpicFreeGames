import format from "date-fns/format";
import { RouterOutputs, trpc } from "../../../trpc";
import { useState } from "react";
import { Modal } from "../Modal";
import { useForm } from "../useForm";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export function AppGamesPage() {
	return (
		<div className="flex flex-col gap-4 pt-4">
			<div className="flex gap-2 justify-between items-center">
				<h1 className="text-xl">Games</h1>

				<CreateGame />
			</div>

			<GameList />
		</div>
	);
}
const now = new Date();

function GameList() {
	const games = trpc.games.getAll.useQuery();

	if (games.isLoading) {
		return <div>Loading...</div>;
	} else if (games.error) {
		return <div>Error: {games.error.message}</div>;
	} else if (!games || !games.data) {
		return <div>No data</div>;
	} else if (!games.data.length) {
		return <div>No games</div>;
	}

	return (
		<div className="flex flex-col gap-2">
			{games.data.map((game) => (
				<div
					key={game.id}
					className="bg-gray-900 border border-gray-800 p-3 rounded-xl flex flex-col gap-2"
				>
					<div className="flex items-center justify-between">
						<h2 className="text-lg">{game.displayName}</h2>

						<div className="flex gap-2">
							<DeleteGame game={game} />
							<EditGame game={game} />
							<Confirmed game={game} />
						</div>
					</div>

					<div className="flex flex-col sm:flex-row gap-2">
						<div>
							<img
								className="max-w-[16rem] rounded-lg border border-gray-800"
								src={game.imageUrl}
							/>
						</div>

						<div className="flex flex-col gap-2 w-full">
							<div className="flex flex-col gap-1 p-2 rounded-lg border border-gray-800 bg-gray-950/50">
								<span>Name:</span>
								<span>{game.name}</span>
							</div>

							<div className="flex flex-col gap-1 p-2 rounded-lg border border-gray-800 bg-gray-950/50">
								<span>Start:</span>
								<span>{format(game.startDate, "yyyy-MM-dd HH:mm")}</span>
							</div>

							<div className="flex flex-col gap-1 p-2 rounded-lg border border-gray-800 bg-gray-950/50">
								<span>End:</span>
								<span>{format(game.endDate, "yyyy-MM-dd HH:mm")}</span>
							</div>

							<div className="flex flex-col gap-1 p-2 rounded-lg border border-gray-800 bg-gray-950/50">
								<span>Path:</span>
								<span>{game.path}</span>
							</div>

							<div className="flex flex-col gap-1 p-2 rounded-lg border border-gray-800 bg-gray-950/50">
								<span>Status:</span>
								<span>
									{now < game.startDate ? "Upcoming" : game.endDate > now ? "Free" : "Gone"}
								</span>
							</div>
						</div>

						<div className="w-full">
							{game.prices.length ? (
								<details className="focus rounded-lg p-3 bg-gray-950/50 border border-gray-800">
									<summary>Prices</summary>

									<div className="flex flex-col gap-2 mt-2">
										{game.prices.map((price) => (
											<span key={price.id} className="rounded-md border border-gray-800 p-2">
												<b>{price.currencyCode}:</b> {price.formattedValue}
											</span>
										))}
									</div>
								</details>
							) : (
								<div className="rounded-lg p-3 bg-gray-950/50 border border-gray-800">
									<span>No prices</span>
								</div>
							)}
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

const Confirmed = (props: { game: Game }) => {
	const trpcCtx = trpc.useContext();
	const mutation = trpc.games.toggleConfirmed.useMutation({
		onSuccess: () => {
			trpcCtx.games.getAll.invalidate();
		},
	});

	return (
		<button
			className={`bg-gray-700 border border-gray-600 h-full whitespace-nowrap px-2 rounded-lg p-2 ${
				props.game.confirmed ? "bg-green-900 border-green-600" : "bg-red-900 border-red-600"
			}`}
			onClick={() =>
				mutation.mutate({
					gameId: props.game.id,
					confirmed: !props.game.confirmed,
				})
			}
		>
			{mutation.isLoading
				? "Loading..."
				: mutation.error
				? "Error: " + mutation.error.message
				: props.game.confirmed
				? "Confirmed"
				: "Not confirmed"}
		</button>
	);
};

const editGameFormSchema = z.object({
	name: z.string(),
	displayName: z.string(),
	imageUrl: z.string(),
	startDate: z.custom((v) =>
		v instanceof Date ? v : typeof v === "string" ? new Date(v) : new Date(v as string)
	),
	endDate: z.custom((v) =>
		v instanceof Date ? v : typeof v === "string" ? new Date(v) : new Date(v as string)
	),
	path: z.string(),

	usd_price_formatted: z.string(),
	usd_price_value: z.number(),
});

function EditGame(props: { game: Game }) {
	const [isOpen, setIsOpen] = useState(false);

	const trpcCtx = trpc.useContext();
	const editMutation = trpc.games.edit.useMutation({
		onSuccess: () => {
			setIsOpen(false);
			trpcCtx.games.getAll.invalidate();
		},
	});

	const editGameForm = useForm<z.infer<typeof editGameFormSchema>>({
		resolver: zodResolver(editGameFormSchema),
		defaultValues: {
			name: props.game.name,
			displayName: props.game.displayName,
			imageUrl: props.game.imageUrl,
			startDate: format(props.game.startDate, "yyyy-MM-dd'T'HH:mm"),
			endDate: format(props.game.endDate, "yyyy-MM-dd'T'HH:mm"),
			path: props.game.path,

			usd_price_formatted:
				props.game.prices.find((price) => price.currencyCode === "USD")?.formattedValue || "0 $",
			usd_price_value: props.game.prices.find((price) => price.currencyCode === "USD")?.value || 0,
		},
		onSubmit: (data) => {
			editMutation.mutate({
				gameId: props.game.id,
				startDate: data.startDate as Date,
				endDate: data.endDate as Date,
				...data,
			});
		},
	});

	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				className="py-2 px-3 rounded-lg border border-gray-600 bg-gray-700"
			>
				Edit
			</button>

			<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
				<div className="flex flex-col gap-2">
					<h1 className="text-xl">Edit game</h1>

					<form className="flex flex-col gap-4" onSubmit={editGameForm.handleSubmit}>
						<label className="flex flex-col gap-1">
							<span className="text-sm">Name:</span>
							<input
								className="p-2 focus rounded-lg bg-gray-700 border border-gray-500 "
								type="text"
								{...editGameForm.register("name")}
							/>
						</label>

						<label className="flex flex-col gap-1">
							<span className="text-sm">Image url:</span>

							<input
								className="p-2 focus rounded-lg bg-gray-700 border border-gray-500 "
								type="text"
								{...editGameForm.register("imageUrl")}
							/>
						</label>

						<label className="flex flex-col gap-1">
							<span className="text-sm">Start:</span>

							<input
								className="p-2 focus rounded-lg bg-gray-700 border border-gray-500 "
								type="datetime-local"
								{...editGameForm.register("startDate", { valueAsDate: true })}
							/>
						</label>

						<label className="flex flex-col gap-1">
							<span className="text-sm">End:</span>

							<input
								className="p-2 focus rounded-lg bg-gray-700 border border-gray-500 "
								type="datetime-local"
								{...editGameForm.register("endDate", { valueAsDate: true })}
							/>
						</label>

						<label className="flex flex-col gap-1">
							<span className="text-sm">Path:</span>

							<input
								className="p-2 focus rounded-lg bg-gray-700 border border-gray-500 "
								type="text"
								{...editGameForm.register("path")}
							/>
						</label>

						<label className="flex flex-col gap-1">
							<span className="text-sm">USD price (formatted):</span>

							<input
								className="p-2 focus rounded-lg bg-gray-700 border border-gray-500 "
								type="text"
								{...editGameForm.register("usd_price_formatted")}
							/>
						</label>

						<label className="flex flex-col gap-1">
							<span className="text-sm">USD price (value):</span>

							<input
								className="p-2 focus rounded-lg bg-gray-700 border border-gray-500 "
								type="number"
								step="0.01"
								{...editGameForm.register("usd_price_value", {
									valueAsNumber: true,
								})}
							/>
						</label>

						<div className="flex gap-2 w-full">
							<button
								className="w-full py-2 px-3 rounded-lg border border-gray-600 bg-gray-700"
								type="button"
								onClick={() => setIsOpen(false)}
							>
								Cancel
							</button>

							<button
								className="w-full py-2 px-3 rounded-lg border border-gray-600 bg-gray-700"
								type="submit"
							>
								{editMutation.isLoading ? "Saving..." : "Save"}
							</button>
						</div>
					</form>
				</div>
			</Modal>
		</>
	);
}

const newGameFormSchema = z.object({
	name: z.string(),
	displayName: z.string(),
	imageUrl: z.string(),
	startDate: z.custom((v) =>
		v instanceof Date ? v : typeof v === "string" ? new Date(v) : new Date(v as string)
	),
	endDate: z.custom((v) =>
		v instanceof Date ? v : typeof v === "string" ? new Date(v) : new Date(v as string)
	),
	path: z.string(),

	usd_price_formatted: z.string(),
	usd_price_value: z.number(),
});

function CreateGame() {
	const [isOpen, setIsOpen] = useState(false);

	const trpcCtx = trpc.useContext();
	const createMutation = trpc.games.create.useMutation({
		onSuccess: () => {
			setIsOpen(false);
			trpcCtx.games.invalidate();
		},
	});

	const createGameForm = useForm<z.infer<typeof newGameFormSchema>>({
		resolver: zodResolver(editGameFormSchema),
		defaultValues: {
			name: "",
			displayName: "",
			imageUrl: "",
			startDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
			endDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
			path: "",
			usd_price_formatted: "0 $",
			usd_price_value: 0,
		},
		onSubmit: (data) => {
			createMutation.mutate({
				startDate: data.startDate as Date,
				endDate: data.endDate as Date,
				...data,
			});
		},
	});

	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				className="py-2 px-3 rounded-lg border border-gray-600 bg-gray-700"
			>
				Create
			</button>

			<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
				<div className="flex flex-col gap-2">
					<h1 className="text-xl">Create game</h1>

					<form className="flex flex-col gap-4" onSubmit={createGameForm.handleSubmit}>
						<label className="flex flex-col gap-1">
							<span className="text-sm">Name:</span>
							<input
								className="p-2 focus rounded-lg bg-gray-700 border border-gray-500 "
								type="text"
								{...createGameForm.register("name")}
							/>
						</label>

						<label className="flex flex-col gap-1">
							<span className="text-sm">Display name:</span>
							<input
								className="p-2 focus rounded-lg bg-gray-700 border border-gray-500 "
								type="text"
								{...createGameForm.register("displayName")}
							/>
						</label>

						<label className="flex flex-col gap-1">
							<span className="text-sm">Image url:</span>

							<input
								className="p-2 focus rounded-lg bg-gray-700 border border-gray-500 "
								type="text"
								{...createGameForm.register("imageUrl")}
							/>
						</label>

						<label className="flex flex-col gap-1">
							<span className="text-sm">Start:</span>

							<input
								className="p-2 focus rounded-lg bg-gray-700 border border-gray-500 "
								type="datetime-local"
								{...createGameForm.register("startDate", { valueAsDate: true })}
							/>
						</label>

						<label className="flex flex-col gap-1">
							<span className="text-sm">End:</span>

							<input
								className="p-2 focus rounded-lg bg-gray-700 border border-gray-500 "
								type="datetime-local"
								{...createGameForm.register("endDate", { valueAsDate: true })}
							/>
						</label>

						<label className="flex flex-col gap-1">
							<span className="text-sm">Path:</span>

							<input
								className="p-2 focus rounded-lg bg-gray-700 border border-gray-500 "
								type="text"
								{...createGameForm.register("path")}
							/>
						</label>

						<label className="flex flex-col gap-1">
							<span className="text-sm">USD price (formatted):</span>

							<input
								className="p-2 focus rounded-lg bg-gray-700 border border-gray-500 "
								type="text"
								{...createGameForm.register("usd_price_formatted")}
							/>
						</label>

						<label className="flex flex-col gap-1">
							<span className="text-sm">USD price (value):</span>

							<input
								className="p-2 focus rounded-lg bg-gray-700 border border-gray-500 "
								type="number"
								step="0.01"
								{...createGameForm.register("usd_price_value", {
									valueAsNumber: true,
								})}
							/>
						</label>

						<div className="flex gap-2 w-full">
							<button
								className="w-full py-2 px-3 rounded-lg border border-gray-600 bg-gray-700"
								type="button"
								onClick={() => setIsOpen(false)}
							>
								Cancel
							</button>

							<button
								className="w-full py-2 px-3 rounded-lg border border-gray-600 bg-gray-700"
								type="submit"
							>
								{createMutation.isLoading ? "Saving..." : "Save"}
							</button>
						</div>
					</form>
				</div>
			</Modal>
		</>
	);
}

function DeleteGame(props: { game: Game }) {
	const [isOpen, setIsOpen] = useState(false);

	const trpcCtx = trpc.useContext();
	const deleteGameMutation = trpc.games.delete.useMutation({
		onSuccess: () => {
			trpcCtx.games.invalidate();
		},
	});

	const deleteGameForm = useForm({
		defaultValues: {
			gameIds: new Array<string>(),
		},
		onSubmit: async () => {
			await deleteGameMutation.mutateAsync({ gameId: props.game.id });

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
					<h1 className="text-xl">Delete game</h1>

					<p>Are you sure you want to delete this game?</p>

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
							onClick={deleteGameForm.handleSubmit}
							className="py-2 w-full px-3 rounded-lg border border-gray-600 bg-gray-700"
						>
							Delete
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
}

type Game = RouterOutputs["games"]["getAll"][number];
