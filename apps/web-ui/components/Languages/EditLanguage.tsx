import { Modal, TextInput } from "@mantine/core";
import { FC, useState } from "react";
import { Button } from "../Button";
import { Formik } from "formik";
import { languageSchema, IAddLanguageValues } from "../../utils/validation/Languages";
import { mutate } from "swr";
import { updateLanguage } from "../../utils/requests/Languages";
import { FlexDiv } from "../FlexDiv";
import { useLanguages } from "../../hooks/requests";
import { Tooltip } from "../Tooltip";
import { ILanguageWithGuildCount } from "types";

export const EditLanguage = ({ language }: { language: ILanguageWithGuildCount }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <EditLanguageButton setOpen={setOpen} language={language!} />
      <EditLanguageModal open={open} setOpen={setOpen} language={language!} />
    </>
  );
};

const EditLanguageButton: FC<{
  setOpen: (open: boolean) => void;
  language: ILanguageWithGuildCount;
}> = ({ setOpen, language }) =>
  language.isDefault ? (
    <Tooltip label="Default language can't be edited" fullWidth>
      <Button onClick={() => setOpen(true)} disabled flexGrow>
        Edit language
      </Button>
    </Tooltip>
  ) : (
    <Button onClick={() => setOpen(true)}>Edit language</Button>
  );

const EditLanguageModal: FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
  language: ILanguageWithGuildCount;
}> = ({ open, setOpen, language }) => {
  const { languages } = useLanguages();

  const onSuccess = () => setOpen(false);

  const onSubmit = async (values: IAddLanguageValues) =>
    mutate("/languages", updateLanguage(language.code, values, onSuccess, languages));

  return (
    <Modal opened={open} onClose={() => setOpen(false)} title="Add a language">
      <Formik
        onSubmit={onSubmit}
        initialValues={{
          name: language?.englishName,
          localizedName: language?.localizedName,
          code: language.code,
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
