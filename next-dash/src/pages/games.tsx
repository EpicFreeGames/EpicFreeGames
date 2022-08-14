import { AddGame } from "~components/Game/AddGame";
import { Game } from "~components/Game/Game";
import { Layout } from "~components/Layout/Layout";
import { StatusCard } from "~components/StatusCard";
import { useGames } from "~utils/api/games/getGames";

export default function GameIndexPage() {
  return (
    <Layout title="Games" segments={["Games"]} titleButtons={[AddGame]}>
      <Games />
    </Layout>
  );
}

const Games = () => {
  const { data: games, isLoading, error } = useGames();

  if (isLoading) return <StatusCard>Loading...</StatusCard>;
  if (error) return <StatusCard error>Error loading games</StatusCard>;

  return (
    <div className="flex flex-col gap-3">
      {games && games?.length ? (
        games?.map((game) => <Game game={game} key={game.id} />)
      ) : (
        <StatusCard>No games</StatusCard>
      )}
    </div>
  );
};
