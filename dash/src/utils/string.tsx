/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { tw } from "twind";
import { IGame } from "../types.ts";

export const arrayToCoolString = (array: string[]): string | undefined => {
  if (!array.length) return undefined;

  if (array.length === 1) return array[0];

  return `${array.slice(0, -1).join(", ")} and ${array.at(-1)}`;
};

export const getGameNames = (games: IGame[]) => {
  if (!games.length) return "";

  if (games.length === 1) return <b className={tw`whitespace-nowrap`}>{games.at(0)?.name}</b>;

  const names = games.map((game) => game.name);

  return (
    <div className={tw`flex flex-col`}>
      {names.slice(0, -1).map((name) => (
        <b className={tw`whitespace-nowrap`}>{name}, </b>
      ))}

      <span>
        and <b className={tw`whitespace-nowrap`}> {names.at(-1)}</b>
      </span>
    </div>
  );
};
