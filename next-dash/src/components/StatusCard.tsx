import { ReactNode } from "react";

type Props = { children: ReactNode; error?: boolean };

export const StatusCard = ({ children, error }: Props) =>
  error ? (
    <div className="rounded-md p-3 bg-red-800/95 border-[1px] border-red-600 flex items-center justify-center text-red-400">
      {children}
    </div>
  ) : (
    <div className="rounded-md p-3 bg-gray-800/95 border-[1px] border-gray-600 flex items-center justify-center text-gray-400">
      {children}
    </div>
  );
