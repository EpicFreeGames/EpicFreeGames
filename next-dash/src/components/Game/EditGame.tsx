import { Edit } from "tabler-icons-react";
import { Dialog, DialogClose } from "~components/Dialog";
import { Input } from "~components/Input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { IGame } from "~types";
import { getHtmlDate } from "~utils/getHtmlDate";
import { useGameMutation } from "~utils/api/games/updateGame";
import toast from "react-hot-toast";

const formSchema = z
  .object({
    name: z.string().optional(),
    displayName: z.string().optional(),
    imageUrl: z.string().optional(),
    start: z.string().optional(),
    end: z.string().optional(),
    path: z.string().optional(),
    confirmed: z.boolean().optional(),
  })
  .strict();

type FormSchema = z.infer<typeof formSchema>;

type Props = {
  game: IGame;
};

export const EditGame = ({ game }: Props) => {
  const { mutateAsync } = useGameMutation();

  const form = useForm<IGame>({
    // resolver: zodResolver(formSchema),
    defaultValues: game,
  });

  const onSubmit = (values: FormSchema) => {
    console.log(values);

    // toast.promise(mutateAsync({ gameId: game.id, updateData: values }), {
    //   success: "Changes saved",
    //   error: "Error saving changes",
    //   loading: "Saving changes",
    // });
  };

  return (
    <Dialog
      title={`Edit ${game.name}`}
      trigger={
        <button className="btnBase px-3 bg-gray-800 hover:bg-gray-900/80 active:bg-gray-900">
          <Edit strokeWidth={1.4} size={23} />
        </button>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <Input label="Name" defaultValue={game?.name} required {...form.register("name")} />
        <Input
          label="Display name"
          defaultValue={game?.displayName}
          required
          {...form.register("displayName")}
        />
        <Input label="Path" defaultValue={game?.path} required {...form.register("path")} />
        <Input
          label="Image URL"
          defaultValue={game?.imageUrl}
          required
          {...form.register("imageUrl")}
        />
        <Input
          label="Sale starts"
          type="datetime-local"
          defaultValue={getHtmlDate(game?.start)}
          required
          {...form.register("start", { valueAsDate: true })}
        />
        <Input
          label="Sale ends"
          type="datetime-local"
          defaultValue={getHtmlDate(game?.end)}
          required
          {...form.register("end", { valueAsDate: true })}
        />

        <div className="flex gap-2 justify-between items-center">
          <DialogClose>
            <button className="btnBase p-2 bg-gray-600 hover:bg-gray-500/80 active:bg-gray-400/60">
              Cancel
            </button>
          </DialogClose>

          <button
            type="submit"
            className="btnBase py-2 px-2 border-[1px] border-blue-500 bg-blue-800/60 hover:bg-blue-700/80 active:bg-blue-600/80"
          >
            Save
          </button>
        </div>
      </form>
    </Dialog>
  );
};
