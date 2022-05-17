import { Modal, TextInput } from "@mantine/core";
import { FC, useState } from "react";
import { Button } from "../Button";
import { Formik } from "formik";
import { languageSchema, IAddLanguageValues } from "../../utils/validation/Languages";
import { mutate } from "swr";
import { updateLanguage } from "../../utils/swr/requests/Languages";
import { useLanguages } from "../../utils/swr";
import { FlexDiv } from "../FlexDiv";

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
          name: language?.name || "",
          localizedName: language?.localizedName || "",
          code: code,
        }}
        validationSchema={languageSchema}
      >
        {({
          handleSubmit,
          handleBlur,
          values,
          handleChange,
          isSubmitting,
          errors,
          dirty,
          touched,
          isValid,
        }) => (
          <form onSubmit={handleSubmit}>
            <FlexDiv column>
              <TextInput
                name="name"
                label="English name"
                onChange={handleChange}
                value={values.name}
                onBlur={handleBlur}
                error={errors.name && touched.name ? errors.name : undefined}
                autoComplete="off"
                required
              />

              <TextInput
                name="localizedName"
                label="Local name"
                onChange={handleChange}
                value={values.localizedName}
                onBlur={handleBlur}
                error={
                  errors.localizedName && touched.localizedName ? errors.localizedName : undefined
                }
                autoComplete="off"
                required
              />

              <TextInput
                name="code"
                label="Code"
                onChange={handleChange}
                value={values.code}
                onBlur={handleBlur}
                error={errors.code && touched.code ? errors.code : undefined}
                autoComplete="off"
                required
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
