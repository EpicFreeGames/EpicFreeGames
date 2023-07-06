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
			<h1 className="text-xl">Games</h1>

			<GameList />
		</div>
	);
}

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

	const now = new Date();

	return (
		<div className="flex flex-col gap-2">
			{games.data.map((game) => (
				<div className="bg-gray-900 border border-gray-800 p-3 rounded-xl flex flex-col gap-2">
					<div className="flex items-center justify-between">
						<h2 className="text-lg">{game.display_name}</h2>

						<div className="flex gap-2">
							<EditGame game={game} />
							<Confirmed game={game} />
						</div>
					</div>

					<div className="flex flex-col sm:flex-row gap-2">
						<img
							className="w-full max-w-[16rem] rounded-lg border border-gray-800"
							src={game.image_url}
						/>

						<div className="flex flex-col gap-2 w-full">
							<div className="flex flex-col gap-1 p-2 rounded-lg border border-gray-800 bg-gray-950/50">
								<span>Name:</span>
								<span>{game.name}</span>
							</div>

							<div className="flex flex-col gap-1 p-2 rounded-lg border border-gray-800 bg-gray-950/50">
								<span>Start:</span>
								<span>{format(game.start_date, "yyyy-MM-dd HH:mm")}</span>
							</div>

							<div className="flex flex-col gap-1 p-2 rounded-lg border border-gray-800 bg-gray-950/50">
								<span>End:</span>
								<span>{format(game.end_date, "yyyy-MM-dd HH:mm")}</span>
							</div>

							<div className="flex flex-col gap-1 p-2 rounded-lg border border-gray-800 bg-gray-950/50">
								<span>Path:</span>
								<span>{game.path}</span>
							</div>

							<div className="flex flex-col gap-1 p-2 rounded-lg border border-gray-800 bg-gray-950/50">
								<span>Status:</span>
								<span>
									{now < game.start_date
										? "Upcoming"
										: game.end_date < now
										? "Free"
										: "Gone"}
								</span>
							</div>
						</div>

						<div className="w-full">
							{game.prices.length ? (
								<details className="focus rounded-lg p-3 bg-gray-950/50 border border-gray-800">
									<summary>Prices</summary>

									<div className="flex flex-col gap-2 mt-2">
										{game.prices.map((price) => (
											<span className="rounded-md  border border-gray-800 p-2">
												<b>{price.currency_code}:</b>{" "}
												{price.formatted_value}
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
	display_name: z.string(),
	image_url: z.string(),
	start_date: z.custom((v) =>
		v instanceof Date ? v : typeof v === "string" ? new Date(v) : new Date(v as string)
	),
	end_date: z.custom((v) =>
		v instanceof Date ? v : typeof v === "string" ? new Date(v) : new Date(v as string)
	),
	path: z.string(),

	usd_price_formatted: z.string(),
	usd_price_value: z.number(),
});

function EditGame(props: { game: Game }) {
	const [isOpen, setIsOpen] = useState(false);

	const editMutation = trpc.games.edit.useMutation();

	const editGameForm = useForm<z.infer<typeof editGameFormSchema>>({
		resolver: zodResolver(editGameFormSchema),
		defaultValues: {
			name: props.game.name,
			display_name: props.game.display_name,
			image_url: props.game.image_url,
			start_date: format(props.game.start_date, "yyyy-MM-dd'T'HH:mm"),
			end_date: format(props.game.end_date, "yyyy-MM-dd'T'HH:mm"),
			path: props.game.path,

			usd_price_formatted:
				props.game.prices.find((price) => price.currency_code === "USD")?.formatted_value ||
				"0 $",
			usd_price_value:
				props.game.prices.find((price) => price.currency_code === "USD")?.value || 0,
		},
		onSubmit: (data) => {
			editMutation.mutate({
				gameId: props.game.id,
				start_date: data.start_date as Date,
				end_date: data.end_date as Date,
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
								{...editGameForm.register("image_url")}
							/>
						</label>

						<label className="flex flex-col gap-1">
							<span className="text-sm">Start:</span>

							<input
								className="p-2 focus rounded-lg bg-gray-700 border border-gray-500 "
								type="datetime-local"
								{...editGameForm.register("start_date", { valueAsDate: true })}
							/>
						</label>

						<label className="flex flex-col gap-1">
							<span className="text-sm">End:</span>

							<input
								className="p-2 focus rounded-lg bg-gray-700 border border-gray-500 "
								type="datetime-local"
								{...editGameForm.register("end_date", { valueAsDate: true })}
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

type Game = RouterOutputs["games"]["getAll"][number];
