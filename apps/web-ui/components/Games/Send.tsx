import { Anchor, Modal, TextInput } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useFreeGames } from "../../hooks/requests";
import { sendGames } from "../../utils/requests/Games";
import { Button } from "../Button";
import { FlexDiv } from "../FlexDiv";
import { H3 } from "../Text";
import { Tooltip } from "../Tooltip";

export const SendGames = () => {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  if (!session?.user.isAdmin) return null;

  return (
    <>
      <SendGamesButton setOpen={setOpen} />
      <SendGamesModal open={open} setOpen={setOpen} />
    </>
  );
};

interface ButtonProps {
  setOpen: (open: boolean) => void;
}

const SendGamesButton = ({ setOpen }: ButtonProps) => {
  const { freeGames } = useFreeGames();

  return !!freeGames?.length ? (
    <Button onClick={() => setOpen(true)}>Send</Button>
  ) : (
    <Tooltip label="No games to send">
      <Button disabled>Send</Button>
    </Tooltip>
  );
};

interface ModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SendGamesModal = ({ open, setOpen }: ModalProps) => {
  const { freeGames } = useFreeGames();
  const gameNames = freeGames?.map((game) => game.name) || [];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    initialValues: {
      sendingId: "",
    },
  });

  const onSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      await sendGames(freeGames || [], values.sendingId);

      setOpen(false);
    } catch (_) {}
    setIsSubmitting(false);
  };

  return (
    <Modal
      opened={open}
      onClose={() => setOpen(false)}
      title={<H3>Send games: {gameNames.join(", ")}?</H3>}
    >
      <form onSubmit={form.onSubmit(onSubmit)}>
        <FlexDiv column>
          <TextInput label="Sending id" {...form.getInputProps("sendingId")} />

          <FlexDiv fullWidth alignCenter gap05 justifyBetween>
            <Anchor color="gray" component="button" onClick={() => setOpen(false)}>
              Cancel
            </Anchor>

            <Button loading={isSubmitting} type="submit">
              {isSubmitting ? "Sending request..." : "Send"}
            </Button>
          </FlexDiv>
        </FlexDiv>
      </form>
    </Modal>
  );
};
