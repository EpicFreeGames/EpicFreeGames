import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Edit } from "tabler-icons-react";
import { Dialog, DialogCloseButton } from "~components/Dialog";
import { Input } from "~components/Input";
import { EditCurrencyProps, useEditCurrencyMutation } from "~utils/api/currencies/editCurrency";
import { ICurrency } from "~utils/api/types";

type Props = {
  currency: ICurrency;
};

export const EditCurrency = ({ currency }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { mutateAsync } = useEditCurrencyMutation();

  const form = useForm({
    defaultValues: currency,
  });

  const onSubmit = async (values: EditCurrencyProps["updateData"]) => {
    await toast.promise(mutateAsync({ currencyId: currency.id, updateData: values }), {
      success: "Changes saved",
      error: "Error saving changes",
      loading: "Saving changes",
    });

    setDialogOpen(false);
  };

  return (
    <Dialog
      open={dialogOpen}
      setOpen={setDialogOpen}
      title={`Edit ${currency.name}`}
      trigger={
        <button className="btnBase px-2 bg-gray-800 hover:bg-gray-900/80 active:bg-gray-900">
          <Edit strokeWidth={1.3} size={21} />
        </button>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <Input label="Name" defaultValue={currency.name} required {...form.register("name")} />
        <Input label="Code" defaultValue={currency.code} required {...form.register("code")} />
        <Input label="API Value" required {...form.register("apiValue")} />

        <p>
          Price preview: <br />
          {form.watch().inFrontOfPrice}49.99{form.watch().afterPrice}
        </p>

        <Input
          label="In front of price"
          defaultValue={currency.inFrontOfPrice}
          {...form.register("inFrontOfPrice")}
        />
        <Input
          label="After price"
          defaultValue={currency.afterPrice}
          {...form.register("afterPrice")}
        />

        <div className="flex gap-2 justify-between items-center">
          <DialogCloseButton className="btnBase bg-gray-600 hover:bg-gray-500/80 active:bg-gray-400/60">
            Cancel
          </DialogCloseButton>

          <button
            type="submit"
            className="btnBase border-[1px] border-blue-500 bg-blue-800/60 hover:bg-blue-700/80 active:bg-blue-600/80"
          >
            Save
          </button>
        </div>
      </form>
    </Dialog>
  );
};
