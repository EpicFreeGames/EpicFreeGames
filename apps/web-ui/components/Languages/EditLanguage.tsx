import { Modal, TextInput } from "@mantine/core";
import { FC, useState } from "react";
import { Button } from "../Button";
import { Formik } from "formik";
import { languageSchema, IAddLanguageValues } from "../../utils/validation/Languages";
import { mutate } from "swr";
import { updateLanguage } from "../../utils/swr/requests/Languages";
import { FlexDiv } from "../FlexDiv";
import { useLanguages } from "../../hooks/requests";

export const EditLanguage = ({ code }: { code: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <EditLanguageButton setOpen={setOpen} />
      <EditLanguageModal open={open} setOpen={setOpen} code={code} />
    </>
  );
};

const EditLanguageButton: FC<{ setOpen: (open: boolean) => void }> = ({ setOpen }) => (
  <Button fullWidth onClick={() => setOpen(true)}>
    Edit
  </Button>
);
const EditLanguageModal: FC<{ open: boolean; setOpen: (open: boolean) => void; code: string }> = ({
  open,
  setOpen,
  code,
}) => {
  const { languages } = useLanguages();

  const onSuccess = () => setOpen(false);

  const onSubmit = async (values: IAddLanguageValues) =>
    mutate("/languages", updateLanguage(code, values, onSuccess, languages));

  const language = languages?.find((l) => l.code === code);

  return (
    <Modal opened={open} onClose={() => setOpen(false)} title="Add a language">
      <Formik
        onSubmit={onSubmit}
        initialValues={{
          name: language?.englishName,
          localizedName: language?.localizedName,
          code: code,
        }}
        validationSchema={languageSchema}
      >
        {({ handleSubmit, isSubmitting, errors, dirty, touched, isValid, getFieldProps }) => (
          <form onSubmit={handleSubmit}>
            <FlexDiv column>
              <TextInput
                label="English name"
                error={errors.name && touched.name ? errors.name : undefined}
                autoComplete="off"
                required
                {...getFieldProps("name")}
              />

              <TextInput
                label="Local name"
                error={
                  errors.localizedName && touched.localizedName ? errors.localizedName : undefined
                }
                autoComplete="off"
                required
                {...getFieldProps("localizedName")}
              />

              <TextInput
                label="Code"
                error={errors.code && touched.code ? errors.code : undefined}
                autoComplete="off"
                required
                {...getFieldProps("code")}
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
                  {isSubmitting ? "Updating..." : "Update"}
                </Button>
              </FlexDiv>
            </FlexDiv>
          </form>
        )}
      </Formik>
    </Modal>
  );
};
