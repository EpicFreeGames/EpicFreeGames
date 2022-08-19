import { ReactNode } from "react";

type Props = { children: ReactNode; error?: boolean };

export const StatusCard = ({ children, error }: Props) =>
  error ? (
    <div className="flex items-center justify-center rounded-md border-[1px] border-red-600 bg-red-800/95 p-3">
      {children}
    </div>
  ) : (
    <div className="flex items-center justify-center rounded-md border-[1px] border-gray-600 bg-gray-800/95 p-3">
      {children}
    </div>
  );
