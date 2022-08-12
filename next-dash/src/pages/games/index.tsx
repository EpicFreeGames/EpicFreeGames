import { AddGame } from "~components/Game/AddGame";
import { Game } from "~components/Game/Game";
import { Layout } from "~components/Layout/Layout";
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <div className="flex flex-col gap-3">
      {games?.map((game) => (
        <Game game={game} key={game.id} />
      ))}
    </div>
  );
};
