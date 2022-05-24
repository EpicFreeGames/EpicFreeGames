import { Modal, Text, TextInput } from "@mantine/core";
import { FC, useState } from "react";
import { Button } from "../Button";
import { Formik } from "formik";
import { mutate } from "swr";
import { FlexDiv } from "../FlexDiv";
import { currencySchema, IAddCurrencyValues } from "../../utils/validation/Currencies";
import { addCurrency } from "../../utils/requests/Currencies";
import { useCurrencies } from "../../hooks/requests";
import { DeployGlobalCommands, DeployGuildCommands } from "../../utils/requests/Commands";
import { Plus } from "tabler-icons-react";
import { useSession } from "next-auth/react";
import { Tooltip } from "../Tooltip";

export const AddCurrency = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AddCurrencyButton setOpen={setOpen} />
      <AddCurrencyModal open={open} setOpen={setOpen} />
    </>
  );
};

const AddCurrencyButton: FC<{ setOpen: (open: boolean) => void }> = ({ setOpen }) => {
  const { data: session } = useSession();

  return !session?.user.isAdmin ? (
    <Tooltip label="Only the admin can add languages">
      <Button disabled p={"0.5rem"}>
        <Plus />
      </Button>
    </Tooltip>
  ) : (
    <Button p={"0.5rem"} onClick={() => setOpen(true)}>
      <Plus />
    </Button>
  );
};

const AddCurrencyModal: FC<{ open: boolean; setOpen: (open: boolean) => void }> = ({
  open,
  setOpen,
}) => {
  const { currencies } = useCurrencies();

  const onSubmit = async (values: IAddCurrencyValues) => {
    try {
      await mutate("/currencies", addCurrency(values, currencies));

      setOpen(false);

      await DeployGuildCommands();
      await DeployGlobalCommands();
    } catch (_) {}
  };

  return (
    <Modal opened={open} onClose={() => setOpen(false)} title="Add a currency">
      <Formik
        onSubmit={onSubmit}
        initialValues={{
          code: "",
          name: "",
          apiValue: "",
          inFrontOfPrice: "",
          afterPrice: "",
        }}
        validationSchema={currencySchema}
      >
        {({
          handleSubmit,
          isSubmitting,
          errors,
          dirty,
          touched,
          isValid,
          getFieldProps,
          values,
        }) => (
          <form onSubmit={handleSubmit}>
            <FlexDiv column>
              <TextInput
                label="Name"
                error={errors.name && touched.name ? errors.name : undefined}
                autoComplete="off"
                required
                {...getFieldProps("name")}
              />

              <TextInput
                label="Code"
                error={errors.code && touched.code ? errors.code : undefined}
                autoComplete="off"
                required
                {...getFieldProps("code")}
              />

              <TextInput
                label="Api value"
                error={errors.apiValue && touched.apiValue ? errors.apiValue : undefined}
                autoComplete="off"
                required
                {...getFieldProps("apiValue")}
              />

              <FlexDiv column gap0>
                <Text size="sm">Price preview</Text>
                <Text>
                  {values.inFrontOfPrice}59.99{values.afterPrice}
                </Text>
              </FlexDiv>

              <TextInput
                label="In front of price"
                error={
                  errors.inFrontOfPrice && touched.inFrontOfPrice
                    ? errors.inFrontOfPrice
                    : undefined
                }
                autoComplete="off"
                {...getFieldProps("inFrontOfPrice")}
              />

              <TextInput
                label="After price"
                error={errors.afterPrice && touched.afterPrice ? errors.afterPrice : undefined}
                autoComplete="off"
                {...getFieldProps("afterPrice")}
              />

              <FlexDiv fullWidth gap05>
                <Button flexGrow onClick={() => setOpen(false)}>
                  Cancel
                </Button>

                <Button
                  flexGrow
                  disabled={!isValid || !dirty || isSubmitting}
                  loading={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Adding..." : "Add"}
                </Button>
              </FlexDiv>
            </FlexDiv>
          </form>
        )}
      </Formik>
    </Modal>
  );
};
