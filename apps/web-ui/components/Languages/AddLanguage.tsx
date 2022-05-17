import { Modal, TextInput } from "@mantine/core";
import { FC, useState } from "react";
import { Button } from "../Button";
import { Formik } from "formik";
import { languageSchema, IAddLanguageValues } from "../../utils/validation/Languages";
import { mutate } from "swr";
import { addLanguage } from "../../utils/swr/requests/Languages";
import { useLanguages } from "../../utils/swr";
import { FlexDiv } from "../FlexDiv";

export const AddLanguage = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AddLanguageButton setOpen={setOpen} />
      <AddLanguageModal open={open} setOpen={setOpen} />
    </>
  );
};

const AddLanguageButton: FC<{ setOpen: (open: boolean) => void }> = ({ setOpen }) => (
  <Button onClick={() => setOpen(true)}>Add a language</Button>
);

const AddLanguageModal: FC<{ open: boolean; setOpen: (open: boolean) => void }> = ({
  open,
  setOpen,
}) => {
  const { languages } = useLanguages();

  const onSuccess = () => setOpen(false);

  const onSubmit = async (values: IAddLanguageValues) =>
    mutate("/languages", addLanguage(values, onSuccess, languages));

  return (
    <Modal opened={open} onClose={() => setOpen(false)} title="Add a language">
      <Formik
        onSubmit={onSubmit}
        initialValues={{
          name: "",
          localizedName: "",
          code: "",
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
