import { useHasFlags } from "~hooks/useHasFlags";
import { Flags } from "~utils/api/flags";
import { ISending } from "~utils/api/types";

import { DeleteSending } from "./DeleteSending";
import { EditSending } from "./EditSending";
import { StartSending } from "./StartSending";

type Props = {
  sending: ISending & {
    _count: {
      logs: number;
    };
  };
};

export const Sending = ({ sending }: Props) => {
  const sendingDone = sending._count.logs >= sending.target;

  const showSend = useHasFlags(Flags.Send) && !sendingDone;
  const showEdit = useHasFlags(Flags.EditSendings);
  const showDelete = useHasFlags(Flags.DeleteSendings);

  const showButtons = showSend || showEdit || showDelete;

  return (
    <div className="flex flex-col gap-3 rounded-md bg-gray-700 p-3">
      <div className="flex h-full w-full flex-col items-start justify-between gap-2 md:flex-row">
        <h2 className="rounded-md bg-gray-800 py-2 px-3 text-lg md:text-2xl">{sending.id}</h2>

        {showButtons && (
          <div className="flex gap-1 rounded-lg bg-gray-800 p-2">
            {showDelete && <DeleteSending sending={sending} />}
            {showEdit && <EditSending sending={sending} />}
            {showSend && <StartSending sending={sending} />}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Spec title="Games" value={sending.games?.map((g) => g.name).join(", ") ?? ""} />
        <Spec title="Target" value={sending.target} />
        <Spec title="Sent" value={sending._count.logs} />
      </div>
    </div>
  );
};

const Spec = ({
  title,
  value,
  wordWrap,
}: {
  title: string;
  value: string | number;
  wordWrap?: boolean;
}) => (
  <p className={`rounded-md bg-gray-800 p-3 ${wordWrap ? "" : "whitespace-nowrap"}`}>
    <b className="text-[17px]">{title}</b> <br /> {value}
  </p>
);
