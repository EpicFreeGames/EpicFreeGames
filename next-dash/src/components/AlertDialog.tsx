import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { ReactNode } from "react";

type Props = {
  title: string | ReactNode;
  description?: string | ReactNode;
  trigger: ReactNode;
  action: ReactNode;
};

export const AlertDialog = ({ title, description, trigger, action }: Props) => {
  return (
    <AlertDialogPrimitive.Root>
      <AlertDialogPrimitive.Trigger asChild>{trigger}</AlertDialogPrimitive.Trigger>

      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className="animate-fadeIn bg-gray-900/60 backdrop-blur-sm fixed inset-0" />
        <AlertDialogPrimitive.Content className="animate-fadeUp bg-gray-900/95 border-[1px] border-gray-700/70 rounded-md fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-[450px] p-3">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <AlertDialogPrimitive.Title className="text-2xl">{title}</AlertDialogPrimitive.Title>

              {description && (
                <AlertDialogPrimitive.Description>{description}</AlertDialogPrimitive.Description>
              )}
            </div>

            <div className="flex justify-between">
              <AlertDialogPrimitive.Cancel asChild>
                <button className="btnBase p-2 bg-gray-600 hover:bg-gray-500/80 active:bg-gray-400/60">
                  Cancel
                </button>
              </AlertDialogPrimitive.Cancel>

              <AlertDialogPrimitive.Action asChild>{action}</AlertDialogPrimitive.Action>
            </div>
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
};
