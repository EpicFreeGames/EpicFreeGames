import { Modal, TextInput } from "@mantine/core";
import { Formik } from "formik";
import { FC, useState } from "react";
import { IGame } from "shared";
import { updateGame } from "../../utils/requests/Games";
import { gameValidationSchema, IUpdateGameValues } from "../../utils/validation/Games";
import { FlexDiv } from "../FlexDiv";
import { DateRangePicker } from "@mantine/dates";
import { Button } from "../Button";
import { Edit } from "tabler-icons-react";
import { useSession } from "next-auth/react";

export const EditGame = ({ game }: { game: IGame }) => {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  if (!session?.user.isAdmin) return null;

  return (
    <>
      <EditGameButton setOpen={setOpen} />
      <EditGameModal open={open} setOpen={setOpen} game={game} />
    </>
  );
};

const EditGameButton: FC<{
  setOpen: (open: boolean) => void;
}> = ({ setOpen }) => (
  <Button onClick={() => setOpen(true)} p="0.5rem">
    <Edit />
  </Button>
);

const EditGameModal: FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
  game: IGame;
}> = ({ open, setOpen, game }) => {
  const onSubmit = async (values: IUpdateGameValues) => {
    try {
      await updateGame(game, values);

      setOpen(false);
    } catch (err) {}
  };

  return (
    <Modal opened={open} onClose={() => setOpen(false)} title="Edit game">
      <Formik
        initialValues={{
          name: game.name,
          imageUrl: game.imageUrl,
          slug: game.slug,
          start: new Date(game.start),
          end: new Date(game.end),
          price: game.price,
        }}
        onSubmit={onSubmit}
        validationSchema={gameValidationSchema}
      >
        {({
          handleSubmit,
          isSubmitting,
          errors,
          dirty,
          touched,
          isValid,
          getFieldProps,
          setValues,
          values,
          handleBlur,
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
                label="Image URL"
                error={errors.imageUrl && touched.imageUrl ? errors.imageUrl : undefined}
                autoComplete="off"
                required
                {...getFieldProps("imageUrl")}
              />

              <TextInput
                label="Slug"
                error={errors.slug && touched.slug ? errors.slug : undefined}
                autoComplete="off"
                required
                {...getFieldProps("slug")}
              />

              <DateRangePicker
                label="Free on"
                placeholder="Pick a date range"
                onBlur={handleBlur}
                value={[values.start, values.end]}
                required
                onChange={(dates) =>
                  setValues({
                    ...values,
                    start: dates[0]!,
                    end: dates[1]!,
                  })
                }
              />

              {Object.entries(game.price).map(([currency, _]) => (
                <TextInput
                  key={currency}
                  label={currency}
                  autoComplete="off"
                  required
                  onBlur={handleBlur}
                  value={values.price[currency]}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      price: {
                        ...values.price,
                        [currency]: e.target.value!,
                      },
                    })
                  }
                />
              ))}

              <FlexDiv fullWidth gap05>
                <Button flexGrow onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button flexGrow type="submit" disabled={!isValid || isSubmitting || !dirty}>
                  Submit
                </Button>
              </FlexDiv>
            </FlexDiv>
          </form>
        )}
      </Formik>
    </Modal>
  );
};
