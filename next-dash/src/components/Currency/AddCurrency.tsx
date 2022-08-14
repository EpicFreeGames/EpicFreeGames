import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Dialog, DialogCloseButton } from "~components/Dialog";
import { Input } from "~components/Input";
import { AddCurrencyProps, useAddCurrencyMutation } from "~utils/api/currencies/addCurrency";

export const AddCurrency = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { mutateAsync } = useAddCurrencyMutation();

  const form = useForm<AddCurrencyProps>();

  const onSubmit = async (values: AddCurrencyProps) => {
    await toast.promise(mutateAsync(values), {
      success: "Currency added",
      error: "Error adding currency",
      loading: "Adding currency",
    });

    setDialogOpen(false);
  };

  return (
    <Dialog
      open={dialogOpen}
      setOpen={setDialogOpen}
      title="Add currency"
      trigger={
        <button className="btnBase bg-gray-600 hover:bg-gray-500/80 active:bg-gray-400/60">
          Add a currency
        </button>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <Input label="Name" required {...form.register("name")} />
        <Input label="Code" required {...form.register("code")} />
        <Input label="API Value" required {...form.register("apiValue")} />

        <p>
          Price preview: <br />
          {form.watch().inFrontOfPrice}49.99{form.watch().afterPrice}
        </p>

        <Input label="In front of price" {...form.register("inFrontOfPrice")} />
        <Input label="After price" {...form.register("afterPrice")} />

        <div className="flex gap-2 justify-between items-center">
          <DialogCloseButton className="btnBase bg-gray-600 hover:bg-gray-500/80 active:bg-gray-400/60">
            Cancel
          </DialogCloseButton>

          <button
            type="submit"
            className="btnBase border-[1px] border-blue-500 bg-blue-800/60 hover:bg-blue-700/80 active:bg-blue-600/80"
          >
            Add
          </button>
        </div>
      </form>
    </Dialog>
  );
};
