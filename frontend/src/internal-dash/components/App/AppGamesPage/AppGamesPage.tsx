import format from "date-fns/format";
import { trpc } from "../../../trpc";

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
					<h2 className="text-lg">{game.display_name}</h2>

					<div className="flex flex-col sm:flex-row gap-2">
						<img className="w-full max-w-[16rem] rounded-md" src={game.image_url} />

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
					</div>
				</div>
			))}
		</div>
	);
}
