import { Modal, Text, TextInput } from "@mantine/core";
import { FC, useState } from "react";
import { Button } from "../Button";
import { Formik } from "formik";
import { mutate } from "swr";
import { FlexDiv } from "../FlexDiv";
import { updateCurrency } from "../../utils/requests/Currencies";
import { currencySchema, IUpdateCurrencyValues } from "../../utils/validation/Currencies";
import { useCurrencies } from "../../hooks/requests";
import { Tooltip } from "../Tooltip";
import { ICurrencyWithGuildCount } from "shared";
import { DeployGlobalCommands, DeployGuildCommands } from "../../utils/requests/Commands";

export const EditCurrency = ({ currency }: { currency: ICurrencyWithGuildCount }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <EditCurrencyButton setOpen={setOpen} currency={currency} />
      <EditCurrencyModal open={open} setOpen={setOpen} currency={currency} />
    </>
  );
};

const EditCurrencyButton: FC<{
  setOpen: (open: boolean) => void;
  currency: ICurrencyWithGuildCount;
}> = ({ setOpen, currency }) =>
  currency.isDefault ? (
    <Tooltip label="Default currency can't be edited" fullWidth>
      <Button onClick={() => setOpen(true)} disabled flexGrow>
        Edit currency
      </Button>
    </Tooltip>
  ) : (
    <Button fullWidth onClick={() => setOpen(true)}>
      Edit currency
    </Button>
  );

const EditCurrencyModal: FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
  currency: ICurrencyWithGuildCount;
}> = ({ open, setOpen, currency }) => {
  const { currencies } = useCurrencies();

  const onSuccess = async () => {
    setOpen(false);

    await DeployGuildCommands();
    await DeployGlobalCommands();
  };

  const onSubmit = async (values: IUpdateCurrencyValues) =>
    mutate("/currencies", updateCurrency(currency.code, values, onSuccess, currencies));

  return (
    <Modal opened={open} onClose={() => setOpen(false)} title="Edit currency">
      <Formik
        onSubmit={onSubmit}
        initialValues={{
          code: currency?.code,
          name: currency?.name,
          apiValue: currency?.apiValue,
          inFrontOfPrice: currency?.inFrontOfPrice,
          afterPrice: currency?.afterPrice,
        }}
        validationSchema={currencySchema}
      >
        {({ handleSubmit, isSubmitting, errors, dirty, touched, isValid, getFieldProps }) => (
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

              <Text>Price preview: </Text>

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
