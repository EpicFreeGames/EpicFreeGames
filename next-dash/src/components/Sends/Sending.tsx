import { ISending } from "~utils/api/types";
import { DeleteSending } from "./DeleteSending";
import { EditSending } from "./EditSending";

type Props = {
  sending: ISending;
};

export const Sending = ({ sending }: Props) => (
  <div className="bg-gray-700 p-3 rounded-md flex flex-col gap-3">
    <div className="flex gap-2 justify-between w-full h-full flex-col halfMax:flex-row">
      <h2 className="bg-gray-800 py-2 px-3 rounded-md text-lg halfMax:text-2xl">{sending.id}</h2>

      <div className="flex gap-1 p-2 bg-gray-800/80 rounded-lg">
        <DeleteSending sending={sending} />
        <EditSending sending={sending} />
      </div>
    </div>

    <div className="flex flex-col gap-2">
      <Spec title="Games" value={sending.games?.map((g) => g.name).join(", ") ?? ""} />
      <Spec title="Status" value={sending.status} />
    </div>
  </div>
);

const Spec = ({ title, value, wordWrap }: { title: string; value: string; wordWrap?: boolean }) => (
  <p className={`bg-gray-800 p-3 rounded-md ${wordWrap ? "" : "whitespace-nowrap"}`}>
    <b className="text-[17px]">{title}</b> <br /> {value}
  </p>
);
