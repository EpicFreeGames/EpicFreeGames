import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ReactNode } from "react";
import { X } from "tabler-icons-react";

const DialogX = () => (
  <DialogPrimitive.Close className="btnBase p-1 hover:bg-gray-700/80 active:bg-gray-700/50">
    <X />
  </DialogPrimitive.Close>
);

type Props = {
  children: ReactNode;
  trigger: ReactNode;
  title: string | ReactNode;
};

export const Dialog = ({ children, trigger, title }: Props) => {
  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="animate-fadeIn bg-gray-900/60 backdrop-blur-sm fixed inset-0" />
        <DialogPrimitive.Content className="animate-fadeUp bg-gray-900/95 border-[1px] border-gray-800 rounded-md fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-[450px] p-3">
          <div className="flex justify-between pb-3">
            <DialogPrimitive.Title className="text-2xl">{title}</DialogPrimitive.Title>

            <DialogX />
          </div>

          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export const DialogCloseButton = DialogPrimitive.Close;
