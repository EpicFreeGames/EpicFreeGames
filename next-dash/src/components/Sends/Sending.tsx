import { ISending } from "~utils/api/types";
import { DeleteSending } from "./DeleteSending";
import { EditSending } from "./EditSending";
import { StartSending } from "./StartSending";
import { useHasPerms } from "~hooks/useHasPerms";
import { Flags } from "~utils/api/flags";

type Props = {
  sending: ISending & { successes: number; failures: number };
};

export const Sending = ({ sending }: Props) => {
  const showSend = useHasPerms(Flags.Send) && sending.status !== "SENT";
  const showEdit = useHasPerms(Flags.EditSendings);
  const showDelete = useHasPerms(Flags.DeleteSendings);

  const showButtons = showSend || showEdit || showDelete;

  const showNumbers = sending.status === "SENDING" || sending.status === "SENT";

  return (
    <div className="bg-gray-700 p-3 rounded-md flex flex-col gap-3">
      <div className="flex gap-2 justify-between w-full h-full flex-col halfMax:flex-row items-start">
        <h2 className="bg-gray-800 py-2 px-3 rounded-md text-lg halfMax:text-2xl">{sending.id}</h2>

        {showButtons && (
          <div className="flex gap-1 p-2 bg-gray-800 rounded-lg">
            {showDelete && <DeleteSending sending={sending} />}
            {showEdit && <EditSending sending={sending} />}
            {showSend && <StartSending sending={sending} />}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Spec title="Games" value={sending.games?.map((g) => g.name).join(", ") ?? ""} />
        <Spec title="Status" value={sending.status} />
        {showNumbers && (
          <>
            <Spec title="Successes" value={sending.successes} />
            <Spec title="Failures" value={sending.failures} />
          </>
        )}
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
  <p className={`bg-gray-800 p-3 rounded-md ${wordWrap ? "" : "whitespace-nowrap"}`}>
    <b className="text-[17px]">{title}</b> <br /> {value}
  </p>
);
