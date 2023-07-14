import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { ReactNode } from "react";

type Props = {
  title: string | ReactNode;
  description?: string | ReactNode;
  trigger: ReactNode;
  action: ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  children?: ReactNode;
};

export const AlertDialog = ({
  title,
  description,
  trigger,
  action,
  open,
  setOpen,
  children,
}: Props) => {
  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <AlertDialogPrimitive.Trigger asChild>{trigger}</AlertDialogPrimitive.Trigger>

      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className="animate-fadeIn fixed inset-0 bg-gray-900/60 backdrop-blur-sm" />
        <AlertDialogPrimitive.Content className="animate-fadeUp fixed top-[50%] left-[50%] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-md border-[1px] border-gray-700/70 bg-gray-900/95 p-3">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <AlertDialogPrimitive.Title className="text-2xl">{title}</AlertDialogPrimitive.Title>

              {description && (
                <AlertDialogPrimitive.Description>{description}</AlertDialogPrimitive.Description>
              )}

              {children ? children : null}
            </div>

            <div className="flex justify-between">
              <AlertDialogPrimitive.Cancel asChild>
                <button className="btnBase bg-gray-600 hover:bg-gray-500/80 active:bg-gray-400/60">
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
