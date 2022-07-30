/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { tw } from "twind";
import { IGame } from "../../types.ts";
import { Input } from "../Input.tsx";

type Props = {
  game?: IGame;
};

export const GameForm = ({ game }: Props) => {
  const isEditing = !!game;

  return (
    <div className={tw`bg-gray-700 rounded-md mx-auto max-w-[400px] p-3`}>
      <form className={tw`flex flex-col gap-3`} method="POST">
        <Input name="name" label="Name" defaultValue={game?.name} required />
        <Input name="displayName" label="Display name" defaultValue={game?.displayName} required />
        <Input name="path" label="Path" defaultValue={game?.path} required />
        <Input name="imageUrl" label="Image URL" defaultValue={game?.imageUrl} required />
        <Input
          name="start"
          label="Sale starts"
          type="datetime-local"
          defaultValue={isEditing ? getHtmlDate(game?.start) : ""}
          required
        />
        <Input
          name="end"
          label="Sale ends"
          type="datetime-local"
          defaultValue={isEditing ? getHtmlDate(game?.end) : ""}
          required
        />
        {!isEditing && (
          <>
            <Input name="usdPrice" label="Formatted USD price ($49.99)" required />
            <Input name="priceValue" type="number" label="USD price (49.99)" required />
          </>
        )}

        <div className={tw`flex gap-2 justify-between`}>
          <a className={tw`px-3 py-2`} href="/games">
            Cancel
          </a>

          <button className={tw`px-3 py-2 bg-gray-800 rounded-md`}>
            {isEditing ? "Save changes" : "Add game"}
          </button>
        </div>
      </form>
    </div>
  );
};

const getHtmlDate = (date: string) => {
  const [start, end] = new Date(date).toISOString().split("T");

  return `${start}T${end.slice(0, 5)}`;
};
