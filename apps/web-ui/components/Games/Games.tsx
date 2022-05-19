import { IGame } from "shared";
import { Game } from "./Game";
import { useGamesStyles } from "./Games.styles";

export const Games = ({ games }: { games: IGame[] }) => {
  const { classes } = useGamesStyles();

  return (
    <div className={classes.gamesGrid}>
      {games.map((game) => (
        <Game key={game._id} game={game} />
      ))}
    </div>
  );
};
